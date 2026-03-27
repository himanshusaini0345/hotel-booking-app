const express = require('express');
const { getUserList } = require('../controllers/user.controller');
const { getUsersValidation } = require('../validations/user.validation');
const validate = require('../middleware/validate.middleware');

const router = express.Router();

router.route('/getUserList').get(getUsersValidation, validate, getUserList);

module.exports = router;
