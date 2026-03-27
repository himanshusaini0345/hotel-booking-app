/**
 * Convert an array of objects to CSV format.
 * @param {Array} data - Array of objects to convert.
 * @returns {string} CSV formatted string.
 */
const jsonToCsv = (data) => {
  if (!data || data.length === 0) {
    return "";
  }

  // Extract headers
  const headers = [
    "Booking ID",
    "User Name",
    "User Email",
    "Hotel Name",
    "Location",
    "Check-In Date",
    "Number of Guests",
    "Status",
    "Booking Date",
    "Special Requests"
  ];

  const statusMap = {
    0: "CONFIRMED",
    1: "CANCELLED",
    2: "COMPLETED"
  };

  const rows = data.map(booking => {
    return [
      booking.id,
      booking.userId?.name || "N/A",
      booking.userId?.email || "N/A",
      booking.hotelId?.name || "N/A",
      booking.hotelId?.location || "N/A",
      booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : "N/A",
      booking.numberOfGuests,
      statusMap[booking.status] || "UNKNOWN",
      booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : "N/A",
      `"${(booking.specialRequests || "").replace(/"/g, '""')}"` // Escape quotes for CSV
    ].join(",");
  });

  return [headers.join(","), ...rows].join("\n");
};

module.exports = { jsonToCsv };
