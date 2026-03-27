import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import ApiFeatures from '../utils/apiFeatures';

export const getUserList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, sort, search } = req.query;
    let filter: any = {};
    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      filter = {
        $or: [
          { name: searchRegex },
          { email: searchRegex },
          { phone: searchRegex }
        ]
      };
    }

    const features = new ApiFeatures(User.find(filter), { page, limit, sort, search })
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
