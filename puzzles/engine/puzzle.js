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
  };
  
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
}

export { PuzzleFunction, Puzzle };