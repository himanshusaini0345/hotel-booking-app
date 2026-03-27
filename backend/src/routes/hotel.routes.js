const express = require('express');
const { getHotelList } = require('../controllers/hotel.controller');

const router = express.Router();

router.route('/getHotelList').get(getHotelList);

module.exports = router;
