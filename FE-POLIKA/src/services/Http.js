import axios from "axios";
import { BASE_API } from "../constants/app";

const Http = axios.create({
    baseURL: BASE_API,
});

Http.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token'); // Sử dụng accessToken
      console.log('Auth Header:', token);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

Http.interceptors.response.use(
  (response) => response.data, // Trả về response.data trực tiếp
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    // if (error.response && error.response.status === 401) {
    //   localStorage.removeItem('token');
    //   localStorage.removeItem('user');
    //   window.location.href = '/admin-login';
    //   return Promise.reject(new Error('Unauthorized. Please log in again.'));
    // }
    return Promise.reject(error.response?.data || { message: 'Lỗi không xác định.' });
  }
);

export default Http;
