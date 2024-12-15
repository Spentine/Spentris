import { gaEventHandler } from "./nextEvent.js";

/**
  @param {number} time // number of time to elapse
*/
const update = function (time) {
  
};

/**
  @param {number} time // number of time to elapse
  @param {object} inputs // the inputs for the game
*/
const tick = function (time, inputs) {
  
};

/**
  @param {object} params
*/
const initialize = function (params) {
  this.score = 0;
}

const values = {
  update: [
    // variables `update` requires
  ],
  tick: [
    // variables `tick` requires
  ],
  initialize: {
    width: 10,
    height: 40,
    // other stuff
  }
};

// all the functions to export
const functions = [update, tick, initialize];

// create a map from string to function using their name
const standardFunctions = {};
for (let fn of functions) {
  standardFunctions[fn.name] = fn;
}

export { standardFunctions, values };