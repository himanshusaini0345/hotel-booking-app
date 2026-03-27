import api from './axios';

export const fetchHotels = async (params) => {
    const { data } = await api.get('/hotels/getHotelList', { params });
    return data;
};
