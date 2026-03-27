import { Request, Response, NextFunction } from 'express';
import State from '../models/State';

export const getStates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const states = await State.find().sort('name');
    res.status(200).json({
      success: true,
      count: states.length,
      data: states
    });
  } catch (error) {
    next(error);
  }
};
