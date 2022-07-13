import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL:
    process?.env?.REACT_APP_ENV === 'prod'
      ? `${process.env.REACT_APP_PRODUCTION_API}`
      : `${process.env.REACT_APP_DEVELOPMENT_API}`,
  timeout: 20000,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json'
  }
});
