// i need an axios base config and functions like APIPOST APIGET APIPUT APIDELETE

import axios from 'axios';

const API = axios.create({
    baseURL: process.env.API_URL ?? 'http://',
    timeout: 3000
    // headers: {'X-Custom-Header': 'foobar'}
});

export const APIPOST = (url, data, isExternal = false) => {
    return API.post(url, data);
}

export const APIGET = (url,params, isExternal = false) => {
  return API.get(url, params);
}

export const APIPUT = (url, data, isExternal = false) => {
  return API.put(url, data);
}

export const APIDELETE = (url, isExternal = false) => {
  return API.delete(url);
}
