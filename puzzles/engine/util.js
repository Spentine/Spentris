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