const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/error.middleware');

const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');

// Middleware
app.use(cors());
app.use(express.json());

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Routes (to be defined)
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/hotels', require('./routes/hotel.routes'));
app.use('/api/bookings', require('./routes/booking.routes'));
app.use('/api/state', require('./routes/state.routes'));
app.use('/api/city', require('./routes/city.routes'));

// Catch-all route for unhandled requests
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
