const spentrisMenus = {
  home: {
    container: document.getElementById("menuHome"),
    buttonStart: document.getElementById("menuHomeButtonStart"),
  },
};

class MenuHandler {
  constructor(data) {
    data = data ?? {};
    
    this.menus = data.menus ?? spentrisMenus;
    this.currentMenu = data.currentMenu ?? "home";
    
    this.showMenu(this.currentMenu);
  }
  
  /**
   * @param {string} menu
   * @returns {void}
   */
  showMenu(menu) {
    this.menus[menu].container.style.display = "block";
  }
  
  /**
   * @param {string} menu
   * @returns {void}
   */
  hideMenu(menu) {
    this.menus[menu].container.style.display = "none";
  }
  
  /**
   * @param {string} menu
   * @returns {void}
   */
  changeMenu(menu) {
    // this.currentMenu is technically the previous menu
    this.hideMenu(this.currentMenu);
    
    this.currentMenu = menu;
    this.showMenu(this.currentMenu);
  }
}

export { MenuHandler, spentrisMenus };