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

/**
 * copy object by traversal
 * @param {object} head - object to copy to
 * @param {object} copy - object to copy from
 * @param {object} disallowed - object with keys to ignore
 */
function copyObjByTraversal(head, copy, disallowed) {
  disallowed ??= {};
  for (let key in copy) {
    const value = copy[key];
    
    if (typeof value === "object" && !Array.isArray(value) && !disallowed[key] === true) {
      head[key] ??= {};
      copyObjByTraversal(head[key], value, disallowed[key]);
    } else {
      head[key] = value;
    }
    
  }
  
  return head;
}

export { functionMap, functionLocationAccessor, copyObjByTraversal };