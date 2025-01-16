const menus = {
  home: {
    container: document.getElementById("menuHome"),
    buttonStart: document.getElementById("menuHomeButtonStart"),
  },
};

class MenuHandler {
  constructor(data) {
    data = data ?? {};
    
    this.menus = data.menus ?? menus;
    this.currentMenu = data.currentMenu ?? "home";
    
    this.menus[this.currentMenu].container.style.display = "block";
  }
  
  changeMenu(menu) {
    // hide previous menu
    this.menus[this.currentMenu].container.style.display = "none";
    
    this.menus = menu;
    
    // show new menu
    this.menus[menu].container.style.display = "block";
  }
}

export { menus, MenuHandler };