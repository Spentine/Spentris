import { standardFunctions } from "./stackerFunctions/standardRules.js";
import { allSpinFunctions } from "./stackerFunctions/allSpin.js";

// addons
import { bidirectionalRSFunctions } from "../addons/biRS/bidirectionalRS.js";

// console.log(standardFunctions, allSpinFunctions);
const files = {
  "standardRules.js": standardFunctions,
  "allSpin.js": allSpinFunctions,
  "bidirectionalRS.js": bidirectionalRSFunctions,
  // files to functions
};

export { files };