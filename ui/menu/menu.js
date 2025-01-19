// values
import { values, defaultValues } from "./defaultValues.js";

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
    buttonKeybinds: document.getElementById("menuSettingsButtonKeybinds"),
  },
  handling: {
    container: document.getElementById("menuHandling"),
    buttonBack: document.getElementById("menuHandlingButtonBack"),
    values: {
      arr: document.getElementById("menuHandlingARR"),
      das: document.getElementById("menuHandlingDAS"),
      sdf: document.getElementById("menuHandlingSDF"),
      dcd: document.getElementById("menuHandlingDCD"),
      msg: document.getElementById("menuHandlingMSG"),
      are: document.getElementById("menuHandlingARE"),
      lca: document.getElementById("menuHandlingLCA"),
    },
  },
  keybinds: {
    container: document.getElementById("menuKeybinds"),
    buttonBack: document.getElementById("menuKeybindsButtonBack"),
    actions: {
      moveLeftInput: document.getElementById("menuKeybindsLeftContainer"),
      moveRightInput: document.getElementById("menuKeybindsRightContainer"),
      softDropInput: document.getElementById("menuKeybindsSoftDropContainer"),
      hardDropInput: document.getElementById("menuKeybindsHardDropContainer"),
      rotateCCWInput: document.getElementById("menuKeybindsRotateCCWContainer"),
      rotateCWInput: document.getElementById("menuKeybindsRotateCWContainer"),
      rotate180Input: document.getElementById("menuKeybindsRotate180Container"),
      holdPieceInput: document.getElementById("menuKeybindsHoldPieceContainer"),
      resetInput: document.getElementById("menuKeybindsResetGameContainer"),
    },
    inputTypeMap: {
      moveLeftInput: "play",
      moveRightInput: "play",
      softDropInput: "play",
      hardDropInput: "play",
      rotateCCWInput: "play",
      rotateCWInput: "play",
      rotate180Input: "play",
      holdPieceInput: "play",
      resetInput: "meta",
    },
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
  
  // settings
  menuHomeButtonSettings: {
    origin: ["home", "buttonSettings"],
    redirect: "settings",
  },
  menuSettingsButtonBack: {
    origin: ["settings", "buttonBack"],
    redirect: "home",
  },
  menuSettingsButtonHandling: {
    origin: ["settings", "buttonSettings"],
    redirect: "handling",
  },
  
  // handling
  menuHandlingButtonBack: {
    origin: ["handling", "buttonBack"],
    redirect: "settings",
  },
  
  // keybinds
};

// all functions binded to the MenuHandler
const functionIds = {
  menuHomeButtonStart: {
    origin: ["home", "buttonStart"],
    type: "click",
    function: function () {
      this.changeMenu("ingame");
      this.event.emit("gameStart", {
        time: Date.now(),
        mode: "marathon",
        settings: this.generateSettings(),
      });
    }
  },
  
  menuSettingsButtonKeybinds: {
    origin: ["settings", "buttonKeybinds"],
    type: "click",
    function: function () {
      this.updateKeybindMenu();
      this.changeMenu("keybinds");
    }
  },
  
  // todo: apply DRY principle
  menuHandlingARR: {
    origin: ["handling", "values", "arr"],
    type: "change",
    function : function () {
      if (!isNaN(this.menus.handling.values.arr.value)) {
        this.values.handling.arr = parseFloat(this.menus.handling.values.arr.value);
      }
      
      this.menus.handling.values.arr.value = this.values.handling.arr;
    }
  },
  menuHandlingDAS: {
    origin: ["handling", "values", "das"],
    type: "change",
    function : function () {
      if (!isNaN(this.menus.handling.values.das.value)) {
        this.values.handling.das = parseFloat(this.menus.handling.values.das.value);
      }
      
      this.menus.handling.values.das.value = this.values.handling.das;
    }
  },
  menuHandlingSDF: {
    origin: ["handling", "values", "sdf"],
    type: "change",
    function : function () {
      if (!isNaN(this.menus.handling.values.sdf.value)) {
        this.values.handling.sdf = parseFloat(this.menus.handling.values.sdf.value);
      }
      
      this.menus.handling.values.sdf.value = this.values.handling.sdf;
    }
  },
  menuHandlingMSG: {
    origin: ["handling", "values", "msg"],
    type: "change",
    function : function () {
      if (!isNaN(this.menus.handling.values.msg.value)) {
        this.values.handling.msg = parseFloat(this.menus.handling.values.msg.value);
      }
      
      this.menus.handling.values.msg.value = this.values.handling.msg;
    }
  },
  
  menuKeybindsButtonBack: {
    origin: ["keybinds", "buttonBack"],
    type: "click",
    function: function () {
      this.removeKeybindMenu();
      this.changeMenu("settings");
    }
  },
};

// there really isn't much of a reason to make this a class because it's going to be a singleton
class MenuHandler {
  constructor(data) {
    // setting values
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
   * changes the menu to the specified menu (and hiding the previous menu in the process)
   * @param {string} menu
   * @returns {void}
   */
  changeMenu(menu) {
    // this.currentMenu is technically the previous menu
    const previousMenu = this.currentMenu;
    this.currentMenu = menu;
    
    this.hideMenu(previousMenu);
    this.showMenu(this.currentMenu);
    
    this.event.emit("menuChange", {
      time: Date.now(),
      previousMenu: previousMenu,
      currentMenu: this.currentMenu,
    });
  }
  
  /**
   * adds the redirects (predefined functions) to each element as provided by the redirects json
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
   * adds the functions associated to each element as provided by the functions json
   * @returns {void}
   */
  addFunctions() {
    const ids = Object.keys(this.functions);
    
    for (const id of ids) {
      const func = this.functions[id];
      
      const origin = document.getElementById(id);
      origin.addEventListener(
        func.type, func.function.bind(this)
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
  
  /**
   * deletes everything from the keybind menu
   * @returns {void}
   */
  removeKeybindMenu() {
    const actions = this.menus.keybinds.actions;
    
    for (let input in actions) {
      const container = actions[input];
      
      // remove all items from container
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    }
  }
  
  /**
   * updates the keybind menu with new elements and event listeners
   * @returns {void}
   */
  updateKeybindMenu() {
    const actions = this.menus.keybinds.actions;
    const inputTypeMap = this.menus.keybinds.inputTypeMap;
    
    let awaitingInput = false;
    
    for (let input in actions) {
      const container = actions[input];
      const type = inputTypeMap[input];
      
      // remove all items from container
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      
      // get keybinds stored in settings
      const keybinds = this.values.keybinds[type][input];
      
      // add keybind buttons to container
      for (let keybind of keybinds) {
        const keybindElement = document.createElement("button");
        keybindElement.classList.add("keybind");
        
        // add click event listener that deletes the keybind
        // inadvertently closes all "add keybind" awaiting inputs
        keybindElement.addEventListener("click", () => {
          keybinds.splice(keybinds.indexOf(keybind), 1);
          this.updateKeybindMenu();
        });
        
        keybindElement.textContent = keybind.code;
        container.appendChild(keybindElement);
      };
      
      // add "addKeybind" button to container
      const addKeybind = document.createElement("button");
      addKeybind.classList.add("add-keybind");
      addKeybind.textContent = "Add Keybind";
      
      let currentAwaitingInput = false;
      
      // todo: clean up code and beware of memory leaks
      
      // event listeners
      const removeListeners = () => {
        document.removeEventListener("keydown", keyDown);
        this.event.off("menuChange", removeListeners);
        this.event.off("keybindMenuUpdated", removeListeners);
      };
      
      const keyDown = (e) => {
        
        keybinds.push({
          code: e.code,
          keyCode: e.keyCode,
        });
        
        this.updateKeybindMenu();
        
        awaitingInput = false;
        removeListeners();
      };
      
      // add click event listener that adds a new keybind
      addKeybind.addEventListener("click", () => {
        // this button is already waiting for input
        if (currentAwaitingInput) {
          // cancel the input
          awaitingInput = false;
          currentAwaitingInput = false;
          addKeybind.textContent = "Add Keybind";
          removeListeners();
          return;
        };
        
        // another button is waiting for input
        if (awaitingInput) return;
        
        // nothing is waiting for input
        awaitingInput = true;
        currentAwaitingInput = true;
        addKeybind.textContent = "Awaiting Input";
        
        // wait for input
        document.addEventListener("keydown", keyDown);
        
        // if the user leaves or something is updated then cancel the listeners (because the parent is removed)
        this.event.on("menuChange", removeListeners);
        this.event.on("keybindMenuUpdated", removeListeners);
      });
      
      container.appendChild(addKeybind);
    }
    
    this.event.emit("keybindMenuUpdated", {
      time: Date.now(),
    });
  }
}

export { MenuHandler, spentrisMenus, redirectionIds, functionIds, values };