/**
 * create a map from string to function using their name
 * @param {Object} functions
 */
function functionMap(functions) {
  const standardFunctions = {};
  for (let fn of functions) {
    standardFunctions[fn.name] = fn;
  }
  return standardFunctions;
}

/**
 * create an object with functions
 * @param {Object} locations - object with function locations
 * @param {Object} files - object with files containing functions
 * @returns {Object} - object with functions
 */
function functionLocationAccessor(locations, files) {
  const functions = {};
  for (let i in locations) {
    const fn = files[locations[i].file][locations[i].name];
    functions[i] = fn;
  }
  return functions;
}

export { functionMap, functionLocationAccessor };