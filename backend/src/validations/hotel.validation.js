const { query } = require('express-validator');

exports.getHotelsValidation = [
  query('search').optional().isString().trim(),
  query('stateId').optional().isMongoId().withMessage('Invalid State ID'),
  query('cityId').optional().isMongoId().withMessage('Invalid City ID'),
  query('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  query('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be at least 1'),
  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be at least 1'),
  query('sort').optional().isString().trim()
];
