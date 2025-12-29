// standard modes
import { standardModes, standardFunctionLocations } from "../../engine/modes/standardModes.js";

// file locations
import { files } from "../../engine/functionLibrary.js";

import { functionLocationAccessor } from "../../engine/util.js";

import { copyObjByTraversal } from "../../util/util.js";

/**
 * converts `gameStart` event data format to `Stacker.generateSettings` data format
 * @param {Object} e - the event data
 * @returns {Object} - the converted data
 */
const convertGameStartEvent = function (e) {
  
  if (e.mode === "puzzle") {
    const puzzle = e.settings.puzzle;
    
    // method to generate the standard data
    var standard = puzzle.getStandard();
    
    // generate the init function
    puzzle.makeAllFunctions();
    var initFunction = puzzle.allFunctions;
  } else {
    const standardMode = standardModes[e.mode];
    // create standard initialization data
    // refer to `initializationData` in docs.md
    var standard = {
      version: 1,
      functions: functionLocationAccessor(
        standardMode.values.settings.functionLocations,
        files
      ),
      settings: standardMode.values.settings,
    };
    
    var initFunction = standardMode.initFunction;
  }
  
  const settings = {};
  
  const excludeKeys = {
    keybinds: true, // exclude keybinds because they are not used in Stacker
    puzzle: true, // puzzle is an entirely separate mode
  };
  
  // copy the settings from the event to the standard settings
  copyObjByTraversal(settings, e.settings, excludeKeys);
  
  // put the data into the `Stacker.generateSettings` format
  const data = {
    standard: standard,
    initFunction: initFunction,
    settings: settings,
  };
  
  return data;
}

export { convertGameStartEvent };