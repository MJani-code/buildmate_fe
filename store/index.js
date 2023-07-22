import Vuex from 'vuex'

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
      login({ commit }, user) {
        //TODO Beléptetési logika, például API hívás vagy adatbázis ellenőrzés. Értékek változóba mentése.
        const userRole = "admin";

        commit('SET_LOGGED_IN', true)
        commit('SET_USER', user)
        commit('SET_USERROLE', userRole)

        //TODO: userRole kapott értéke alapján elirányítani
        this.$router.push('/' + userRole + '/home') // Módosítsd a célútvonalat a saját alkalmazásodhoz igazítva

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
