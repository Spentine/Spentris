// lua
import { createLuaState } from "../../scriptEngine/wasmoon/handler.js";

/**
 * contains functions and specifications for each function
 */
const puzzleFunctions = {
  none: {
    func: function () {
      return function (game) {};
    },
    specifications: {
      key: "none",
      parameters: {}
    },
  },
  
  linesFinish: {
    /**
     * @param {PuzzleFunction} puzzleFunction
     * @param {number} puzzleFunction.lines - number of lines to clear
     * @param {string} puzzleFunction.endType - type of end event to emit
     */
    func: function (puzzleFunction) {
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
    specifications: {
      key: "linesFinish",
      parameters: {
        lines: {
          type: "number",
          step: 1,
          min: 1,
          default: 4,
        },
        endType: {
          type: "string",
          default: "linesFinish"
        },
      }
    },
  },
  
  timeFinish: {
    /**
     * @param {PuzzleFunction} puzzleFunction
     * @param {number} puzzleFunction.time - time to clear in ms
     * @param {string} puzzleFunction.endType - type of end event to emit
     */
    func: function (puzzleFunction) {
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
    specifications: {
      key: "timeFinish",
      parameters: {
        time: {
          type: "number",
          step: 1000,
          min: 0,
          default: 60000,
        },
        endType: {
          type: "string",
          default: "timeFinish"
        },
      }
    },
  },
  
  clearsFinish: {
    /**
     * @param {PuzzleFunction} puzzleFunction
     * @param {number} puzzleFunction.clears - types of clears
     * @param {string} puzzleFunction.type - how to handle the clears
     * @param {string} puzzleFunction.endType - type of end event to emit
     */
    func: function (puzzleFunction) {
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
    specifications: {
      key: "clearsFinish",
      parameters: {
        clears: {
          type: "array",
          default: [],
        },
        type: {
          type: "string",
          default: "all"
        },
        endType: {
          type: "string",
          default: "clearsFinish"
        },
      }
    },
  },
  
  piecesLoss: {
    /**
     * @param {PuzzleFunction} puzzleFunction
     * @param {number} puzzleFunction.pieces - number of pieces placed before losing
     * @param {string} puzzleFunction.endType - type of end event to emit
     */
    func: function (puzzleFunction) {
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
    specifications: {
      key: "piecesLoss",
      parameters: {
        pieces: {
          type: "number",
          step: 1,
          min: 1,
          default: 100,
        },
        endType: {
          type: "string",
          default: "piecesLoss"
        },
      }
    },
  },
  
  luaExecution: {
    /**
     * @param {PuzzleFunction} puzzleFunction
     * @param {string} puzzleFunction.lua - lua code to run
     */
    func: function (puzzleFunction) {
      const lua = puzzleFunction.parameters.lua ?? "";
      return async function (game) {
        const luaState = await createLuaState();
        luaState.global.set("game", game);
        luaState.global.set("puzzleFunction", puzzleFunction);
        
        await luaState.doString(lua);
      };
    },
    specifications: {
      key: "luaExecution",
      parameters: {
        lua: {
          type: "multilineString",
          default: `
-- linesFinish recreation

local lines = 4
local endType = "linesFinish"

-- game object API provided
game.event:on("clear", function(e)
  
  console.log(e) -- console.log available
  
  if game.lines >= lines then
    game.event:emit("end", {
      time = game.time,
      type = endType,
      success = true,
    })
  end
end)
          `.trim(),
        },
      }
    },
  }
};

export { puzzleFunctions };