// values
import { values, defaultValues } from "./defaultValues.js";

// event emitter
import { EventEmitter } from "../../eventEmitter.js";

// local storage
import { ls } from "../../localStorage/localStorage.js";

// function location accessor
import { functionLocationAccessor } from "../../engine/util.js";

// languages
import { translations } from "../../localization/language.js";

// game engine
import { Stacker } from "../../engine/stacker.js";

// puzzles
import { PuzzleFunction, Puzzle } from "../../puzzles/engine/puzzle.js";
import { debugPuzzles } from "../../puzzles/packs/test.js";

// puzzle menus
import {
  puzzleUiFunctions,
  puzzleMenus,
} from "./puzzles/puzzleMenu.js";
import {
  PuzzleMenuHandler
} from "./puzzles/puzzleMenuHandler.js";

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
      game: this.uiFunctions.createButton(
        this.uiText.menuHomeButtonGame
      ),
      settings: this.uiFunctions.createButton(
        this.uiText.menuHomeButtonSettings
      ),
      language: this.uiFunctions.createButton(
        this.uiText.menuHomeButtonLanguage
      ),
      jumpToPuzzleEditor: this.uiFunctions.createButton(
        "I am debugging, please ignore this"
      ),
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
    buttons.jumpToPuzzleEditor.addEventListener("click", () => {
      this.showMenu("puzzleMenu", {
        currentMenu: "puzzleEditor",
      });
    });
    
    this.uiDisplay.appendChild(menuSelection.outer);
  },
  
  game: function () {
    this.uiDisplay.className = "padding-inside";
    const backButton = this.uiFunctions.createButton(
      this.uiText.menuGameButtonBack
    );
    const menuSelection = this.uiFunctions.createMenuSelection();
    
    const buttons = {
      standardGamemodes: this.uiFunctions.createButton(
        this.uiText.menuGameButtonStandardGamemodes
      ),
      puzzles: this.uiFunctions.createButton(
        this.uiText.menuGameButtonPuzzles
      ),
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
    const backButton = this.uiFunctions.createButton(
      this.uiText.menuStandardGamemodesButtonBack
    );
    const menuSelection = this.uiFunctions.createMenuSelection();
    
    const buttons = {
      marathon: this.uiFunctions.createButton(
        this.uiText.menuStandardGamemodesButtonMarathon
      ),
      sprint: this.uiFunctions.createButton(
        this.uiText.menuStandardGamemodesButtonSprint
      ),
      ultra: this.uiFunctions.createButton(
        this.uiText.menuStandardGamemodesButtonUltra
      ),
    };
    
    this.uiFunctions.appendButtons(menuSelection, buttons);
    
    // functionality
    backButton.addEventListener("click", () => {
      this.showMenu("game");
    });
    
    const standardSettings = {
      handling: this.values.handling,
      keybinds: this.values.keybinds,
      language: this.values.language,
    };
    
    // these buttons are using a new version of the game start event
    // engine/modes/standardModes.js handles most of the mode specifications
    buttons.marathon.addEventListener("click", () => {
      this.showMenu("inGame");
      this.event.emit("gameStart", {
        time: Date.now(),
        mode: "marathon",
        settings: standardSettings,
      });
    });
    buttons.sprint.addEventListener("click", () => {
      this.showMenu("inGame");
      this.event.emit("gameStart", {
        time: Date.now(),
        mode: "sprint",
        settings: standardSettings,
      });
    });
    buttons.ultra.addEventListener("click", () => {
      this.showMenu("inGame");
      this.event.emit("gameStart", {
        time: Date.now(),
        mode: "ultra",
        settings: standardSettings,
      });
    });
    
    this.uiDisplay.appendChild(backButton);
    this.uiDisplay.appendChild(menuSelection.outer);
  },
  
  puzzles: function () {
    this.uiDisplay.className = "padding-inside";
    const backButton = this.uiFunctions.createButton(
      this.uiText.menuPuzzlesButtonBack
    );
    const menuSelection = this.uiFunctions.createMenuSelection();
    
    const buttons = {
      play: this.uiFunctions.createButton(
        this.uiText.menuPuzzlesButtonPlay
      ),
      create: this.uiFunctions.createButton(
        this.uiText.menuPuzzlesButtonCreate
      ),
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
    const backButton = this.uiFunctions.createButton(
      this.uiText.menuPlayPuzzlesButtonBack
    );
    const menuSelection = this.uiFunctions.createMenuSelection();
    
    const buttons = {
      listing: this.uiFunctions.createButton(
        this.uiText.menuPlayPuzzlesButtonListing
      ),
      import: this.uiFunctions.createButton(
        this.uiText.menuPlayPuzzlesButtonImport
      ),
    };
    
    this.uiFunctions.appendButtons(menuSelection, buttons);
    
    // functionality
    backButton.addEventListener("click", () => {
      this.showMenu("puzzles");
    });
    
    // test functionality
    buttons.listing.addEventListener("click", () => {
      // trigger play puzzle event
      this.showMenu("inGame");
      this.event.emit("gameStart", {
        time: Date.now(),
        mode: "puzzle",
        settings: {
          handling: this.values.handling,
          keybinds: this.values.keybinds,
          language: this.values.language,
          puzzle: debugPuzzles[0],
        },
      });
    });
    
    this.uiDisplay.appendChild(backButton);
    this.uiDisplay.appendChild(menuSelection.outer);
  },
  
  createPuzzles: function () {
    this.uiDisplay.className = "padding-inside";
    const backButton = this.uiFunctions.createButton(
      this.uiText.menuCreatePuzzlesButtonBack
    );
    const menuSelection = this.uiFunctions.createMenuSelection();
    
    const buttons = {
      new: this.uiFunctions.createButton(
        this.uiText.menuCreatePuzzlesButtonNew
      ),
      template: this.uiFunctions.createButton(
        this.uiText.menuCreatePuzzlesButtonTemplate
      ),
      import: this.uiFunctions.createButton(
        this.uiText.menuCreatePuzzlesButtonImport
      ),
    };
    
    this.uiFunctions.appendButtons(menuSelection, buttons);
    
    // functionality
    backButton.addEventListener("click", () => {
      this.showMenu("puzzles");
    });
    buttons.new.addEventListener("click", () => {
      this.showMenu("puzzleMenu", {
        currentMenu: "puzzleEditor",
      });
    });
    
    this.uiDisplay.appendChild(backButton);
    this.uiDisplay.appendChild(menuSelection.outer);
  },
  
  settings: function () {
    this.uiDisplay.className = "padding-inside";
    const backButton = this.uiFunctions.createButton(
      this.uiText.menuSettingsButtonBack
    );
    const menuSelection = this.uiFunctions.createMenuSelection();
    
    const buttons = {
      handling: this.uiFunctions.createButton(
        this.uiText.menuSettingsButtonHandling
      ),
      keybinds: this.uiFunctions.createButton(
        this.uiText.menuSettingsButtonKeybinds
      ),
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
    const backButton = this.uiFunctions.createButton(
      this.uiText.menuHandlingButtonBack
    );
    
    // create display
    const outer = document.createElement("div");
    outer.className = "center-inside window-fill padding-inside";
    
    const inner = document.createElement("div");
    inner.className = "two-grid padding-inside";
    
    outer.appendChild(inner);
    
    // handling function because it is reused a lot
    const generateValidationFunction = function (defaultValue, minValue=0) {
      return function (value) {
        value = parseFloat(value);
        
        if (isNaN(value)) { // default value
          return defaultValue;
        }
        
        if (value < minValue) { // minimum value
          return minValue;
        }
        
        return value;
      };
    };
    
    /**
     * handling options
     * - text: the text to display
     * - valid: converts a value to a valid value
     */
    const handlingOptions = {
      "arr": {
        "text": this.uiText.menuHandlingARRLabel,
        "id": "menuHandlingARR",
        "enabled": true,
        "valid": generateValidationFunction(
          defaultValues.handling.arr, 0
        ),
      },
      "das": {
        "text": this.uiText.menuHandlingDASLabel,
        "id": "menuHandlingDAS",
        "enabled": true,
        "valid": generateValidationFunction(
          defaultValues.handling.das, 0
        ),
      },
      "sdf": {
        "text": this.uiText.menuHandlingSDFLabel,
        "id": "menuHandlingSDF",
        "enabled": true,
        "valid": generateValidationFunction(
          defaultValues.handling.sdf, 1
        ),
      },
      "dcd": {
        "text": this.uiText.menuHandlingDCDLabel,
        "id": "menuHandlingDCD",
        "enabled": false,
        "valid": generateValidationFunction(
          defaultValues.handling.dcd, 0
        ),
      },
      "msg": {
        "text": this.uiText.menuHandlingMSGLabel,
        "id": "menuHandlingMSG",
        "enabled": true,
        "valid": generateValidationFunction(
          defaultValues.handling.msg, 0
        ),
      },
      "are": {
        "text": this.uiText.menuHandlingARELabel,
        "id": "menuHandlingARE",
        "enabled": false,
        "valid": generateValidationFunction(
          defaultValues.handling.are, 0
        ),
      },
      "lca": {
        "text": this.uiText.menuHandlingLCALabel,
        "id": "menuHandlingLCA",
        "enabled": false,
        "valid": generateValidationFunction(
          defaultValues.handling.lca, 0
        ),
      },
    };
    
    // add handling options to the display (inner)
    const options = Object.keys(handlingOptions);
    for (let option of options) {
      const optionData = handlingOptions[option];
      
      // label and input
      const label = document.createElement("label");
      label.className = "menuLabel large";
      label.for = optionData.id;
      label.textContent = optionData.text;
      
      const input = document.createElement("input");
      input.className = "menuInput large";
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
    const backButton = this.uiFunctions.createButton(
      this.uiText.menuKeybindsButtonBack
    );
    
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
        text: this.uiText.menuKeybindsLeftLabel,
        id: "menuKeybindsLeftContainer",
        input: ["play", "moveLeftInput"],
      },
      moveRight: {
        text: this.uiText.menuKeybindsRightLabel,
        id: "menuKeybindsRightContainer",
        input: ["play", "moveRightInput"],
      },
      softDrop: {
        text: this.uiText.menuKeybindsSoftDropLabel,
        id: "menuKeybindsSoftDropContainer",
        input: ["play", "softDropInput"],
      },
      hardDrop: {
        text: this.uiText.menuKeybindsHardDropLabel,
        id: "menuKeybindsHardDropContainer",
        input: ["play", "hardDropInput"],
      },
      rotateCCW: {
        text: this.uiText.menuKeybindsRotateCCWLabel,
        id: "menuKeybindsRotateCCWContainer",
        input: ["play", "rotateCCWInput"],
      },
      rotateCW: {
        text: this.uiText.menuKeybindsRotateCWLabel,
        id: "menuKeybindsRotateCWContainer",
        input: ["play", "rotateCWInput"],
      },
      rotate180: {
        text: this.uiText.menuKeybindsRotate180Label,
        id: "menuKeybindsRotate180Container",
        input: ["play", "rotate180Input"],
      },
      holdPiece: {
        text: this.uiText.menuKeybindsHoldPieceLabel,
        id: "menuKeybindsHoldPieceContainer",
        input: ["play", "holdPieceInput"],
      },
      resetGame: {
        text: this.uiText.menuKeybindsResetGameLabel,
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
       * the text for the buttons
       * has to be created because `this` doesn't carry into the button
       */
      const addKeybindText = this.uiText.menuKeybindsAddKeybindButton;
      const awaitingInputText = this.uiText.menuKeybindsAwaitingInputButton;
      
      /**
       * deletion of keybinds (very confusing code)
       * - when a keybind is deleted, it:
       *   - removes the keybind from the keybindsData array
       *   - removes the keybind button from the container
       * - the relative indices are maintained
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
      addKeybind.textContent = addKeybindText;
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
        addKeybind.textContent = addKeybindText;
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
        addKeybind.textContent = awaitingInputText;
        
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
    const backButton = this.uiFunctions.createButton(
      this.uiText.menuLanguageButtonBack
    );
    const menuSelection = this.uiFunctions.createMenuSelection();
    
    // i think i should hide the japanese translation until i actually get a native speaker to translate it because my comprehension of the language is terrible
    // 俺の日本語翻訳最悪だ！！！！！　タスケテくれぇぇ！！！！
    const buttons = {
      english: this.uiFunctions.createButton(
        this.uiText.menuLanguageButtonEnglish
      ),
      japanese: this.uiFunctions.createButton(
        this.uiText.menuLanguageButtonJapanese
      ),
      dev: this.uiFunctions.createButton(
        this.uiText.menuLanguageButtonDev
      ),
    };
    
    this.uiFunctions.appendButtons(menuSelection, buttons);
    
    // set font family for buttons
    buttons.english.style.setProperty(
      "font-family", translations.en.font.ui
    );
    buttons.japanese.style.setProperty(
      "font-family", translations.ja.font.ui
    );
    buttons.dev.style.setProperty(
      "font-family", translations.dev.font.ui
    );
    
    // functionality
    backButton.addEventListener("click", () => {
      this.showMenu("home");
    });
    buttons.english.addEventListener("click", () => {
      this.saveLanguage("en");
      this.loadLanguage("en");
      this.showMenu("home");
    });
    buttons.japanese.addEventListener("click", () => {
      this.saveLanguage("ja");
      this.loadLanguage("ja");
      this.showMenu("home");
    });
    buttons.dev.addEventListener("click", () => {
      this.saveLanguage("dev");
      this.loadLanguage("dev");
      this.showMenu("home");
    });
    
    this.uiDisplay.appendChild(backButton);
    this.uiDisplay.appendChild(menuSelection.outer);
  },
  
  inGame: function () {
    this.uiDisplay.className = "menu window-fill";
    
    // create a render canvas
    const renderCanvas = document.createElement("canvas");
    renderCanvas.id = "renderCanvas";
    renderCanvas.tabIndex = 0; // make it focusable
    
    uiDisplay.appendChild(renderCanvas);
  },
  
  /**
   * this menu is handled by PuzzleMenuHandler
   * @param data - i havent decided what this does really
   */
  puzzleMenu: function (data) {
    const puzzleMH = new PuzzleMenuHandler({
      currentMenu: data.currentMenu ?? "puzzleEditor",
      uiFunctions: puzzleUiFunctions,
      menus: puzzleMenus,
      uiDisplay: uiDisplay, // i think this is a great idea
      values: {
        handling: this.values.handling,
        keybinds: this.values.keybinds,
        language: this.values.language,
      },
    });
    puzzleMH.showMenu(puzzleMH.currentMenu);
    
    puzzleMH.event.on("exitPuzzleMenu", () => {
      this.showMenu("home");
    });
  },
  
  template: function () {
    this.uiDisplay.className = "padding-inside";
    const backButton = this.uiFunctions.createButton(
      /* insert the correct translation id here */
      this.uiText.menuTemplateButtonBack
    );
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

export {
  uiFunctions,
  spentrisMenus,
  uiDisplay,
  values,
};