import { standardFunctionLocations } from "../../engine/modes/standardModes.js";

class Puzzle {
  constructor(data) {
    data ??= {};
    
    data.values ??= {};
    this.parameters = data.parameters ?? {
      values: data.values,
      
      // unspecifiable so it will remain like this
      initFunction: function () {},
    };
    
  }
}

export { Puzzle };