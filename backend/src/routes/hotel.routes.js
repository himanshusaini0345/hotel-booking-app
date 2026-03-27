const express = require('express');
const { getHotelList } = require('../controllers/hotel.controller');
const { getHotelsValidation } = require('../validations/hotel.validation');
const validate = require('../middleware/validate.middleware');

const router = express.Router();

router.route('/getHotelList').get(getHotelsValidation, validate, getHotelList);

module.exports = router;
