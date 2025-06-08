// menu handler to extend from
import { MenuHandler } from "../../../ui/menu/menuHandler.js";

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
   * - saveLangauge (do not use!!)
   */
  
  saveLanguage() {
    console.warn("PuzzleMenuHandler does not support saving language settings.");
  }
}

export {
  PuzzleMenuHandler,
}