import { standardFunctions } from "./stackerFunctions/standardRules.js";
import { allSpinFunctions } from "./stackerFunctions/allSpin.js";

console.log(standardFunctions, allSpinFunctions);
const files = {
  "standardRules.js": standardFunctions,
  "allSpin.js": allSpinFunctions,
  // files to functions
};

export { files };