const express = require('express');
const { getStates } = require('../controllers/state.controller');

const router = express.Router();

router.route('/').get(getStates);

module.exports = router;
