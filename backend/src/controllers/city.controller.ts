import { Request, Response, NextFunction } from 'express';
import City from '../models/City';

export const getCities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let filter: any = {};
    if (req.query.stateId) {
      filter.stateId = req.query.stateId;
    }
    const cities = await City.find(filter).sort('name');
    res.status(200).json({
      success: true,
      count: cities.length,
      data: cities
    });
  } catch (error) {
    next(error);
  }
};
