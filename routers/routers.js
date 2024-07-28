const dataFromLocalStorage = localStorage.getItem('apiLogin');
var menuItems = null;
if(dataFromLocalStorage){
    menuItems = JSON.parse(dataFromLocalStorage).menuItems
}

export const routers = menuItems
