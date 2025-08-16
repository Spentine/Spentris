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
    
    if (
      typeof value === "object" &&
      !Array.isArray(value) &&
      value !== null // why the fuck is null an object
    ) {
      head[key] ??= {};
      copyObjByTraversal(head[key], value, disallowed[key]);
    } else {
      head[key] = value;
    }
  }
  
  return head;
}

export { copyObjByTraversal };