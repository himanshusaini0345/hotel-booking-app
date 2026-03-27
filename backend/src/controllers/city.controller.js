const City = require('../models/City');

exports.getCities = async (req, res, next) => {
  try {
    let filter = {};
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
