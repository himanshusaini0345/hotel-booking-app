const express = require('express');
const { getCities } = require('../controllers/city.controller');

const router = express.Router();

router.route('/').get(getCities);

module.exports = router;
