import { standardFunctionLocations } from "../../engine/modes/standardModes.js";
import { functionLocationAccessor } from "../../engine/util.js";
import { files } from "../../engine/functionLibrary.js";

import { puzzleFunctions } from "./puzzleFunctions.js";

class PuzzleFunction {
  constructor(data) {
    data ??= {};
    
    this.version = data.version ?? 1;
    this.type = data.type ?? "none";
    this.parameters = data.parameters ?? {};
    this.func = null;
    
    this.makeFunction();
  }
  
  makeFunction() {
    this.func = puzzleFunctions[this.type].func(this);
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
      values: data.values ?? {},
    };
    
    // {puzzleFunction[]}
    this.puzzleFunctions = data.puzzleFunctions ?? [];
    
    // this.prioritizeWinCondition = data.prioritizeWinCondition ?? false;
    
    this.initFunction = data.initFunction ?? new PuzzleFunction();
    
    this.allFunctions = null;
  }
  
  /**
   * constructs all functions that are used in the puzzle
   * @returns {Puzzle} this
   */
  makeAllFunctions() {
    const functions = [
      ...this.puzzleFunctions.map((e) => e.func),
      this.initFunction.func,
    ];
    
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
      parameters: {
        values: this.parameters.values,
        // initFunction ignored because it is a function
      },
      puzzleFunctions: this.puzzleFunctions.map((e) => e.exportJSON()),
      initFunction: this.initFunction.exportJSON(),
    };
    
    return data;
  }
  
  /**
   * creates a Puzzle object from a JSON object
   * @param {Object} json - JSON object to create the Puzzle from
   * @return {Puzzle} Puzzle object created from the JSON
   */
  static fromJSON(json) {
    json = structuredClone(json);
    
    // replace functions with PuzzleFunction objects
    json.puzzleFunctions = json.puzzleFunctions.map((e) => new PuzzleFunction(e));
    json.initFunction = new PuzzleFunction(json.initFunction);
    
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
      settings: structuredClone(this.parameters.values.settings),
    };
    return standard;
  }
}

export { PuzzleFunction, Puzzle };