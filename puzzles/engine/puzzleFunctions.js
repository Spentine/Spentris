/**
 * contains functions
 * @typedef {Object} puzzleFunctions
 */
const puzzleFunctions = {
  none: function () {
    return function (game) {};
  },
  
  /**
   * @param {object} data
   * @param {number} data.lines - number of lines to clear
   * @param {string} data.endType - type of end event to emit
   */
  linesFinish: function (puzzleFunction) {
    const lines = puzzleFunction.parameters.lines;
    const endType = puzzleFunction.parameters.endType ?? "linesFinish";
    return function (game) {
      game.event.on("clear", (e) => {
        if (game.lines >= lines) {
          game.event.emit("end", {
            time: game.time,
            type: endType,
            success: true,
          });
        }
      });
    };
  },
  
  /**
   * @param {object} data
   * @param {number} data.time - time to clear in ms
   * @param {string} data.endType - type of end event to emit
   */
  timeFinish: function (puzzleFunction) {
    const time = puzzleFunction.parameters.time;
    const endType = puzzleFunction.parameters.endType ?? "timeFinish";
    return function (game) {
      game.event.on("update", (e) => {
        if (e.time >= time) {
          game.event.emit("end", {
            time: game.time,
            type: endType,
            success: true,
          });
        }
      });
    };
  },
};

export { puzzleFunctions };