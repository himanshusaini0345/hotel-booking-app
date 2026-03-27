import mongoose from 'mongoose';
import dotenv from 'dotenv';

import User from './src/models/User';
import Hotel from './src/models/Hotel';
import Booking from './src/models/Booking';
import State from './src/models/State';
import City from './src/models/City';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hotel_task');
        console.log('MongoDB Connected for Seeding');
    } catch (error: any) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();
    
    try {
        // Clear Existing Data
        await User.deleteMany();
        await Hotel.deleteMany();
        await Booking.deleteMany();
        await State.deleteMany();
        await City.deleteMany();

        console.log('Existing DB Cleared.');

        // 1. Seed States & Cities
        const statesData = [
            { name: 'Karnataka', code: 'KA', cities: ['Bengaluru', 'Mysuru', 'Mangaluru'] },
            { name: 'Maharashtra', code: 'MH', cities: ['Mumbai', 'Pune', 'Nagpur'] },
            { name: 'Delhi', code: 'DL', cities: ['New Delhi'] },
            { name: 'Tamil Nadu', code: 'TN', cities: ['Chennai', 'Madurai', 'Coimbatore'] },
            { name: 'West Bengal', code: 'WB', cities: ['Kolkata', 'Darjeeling'] },
            { name: 'Rajasthan', code: 'RJ', cities: ['Jaipur', 'Udaipur', 'Jodhpur'] },
            { name: 'Gujarat', code: 'GJ', cities: ['Ahmedabad', 'Surat'] },
            { name: 'Telangana', code: 'TG', cities: ['Hyderabad'] }
        ];

        const allStates: any[] = [];
        const allCities: any[] = [];

        for (const s of statesData) {
            const state = await State.create({ name: s.name, code: s.code, country: 'India' });
            allStates.push(state);
            for (const cName of s.cities) {
                const city = await City.create({ name: cName, stateId: state._id });
                allCities.push(city);
            }
        }
        console.log(`Seeded ${allStates.length} States and ${allCities.length} Cities.`);

        // 2. Seed Users (25 Entries)
        const userNames = [
            'Aarav Sharma', 'Vihaan Gupta', 'Ananya Iyer', 'Diya Patel', 'Advik Singh',
            'Ishani Reddy', 'Myra Kapoor', 'Krishna Verma', 'Arjun Malhotra', 'Kabir Das',
            'Aryan Joshi', 'Reeti Saxena', 'Advaita Nair', 'Rohan Mehra', 'Saanvi Choudhury',
            'Ishaan Bhatia', 'Avni Kulkarni', 'Reyansh Mishra', 'Pari Shah', 'Aavya Rao',
            'Kavya Jain', 'Vivaan Prasad', 'Zoya Khan', 'Atharv Pandey', 'Kyra Agarwal'
        ];

        const usersData = userNames.map((name, index) => ({
            name,
            email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
            phone: `+91 ${9000000000 + index}`,
            address: `${100 + index}, Residency Road, New Block`
        }));

        const users = await User.insertMany(usersData);
        console.log(`Seeded ${users.length} Users.`);

        // 3. Seed Hotels (25 Entries)
        const hotelNames = [
            'The Taj Mahal Palace', 'The Oberoi Grand', 'ITC Gardenia', 'JW Marriott Marquis',
            'The Leela Palace', 'Radisson Blu Plaza', 'Hyatt Regency', 'Ginger Hotel',
            'Lemon Tree Premier', 'Novotel Heritage', 'The Park', 'Fortune Select',
            'Vivanta by Taj', 'Westin Resort', 'Sheraton Grand India', 'Zuri White Sands',
            'Lalit Laxmi Vilas', 'Umaid Bhawan Palace Hotel', 'Trident Nariman Point',
            'Eros Hotel', 'Claridges', 'Ambassador Pallava', 'Green Park Hotel',
            'Royal Orchid Central', 'Pride Plaza'
        ];

        const hotelsData: any[] = [];
        for (let i = 0; i < 25; i++) {
            const randomCity = allCities[Math.floor(Math.random() * allCities.length)];
            const stateId = randomCity.stateId;
            hotelsData.push({
                name: hotelNames[i],
                location: 'Main Street Area',
                cityId: randomCity._id,
                stateId: stateId,
                country: 'India',
                rating: Math.floor(Math.random() * 3) + 3, // 3 to 5 stars
                amenities: ['Wifi', 'AC', 'Parking', 'Pool'].slice(0, Math.floor(Math.random() * 4) + 1),
                pricePerNight: Math.floor(Math.random() * 8000) + 2000,
                description: `A luxurious stay at ${hotelNames[i]} in ${randomCity.name}.`,
                isActive: true
            });
        }

        const hotels = await Hotel.insertMany(hotelsData);
        console.log(`Seeded ${hotels.length} Hotels.`);

        // 4. Seed Bookings (25 Entries)
        const bookingsData: any[] = [];
        for (let i = 0; i < 25; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const randomHotel = hotels[Math.floor(Math.random() * hotels.length)];
            
            const checkInDate = new Date();
            checkInDate.setDate(checkInDate.getDate() + Math.floor(Math.random() * 30) + 1);

            bookingsData.push({
                userId: randomUser._id,
                hotelId: randomHotel._id,
                checkInDate: checkInDate,
                numberOfGuests: Math.floor(Math.random() * 4) + 1,
                status: i % 5 === 0 ? 1 : (i % 8 === 0 ? 2 : 0), // Mix of 0 (Confirmed), 1 (Cancelled), 2 (Checked In)
                specialRequests: i % 3 === 0 ? 'Vegan meal' : 'Extra pillows'
            });
        }

        const bookings = await Booking.insertMany(bookingsData);
        console.log(`Seeded ${bookings.length} Bookings.`);

        console.log('\nAll Dummy Data Seeded Successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error Seeding Data:', error);
        process.exit(1);
    }
};

seedData();
