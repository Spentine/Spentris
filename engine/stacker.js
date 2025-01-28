// standard functions to use
import { standardFunctions } from "./stackerFunctions/standardRules.js";

// utilities
import { functionLocationAccessor, copyObjByTraversal } from "./util.js";

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
    
    console.log("Stacker Initialized", this);
  }
  
  /**
   * generates an object with the settings for the game
   * @param {object} data
   * @param {object} data.values - values for the game, can be used to override defaults
   * @param {object} data.defaults - default values for certain keys, does not use same format
   * @returns {object}
   */
  static generateSettings(data) {
    data ??= {};
    
    data.values ??= {};
    const handling = data.values.handling ?? data.defaults.handling;
    const handlingTraversal = {
      settings: {
        initialization: {
          parameters: {
            state: handling,
          },
        },
      },
    };
    
    // copy handling settings
    copyObjByTraversal(data.values, handlingTraversal);
    
    const gameValues = {
      version: 1,
      functions: null, // computed afterwards
      settings: {
        functionLocations: data.defaults.functionLocations,
        initialization: {
          parameters: {
            seed: "random",
            rotationSystem: data.defaults.rotationSystem,
            state: data.defaults.state,
          },
        },
      },
    };
    
    // which keys not to traverse
    const disallowedKeys = {
      version: true,
      functions: true,
      settings: {
        functionLocations: true,
        initialization: {
          parameters: {
            seed: true,
            rotationSystem: true,
            state: true,
          }
        }
      }
    }
    
    // overwrite gameValues with data.values
    copyObjByTraversal(gameValues, data.values, disallowedKeys);
    
    // compute and overwrite functions to access
    const computedValues = {
      functions: functionLocationAccessor(gameValues.settings.functionLocations, data.defaults.files),
    };
    
    copyObjByTraversal(gameValues, computedValues, disallowedKeys);
    
    return {
      gameValues: gameValues,
      keybinds: data.defaults.keybinds,
    }
  }
}

export { Stacker };