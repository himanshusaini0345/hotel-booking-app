import { Request, Response, NextFunction } from 'express';
import Hotel from '../models/Hotel';
import ApiFeatures from '../utils/apiFeatures';

export const getHotelList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let filter: any = {};

    // Search Box for hotel name
    if (req.query.search) {
      filter.name = new RegExp(req.query.search as string, 'i');
    }

    // Exact match filters
    if (req.query.stateId) filter.stateId = req.query.stateId;
    if (req.query.cityId) filter.cityId = req.query.cityId;
    if (req.query.rating) filter.rating = req.query.rating;
    
    // Status (Active/Inactive)
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true';
    }

    const features = new ApiFeatures(Hotel.find(filter).populate('cityId').populate('stateId'), req.query)
      .sort()
      .paginate();

    const hotels = await features.query;
    const total = await Hotel.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: hotels.length,
      total,
      data: hotels
    });
  } catch (error) {
    next(error);
  }
};
