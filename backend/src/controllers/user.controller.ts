import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import ApiFeatures from '../utils/apiFeatures';

export const getUserList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let filter: any = {};
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, 'i');
      filter = {
        $or: [
          { name: searchRegex },
          { email: searchRegex },
          { phone: searchRegex }
        ]
      };
    }

    const features = new ApiFeatures(User.find(filter), req.query)
      .sort()
      .paginate();

    const users = await features.query;
    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      data: users
    });
  } catch (error) {
    next(error);
  }
};
