import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
// form some reason the import.meta.env.VITE_API_BASE_URL is not working so I hardcoded the baseURL, but I will try to fix it later
// import.meta.env.VITE_API_BASE_URL
const api: AxiosInstance = axios.create({
  baseURL: "https://street-bite-backend-1.onrender.com/api",
  headers: {
    'Content-Type': 'application/json'
  }
});
// console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
api.interceptors.request.use(
  (config: any): any => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('token');
          break;
        case 403:
          console.error('Access forbidden');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default api;