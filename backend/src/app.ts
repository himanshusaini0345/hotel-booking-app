import express, { Request, Response } from 'express';
import cors from 'cors';
import errorHandler from './middleware/error.middleware';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from './swagger-output.json';

// Routes
import userRoutes from './routes/user.routes';
import hotelRoutes from './routes/hotel.routes';
import bookingRoutes from './routes/booking.routes';
import stateRoutes from './routes/state.routes';
import cityRoutes from './routes/city.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/state', stateRoutes);
app.use('/api/city', cityRoutes);

// Catch-all route for unhandled requests
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global Error Handler
app.use(errorHandler);

export default app;
