const Booking = require('../models/Booking');
const ApiFeatures = require('../utils/apiFeatures');
const { jsonToCsv } = require('../utils/csvUtils');

exports.getBookings = async (req, res, next) => {
  try {
    let filter = {};

    // Standard filters
    if (req.query.userId) filter.userId = req.query.userId;
    if (req.query.hotelId) filter.hotelId = req.query.hotelId;
    if (req.query.status) filter.status = req.query.status;

    // Date Range implementation
    if (req.query.startDate || req.query.endDate) {
      filter.checkInDate = {};
      if (req.query.startDate) filter.checkInDate.$gte = new Date(req.query.startDate);
      if (req.query.endDate) filter.checkInDate.$lte = new Date(req.query.endDate);
    }

    const features = new ApiFeatures(
      Booking.find(filter)
        .populate('userId', 'name email')
        .populate('hotelId', 'name location cityId'),
      req.query
    )
      .sort()
      .paginate();

    const rawBookings = await features.query;
    const bookings = rawBookings.map(b => b.toJSON());

    // Handle Download
    if (req.query.download === 'true') {
      const csv = jsonToCsv(bookings);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=bookings.csv');
      return res.status(200).send(csv);
    }

    const total = await Booking.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

exports.createBooking = async (req, res, next) => {
  try {
    const { userId, hotelId, checkInDate, numberOfGuests, specialRequests } = req.body;

    const requestedDate = new Date(checkInDate);
    const now = new Date();
    
    // Check if the booking is for tomorrow, and if it's past 9 PM today
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Normalize dates to ignore time component for comparison
    const normRequested = new Date(requestedDate.getFullYear(), requestedDate.getMonth(), requestedDate.getDate());
    const normTomorrow = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
    
    if (normRequested.getTime() === normTomorrow.getTime()) {
      if (now.getHours() >= 21) {
        return res.status(400).json({
          success: false,
          message: 'Cannot book for the next day after 9 PM. Please select a later date.'
        });
      }
    }

    // Check for duplicates
    // Same hotel, same day, same user
    const duplicateBooking = await Booking.findOne({
      userId,
      hotelId,
      checkInDate: {
        $gte: normRequested,
        $lt: new Date(normRequested.getTime() + 24 * 60 * 60 * 1000)
      },
      status: { $in: [0, 2] } // Exclude cancelled ones from duplicate check
    });

    if (duplicateBooking) {
      return res.status(400).json({
        success: false,
        message: 'You already have a booking at this hotel for the same day.'
      });
    }

    const booking = await Booking.create({
      userId,
      hotelId,
      checkInDate: requestedDate,
      numberOfGuests,
      specialRequests,
      status: 0 // Default to CONFIRMED
    });

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.status === 1) {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
    }

    booking.status = 1; // CANCELLED
    await booking.save();

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};
 
exports.getBookedUsers = async (req, res, next) => {
  try {
    const bookedUsers = await Booking.aggregate([
      { $group: { _id: '$userId' } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          _id: 0,
          id: '$_id',
          name: '$userDetails.name',
          email: '$userDetails.email'
        }
      },
      { $sort: { name: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: bookedUsers
    });
  } catch (error) {
    next(error);
  }
};
