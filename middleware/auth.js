import { APIPOST } from "~/api/apiHelper";

export default async function ({ store, redirect, route }) {
    // Adatok lekérése a localstorage-ból
    const dataFromLocalStorage = localStorage.getItem('apiLogin');
    const parsedData = JSON.parse(dataFromLocalStorage);

    var tokenValid = false;

    // Ha van token az adatokban, akkor ellenőrizzük annak érvényességét az API-n keresztül
    if (parsedData && parsedData.token) {
        try {
            // Az API hívás elvégzése a token-rel
            const response = await APIPOST('auth', parsedData);
            const jsonData = JSON.stringify(response.data);

            tokenValid = response.data.tokenValid;
            const pageCategory = response.data.pageCategory;

            store.state.auth.loggedIn = response.data.tokenValid;
            store.state.auth.userRole = response.data.pageCategory;

            // Ha a token érvényes, a válasz 200-as státuszkóddal érkezik
            if (response.status === 200) {
                // Ellenőrizd a felhasználó jogosultságát csak a bizonyos útvonalon.
                if (route.path.startsWith('/ccr') && pageCategory !== 'ccr') {
                    return redirect('/')
                }
                else if (route.path.startsWith('/admin') && pageCategory !== 'admin') {
                    return redirect('/')
                }
            } else {
                // Ha a token érvénytelen vagy lejárt, átirányítjuk a felhasználót a bejelentkezési oldalra
                return redirect('/');
            }
        } catch (error) {
            // Ha hiba történt az API hívás során, átirányítjuk a felhasználót a bejelentkezési oldalra
            console.error('API hívás hiba:', error.message);
            return redirect('/');
        }
    }

    // Ellenőrizd, hogy a felhasználó be van-e jelentkezve
    if ((route.path.startsWith('/admin') || route.path.startsWith('/ccr')) && !tokenValid) {
        redirect('/');
    }
}


// import { APIGET, APIUPLOAD, APIPOST } from "~/api/apiHelper";

// export default function ({ store, redirect, route }) {

//     //TODO: adatok lekérdezése a localstorageből
//     const dataFromLocalStorage = localStorage.getItem('apiLogin');
//     const parsedData = JSON.parse(dataFromLocalStorage);
//     console.log(parsedData);

//     const loggedIn = store.state.auth.loggedIn;
//     const userRole = store.state.auth.userRole;
//     //TODO token-t lekrédezni és megvizsgálni, hogy érvényes-e.

//     // Ellenőrizd, hogy a felhasználó be van-e jelentkezve
//     if (route.path.startsWith('/admin') && loggedIn == false) {
//         redirect('/')
//     } else if (route.path.startsWith('/ccr') && loggedIn == false) {
//         redirect('/')
//     }

//     //Ellenőrizzük, hogy a felhasználónak van-e megfelelő jogosultsága az utvonal megtekintéséhez
//     else if (route.path.startsWith('/ccr') && userRole !== 'ccr') {
//         redirect('/')
//     }else if (route.path.startsWith('/admin') && userRole !== 'admin') {
//         redirect('/')
//     }

//     // Ellenőrizd a felhasználó jogosultságát csak a bizonyos útvonalon.
//     if (route.path.startsWith('/ccr')) {
//         if (userRole !== 'ccr') {
//             return redirect('/')
//         }
//     }
// }
