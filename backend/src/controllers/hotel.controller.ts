import { Request, Response, NextFunction } from 'express';
import Hotel from '../models/Hotel';
import ApiFeatures from '../utils/apiFeatures';

export const getHotelList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, stateId, cityId, rating, isActive, page, limit, sort } = req.query;
    let filter: any = {};

    // Search Box for hotel name
    if (search) {
      filter.name = new RegExp(search as string, 'i');
    }

    // Exact match filters
    if (stateId) filter.stateId = stateId;
    if (cityId) filter.cityId = cityId;
    if (rating) filter.rating = rating;
    
    // Status (Active/Inactive)
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const features = new ApiFeatures(Hotel.find(filter).populate('cityId').populate('stateId'), { search, stateId, cityId, rating, isActive, page, limit, sort })
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
