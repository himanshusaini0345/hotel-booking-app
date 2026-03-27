import express from 'express';
import { getBookings, createBooking, cancelBooking, getBookedUsers } from '../controllers/booking.controller';
import { createBookingValidation, getBookingsValidation, cancelBookingValidation } from '../validations/booking.validation';
import validate from '../middleware/validate.middleware';

const router = express.Router();

router.route('/getBookings').get(getBookingsValidation, validate, getBookings);
router.route('/getBookedUsers').get(getBookedUsers);
router.route('/createBooking').post(createBookingValidation, validate, createBooking);
router.route('/:bookingId/cancel').post(cancelBookingValidation, validate, cancelBooking);

export default router;
