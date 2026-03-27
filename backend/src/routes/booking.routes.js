const express = require('express');
const { getBookings, createBooking, cancelBooking } = require('../controllers/booking.controller');

const router = express.Router();

router.route('/getBookings').get(getBookings);
router.route('/createBooking').post(createBooking);
router.route('/:bookingId/cancel').post(cancelBooking);

module.exports = router;
