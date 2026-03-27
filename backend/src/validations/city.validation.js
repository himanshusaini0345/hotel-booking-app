const { query } = require('express-validator');

exports.getCitiesValidation = [
  query('stateId').optional().isMongoId().withMessage('Invalid State ID')
];
