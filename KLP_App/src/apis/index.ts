import axios from 'axios';
import { BASE_URL } from '@env';
import { Platform } from 'react-native';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 3000,
  withCredentials: true,
});

api.interceptors.request.use(
  config => {
    config.withCredentials = true;
    return config;
  },
  error => Promise.reject(error),
);

api.interceptors.response.use(
  response => {
    if (__DEV__) {
      const method = response.config.method?.toUpperCase() ?? 'METHOD';
      const url = (response.config.baseURL ?? '') + (response.config.url ?? '');
      const icons = ['✨', '🫧', '🌈', '⭐️', '🌹', '🐱'];
      const randomIcon = icons[Math.floor(Math.random() * icons.length)];
      console.log('--------------------------------------------------');
      console.log(`[${Platform.OS.toUpperCase()}]`, method, url, randomIcon);
      console.log(response.data);
      console.log('--------------------------------------------------');
    }
    return response;
  },
  err => {
    const error = {
      status: err.response ? err.response.status : null,
      data: err.response ? err.response.data : null,
      message: err.message,
    };
    return Promise.reject(error);
  },
);

export default api;
