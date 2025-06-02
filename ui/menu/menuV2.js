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

// game engine
import { Stacker } from "../../engine/stacker.js";

// puzzles
import { PuzzleFunction, Puzzle } from "../../puzzles/engine/puzzle.js";
import { debugPuzzles } from "../../puzzles/packs/test.js";

const uiDisplay = document.getElementById("uiDisplay");

const uiFunctions = {
  /**
   * delete all elements in uiDisplay
   */
  resetDisplay: function () {
    while (this.uiDisplay.firstChild) {
      this.uiDisplay.removeChild(this.uiDisplay.firstChild);
    }
  },
  
  /**
   * create button
   * @param {string} text - the text of the button
   * @param {(function|null)} callback - the function to call when the button is clicked
   * @returns {HTMLElement} - the created button element
   */
  createButton: function (text, callback) {
    const button = document.createElement("button");
    button.className = "menuButton";
    button.textContent = text;
    if (callback) button.addEventListener("click", callback);
    return button;
  },
  
  /**
   * create a menu selection div
   * <div class="center-inside window-fill">
   *   <div class="center-inside padding-inside">
   *   </div>
   * </div>
   * @returns {outer: HTMLElement, inner: HTMLElement}
   */
  createMenuSelection: function () {
    const outer = document.createElement("div");
    outer.className = "center-inside window-fill";
    const inner = document.createElement("div");
    inner.className = "center-inside padding-inside";
    outer.appendChild(inner);
    return {
      outer: outer,
      inner: inner,
    };
  },
  
  /**
   * appends buttons to a div
   * @param {HTMLElement} menuSelection - the div to append buttons to
   * @param {Object} buttons - an object with button names as keys and button elements as values
   */
  appendButtons: function (menuSelection, buttons) {
    const keys = Object.keys(buttons);
    keys.forEach((key) => {
      menuSelection.inner.appendChild(buttons[key]);
    });
  },
};

/**
 * js functions for spentris menus
 */
const spentrisMenus = {
  home: function () {
    this.uiDisplay.className = "padding-inside";
    const menuSelection = this.uiFunctions.createMenuSelection();
    
    const buttons = {
      game: this.uiFunctions.createButton("Game"),
      settings: this.uiFunctions.createButton("Settings"),
      language: this.uiFunctions.createButton("Language"),
    };
    
    this.uiFunctions.appendButtons(menuSelection, buttons);
    
    // functionality
    buttons.game.addEventListener("click", () => {
      this.showMenu("game");
    });
    buttons.settings.addEventListener("click", () => {
      this.showMenu("settings");
    });
    buttons.language.addEventListener("click", () => {
      this.showMenu("language");
    });
    
    this.uiDisplay.appendChild(menuSelection.outer);
  },
  
  game: function () {
    this.uiDisplay.className = "padding-inside";
    const backButton = this.uiFunctions.createButton("Back");
    const menuSelection = this.uiFunctions.createMenuSelection();
    
    const buttons = {
      standardGamemodes: this.uiFunctions.createButton("Standard Gamemodes"),
      puzzles: this.uiFunctions.createButton("Puzzles"),
    };
    
    this.uiFunctions.appendButtons(menuSelection, buttons);
    
    // functionality
    backButton.addEventListener("click", () => {
      this.showMenu("home");
    });
    buttons.standardGamemodes.addEventListener("click", () => {
      this.showMenu("standardGamemodes");
    });
    buttons.puzzles.addEventListener("click", () => {
      this.showMenu("puzzles");
    });
    
    this.uiDisplay.appendChild(backButton);
    this.uiDisplay.appendChild(menuSelection.outer);
  },
  
  standardGamemodes: function () {
    this.uiDisplay.className = "padding-inside";
    const backButton = this.uiFunctions.createButton("Back");
    const menuSelection = this.uiFunctions.createMenuSelection();
    
    const buttons = {
      marathon: this.uiFunctions.createButton("Marathon"),
      sprint: this.uiFunctions.createButton("Sprint"),
      ultra: this.uiFunctions.createButton("Ultra"),
    };
    
    this.uiFunctions.appendButtons(menuSelection, buttons);
    
    // functionality
    backButton.addEventListener("click", () => {
      this.showMenu("game");
    });
    
    this.uiDisplay.appendChild(backButton);
    this.uiDisplay.appendChild(menuSelection.outer);
  },
  
  puzzles: function () {
    this.uiDisplay.className = "padding-inside";
    const backButton = this.uiFunctions.createButton("Back");
    const menuSelection = this.uiFunctions.createMenuSelection();
    
    const buttons = {
      play: this.uiFunctions.createButton("Play"),
      create: this.uiFunctions.createButton("Create"),
    };
    
    this.uiFunctions.appendButtons(menuSelection, buttons);
    
    // functionality
    backButton.addEventListener("click", () => {
      this.showMenu("game");
    });
    buttons.play.addEventListener("click", () => {
      this.showMenu("playPuzzles");
    });
    buttons.create.addEventListener("click", () => {
      this.showMenu("createPuzzles");
    });
    
    this.uiDisplay.appendChild(backButton);
    this.uiDisplay.appendChild(menuSelection.outer);
  },
  
  playPuzzles: function () {
    this.uiDisplay.className = "padding-inside";
    const backButton = this.uiFunctions.createButton("Back");
    const menuSelection = this.uiFunctions.createMenuSelection();
    
    const buttons = {
      listing: this.uiFunctions.createButton("Listing"),
      import: this.uiFunctions.createButton("Import"),
    };
    
    this.uiFunctions.appendButtons(menuSelection, buttons);
    
    // functionality
    backButton.addEventListener("click", () => {
      this.showMenu("puzzles");
    });
    
    this.uiDisplay.appendChild(backButton);
    this.uiDisplay.appendChild(menuSelection.outer);
  },
  
  createPuzzles: function () {
    this.uiDisplay.className = "padding-inside";
    const backButton = this.uiFunctions.createButton("Back");
    const menuSelection = this.uiFunctions.createMenuSelection();
    
    const buttons = {
      new: this.uiFunctions.createButton("New"),
      template: this.uiFunctions.createButton("Template"),
      import: this.uiFunctions.createButton("Import"),
    };
    
    this.uiFunctions.appendButtons(menuSelection, buttons);
    
    // functionality
    backButton.addEventListener("click", () => {
      this.showMenu("puzzles");
    });
    
    this.uiDisplay.appendChild(backButton);
    this.uiDisplay.appendChild(menuSelection.outer);
  },
  
  settings: function () {
    this.uiDisplay.className = "padding-inside";
    const backButton = this.uiFunctions.createButton("Back");
    const menuSelection = this.uiFunctions.createMenuSelection();
    
    const buttons = {
      handling: this.uiFunctions.createButton("Handling"),
      keybinds: this.uiFunctions.createButton("Keybinds"),
    };
    
    this.uiFunctions.appendButtons(menuSelection, buttons);
    
    // functionality
    backButton.addEventListener("click", () => {
      this.showMenu("home");
    });
    buttons.handling.addEventListener("click", () => {
      this.showMenu("handling");
    });
    buttons.keybinds.addEventListener("click", () => {
      this.showMenu("keybinds");
    });
    
    this.uiDisplay.appendChild(backButton);
    this.uiDisplay.appendChild(menuSelection.outer);
  },
  
  handling: function () {
    this.uiDisplay.className = "padding-inside";
    const backButton = this.uiFunctions.createButton("Back");
    
    // create display
    const outer = document.createElement("div");
    outer.className = "center-inside window-fill padding-inside";
    
    const inner = document.createElement("div");
    inner.className = "two-grid padding-inside";
    
    outer.appendChild(inner);
    
    /**
     * handling options
     * - text: the text to display
     * - valid: converts a value to a valid value
     */
    const handlingOptions = {
      "arr": {
        "text": "ARR",
        "id": "menuHandlingARR",
        "enabled": true,
        "valid": function (value) {
          value = Number(value);
          
          if (isNaN(value)) { // default value
            return defaultValues.handling.arr;
          }
          
          if (value < 0) { // minimum value
            return 0;
          }
          
          return value;
        },
      },
      "das": {
        "text": "DAS",
        "id": "menuHandlingDAS",
        "enabled": true,
        "valid": function (value) {
          value = Number(value);
          
          if (isNaN(value)) { // default value
            return defaultValues.handling.das;
          }
          
          if (value < 0) { // minimum value
            return 0;
          }
          
          return value;
        },
      },
      "sdf": {
        "text": "SDF",
        "id": "menuHandlingSDF",
        "enabled": true,
        "valid": function (value) {
          value = Number(value);
          
          if (isNaN(value)) { // default value
            return defaultValues.handling.sdf;
          }
          
          if (value < 1) { // minimum value
            return 1;
          }
          
          return value;
        },
      },
      "dcd": {
        "text": "DCD",
        "id": "menuHandlingDCD",
        "enabled": false,
        "valid": function (value) {
          value = Number(value);
          
          if (isNaN(value)) { // default value
            return defaultValues.handling.dcd;
          }
          
          if (value < 0) { // minimum value
            return 0;
          }
          
          return value;
        },
      },
      "msg": {
        "text": "MSG",
        "id": "menuHandlingMSG",
        "enabled": true,
        "valid": function (value) {
          value = Number(value);
          
          if (isNaN(value)) { // default value
            return defaultValues.handling.msg;
          }
          
          if (value < 0) { // minimum value
            return 0;
          }
          
          return value;
        },
      },
      "are": {
        "text": "ARE",
        "id": "menuHandlingARE",
        "enabled": false,
        "valid": function (value) {
          value = parseFloat(value);
          
          if (isNaN(value)) { // default value
            return defaultValues.handling.are;
          }
          
          if (value < 0) { // minimum value
            return 0;
          }
          
          return value;
        },
      },
      "lca": {
        "text": "LCA",
        "id": "menuHandlingLCA",
        "enabled": false,
        "valid": function (value) {
          value = Number(value);
          
          if (isNaN(value)) { // default value
            return defaultValues.handling.lca;
          }
          
          if (value < 0) { // minimum value
            return 0;
          }
          
          return value;
        },
      },
    };
    
    // add handling options to the display (inner)
    const options = Object.keys(handlingOptions);
    for (let option of options) {
      const optionData = handlingOptions[option];
      
      // label and input
      const label = document.createElement("label");
      label.className = "large";
      label.for = optionData.id;
      label.textContent = optionData.text;
      
      const input = document.createElement("input");
      input.className = "large";
      input.type = "text";
      input.id = optionData.id;
      input.value = String(
        this.values.handling[option]
        ?? defaultValues.handling[option]
      );
      input.disabled = !optionData.enabled;
      
      // add event listener to input
      input.addEventListener("change", () => {
        const value = optionData.valid(input.value);
        
        // set the value in both localStorage and this.values
        (
          ls.values.handling[option]
          = this.values.handling[option]
          = value
        );
        
        // update the input value
        input.value = String(value);
        
        // save to localStorage
        ls.save();
      });
      
      inner.appendChild(label);
      inner.appendChild(input);
    }
    
    backButton.addEventListener("click", () => {
      this.showMenu("settings");
    });
    
    this.uiDisplay.appendChild(backButton);
    this.uiDisplay.appendChild(outer);
  },
  
  keybinds: function () {
    this.uiDisplay.className = "padding-inside";
    const backButton = this.uiFunctions.createButton("Back");
    
    const outer = document.createElement("div");
    outer.className = "padding-inside";
    
    const inner = document.createElement("div");
    inner.className = "two-grid padding-inside";
    
    outer.appendChild(inner);
    
    /**
     * action options
     * - text: the text to display
     * - id: the id of the 
     */
    const actionOptions = {
      moveLeft: {
        text: "Left",
        id: "menuKeybindsLeftContainer",
        input: ["play", "moveLeftInput"],
      },
      moveRight: {
        text: "Right",
        id: "menuKeybindsRightContainer",
        input: ["play", "moveRightInput"],
      },
      softDrop: {
        text: "Soft Drop",
        id: "menuKeybindsSoftDropContainer",
        input: ["play", "softDropInput"],
      },
      hardDrop: {
        text: "Hard Drop",
        id: "menuKeybindsHardDropContainer",
        input: ["play", "hardDropInput"],
      },
      rotateLeft: {
        text: "Rotate CCW",
        id: "menuKeybindsRotateCCWContainer",
        input: ["play", "rotateCCWInput"],
      },
      rotateRight: {
        text: "Rotate CW",
        id: "menuKeybindsRotateCWContainer",
        input: ["play", "rotateCWInput"],
      },
      rotate180: {
        text: "Rotate 180",
        id: "menuKeybindsRotate180Container",
        input: ["play", "rotate180Input"],
      },
      holdPiece: {
        text: "Hold Piece",
        id: "menuKeybindsHoldPieceContainer",
        input: ["play", "holdPieceInput"],
      },
      resetGame: {
        text: "Reset Game",
        id: "menuKeybindsResetGameContainer",
        input: ["meta", "resetInput"],
      },
    };
    
    // add action options to the display (inner)
    const options = Object.keys(actionOptions);
    const keybinds = this.values.keybinds;
    for (let option of options) {
      const optionData = actionOptions[option];
      
      const label = document.createElement("label");
      label.className = "large";
      label.for = optionData.id;
      label.textContent = optionData.text;
      
      const container = document.createElement("div");
      container.className = "large";
      container.id = optionData.id;
      
      const type = optionData.input[0];
      const action = optionData.input[1];
      
      /**
       * this is used in various eventListener functions with a different context, making `this` refer to an element rather than the MenuHandlerV2 instance
       * 
       * this.event must be used so the element can stop awaiting an input when the menu changes because this.event emits a "menuChange" event
       */
      const menuEvent = this.event;
      
      /**
       * contains all keybinds for the specified action
       * {keyCode: integer, code: string}[]
       */
      const keybindsData = keybinds[type][action];
      
      /**
       * deletion of keybinds (very confusing code)
       * - when a keybind is deleted, it:
       *   - removes the keybind from the keybindsData array
       *   - removes the keybind button from the container
       * - the relative indices are maintained
       * - each button should have a unique identifier starting from 0
       * 
       * - to identify the keybind to delete:
       *   - use array.indexOf to find the index of the element
       *   - use that index to remove the element from the array
       */
      
      // array with elements as a reference for deletion
      const keyElements = [];
      
      /**
       * creates a keybind button
       * @param {Object} key - the keybind data object
       */
      const createKeybind = function (key) {
        const keyElement = document.createElement("button");
        keyElement.className = "keybind";
        
        keyElement.textContent = key.code;
        container.appendChild(keyElement);
        
        // update with new keybind
        keyElements.push(keyElement);
        
        /**
         * when the keybind button is clicked, remove the keybind
         */
        const removeKey = function (e) {
          // find index
          const index = keyElements.indexOf(keyElement);
          if (index === -1) return; // not found
          
          // remove from keybindsData (the actual target array)
          keybindsData.splice(index, 1);
          
          // update the keyElements array to maintain relative indices
          keyElements.splice(index, 1);
          
          // remove the keybind button from the container
          container.removeChild(keyElement);
          
          // save to localStorage
          ls.values.keybinds[type][action] = keybindsData;
          ls.save();
        }
        
        // click to remove feature
        keyElement.addEventListener("click", removeKey);
      }
      
      // add buttons to the container
      for (let key of keybindsData) {
        createKeybind(key);
      }
      
      // add "add keybind" button
      const addKeybind = document.createElement("button");
      addKeybind.className = "add-keybind";
      addKeybind.textContent = "Add Keybind";
      container.appendChild(addKeybind);
      
      let awaitingInput = false;
      
      /**
       * stops awaiting input
       * @param {Event} e - the event that triggered this function
       */
      const stopAwaitingInput = function (e) {
        // stop awaiting input
        document.removeEventListener("keydown", keyDown);
        
        // remove stopAwaitingInput listeners
        document.removeEventListener("click", stopAwaitingInput);
        menuEvent.off("menuChange", stopAwaitingInput);
        
        // reset awaitingInput state
        awaitingInput = false;
        addKeybind.textContent = "Add Keybind";
      };
      
      /**
       * handles keydown events
       * @param {KeyboardEvent} e - the keydown event
       */
      const keyDown = function (e) {
        // if the esc key is pressed, stop awaiting input
        if (e.key === "Escape") {
          stopAwaitingInput(e);
          return;
        }
        
        // get key data
        const key = {
          code: e.code,
          keyCode: e.keyCode,
        };
        
        keybindsData.push(key);
        
        // update localStorage
        ls.values.keybinds[type][action] = keybindsData;
        ls.save();
        
        createKeybind(key);
        
        // move the addKeybind button to the end
        container.appendChild(addKeybind);
        
        stopAwaitingInput();
      };
      
      /**
       * when addKeybind is clicked, it will change its text to "Awaiting Input"
       *   - if a key is pressed, it will add the keybind
       *   - if the button is clicked again, it will cancel the input
       *   - if the esc key is pressed, it will cancel the input
       *   - if the menu is closed, it will cancel the input
       * @param {Event} e - the click event
       */
      const addKeybindFunction = function (e) {
        // handle click cancellation
        if (awaitingInput) {
          stopAwaitingInput(e);
          return;
        }
        
        awaitingInput = true;
        addKeybind.textContent = "Awaiting Input";
        
        // handles key input and esc cancellation
        document.addEventListener("keydown", keyDown);
        
        // handles menu change cancellation
        menuEvent.on("menuChange", stopAwaitingInput);
      };
      addKeybind.addEventListener("click", addKeybindFunction);
      
      inner.appendChild(label);
      inner.appendChild(container);
    }
    
    backButton.addEventListener("click", () => {
      this.showMenu("settings");
    });
    
    this.uiDisplay.appendChild(backButton);
    this.uiDisplay.appendChild(outer);
  },
  
  language: function () {
    this.uiDisplay.className = "padding-inside";
    const backButton = this.uiFunctions.createButton("Back");
    const menuSelection = this.uiFunctions.createMenuSelection();
    
    const buttons = {
      english: this.uiFunctions.createButton("English"),
      japanese: this.uiFunctions.createButton("日本語"),
    };
    
    this.uiFunctions.appendButtons(menuSelection, buttons);
    
    // functionality
    backButton.addEventListener("click", () => {
      this.showMenu("home");
    });
    
    this.uiDisplay.appendChild(backButton);
    this.uiDisplay.appendChild(menuSelection.outer);
  },
  
  template: function () {
    this.uiDisplay.className = "padding-inside";
    const backButton = this.uiFunctions.createButton("Back");
    const menuSelection = this.uiFunctions.createMenuSelection();
    
    const buttons = {
      
    };
    
    this.uiFunctions.appendButtons(menuSelection, buttons);
    
    // functionality
    backButton.addEventListener("click", () => {
      this.showMenu("home");
    });
    
    this.uiDisplay.appendChild(backButton);
    this.uiDisplay.appendChild(menuSelection.outer);
  },
};

class MenuHandlerV2 {
  constructor(data) {
    this.currentMenu = data.currentMenu ?? "home";
    this.uiFunctions = data.uiFunctions ?? uiFunctions;
    this.menus = data.menus ?? spentrisMenus;
    this.uiDisplay = data.uiDisplay ?? uiDisplay;
    
    this.event = new EventEmitter();
    this.values = data.values ?? values;
  }
  
  showMenu(menu) {
    const previousMenu = this.currentMenu;
    this.currentMenu = menu;
    this.uiFunctions.resetDisplay.call(this);
    this.menus[menu].call(this);
    
    this.event.emit("menuChange", {
      time: Date.now(),
      previousMenu: previousMenu,
      currentMenu: this.currentMenu,
    });
  }
}

export {
  MenuHandlerV2,
  uiFunctions,
  spentrisMenus,
  uiDisplay,
  values,
};