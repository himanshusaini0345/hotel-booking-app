import api from './axios';

export const fetchUsers = async (params: any) => {
    const { data } = await api.get('/users/getUserList', { params });
    return data;
};
