const Hotel = require('../models/Hotel');
const ApiFeatures = require('../utils/apiFeatures');

exports.getHotelList = async (req, res, next) => {
  try {
    let filter = {};

    // Search Box for hotel name
    if (req.query.search) {
      filter.name = new RegExp(req.query.search, 'i');
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
