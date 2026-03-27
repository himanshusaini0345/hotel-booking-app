import api from './axios';

export const fetchStates = async () => {
    const { data } = await api.get('/state');
    return data;
};

export const fetchCities = async (stateId?: string | number) => {
    const params = stateId ? { stateId } : {};
    const { data } = await api.get('/city', { params });
    return data;
};
