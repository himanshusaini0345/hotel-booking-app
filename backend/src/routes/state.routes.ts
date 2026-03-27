import express from 'express';
import { getStates } from '../controllers/state.controller';

const router = express.Router();

router.route('/').get(getStates);

export default router;
