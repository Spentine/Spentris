/*
  Handles events from (a, b] where a is the previous event and b is the current event
  
  I don't know whether to reset arrOffset on arrPrioritization success
  please research and prove whether it is necessary
*/

class gaEventHandler {
  constructor(gravOffset, gravSpeed, arrOffset, arrSpeed, time) {
    // initialize parameters
    this.gravOffset = gravOffset;
    this.gravSpeed = gravSpeed;
    this.arrOffset = arrOffset;
    this.arrSpeed = arrSpeed;
    this.time = time;
    
    // floor all the numbers to fix weird errors
    this.floor();
    
    // calculate the minimum value
    this.gravMin = this.gravityEvent(0);
    this.arrMin = this.arrEvent(0);
    
    // calculate the next events
    this.calculateNextGrav();
    this.calculateNextArr();
    
    // flags for selective arr prioritization
    this.arrPriority = false;
    
    // the previous event
    this.prev = null;
    
    // double skip
    this.skipped = false;
  }
  
  override(settings) {
    this.gravOffset = settings.gravOffset ?? this.gravOffset;
    this.gravSpeed = settings.gravSpeed ?? this.gravSpeed;
    this.arrOffset = settings.arrOffset ?? this.arrOffset;
    this.arrSpeed = settings.arrSpeed ?? this.arrSpeed;
    this.time = settings.time ?? this.time;
    
    this.floor();
    
    this.gravMin = this.gravityEvent(0);
    this.arrMin = this.arrEvent(0);
    
    this.calculateNextGrav();
    this.calculateNextArr();
  }
  
  /**
   * weird errors crop up when trying to do math with shitty numbers like 355.19692825600004 (floor 5) so i'm just going to floor all the numbers to hopefully fix it
   */
  floor() {
    const values = [
      "gravOffset", "gravSpeed", "arrOffset", "arrSpeed",
      // "time", // dont want to interfere with this
    ];
    
    // powers of 2 are my pookie bears
    const precision = 1 << 8;
    // note: IEEE 754 uses 2^53 for the mantissa (52 bits) but my values might be much larger so i'm going to stay safe and use 1 << 8. i'm not sure if this is the right choice but it's the best i can do for now
    
    for (let value of values) {
      this[value] = Math.floor(this[value] * precision) / precision;
    }
  }
  
  gravityEvent(n) {
    return this.gravSpeed * n + this.gravOffset;
  }
  
  arrEvent(n) {
    return this.arrSpeed * n + this.arrOffset;
  }
  
  calculateNextGrav() {
    if (this.gravSpeed === Infinity) return Infinity;
    if (this.gravSpeed === 0) return Math.max(this.time, this.gravOffset);
    
    return Math.max(this.gravMin, this.gravityEvent(Math.floor((this.time - this.gravOffset) / this.gravSpeed) + 1));
  }
  
  calculateNextArr() {
    if (this.arrSpeed === Infinity) return Infinity;
    if (this.arrSpeed === 0) return Math.max(this.time, this.arrOffset);
    
    return Math.max(this.arrMin, this.arrEvent(Math.floor((this.time - this.arrOffset) / this.arrSpeed) + 1));
  }
  
  createEvent(type, time) {
    this.prev = type;
    this.time = time;
    return {
      "action": type,
      "time": time
    };
  }
  
  /**
   * @returns {Object} the next event
   * @returns {String} Object.action the action to take
   * @returns {Number} Object.time the time of the event
   */
  next() {
    this.skipped = false;
    
    // arr prioritization
    if (this.arrPriority) {
      this.arrPriority = false;
      return this.createEvent("arr", Math.max(this.time, this.arrOffset));
    }
    
    // prioritize gravity over arr
    const gravNext = this.calculateNextGrav();
    const arrNext = this.calculateNextArr();
    
    if (arrNext === gravNext && this.gravSpeed !== 0) { // arr next guaranteed
      this.arrPriority = true;
      return this.createEvent("gravity", arrNext);
    } else if (arrNext < gravNext) {
      return this.createEvent("arr", arrNext);
    } else {
      return this.createEvent("gravity", gravNext);
    }
  }
  
  /**
   * @returns {Object} the next event
   * @returns {String} Object.action the action to take
   * @returns {Number} Object.time the time of the event
   */
  skip() {
    if (this.skipped) return {
      "action": "finish",
      "time": this.time
    };
    
    this.skipped = true;
    
    if (this.prev === "arr") {
      this.arrPriority = true;
      
      // gravity is next event
      const gravNext = this.calculateNextGrav();
      return this.createEvent("gravity", gravNext);
    } else {
      this.arrPriority = false;
      
      // arr is next event
      const arrNext = this.calculateNextArr();
      return this.createEvent("arr", arrNext);
    }
  }
}

export { gaEventHandler };