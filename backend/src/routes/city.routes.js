const express = require('express');
const { getCities } = require('../controllers/city.controller');
const { getCitiesValidation } = require('../validations/city.validation');
const validate = require('../middleware/validate.middleware');

const router = express.Router();

router.route('/').get(getCitiesValidation, validate, getCities);

module.exports = router;
