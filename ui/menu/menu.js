// default values
import { values } from "./defaultValues.js";

// event emitter
import { EventEmitter } from "../../eventEmitter.js";

// function location accessor
import { functionLocationAccessor } from "../../engine/util.js";

// keybinds and keyboard input
// import { bindInputFunctions } from "../../interaction/keyboard.js";

const spentrisMenus = {
  home: {
    container: document.getElementById("menuHome"),
    buttonStart: document.getElementById("menuHomeButtonStart"),
    buttonSettings: document.getElementById("menuHomeButtonSettings"),
  },
  settings: {
    container: document.getElementById("menuSettings"),
    buttonBack: document.getElementById("menuSettingsButtonBack"),
    buttonHandling: document.getElementById("menuSettingsButtonHandling"),
    buttonKeybind: document.getElementById("menuSettingsButtonKeybind"),
  },
  ingame: {
    container: document.getElementById("menuIngame"),
    renderCanvas: document.getElementById("renderCanvas"),
  },
};

/**
 * redirects the user to a different menu
 * origin.length may be greater than 2 if there is more nesting
 * @typedef {Object} RedirectionId
 * @property {string[]} origin
 * @property {string} redirect
 */
const redirectionIds = {
  // this button does some special things, not just starting the game but also setting up the game
  // it's not just a simple redirect
  /*
  menuHomeButtonStart: {
    origin: ["home", "buttonStart"],
    redirect: "game",
  },
  */
  menuHomeButtonSettings: {
    origin: ["home", "buttonSettings"],
    redirect: "settings",
  },
  menuSettingsButtonBack: {
    origin: ["settings", "buttonBack"],
    redirect: "home",
  },
};

// all functions binded to the MenuHandler
const functionIds = {
  menuHomeButtonStart: {
    origin: ["home", "buttonStart"],
    function: function () {
      this.changeMenu("ingame");
      this.event.emit("gameStart", {
        time: Date.now(),
        mode: "marathon",
        settings: this.generateSettings(),
      });
    }
  },
};

// there really isn't much of a reason to make this a class because it's going to be a singleton
class MenuHandler {
  constructor(data) {
    data = data ?? {};
    
    this.currentMenu = data.currentMenu ?? "home";
    this.menus = data.menus ?? spentrisMenus;
    this.redirects = data.redirects ?? redirectionIds;
    this.functions = data.functions ?? functionIds;
    
    this.event = new EventEmitter();
    this.values = data.values ?? {};
    
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
  
  /**
   * @returns {void}
   */
  addRedirects() {
    const ids = Object.keys(this.redirects);
    
    for (const id of ids) {
      const redirect = this.redirects[id];
      
      const origin = document.getElementById(id);
      origin.addEventListener(
        "click", () => this.changeMenu(redirect.redirect)
      );
    }
  }
  
  /**
   * @returns {void}
   */
  addFunctions() {
    const ids = Object.keys(this.functions);
    
    for (const id of ids) {
      const func = this.functions[id];
      
      const origin = document.getElementById(id);
      origin.addEventListener(
        "click", func.function.bind(this)
      );
    }
  }
  
  /**
   * generates an object with the settings for the game
   * @returns {object}
   */
  generateSettings() {
    const functionLocations = this.values.functionLocations;
    const gameFunctions = functionLocationAccessor(functionLocations, this.values.files);
    
    const state = this.values.state;
    const handling = this.values.handling;
    state.das = handling.das;
    state.arr = handling.arr;
    state.sdf = handling.sdf;
    state.msg = handling.msg;
    
    const gameValues = {
      version: 1,
      functions: gameFunctions,
      settings: {
        functionLocations: functionLocations,
        initialization: {
          variableOverrides: {
            
          },
          parameters: {
            seed: "random",
            rotationSystem: this.values.rotationSystem,
            state: state
          }
        }
      }
    };
    
    return {
      gameValues: gameValues,
      keybinds: this.values.keybinds,
    }
  }
}

export { MenuHandler, spentrisMenus, redirectionIds, functionIds, values };