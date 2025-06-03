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

/**
 * create an object with functions
 * @param {object} locations - object with function locations
 * @param {object} files - object with files containing functions
 * @returns {object} - object with functions
 */
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
    
    /**
     * the "=== true" is required
     * for keys this isn't needed, but for objects it is
     * for an object, the disallowed key can be an object, which is not `true`
     */
    if (disallowed[key] === true) continue;
    
    if (typeof value === "object" && !Array.isArray(value)) {
      head[key] ??= {};
      copyObjByTraversal(head[key], value, disallowed[key]);
    } else {
      head[key] = value;
    }
  }
  
  return head;
}

export { functionMap, functionLocationAccessor, copyObjByTraversal };