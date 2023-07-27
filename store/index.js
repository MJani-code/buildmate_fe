import axios from 'axios';
import Vuex from 'vuex'
import { APIGET, APIUPLOAD, APIPOST } from "~/api/apiHelper";


export const createStore = () => {

  return new Vuex.Store({
    state: {
      auth: {
        loggedIn: false,
        user: null,
        userRole: null
      },
      responseHandler: {
        show: false,
        title: 'Teszt title',
        message: 'Teszt message',
        options: [],
        type: 'success'
      }
    },
    mutations: {
      SET_LOGGED_IN(state, value) {
        state.auth.loggedIn = value
      },
      SET_USER(state, user) {
        state.auth.user = user
      },
      SET_USERROLE(state, value) {
        state.auth.userRole = value
      },
      SET_RESPONSEHANDLER(state, value) {
        state.responseHandler = value
      },
      TOGGLE_RESPONSEHANDLER(state) {
        state.responseHandler.show = !state.responseHandler.show
      },
      SET_DEFAULT_RESPONSEHANDLER(state) {
        state.responseHandler = {
          show: false,
          title: 'Teszt title',
          message: 'Teszt message',
          options: [],
          type: 'success'
        }
      }
    },
    actions: {
      async login({ commit }, user) {
        //TODO Beléptetési logika, például API hívás vagy adatbázis ellenőrzés. Értékek változóba mentése.
        const domain = window.location.hostname;
        try {
          const response = await APIPOST('http://localhost:3000/build_mate_be/login.php', user);
          console.log(response);
          if (!response.data.error && response.data.loggedIn == true) {
            const userRole = response.data.userRole;

            commit('SET_LOGGED_IN', true)
            commit('SET_USER', user)
            commit('SET_USERROLE', userRole)

            this.$router.push('/' + userRole + '/home') // Módosítsd a célútvonalat a saját alkalmazásodhoz igazítva
          }
          // response.data.forEach((item, index) => {
          //   this.documents.push({ ...this.documents[index], ...item, id: index + 10 })
          // })
        }
        catch (error) {
          this.checkError(error, {
            show: true,
            title: 'Hiba',
            message: `Hiba történt az adatok lekérése közben: ${error.code} - ${error.name} - ${error.message}`,
            options: [],
            type: 'error',
          });
        }


      },
      logout({ commit }) {
        // Kijelentkeztetési logika, például API hívás vagy adatbázis művelet
        commit('SET_LOGGED_IN', false)
        commit('SET_USER', null)
      },
      setResponseHandler({ commit }, value) {
        commit('SET_RESPONSEHANDLER', value)
      },
      setDefaultResponseHandler({ commit }) {
        commit('SET_DEFAULT_RESPONSEHANDLER')
      }
    },
    getters: {
      isAuthenticated: state => {
        return state.auth.loggedIn
      },
      currentUser: state => {
        return state.auth.user
      }
    }
  })
}

export default createStore
