import { standardFunctions } from "./standardRules.js";

class Stacker {
  
  /**
    @param {object} data
  */
  constructor(data) {
    // check for stacker data version
    // this is important for backwards compatibility
    if (data.version === 1) {
      // keep in mind, not a clone
      this.settings = data.settings;
      
      for (let functionName in data.functions) {
        this[functionName] = data.functions[functionName];
      }
      
      this.initialize(this.settings.initialization.parameters);
    }
  }
  
}

export { Stacker };