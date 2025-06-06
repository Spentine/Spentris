/**
 * contains functions
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
  
  /**
   * @param {object} data
   * @param {number} data.clears - types of clears
   * @param {string} data.type - how to handle the clears
   * @param {string} data.endType - type of end event to emit
   */
  clearsFinish: function (puzzleFunction) {
    const clears = puzzleFunction.parameters.clears;
    const type = puzzleFunction.parameters.type ?? "all";
    const endType = puzzleFunction.parameters.endType ?? "clearsFinish";
    
    const clearMatches = function(performed, clear) {
      for (let i in clear) {
        if (performed[i] !== clear[i]) return false;
      }
      return true;
    };
    
    switch (type) {
      case "all":
        return function (game) {
          const finished = new Array(clears.length).fill(false);
          game.event.on("clear", (e) => {
            for (let i in clears) {
              if (!finished[i]) {
                if (clearMatches(e.performed, clears[i])) {
                  finished[i] = true;
                  if (finished.every((v) => v)) {
                    game.event.emit("end", {
                      time: game.time,
                      type: endType,
                      success: true,
                    });
                  }
                  break;
                }
              }
            }
          });
        };
        break;
      case "sequential":
        return function (game) {
          let index = 0;
          game.event.on("clear", (e) => {
            if (clearMatches(e.performed, clears[index])) {
              index++;
              if (index >= clears.length) {
                game.event.emit("end", {
                  time: game.time,
                  type: endType,
                  success: true,
                });
              }
            }
          });
        };
        break;
    }
  },
  
  /**
   * @param {object} data
   * @param {number} data.pieces - number of pieces placed before losing
   * @param {string} data.endType - type of end event to emit
   */
  piecesLoss: function (puzzleFunction) {
    const pieces = puzzleFunction.parameters.pieces;
    const endType = puzzleFunction.parameters.endType ?? "piecesLoss";
    return function (game) {
      game.event.on("place", (e) => {
        if (game.pieces >= pieces) {
          game.event.emit("end", {
            time: game.time,
            type: endType,
            success: true,
          });
        }
      });
    }
  },
};

export { puzzleFunctions };