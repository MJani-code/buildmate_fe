import axios from 'axios';

//DEV
const host = 'http://localhost:5000/THFustike3';

//Live
//const host = window.location.origin;

export const config = {
  apiUrl: {
    login: host + '/build_mate_be/API/login.php',
    logout: host + '/build_mate_be/API/logout.php',
    auth: host + '/build_mate_be/API/auth.php',
    getUserData: host + '/build_mate_be/API/settings/getuserdata.php',
    updateUserData: host + '/build_mate_be/API/settings/updateuserdata.php',
    getAccountsData: host + '/build_mate_be/API/accounts/getaccountsdata.php',
    addAccountsData: host + '/build_mate_be/API/accounts/addnewaccount.php',
    updateAccountsData: host + '/build_mate_be/API/accounts/updateaccountdata.php',
    getTodo: host + '/build_mate_be/API/todo/gettodo.php',
    updateTodo: host + '/build_mate_be/API/todo/updatetodo.php',
    addTodo: host + '/build_mate_be/API/todo/addtodo.php',
    getDocumentsData: host + '/build_mate_be/API/documents/getdocument.php',
    addDocumentsData: host + '/build_mate_be/API/documents/uploaddocument.php',
    updateDocumentsData: host + '/build_mate_be/API/documents/updatedocumentdata.php',
    downloadDocument: host + '/build_mate_be/API/documents/downloaddocument.php',
    getEvents: host + '/build_mate_be/API/events/getevents.php',
    addEvent: host + '/build_mate_be/API/events/addevent.php',
    deleteEvent: host + '/build_mate_be/API/events/deleteevent.php',
    posts: host + '/build_mate_be/posts.php',
    getFaqs: host + '/build_mate_be/API/faq/getfaqs.php',
    addFaq: host + '/build_mate_be/API/faq/addFaq.php',
    updateFaq: host + '/build_mate_be/API/faq/updatefaq.php',
    deleteFaq: host + '/build_mate_be/API/faq/deletefaq.php',
    getPolls: host + '/build_mate_be/API/polls/getpolls.php',
    addVotes: host + '/build_mate_be/API/polls/addvotes.php',
    addPolls: host + '/build_mate_be/API/polls/addpolls.php',
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
