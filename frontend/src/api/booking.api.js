import api from './axios';

export const fetchBookings = async (params) => {
    const { data } = await api.get('/bookings/getBookings', { params });
    return data;
};

export const createBooking = async (payload) => {
    const { data } = await api.post('/bookings/createBooking', payload);
    return data;
};

export const cancelBooking = async (bookingId) => {
    const { data } = await api.post(`/bookings/${bookingId}/cancel`);
    return data;
};
