/**
 * create a map from string to function using their name
 * @param {object} functions
 */
function functionMap(functions) {
  const standardFunctions = {};
  for (let fn of functions) {
    standardFunctions[fn.name] = fn;
  }
  return standardFunctions;
}

function functionLocationAccessor(locations, files) {
  const functions = {};
  for (let i in locations) {
    const fn = files[locations[i].file][locations[i].name];
    functions[i] = fn;
  }
  return functions;
}

export { functionMap, functionLocationAccessor };