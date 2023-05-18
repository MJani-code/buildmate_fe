// middleware/auth.js

export default function ({ store, redirect, route }) {
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');
    console.log(loggedIn);
    // Ellenőrizd, hogy a felhasználó be van-e jelentkezve
    if (route.path.startsWith('/admin') && !loggedIn) {
        redirect('/') // Átirányítás a bejelentkezési oldalra, ha nincs bejelentkezve
        console.log('admin kezdetű oldalra navigáltunk és nem vagyunk bejelentkezve');
    } else if (route.path.startsWith('/ccr') && !loggedIn) {
        redirect('/') // Átirányítás a bejelentkezési oldalra, ha nincs bejelentkezve
        console.log('ccr kezdetű oldalra navigáltunk és nem vagyunk bejelentkezve');
    }

    // Ellenőrizd a felhasználó jogosultságát csak a bizonyos útvonalon
    if (route.path.startsWith('/ccr')) {
        if (userRole !== 'ccr') {
            return redirect('/') // Átirányítás a kezdőoldalra, ha a felhasználó nem rendelkezik megfelelő jogosultsággal
        }
    }
}
