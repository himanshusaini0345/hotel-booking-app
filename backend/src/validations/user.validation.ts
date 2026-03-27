import { query } from 'express-validator';

export const getUsersValidation = [
  query('search').optional().isString().trim(),
  query('role').optional().isString().trim(),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be at least 1'),
  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be at least 1'),
  query('sort').optional().isString().trim()
];
