import { query } from 'express-validator';

export const getCitiesValidation = [
  query('stateId').optional().isMongoId().withMessage('Invalid State ID')
];
