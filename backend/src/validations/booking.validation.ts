import { body, query, param } from 'express-validator';

export const createBookingValidation = [
  body('userId').isMongoId().withMessage('Invalid User ID'),
  body('hotelId').isMongoId().withMessage('Invalid Hotel ID'),
  body('checkInDate')
    .isISO8601()
    .withMessage('Invalid check-in date format. Use YYYY-MM-DD')
    .custom((value) => {
      const date = new Date(value);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (date < now) {
        throw new Error('Check-in date cannot be in the past');
      }
      return true;
    }),
  body('numberOfGuests')
    .isInt({ min: 1 })
    .withMessage('Number of guests must be at least 1'),
  body('specialRequests')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Special requests must be less than 500 characters')
];

export const getBookingsValidation = [
  query('userId').optional().isMongoId().withMessage('Invalid User ID'),
  query('hotelId').optional().isMongoId().withMessage('Invalid Hotel ID'),
  query('status').optional().isInt().withMessage('Status must be an integer'),
  query('startDate').optional().isISO8601().withMessage('Invalid start date'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be at least 1'),
  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be at least 1'),
  query('download').optional().isBoolean().withMessage('Download must be a boolean')
];

export const cancelBookingValidation = [
  param('bookingId').isMongoId().withMessage('Invalid Booking ID')
];
