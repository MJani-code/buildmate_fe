import axios from 'axios';
import Vuex from 'vuex';
import { mapState } from 'vuex';
import { APIGET, APIUPLOAD, APIPOST } from "~/api/apiHelper";


export const createStore = () => {

  return new Vuex.Store({
    state: {
      auth: {
        loggedIn: false,
        user: null,
        userRole: null,
      },
      cartItems: [],
      responseHandler: {
        show: false,
        title: 'Teszt title',
        message: 'Teszt message',
        options: [],
        clickedButton: null,
        type: {
          action: '',
        }
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
          type: {
            action: ''
          }
        }
      },
      SET_CLICKED_BUTTON(state, value) {
        state.responseHandler.clickedButton = value;
      },
      addToCart(state, product) {
        state.cartItems.push(product)
      }
    },

    actions: {
      async login({ commit }, user) {
        //TODO Beléptetési logika, például API hívás vagy adatbázis ellenőrzés. Értékek változóba mentése.
        const domain = window.location.hostname;
        try {
          const response = await APIPOST('login', user);
          const jsonData = JSON.stringify(response.data);
          localStorage.setItem('apiLogin', jsonData);

          if (!response.data.error && response.data.loggedIn == true) {
            const userRole = response.data.userRole;

            commit('SET_LOGGED_IN', true)
            commit('SET_USER', user)
            commit('SET_USERROLE', userRole)

            this.$router.push('/' + userRole + '/home') // Módosítsd a célútvonalat a saját alkalmazásodhoz igazítva
          } else {
            this.dispatch('setResponseHandler', {
              show: true,
              title: 'Hiba',
              message: response.data.error,
              options: [],
              type: {
                action: 'error'
              }
            });
          }
        }
        catch (error) {
          this.dispatch('setResponseHandler', {
            show: true,
            title: 'Hiba',
            message: response.data.error,
            options: [],
            type: {
              action: 'error'
            }
          });
        }
      },
      logout({ commit, dispatch }) {
        this.dispatch('setResponseHandler', {
          show: true,
          title: 'Kijelentkezés megerősítése',
          message: 'Biztosan ki szeretnél jelentkezni?',
          options: ['Mégsem', 'Igen'],
          type: {
            action: 'confirm',
          }
        })
      },
      confirmLogout({ commit }) {
        const dataFromLocalStorage = localStorage.getItem('apiLogin');
        const parsedData = JSON.parse(dataFromLocalStorage);
        const token = parsedData['token'];

        const deleteTokenFromDatabase = async () => {
          try {
            const response = await APIPOST('logout', token);
            const jsonData = JSON.stringify(response.data);

            if (response.data.confirmLogout) {
              commit('SET_LOGGED_IN', false);
              commit('SET_USER', null);
              localStorage.removeItem('apiLogin');
              this.$router.push('/');
            }

          } catch (error) {
            console.error('Hiba történt a token törlésekor az adatbázisból:', error);
          }
        }

        if (token) {
          deleteTokenFromDatabase()
        }
      },
      setResponseHandler({ commit }, value) {
        commit('SET_RESPONSEHANDLER', value)
      },
      setDefaultResponseHandler({ commit }) {
        commit('SET_DEFAULT_RESPONSEHANDLER')
      },
      addToCart({ commit }, product) {
        commit('addToCart', product)
      }
    },
    getters: {
      isAuthenticated: state => {
        return state.auth.loggedIn
      },
      currentUser: state => {
        return state.auth.user
      },
      getClickedButton: state => {
        return state.responseHandler.clickedButton;
      },
      cartItemCount: state => {
        return state.cartItems.length
      }

    }
  })
}

export default createStore
