import { standardFunctionLocations } from "../../engine/modes/standardModes.js";
import { functionLocationAccessor } from "../../engine/util.js";
import { files } from "../../engine/functionLibrary.js";

import { puzzleFunctions } from "./puzzleFunctions.js";

import { Board } from "../../engine/stackerObjects.js";

/**
 * for hashing puzzles
 */
const { md5 } = await import(new URL("../../imports/md5.js", import.meta.url));

class PuzzleFunction {
  constructor(data) {
    data ??= {};
    
    this.version = data.version ?? 1;
    this.type = data.type ?? "none";
    this.parameters = data.parameters ?? {};
    this.func = null;
  }
  
  makeFunction() {
    return this.func = puzzleFunctions[this.type].func(this);
  }
  
  exportJSON() {
    const data = {
      version: this.version,
      type: this.type,
      parameters: this.parameters,
    };
    
    return data;
  }
}

class Puzzle {
  constructor(data) {
    data ??= {};
    
    this.parameters = data.parameters ?? {
      settings: data.settings ?? {},
    };
    
    // {puzzleFunction[]}
    this.puzzleFunctions = data.puzzleFunctions ?? [];
    
    this.metadata = data.metadata ?? {
      name: null,
      author: null,
      description: null,
      dateCreated: new Date().toISOString(),
      dateModified: new Date().toISOString(),
    };
    
    // this.prioritizeWinCondition = data.prioritizeWinCondition ?? false;
    
    this.allFunctions = null;
  }
  
  /**
   * constructs all functions that are used in the puzzle
   * @returns {Puzzle} the puzzle itself for chaining
   */
  makeAllFunctions() {
    const functions = this.puzzleFunctions.map((e) => e.makeFunction());
    
    // runs all functions in order
    this.allFunctions = async function (game) {
      for (const func of functions) {
        await func(game);
      }
    };
    
    return this;
  }
  
  /**
   * exports the puzzle to a JSON object
   * @returns {Object} JSON object of the puzzle
   */
  exportJSON() {
    const data = {
      version: 1,
      parameters: {
        settings: structuredClone(this.parameters.settings),
        // initFunction ignored because it is a function
      },
      
      puzzleFunctions: this.puzzleFunctions.map((e) => e.exportJSON()),
      metadata: this.metadata,
    };
    
    const initParams = data.parameters.settings.initialization.parameters;
    
    // convert board to simple array
    if (initParams.board) {
      /**
       * by the way, the fucking structuredClone function does not clone prototypes so we actually have to go about this in a roundabout way
       */
      initParams.board = Board.prototype.toSimpleArray.call(initParams.board);
    }
    
    return data;
  }
  
  /**
   * creates a Puzzle object from a JSON object
   * @param {Object} json - JSON object to create the Puzzle from
   * @return {Puzzle} Puzzle object created from the JSON
   */
  static fromJSON(json) {
    json = structuredClone(json);
    
    // convert board from simple array to Board object
    const initParams = json.parameters.settings.initialization.parameters;
    if (initParams.board) {
      initParams.board = Board.fromSimpleArray(initParams.board);
    }
    
    // replace functions with PuzzleFunction objects
    json.puzzleFunctions = json.puzzleFunctions.map((e) => new PuzzleFunction(e));
    
    return new Puzzle(json);
  }
  
  /**
   * gets the stacker parameters for the puzzle
   * @returns {Object} stacker parameters for the puzzle
   */
  getStandard() {
    const standard = {
      version: 1,
      functions: functionLocationAccessor(
        standardFunctionLocations,
        files
      ),
      settings: structuredClone(this.parameters.settings),
    };
    return standard;
  }
}

export { PuzzleFunction, Puzzle };