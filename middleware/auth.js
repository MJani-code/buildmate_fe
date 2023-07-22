export default function ({ store, redirect, route }) {

    const loggedIn = store.state.auth.loggedIn;
    const userRole = store.state.auth.userRole;

    // Ellenőrizd, hogy a felhasználó be van-e jelentkezve
    if (route.path.startsWith('/admin') && loggedIn == null) {
        redirect('/')
    } else if (route.path.startsWith('/ccr') && loggedIn == null) {
        redirect('/')
    }

    //Ellenőrizzük, hogy a felhasználónak van-e megfelelő jogosultsága az utvonal megtekintéséhez
    else if (route.path.startsWith('/ccr') && userRole !== 'ccr') {
        redirect('/')
    }else if (route.path.startsWith('/admin') && userRole !== 'admin') {
        redirect('/')
    }

    // Ellenőrizd a felhasználó jogosultságát csak a bizonyos útvonalon
    if (route.path.startsWith('/ccr')) {
        if (userRole !== 'ccr') {
            return redirect('/')
        }
    }
}
