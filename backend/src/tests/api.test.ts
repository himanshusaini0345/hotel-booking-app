import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import dotenv from 'dotenv';
import User from '../models/User';
import Hotel from '../models/Hotel';
import State from '../models/State';
import City from '../models/City';
import Booking from '../models/Booking';

dotenv.config();

describe('API Endpoints Validation', () => {
  beforeAll(async () => {
    // Connect to the database before running tests
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hotel_task';
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    // Close the database connection after tests
    await mongoose.connection.close();
  });

  describe('Hotels Endpoint', () => {
    it('should fetch hotels with valid parameters', async () => {
      const res = await request(app)
        .get('/api/hotels/getHotelList')
        .query({ page: 1, limit: 5, rating: 5 });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should fail with invalid rating', async () => {
      const res = await request(app)
        .get('/api/hotels/getHotelList')
        .query({ rating: 10 });
      
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toContainEqual(expect.objectContaining({ field: 'rating' }));
    });
  });

  describe('Users Endpoint', () => {
    it('should fetch users with valid parameters', async () => {
      const res = await request(app)
        .get('/api/users/getUserList')
        .query({ page: 1, limit: 2 });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should fail with invalid page number', async () => {
      const res = await request(app)
        .get('/api/users/getUserList')
        .query({ page: 0 });
      
      expect(res.status).toBe(400);
      expect(res.body.errors).toContainEqual(expect.objectContaining({ field: 'page' }));
    });
  });

  describe('Bookings Endpoint', () => {
    it('should fetch bookings with valid parameters', async () => {
      const res = await request(app)
        .get('/api/bookings/getBookings')
        .query({ page: 1, limit: 5 });
      
      expect(res.status).toBe(200);
    });

    it('should fail with invalid MongoID for userId', async () => {
      const res = await request(app)
        .get('/api/bookings/getBookings')
        .query({ userId: 'invalid-id' });
      
      expect(res.status).toBe(400);
      expect(res.body.errors).toContainEqual(expect.objectContaining({ field: 'userId' }));
    });

    it('should fail to create booking with invalid body data', async () => {
      const res = await request(app)
        .post('/api/bookings/createBooking')
        .send({
          userId: 'not-an-id',
          hotelId: 'not-an-id',
          checkInDate: 'invalid-date',
          numberOfGuests: 0
        });
      
      expect(res.status).toBe(400);
      expect(res.body.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Filters Endpoints', () => {
    it('should fetch states', async () => {
      const res = await request(app).get('/api/state');
      expect(res.status).toBe(200);
    });

    it('should fail to fetch cities with invalid stateId', async () => {
      const res = await request(app)
        .get('/api/city')
        .query({ stateId: 'not-an-id' });
      
      expect(res.status).toBe(400);
      expect(res.body.errors).toContainEqual(expect.objectContaining({ field: 'stateId' }));
    });
  });

  describe('Booking Business Rules', () => {
    let testUser: any;
    let testHotel1: any;
    let testHotel2: any;
    let testState: any;
    let testCity: any;

    beforeAll(async () => {
      // Clear existing test data if any
      await User.deleteMany({ email: 'test@example.com' });
      
      testState = await State.create({ name: 'Test State', code: 'TS', country: 'India' });
      testCity = await City.create({ name: 'Test City', stateId: testState._id });
      
      testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890'
      });

      testHotel1 = await Hotel.create({
        name: 'Test Hotel 1',
        location: 'Location 1',
        cityId: testCity._id,
        stateId: testState._id,
        pricePerNight: 1000
      });

      testHotel2 = await Hotel.create({
        name: 'Test Hotel 2',
        location: 'Location 2',
        cityId: testCity._id,
        stateId: testState._id,
        pricePerNight: 2000
      });
    });

    afterAll(async () => {
      // Cleanup
      await Booking.deleteMany({ userId: testUser._id });
      await Hotel.deleteMany({ _id: { $in: [testHotel1._id, testHotel2._id] } });
      await City.deleteMany({ _id: testCity._id });
      await State.deleteMany({ _id: testState._id });
      await User.deleteMany({ _id: testUser._id });
    });

    const formatDate = (date: Date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    describe('9 PM Rule', () => {
      let originalDate: any;

      beforeAll(() => {
        originalDate = global.Date;
      });

      afterAll(() => {
        global.Date = originalDate;
      });

      const setMockTime = (mockTime: Date) => {
        const mockDate = class extends originalDate {
          constructor(arg: any) {
            if (arg) {
              super(arg);
            } else {
              super(mockTime.getTime());
            }
          }
        };
        (mockDate as any).now = () => mockTime.getTime();
        global.Date = mockDate as any;
      };

      it('should fail to book for tomorrow if current time is post 9 PM', async () => {
        // Set time to 10 PM today (2026-03-27)
        setMockTime(new Date(2026, 2, 27, 22, 0, 0));

        const tomorrow = new originalDate(2026, 2, 28);
        const tomorrowStr = formatDate(tomorrow);

        const res = await request(app)
          .post('/api/bookings/createBooking')
          .send({
            userId: testUser._id.toString(),
            hotelId: testHotel1._id.toString(),
            checkInDate: tomorrowStr,
            numberOfGuests: 2
          });

        expect(res.status).toBe(400);
        expect(res.body.message).toContain('Cannot book for the next day after 9 PM');
      });

      it('should succeed to book for tomorrow if current time is before 9 PM', async () => {
        // Set time to 8 PM today (2026-03-27)
        setMockTime(new Date(2026, 2, 27, 20, 0, 0));

        const tomorrow = new originalDate(2026, 2, 28);
        const tomorrowStr = formatDate(tomorrow);

        const res = await request(app)
          .post('/api/bookings/createBooking')
          .send({
            userId: testUser._id.toString(),
            hotelId: testHotel1._id.toString(),
            checkInDate: tomorrowStr,
            numberOfGuests: 2
          });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
      });

      it('should succeed to book for day after tomorrow even if current time is post 9 PM', async () => {
        // Set time to 10 PM today (2026-03-27)
        setMockTime(new Date(2026, 2, 27, 22, 0, 0));

        const dayAfterTomorrow = new originalDate(2026, 2, 29);
        const dateStr = formatDate(dayAfterTomorrow);

        const res = await request(app)
          .post('/api/bookings/createBooking')
          .send({
            userId: testUser._id.toString(),
            hotelId: testHotel1._id.toString(),
            checkInDate: dateStr,
            numberOfGuests: 2
          });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
      });
    });

    describe('Duplicate Booking Rule', () => {
      it('should allow multiple bookings across different hotels for the same day', async () => {
        // Ensure we are in real time for DB operations
        jest.useRealTimers();

        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const dateStr = formatDate(nextWeek);

        // Book Hotel 1
        const res1 = await request(app)
          .post('/api/bookings/createBooking')
          .send({
            userId: testUser._id.toString(),
            hotelId: testHotel1._id.toString(),
            checkInDate: dateStr,
            numberOfGuests: 2
          });
        expect(res1.status).toBe(201);

        // Book Hotel 2 for the same day
        const res2 = await request(app)
          .post('/api/bookings/createBooking')
          .send({
            userId: testUser._id.toString(),
            hotelId: testHotel2._id.toString(),
            checkInDate: dateStr,
            numberOfGuests: 2
          });
        expect(res2.status).toBe(201);
        expect(res2.body.success).toBe(true);
      });

      it('should not allow duplicate booking for same hotel for the same day', async () => {
        jest.useRealTimers();

        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 12);
        const dateStr = formatDate(futureDate);

        // First booking
        const res1 = await request(app)
          .post('/api/bookings/createBooking')
          .send({
            userId: testUser._id.toString(),
            hotelId: testHotel1._id.toString(),
            checkInDate: dateStr,
            numberOfGuests: 2
          });
        expect(res1.status).toBe(201);

        // Duplicate booking (same user, same hotel, same day)
        const res = await request(app)
          .post('/api/bookings/createBooking')
          .send({
            userId: testUser._id.toString(),
            hotelId: testHotel1._id.toString(),
            checkInDate: dateStr,
            numberOfGuests: 2
          });

        expect(res.status).toBe(400);
        expect(res.body.message).toContain('already have an active booking at this hotel');
      });
    });
  });
});
