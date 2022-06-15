import axios from 'axios';
import * as constants from 'utilities/constants';

export const axiosInstanceMoralis = axios.create({
  baseURL: `${constants.MORALIS_API}`,
  timeout: 20000,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': `${constants.MORALIS_KEY}`
  }
});
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
