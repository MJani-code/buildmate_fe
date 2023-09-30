// i need an axios base config and functions like APIPOST APIGET APIPUT APIDELETE

import axios from 'axios';

const host = 'http://localhost:5000';
const config = {
  apiUrl: {
    login: host+'/THFustike3/build_mate_be/API/login.php',
    logout: host+'/THFustike3/build_mate_be/API/logout.php',
    auth: host+'/THFustike3/build_mate_be/API/auth.php',
    getUserData: host+'/THFustike3/build_mate_be/API/settings/getuserdata.php',
    updateUserData: host+'/THFustike3/build_mate_be/API/settings/updateuserdata.php',
    getAccountsData: host+'/THFustike3/build_mate_be/API/accounts/getaccountsdata.php',
    addAccountsData: host+'/THFustike3/build_mate_be/API/accounts/addnewaccount.php',
    updateAccountsData: host+'/THFustike3/build_mate_be/API/accounts/updateaccountdata.php',
    getTodo: host+'/THFustike3/build_mate_be/API/todo/gettodo.php',
    updateTodo: host+'/THFustike3/build_mate_be/API/todo/updatetodo.php',
    addTodo: host+'/THFustike3/build_mate_be/API/todo/addtodo.php',
    getDocumentsData: host+'/THFustike3/build_mate_be/API/documents/getdocument.php',
    addDocumentsData: host+'/THFustike3/build_mate_be/API/documents/uploaddocument.php',
    updateDocumentsData: host+'/THFustike3/build_mate_be/API/documents/updatedocumentdata.php',
    downloadDocument: host+'/THFustike3/build_mate_be/API/documents/downloaddocument.php',
    getEvents: host+'/THFustike3/build_mate_be/API/events/getevents.php',
    addEvent: host+'/THFustike3/build_mate_be/API/events/addevent.php',
    deleteEvent: host+'/THFustike3/build_mate_be/API/events/deleteevent.php',
    posts: host+'/THFustike3/build_mate_be/posts.php',
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

export const APIPOST2 = async (endpoint, data) => {
  const url = config.apiUrl[endpoint];
  return await API.post(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
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

export const APIUPLOAD = async (endpoint, data) => {
  const url = config.apiUrl[endpoint];
  return await API.post(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
// export const APIUPLOAD = async (url, data) => {
//   return await API.post(url, data, {
//     headers: {
//       'Content-Type': 'multipart/form-data'
//     }
//   });
// }
