// menu handler to extend from
import { MenuHandler } from "../../../ui/menu/menuHandler.js";
import { PuzzleModifier } from "./puzzleModification.js";

// for game rendering
import { RenderGameState } from "../../gameRenderV1/converter.js";
import { GameRenderer } from "../../gameRenderV1/renderer.js";

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
   * @param {object} data - the menu handler data
   */
  constructor(data) {
    super(data);
    
    // special puzzleHandler functionality
    // note: replace with actual PuzzleModifier instance
    this.puzzleModifier = PuzzleModifier.default();
    
    // puzzle game rendering
    // this.puzzleRenderState = new RenderGameState();
    // this.puzzleRenderer = new GameRenderer({
    //   time: 0,
    //   // skin: tetrioSkin,
    //   // nextPieces: 5,
    //   // canvas: document.createElement("canvas"),
    // });
  }
  
  saveLanguage() {
    console.warn("PuzzleMenuHandler does not support saving language settings.");
  }
}

export {
  PuzzleMenuHandler,
}