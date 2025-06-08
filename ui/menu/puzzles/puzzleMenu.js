/*

Spentine
Created on 20250607

> the long awaited puzzles!!!
> what else do i do on the airplane???

*/

// event emitter
import { EventEmitter } from "../../../eventEmitter.js";

// local storage
import { ls } from "../../../localStorage/localStorage.js";

// languages
import { translations } from "../../../localization/language.js";


// puzzles
import { PuzzleFunction, Puzzle } from "../../../puzzles/engine/puzzle.js";
import { debugPuzzles } from "../../../puzzles/packs/test.js";

const puzzleUiFunctions = {
  /**
   * delete all elements in uiDisplay
   */
  resetDisplay: function () {
    while (this.uiDisplay.firstChild) {
      this.uiDisplay.removeChild(this.uiDisplay.firstChild);
    }
  },
  
  /**
   * create header
   */
  createHeader: function () {
    
  },
};

const puzzleMenus = {
  puzzleEditor: function () {
    this.uiDisplay.className = "";
    
    const testElement = document.createElement("p");
    testElement.textContent = "im on the fucking airplane i dont get no github copilot here smh smh ts pmo 😭😭😭😭 also i dont even remember how to use `extends` because i forgot so right now im just doing it really jankily get me off of here";
    
    this.uiDisplay.appendChild(testElement);
  },
};

/**
 * basically identical to MenuHandler
 * consider making it actually menuhandler or whatever
 */
class PuzzleMenuHandler {
  constructor(data) {
    this.currentMenu = data.currentMenu ?? "puzzleEditor";
    this.uiFunctions = data.uiFunctions ?? puzzleUiFunctions;
    this.menus = data.menus ?? puzzleMenus;
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
    this.menus[menu].call(this, ...args);
    this.event.emit("menuChange", {
      time: Date.now(),
      previousMenu: previousMenu,
      currentMenu: this.currentMenu,
    });
  }
  
  /**
   * will load the language translations (does not save because this isn't the main menus)
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
}

export {
  PuzzleMenuHandler,
  puzzleUiFunctions,
  puzzleMenus,
};