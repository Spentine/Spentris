/**
 * json serialization utilities
 * makes it easier to convert objects to and from json
 * i dont like it when infinity or nan or undefined shows up as null in json
 */
class JSONSerialization {
  /**
   * attempts to coerce all values in a JSON object
   * @param {Object} json - JSON object to coerce
   * @param {Object} coersions - object mapping keys to coersions
   * @returns {Object} - coerced JSON object
   */
  static coerce(json, coersions) {
    if (!coersions) return json;
    
    // null
    if (json === null) return coersions(json);
    
    // non-object
    if (typeof json !== "object") return coersions(json);
    
    // array
    if (Array.isArray(json)) return json.map(
      (e) => JSONSerialization.coerce(e, coersions)
    );
    
    // object
    for (const key in json) {
      const value = json[key];
      const coersion = coersions[key];
      
      json[key] = JSONSerialization.coerce(
        value, coersion ?? ((e) => e)
      );
    }
    
    return json;
  }
  
  /**
   * generates deserializer coersions
   * @param {Object} inputCoersions - object mapping keys to coersions
   * @returns {Object} - deserializer coersions
   */
  static generateDeserializer(inputCoersions) {
    const coersions = {};
    
    // object
    if (typeof inputCoersions === "object") {
      for (const key in inputCoersions) {
        const coersion = JSONSerialization
          .generateDeserializer(inputCoersions[key]);
          
        coersions[key] = coersion;
      }
    }
    
    switch (inputCoersions) {
      case "number": return (e) => Number(e);
      case "string": return (e) => String(e);
      case "boolean": return (e) => Boolean(e);
      default: return coersions;
    }
  }
  
  /**
   * generates serializer coersions
   * @param {Object} inputCoersions - object mapping keys to coersions
   * @returns {Object} - serializer coersions
   */
  static generateSerializer(inputCoersions) {
    const coersions = {};
    
    // object
    if (typeof inputCoersions === "object") {
      for (const key in inputCoersions) {
        const coersion = JSONSerialization
          .generateSerializer(inputCoersions[key]);
          
        coersions[key] = coersion;
      }
    }
    
    switch (inputCoersions) {
      case "number": return ((e) => // fucking pmo omg
        e === Infinity ? "Infinity" :
        e === -Infinity ? "-Infinity" :
        Number.isNaN(e) ? "NaN" :
        e === undefined ? "undefined" :
        Number(e)
      );
      case "string": return (e) => String(e);
      case "boolean": return (e) => Boolean(e);
      default: return coersions;
    }
  }
  
  /**
   * generates json with keys in alphabetical order and minified
   * @param {Object} obj - object to stringify
   * @returns {string} - minified json with keys in alphabetical order
   */
  static stableStringify(obj) {
    // primitive
    if (typeof obj !== "object" || obj === null) {
      return JSON.stringify(obj);
    }
    
    // array
    if (Array.isArray(obj)) {
      const arr = obj.map((e) => JSONSerialization.stableStringify(e));
      return `[${arr.join(",")}]`;
    }
    
    // object
    const keys = Object.keys(obj).sort();
    const keyValuePairs = keys.map(
      (key) => `${JSON.stringify(key)}:${JSONSerialization.stableStringify(obj[key])}`
    );
    return `{${keyValuePairs.join(",")}}`;
  }
}

export { JSONSerialization };