const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const dotenv = require('dotenv');

dotenv.config();

describe('API Endpoints Validation', () => {
  let server;

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
});
