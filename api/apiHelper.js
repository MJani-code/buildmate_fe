// i need an axios base config and functions like APIPOST APIGET APIPUT APIDELETE

import axios from 'axios';

const config = {
  apiUrl: {
    login: 'http://localhost:5000/THFustike3/build_mate_be/API/login.php',
    logout: 'http://localhost:5000/THFustike3/build_mate_be/API/logout.php',
    auth: 'http://localhost:5000/THFustike3/build_mate_be/API/auth.php',
    getUserData: 'http://localhost:5000/THFustike3/build_mate_be/API/settings/getuserdata.php',
    updateUserData: 'http://localhost:5000/THFustike3/build_mate_be/API/settings/updateuserdata.php',
    getAccountsData: 'http://localhost:5000/THFustike3/build_mate_be/API/accounts/getaccountsdata.php',
    addAccountsData: 'http://localhost:5000/THFustike3/build_mate_be/API/accounts/addnewaccount.php',
    updateAccountsData: 'http://localhost:5000/THFustike3/build_mate_be/API/accounts/updateaccountdata.php',
    getTodo: 'http://localhost:5000/THFustike3/build_mate_be/API/todo/gettodo.php',
    updateTodo: 'http://localhost:5000/THFustike3/build_mate_be/API/todo/updatetodo.php',
    addTodo: 'http://localhost:5000/THFustike3/build_mate_be/API/todo/addtodo.php',
    getDocumentsData: 'http://localhost:5000/THFustike3/build_mate_be/API/documents/getdocument.php',
    addDocumentsData: 'http://localhost:5000/THFustike3/build_mate_be/API/documents/uploaddocument.php',
    updateDocumentsData: 'http://localhost:5000/THFustike3/build_mate_be/API/documents/updatedocumentdata.php',
    getEvents: 'http://localhost:5000/THFustike3/build_mate_be/API/events/getevents.php',
    addEvent: 'http://localhost:5000/THFustike3/build_mate_be/API/events/addevent.php',
    deleteEvent: 'http://localhost:5000/THFustike3/build_mate_be/API/events/deleteevent.php',
    posts: 'http://localhost:5000/THFustike3/build_mate_be/posts.php',
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
