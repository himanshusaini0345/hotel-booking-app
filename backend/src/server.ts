import http from 'http';
import dotenv from 'dotenv';
import connectDB from './config/db';
import app from './app';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
