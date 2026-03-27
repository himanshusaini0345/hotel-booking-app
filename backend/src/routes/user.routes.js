const express = require('express');
const { getUserList } = require('../controllers/user.controller');

const router = express.Router();

router.route('/getUserList').get(getUserList);

module.exports = router;
