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

export {
  puzzleUiFunctions,
  puzzleMenus,
};