/**
 * copy object by traversal
 * @param {Object} head - object to copy to
 * @param {Object} copy - object to copy from
 * @param {Object} disallowed - object with keys to ignore
 * @return {Object} the copied object
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
    
    if (
      typeof value === "object" &&
      value !== null && // why the fuck is null an object
      Object.getPrototypeOf(value) === Object.prototype && // [object Object]
      
      // consider removal, as their prototype may be different
      !Array.isArray(value)
    ) {
      head[key] ??= {};
      copyObjByTraversal(head[key], value, disallowed[key]);
    } else {
      head[key] = value;
    }
  }
  
  return head;
}

/**
 * attempts to dynamically import modules in order until one succeeds
 * @param {...string} modulePaths - url / relative path
 * @returns {Promise<Object>} - module object
 * @throws {Error} - all imports fail
 */
async function tryImports(...modulePaths) {
  for (const path of modulePaths) {
    try {
      const module = await import(path);
      return module; // return first successfully imported module
    } catch (err) {
      console.warn(`Failed to import ${path}:`, err);
    }
  }
  throw new Error("Failed to import modules:", modulePaths);
}

export { copyObjByTraversal, tryImports };