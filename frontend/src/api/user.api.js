import api from './axios';

export const fetchUsers = async (params) => {
    const { data } = await api.get('/users/getUserList', { params });
    return data;
};
