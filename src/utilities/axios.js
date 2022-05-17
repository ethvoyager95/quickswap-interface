import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `https://deep-index.moralis.io/api/v2/`,
  timeout: 20000,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key':
      'fFugHvYLbqbaxsUAqtCukvx0Ybn1tIjert6wUyDgS0JYaRjeS6KkKXF6zROGU8sj'
  }
});

axiosInstance.interceptors.request.use(
  config => {
    const accessToken =
      'fFugHvYLbqbaxsUAqtCukvx0Ybn1tIjert6wUyDgS0JYaRjeS6KkKXF6zROGU8sj';
    if (config.headers)
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  err => Promise.reject(err)
);

axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
