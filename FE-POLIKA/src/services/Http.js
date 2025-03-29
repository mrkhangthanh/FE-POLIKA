import axios from "axios";
import { BASE_API } from "../constants/app";
const Http = axios.create({
    baseURL: BASE_API,
});

Http.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
export default Http;
