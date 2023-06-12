// i need an axios base config and functions like APIPOST APIGET APIPUT APIDELETE

import axios from 'axios';

const API = axios.create({
    baseURL: process.env.API_URL ?? 'http://',
    timeout: 3000
    // headers: {'X-Custom-Header': 'foobar'}
});

export const APIPOST = async (url, data) => {
    return await API.post(url, data);
}

export const APIGET = async (url) => {
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
