/**
 * converts time elapsed in ms to a human readable format
 * @param {number} time - time in ms
 * @returns {string} - human readable time
 */
function humanTime(time) {
  
  // if time is less than 10 minutes
  // format is m:ss.SSS
  if (time < 3600000) {
    const minutes = String(Math.floor(time / 60000));
    const seconds = String(Math.floor((time % 60000) / 1000)).padStart(2, '0');
    const milliseconds = String(time % 1000).padStart(3, '0');

    return `${minutes}:${seconds}.${milliseconds}`;
  }
  
  // if time is greater than 1 hour
  // format is h:mm:ss.SSS
  
  const hours = String(Math.floor(time / 3600000));
  const minutes = String(Math.floor((time % 3600000) / 60000)).padStart(2, '0');
  const seconds = String(Math.floor((time % 60000) / 1000)).padStart(2, '0');
  const milliseconds = String(time % 1000).padStart(3, '0');
  
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
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

export { humanTime, copyObjByTraversal };