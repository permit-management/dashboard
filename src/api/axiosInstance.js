import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://60swqrng-8080.asse.devtunnels.ms/api/v1',
});

// Tambahkan token ke setiap request
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;