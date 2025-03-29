import Http from "./Http";
    export const getAllUsers = ()=> Http.get(`/users`);
    export const register = (userData) => Http.post(`/register`, userData);
    export const createUser = (userData) => Http.post(`/createUser`, userData);
    export const login = (credentials) => Http.post(`/login`, credentials);
    export const updateUser = (userId, userData) => Http.put(`/users/${userId}`, userData);
    export const deleteUser = (userId) => Http.delete(`/users/${userId}`);
