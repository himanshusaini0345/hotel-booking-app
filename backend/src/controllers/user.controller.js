const User = require('../models/User');
const ApiFeatures = require('../utils/apiFeatures');

exports.getUserList = async (req, res, next) => {
  try {
    let filter = {};
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
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
