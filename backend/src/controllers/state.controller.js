const State = require('../models/State');

exports.getStates = async (req, res, next) => {
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
