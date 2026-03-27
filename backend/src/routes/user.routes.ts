import express from 'express';
import { getUserList } from '../controllers/user.controller';
import { getUsersValidation } from '../validations/user.validation';
import validate from '../middleware/validate.middleware';

const router = express.Router();

router.route('/getUserList').get(getUsersValidation, validate, getUserList);

export default router;
