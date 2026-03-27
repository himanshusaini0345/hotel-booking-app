import express from 'express';
import { getHotelList } from '../controllers/hotel.controller';
import { getHotelsValidation } from '../validations/hotel.validation';
import validate from '../middleware/validate.middleware';

const router = express.Router();

router.route('/getHotelList').get(getHotelsValidation, validate, getHotelList);

export default router;
