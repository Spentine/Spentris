import { standardFunctionLocations } from "../../engine/modes/standardModes.js";

class Puzzle {
  constructor(data) {
    data = data ?? {};
    
    this.parameters = data.parameters ?? {
      functionLocations: standardFunctionLocations,
      
      // default state for puzzles
      state: {
        das: 133.33, arr: 16.67, sdf: 30, msg: 1000,
        gravity: Infinity, lockDelay: Infinity, maxLockDelay: Infinity,
        startingLevel: 1, levelling: false, masterLevels: false,
      },
      
      // unspecifiable so it will remain like this
      initFunction: function () {},
    };
    
    
  }
}