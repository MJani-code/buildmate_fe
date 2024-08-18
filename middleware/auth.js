import { APIPOST } from "~/api/apiHelper";

export default async function ({ store, redirect, route }) {
    // Adatok lekérése a localstorage-ból
    const dataFromLocalStorage = localStorage.getItem('apiLogin');
    var parsedData = JSON.parse(dataFromLocalStorage);
    if(parsedData){
        parsedData.path = route.path
    }

    var tokenValid = false;

    // Ha van token az adatokban, akkor ellenőrizzük annak érvényességét az API-n keresztül
    if (parsedData && parsedData.token) {
        var token = parsedData.token;
        var userId = parsedData.userId;
        var userRole = parsedData.userRole;
        var userRoleId = parsedData.userRoleId;
        var condominiumId = parsedData.condominium_id;


        try {
            // Az API hívás elvégzése a token-rel
            const response = await APIPOST('auth', parsedData);
            const jsonData = JSON.stringify(response.data);

            tokenValid = response.data.tokenValid;
            const pageCategory = response.data.pageCategory;

            store.state.auth.loggedIn = response.data.tokenValid;
            store.state.auth.pageCategory = response.data.pageCategory;
            store.state.auth.token = token;
            store.state.auth.userId = userId;
            store.state.auth.userRole = userRole;
            store.state.auth.userRoleId = userRoleId;
            store.state.auth.condominiumId = condominiumId;

            if(response.data.status === 401) {
                //Oldaljogosultság ellenőrzés
                return redirect(`/${data.pageCategory}/home`);
            } else if(response.data.status === 404 || response.data.status === 500) {
                //Lejárt token
                localStorage.removeItem('apiLogin');
                return redirect('/');
            }
        } catch (error) {
            // Ha hiba történt az API hívás során, átirányítjuk a felhasználót a bejelentkezési oldalra
            console.error('API hívás hiba:', error.message);
            return redirect('/');
        }
    }
    // Ellenőrizd, hogy a felhasználó be van-e jelentkezve
    // if ((route.path.startsWith('/admin') || route.path.startsWith('/ccr')) && !tokenValid) {
    //     redirect('/');
    // }
}
