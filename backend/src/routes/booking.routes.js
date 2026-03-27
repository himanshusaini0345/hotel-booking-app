const express = require('express');
const { getBookings, createBooking, cancelBooking, getBookedUsers } = require('../controllers/booking.controller');
const { createBookingValidation, getBookingsValidation, cancelBookingValidation } = require('../validations/booking.validation');
const validate = require('../middleware/validate.middleware');

const router = express.Router();

router.route('/getBookings').get(getBookingsValidation, validate, getBookings);
router.route('/getBookedUsers').get(getBookedUsers);
router.route('/createBooking').post(createBookingValidation, validate, createBooking);
router.route('/:bookingId/cancel').post(cancelBookingValidation, validate, cancelBooking);

module.exports = router;
