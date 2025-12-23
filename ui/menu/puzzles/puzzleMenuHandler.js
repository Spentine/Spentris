// menu handler to extend from
import { MenuHandler } from "../../../ui/menu/menuHandler.js";
import { PuzzleModifier } from "./puzzleModification.js";

/**
 * PuzzleMenuHandler class - handles the puzzle menus
 * @extends MenuHandler
 */
class PuzzleMenuHandler extends MenuHandler {
  // refer to the parent class MenuHandler
  
  /**
   * original menuHandler methods
   * - constructor
   * - showMenu
   * - loadLanguage
   * - saveLanguage (do not use!!)
   */
  
  /**
   * constructor
   * @param {Object} data - the menu handler data
   */
  constructor(data) {
    super(data);
    
    // special puzzleHandler functionality
    // note: replace with actual PuzzleModifier instance
    this.puzzleModifier = PuzzleModifier.default();
  }
  
  saveLanguage() {
    console.warn("PuzzleMenuHandler does not support saving language settings.");
  }
}

export {
  PuzzleMenuHandler,
}