import Vuex from 'vuex'

export const createStore = () => {

    return new Vuex.Store({
        state: {
            auth: {
                loggedIn: false,
                user: null,
                userRole: null
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
            }
        },
        actions: {
            login({ commit }, user) {
                //TODO Beléptetési logika, például API hívás vagy adatbázis ellenőrzés. Értékek változóba mentése.
                const userRole = "admin";

                commit('SET_LOGGED_IN', true)
                commit('SET_USER', user)
                commit('SET_USERROLE', userRole)
                localStorage.setItem('loggedIn', 'true')
                localStorage.setItem('userRole', userRole)

                //TODO: userRole kapott értéke alapján elirányítani
                this.$router.push('/'+userRole+'/home') // Módosítsd a célútvonalat a saját alkalmazásodhoz igazítva

            },
            logout({ commit }) {
                // Kijelentkeztetési logika, például API hívás vagy adatbázis művelet
                commit('SET_LOGGED_IN', false)
                commit('SET_USER', null)
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
