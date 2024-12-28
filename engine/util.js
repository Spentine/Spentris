import { standardFunctions } from "./standardRules.js";

const files = {
  "standardRules.js": standardFunctions,
  // files to functions
};

function functionLocationAccessor(locations) {
  const functions = {};
  for (let i in locations) {
    const fn = files[locations[i].file][locations[i].name];
    functions[i] = fn;
  }
  return functions;
}

export { functionLocationAccessor };