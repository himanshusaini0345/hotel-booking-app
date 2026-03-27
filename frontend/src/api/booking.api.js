import api from './axios';

export const fetchBookings = async (params, isDownload = false) => {
    const config = { params };
    if (isDownload) {
        config.responseType = 'blob';
    }
    const response = await api.get('/bookings/getBookings', config);
    return isDownload ? response : response.data;
};

export const createBooking = async (payload) => {
    const { data } = await api.post('/bookings/createBooking', payload);
    return data;
};

export const cancelBooking = async (bookingId) => {
    const { data } = await api.post(`/bookings/${bookingId}/cancel`);
    return data;
};

export const fetchBookedUsers = async () => {
    const { data } = await api.get('/bookings/getBookedUsers');
    return data;
};
