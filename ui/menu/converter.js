// standard modes
import { standardModes, standardFunctionLocations } from "../../engine/modes/standardModes.js";

// file locations
import { files } from "../../engine/functionLibrary.js";

import { functionLocationAccessor } from "../../engine/util.js";

import { copyObjByTraversal } from "../../util.js";

/**
 * converts `gameStart` event data format to `Stacker.generateSettings` data format
 * @param {object} e - the event data
 * @returns {object} - the converted data
 */
const convertGameStartEvent = function (e) {
  
  const standardMode = standardModes[e.mode];
  // create standard initialization data
  // refer to `initializationData` in docs.md
  const standard = {
    version: 1,
    functions: functionLocationAccessor(
      standardFunctionLocations,
      files
    ),
    settings: standardMode.values.settings,
  };
  
  const initFunction = standardMode.initFunction;
  
  const settings = {};
  
  const excludeKeys = {
    keybinds: true, // exclude keybinds because they are not used in Stacker
  }
  
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