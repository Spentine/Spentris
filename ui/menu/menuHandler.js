// event emitter
import { EventEmitter } from "../../eventEmitter.js";

// local storage
import { ls } from "../../localStorage/localStorage.js";

// langauge translations
import { translations } from "../../localization/language.js";

class MenuHandler {
  constructor(data) {
    this.currentMenu = data.currentMenu;
    this.uiFunctions = data.uiFunctions;
    this.menus = data.menus;
    this.uiDisplay = data.uiDisplay;
    
    this.event = new EventEmitter();
    this.values = data.values;
    
    this.loadLanguage();
  }
  
  /**
   * overwrites the current menu with a new one
   * @param {string} menu - the name of the menu to show
   * @param {array} args - arguments passed into the menu function
   */
  showMenu(menu, ...args) {
    const previousMenu = this.currentMenu;
    this.currentMenu = menu;
    this.uiFunctions.resetDisplay.call(this);
    this.menus[menu].call(this, ...args); // pass in the arguments
    
    this.event.emit("menuChange", {
      time: Date.now(),
      previousMenu: previousMenu,
      currentMenu: this.currentMenu,
    });
  }
  
  /**
   * will load the language translations
   * @param {string|null} lang - the language to load, if null, it will use the current language
   */
  loadLanguage(lang=null) {
    if (lang) {
      this.values.language = lang;
    }
    
    const langTranslations = translations[
      this.values.language ?? "en"
    ];
    
    this.uiText = langTranslations.translations.ui;
    this.uiDisplay.style.setProperty(
      "font-family", langTranslations.font.ui
    ); 
  }
  
  /**
   * will save the language to localStorage
   * @param {string} lang - the language to save
   */
  saveLanguage(lang) {
    this.values.language = lang;
    ls.values.language = lang;
    ls.save();
  }
}

export { MenuHandler };