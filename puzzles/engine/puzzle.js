import { standardFunctionLocations } from "../../engine/modes/standardModes.js";

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
    this.func = puzzleFunctions[this.type](this);
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
      
      // unspecifiable so it will remain like this
      initFunction: function (game) {},
    };
    
    // both {puzzleFunction[]}
    this.winConditions = data.winConditions ?? [];
    this.lossConditions = data.lossConditions ?? [];
    
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
      this.parameters.initFunction,
      // win and loss conditions basically act the same
      // but it's still good to have them separated
      ...this.winConditions.map((e) => e.func),
      ...this.lossConditions.map((e) => e.func),
      this.initFunction.func,
    ];
    
    this.allFunctions = function (game) {
      functions.forEach((func) => func(game));
    };
    
    return this;
  }
  
  /**
   * exports the puzzle to a JSON object
   * @returns {object} JSON object of the puzzle
   */
  exportJSON() {
    const data = {
      parameters: {
        values: this.parameters.values,
        // initFunction ignored because it is a function
      },
      winConditions: this.winConditions.map((e) => e.exportJSON()),
      lossConditions: this.lossConditions.map((e) => e.exportJSON()),
      // prioritizeWinCondition: this.prioritizeWinCondition,
      initFunction: this.initFunction.exportJSON(),
    };
    
    return data;
  }
  
  /**
   * creates a Puzzle object from a JSON object
   * @param {object} json - JSON object to create the Puzzle from
   * @return {Puzzle} Puzzle object created from the JSON
   */
  static fromJSON(json) {
    json = structuredClone(json);
    
    // replace functions with PuzzleFunction objects
    json.winConditions = json.winConditions.map((e) => new PuzzleFunction(e));
    json.lossConditions = json.lossConditions.map((e) => new PuzzleFunction(e));
    json.initFunction = new PuzzleFunction(json.initFunction);
    
    return new Puzzle(json);
  }
}

export { PuzzleFunction, Puzzle };