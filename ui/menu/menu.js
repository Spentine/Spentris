// values
import { values, defaultValues } from "./defaultValues.js";

// standard modes
import { standardModes } from "../../engine/modes/standardModes.js";

// event emitter
import { EventEmitter } from "../../eventEmitter.js";

// local storage
import { ls } from "../../localStorage/localStorage.js";

// function location accessor
import { functionLocationAccessor } from "../../engine/util.js";

// languages
import { translations, currentLanguage, setLanguage } from "../../localization/language.js";

// keybinds and keyboard input
// import { bindInputFunctions } from "../../interaction/keyboard.js";

const spentrisMenus = {
  home: {
    container: document.getElementById("menuHome"),
    buttonGame: document.getElementById("menuHomeButtonGame"),
    buttonSettings: document.getElementById("menuHomeButtonSettings"),
    buttonLanguage: document.getElementById("menuHomeButtonLanguage"),
    
    scrollable: false,
    canvas: false,
  },
  game: {
    container: document.getElementById("menuGame"),
    buttonStandardGamemodes: document.getElementById("menuGameButtonStandardGamemodes"),
    buttonPuzzles: document.getElementById("menuGameButtonPuzzles"),
    
    scrollable: false,
    canvas: false,
  },
  standardGamemodes: {
    container: document.getElementById("menuStandardGamemodes"),
    buttonBack: document.getElementById("menuStandardGamemodesButtonBack"),
    buttonMarathon: document.getElementById("menuStandardGamemodesButtonMarathon"),
    buttonSprint: document.getElementById("menuStandardGamemodesButtonSprint"),
    buttonUltra: document.getElementById("menuStandardGamemodesButtonUltra"),
    
    scrollable: false,
    canvas: false,
  },
  puzzles: {
    container: document.getElementById("menuPuzzles"),
    buttonBack: document.getElementById("menuPuzzlesButtonBack"),
    
    scrollable: false,
    canvas: false,
  },
  playPuzzles: {
    container: document.getElementById("menuPlayPuzzles"),
    buttonBack: document.getElementById("menuPlayPuzzlesButtonBack"),
    listing: document.getElementById("menuPlayPuzzlesButtonListing"),
    import: document.getElementById("menuPlayPuzzlesButtonImport"),
    
    scrollable: false,
    canvas: false,
  },
  createPuzzles: {
    container: document.getElementById("menuCreatePuzzles"),
    buttonBack: document.getElementById("menuCreatePuzzlesButtonBack"),
    new: document.getElementById("menuCreatePuzzlesButtonNew"),
    template: document.getElementById("menuCreatePuzzlesButtonTemplate"),
    import: document.getElementById("menuCreatePuzzlesButtonImport"),
    
    scrollable: false,
    canvas: false,
  },
  settings: {
    container: document.getElementById("menuSettings"),
    buttonBack: document.getElementById("menuSettingsButtonBack"),
    buttonHandling: document.getElementById("menuSettingsButtonHandling"),
    buttonKeybinds: document.getElementById("menuSettingsButtonKeybinds"),
    
    scrollable: false,
    canvas: false,
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
    
    scrollable: true,
    canvas: false,
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
    
    scrollable: true,
    canvas: false,
  },
  language: {
    container: document.getElementById("menuLanguage"),
    buttonBack: document.getElementById("menuLanguageButtonBack"),
    buttonEnglish: document.getElementById("menuLanguageButtonEnglish"),
    buttonJapanese: document.getElementById("menuLanguageButtonJapanese"),
    
    scrollable: false,
    canvas: false,
  },
  ingame: {
    container: document.getElementById("menuIngame"),
    
    scrollable: false,
    canvas: true,
  },
  
  global: {
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
  // home
  menuHomeButtonGame: {
    origin: ["home", "buttonGame"],
    redirect: "game",
  },
  menuHomeButtonSettings: {
    origin: ["home", "buttonSettings"],
    redirect: "settings",
  },
  menuHomeButtonLanguage: {
    origin: ["home", "buttonLanguage"],
    redirect: "language",
  },
  
  // game
  menuGameButtonBack: {
    origin: ["game", "buttonBack"],
    redirect: "home",
  },
  menuGameButtonStandardGamemodes: {
    origin: ["game", "buttonStandardGamemodes"],
    redirect: "standardGamemodes",
  },
  menuGameButtonPuzzles: {
    origin: ["game", "buttonPuzzles"],
    redirect: "puzzles",
  },
  
  // standard gamemodes
  menuStandardGamemodesButtonBack: {
    origin: ["standardGamemodes", "buttonBack"],
    redirect: "game",
  },
  
  // puzzles
  menuPuzzlesButtonBack: {
    origin: ["puzzles", "buttonBack"],
    redirect: "game",
  },
  menuPuzzlesButtonPlay: {
    origin: ["puzzles", "buttonPlay"],
    redirect: "playPuzzles",
  },
  menuPuzzlesButtonCreate: {
    origin: ["puzzles", "buttonCreate"],
    redirect: "createPuzzles",
  },
  
  // play puzzles
  menuPlayPuzzlesButtonBack: {
    origin: ["playPuzzles", "buttonBack"],
    redirect: "puzzles",
  },
  
  // create puzzles
  menuCreatePuzzlesButtonBack: {
    origin: ["createPuzzles", "buttonBack"],
    redirect: "puzzles",
  },
  
  // settings
  menuSettingsButtonBack: {
    origin: ["settings", "buttonBack"],
    redirect: "home",
  },
  
  // handling
  menuHandlingButtonBack: {
    origin: ["handling", "buttonBack"],
    redirect: "settings",
  },
  
  // keybinds
  
  // language
  menuLanguageButtonBack: {
    origin: ["language", "buttonBack"],
    redirect: "home",
  },
};

function menuHandlingFunctionGenerator(handlingValue) {
  const func = function () {
    if (!isNaN(this.menus.handling.values[handlingValue].value)) {
      this.values.handling[handlingValue] = parseFloat(this.menus.handling.values[handlingValue].value);
    }
    
    this.menus.handling.values[handlingValue].value = this.values.handling[handlingValue];
    
    ls.values.handling[handlingValue] = this.values.handling[handlingValue];
    ls.save();
  };
  return func;
}

// all functions binded to the MenuHandler
const functionIds = {
  menuStandardGamemodesButtonMarathon: {
    origin: ["home", "buttonStart"],
    type: "click",
    function: function () {
      this.changeMenu("ingame");
      this.event.emit("gameStart", {
        time: Date.now(),
        mode: "marathon",
        settings: this.generateSettings({
          functionLocations: standardModes.marathon.functionLocations,
          state: standardModes.marathon.state,
        }),
        initFunction: standardModes.marathon.initFunction,
      });
    }
  },
  
  // 40l
  menuStandardGamemodesButtonSprint: {
    origin: ["home", "buttonStart"],
    type: "click",
    function: function () {
      this.changeMenu("ingame");
      this.event.emit("gameStart", {
        time: Date.now(),
        mode: "sprint",
        settings: this.generateSettings({
          functionLocations: standardModes.sprint.functionLocations,
          state: standardModes.sprint.state,
        }),
        initFunction: standardModes.sprint.initFunction,
      });
    }
  },
  
  menuStandardGamemodesButtonUltra: {
    origin: ["home", "buttonStart"],
    type: "click",
    function: function () {
      this.changeMenu("ingame");
      this.event.emit("gameStart", {
        time: Date.now(),
        mode: "ultra",
        settings: this.generateSettings({
          functionLocations: standardModes.ultra.functionLocations,
          state: standardModes.ultra.state,
        }),
        initFunction: standardModes.ultra.initFunction,
      });
    }
  },
  
  menuSettingsButtonHandling: {
    origin: ["settings", "buttonHandling"],
    type: "click",
    function: function () {
      this.updateHandlingMenu();
      this.changeMenu("handling");
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
  
  menuHandlingARR: {
    origin: ["handling", "values", "arr"],
    type: "change",
    function : menuHandlingFunctionGenerator("arr"),
  },
  menuHandlingDAS: {
    origin: ["handling", "values", "das"],
    type: "change",
    function : menuHandlingFunctionGenerator("das"),
  },
  menuHandlingSDF: {
    origin: ["handling", "values", "sdf"],
    type: "change",
    function : menuHandlingFunctionGenerator("sdf"),
  },
  menuHandlingMSG: {
    origin: ["handling", "values", "msg"],
    type: "change",
    function : menuHandlingFunctionGenerator("msg"),
  },
  
  menuKeybindsButtonBack: {
    origin: ["keybinds", "buttonBack"],
    type: "click",
    function: function () {
      this.removeKeybindMenu();
      this.changeMenu("settings");
    }
  },
  
  menuLanguageButtonEnglish: {
    origin: ["language", "buttonEnglish"],
    type: "click",
    function: function () {
      setLanguage("en");
      ls.values.language = "en";
      ls.save();
      this.translateMenu("en");
    }
  },
  
  menuLanguageButtonJapanese: {
    origin: ["language", "buttonJapanese"],
    type: "click",
    function: function () {
      setLanguage("jp");
      ls.values.language = "jp";
      ls.save();
      this.translateMenu("jp");
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
    
    setLanguage(ls.values.language);
    
    this.translateMenu(currentLanguage);
    this.showMenu(this.currentMenu);
    
    console.log("MenuHandler initialized", this);
  }
  
  /**
   * @param {string} menu
   * @returns {void}
   */
  showMenu(menu) {
    this.menus[menu].container.style.display = "block";
    
    // set the body scrollability
    // use the .scrollable class
    if (this.menus[menu].scrollable) {
      document.body.classList.add("scrollable");
    } else {
      document.body.classList.remove("scrollable");
    }
    
    // set the canvas visibility
    if (this.menus[menu].canvas) {
      this.menus.global.renderCanvas.style.display = "block";
    } else {
      this.menus.global.renderCanvas.style.display = "none";
    }
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
   * translates the menu to the specified language
   * @param {string} language
   * @returns {void}
   */
  translateMenu(language) {
    // translate the ui elements
    const uiTranslations = translations[language].translations.ui;
    
    for (let id in uiTranslations) {
      const element = document.getElementById(id);
      element.textContent = uiTranslations[id];
    }
    
    // use correct font
    document.body.style.fontFamily = translations[language].font.ui;
  }
  
  /**
   * adds the redirects (predefined functions) to each element as provided by the redirects json
   * @returns {void}
   */
  addRedirects() {
    const ids = Object.keys(this.redirects);
    
    for (const id of ids) {
      try {
        const redirect = this.redirects[id];
        
        const origin = document.getElementById(id);
        origin.addEventListener(
          "click", () => this.changeMenu(redirect.redirect)
        );
      } catch (e) {
        console.error("Error adding redirect", id);
      }
    }
  }
  
  /**
   * adds the functions associated to each element as provided by the functions json
   * @returns {void}
   */
  addFunctions() {
    const ids = Object.keys(this.functions);
    
    for (const id of ids) {
      try {
        const func = this.functions[id];
        
        const origin = document.getElementById(id);
        origin.addEventListener(
          func.type, func.function.bind(this)
        );
      } catch (e) {
        console.error("Error adding function", id);
      }
    }
  }
  
  /**
   * generates an object with the settings for the game
   * @returns {object}
   */
  generateSettings(data) {
    data = data ?? {};
    
    const functionLocations = data.functionLocations ?? this.values.functionLocations;
    const gameFunctions = functionLocationAccessor(functionLocations, this.values.files);
    
    const state = data.state ?? this.values.state;
    const handling = data.handling ?? this.values.handling;
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
  
  updateHandlingMenu() {
    // update everything to the correct values
    const handlingElements = this.menus.handling.values;
    const handlingValues = this.values.handling;
    
    for (let handlingValue in handlingValues) {
      const element = handlingElements[handlingValue];
      const value = handlingValues[handlingValue];
      element.value = String(value);
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
          
          // update localStorage
          ls.values.keybinds[type][input] = keybinds;
          ls.save();
          
          // refresh menu
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
          
        // update localStorage
        ls.values.keybinds[type][input] = keybinds;
        ls.save();
        
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