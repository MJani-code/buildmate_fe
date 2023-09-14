// i need an axios base config and functions like APIPOST APIGET APIPUT APIDELETE

import axios from 'axios';

const config = {
  apiUrl: {
    getLandingNewProductsData: 'http://localhost:5000/LastMinute_BE/scripts/landing/getnewproductsdata.php',
    getLandingPartnersData: 'http://localhost:5000/LastMinute_BE/scripts/landing/getpartnersdata.php',
    getProductsData: 'http://localhost:5000/LastMinute_BE/scripts/products/getproductsdata.php',
    // Itt további végpontokat adhatsz meg
  },
};

const API = axios.create({
    baseURL: process.env.API_URL ?? 'http://',
    timeout: 3000
    // headers: {'X-Custom-Header': 'foobar'}
});

export const APIPOST = async (endpoint, data) => {
    const url = config.apiUrl[endpoint];
    return await API.post(url, data);
}

export const APIGET = async (endpoint) => {
  const url = config.apiUrl[endpoint];
  return await API.get(url);
}

export const APIPUT = async (url, data) => {
  return await API.put(url, data);
}

export const APIDELETE = async (url) => {
  return await API.delete(url);
}

export const APIUPLOAD = async (url, data) => {
  return await API.post(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
