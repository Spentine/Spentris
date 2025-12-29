// standard functions to use
import { standardFunctions } from "./stackerFunctions/standardRules.js";

// utilities
import { functionLocationAccessor } from "./util.js";
import { copyObjByTraversal } from "../util/util.js";

class Stacker {
  /**
   * @param {Object} data
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
      
      // check for the type of parameters
      
      const paramType = data.settings.initialization.paramType;
      var parameters;
      
      if (paramType === "standardInitializeParams") {
        parameters = this.settings.initialization.parameters;
      } 
      if (paramType === "standardJsonParams") {
        parameters = this.jsonToInitialize(this.settings.initialization.parameters);
      } else {
        parameters = this.settings.initialization.parameters; // default
      }
      
      this.initialize(parameters);
    }
    
    console.log("Stacker Initialized", this);
  }
  
  /**
   * generates an object with the settings for the game
   * @param {Object} data
   * @returns {Object}
   */
  static generateSettings(data) {
    const initData = data.standard; // initialization data
    const initFunction = data.initFunction; // initialization function
    const handling = data.settings.handling ?? {};
    
    // copy handling data
    const handlingKeys = copyObjByTraversal(handling);
    const state = initData.settings.initialization.parameters.state;
    for (let key in handlingKeys) {
      const previousValue = state[key];
      
      // if it's undefined or null, set it to the handling value
      if (!previousValue) {
        state[key] = handling[key];
      }
    }
    
    return {
      initData: initData,
      initFunction: initFunction,
    };
  }
}

export { Stacker };