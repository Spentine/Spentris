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
   * @return {HTMLElement} - the created button element
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
   * @return {outer: HTMLElement, inner: HTMLElement}
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
    
    // placeholder
    
    // functionality
    backButton.addEventListener("click", () => {
      this.showMenu("settings");
    });
    
    this.uiDisplay.appendChild(backButton);
  },
  
  keybinds: function () {
    this.uiDisplay.className = "padding-inside";
    const backButton = this.uiFunctions.createButton("Back");
    
    // placeholder
    
    // functionality
    backButton.addEventListener("click", () => {
      this.showMenu("settings");
    });
    
    this.uiDisplay.appendChild(backButton);
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
    this.currentMenu = menu;
    this.uiFunctions.resetDisplay.call(this);
    this.menus[menu].call(this);
  }
}

export {
  MenuHandlerV2,
  uiFunctions,
  spentrisMenus,
  uiDisplay,
  values,
};