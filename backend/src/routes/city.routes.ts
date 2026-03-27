import express from 'express';
import { getCities } from '../controllers/city.controller';
import { getCitiesValidation } from '../validations/city.validation';
import validate from '../middleware/validate.middleware';

const router = express.Router();

router.route('/').get(getCitiesValidation, validate, getCities);

export default router;
