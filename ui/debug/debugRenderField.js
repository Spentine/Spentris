// Spentine 13 November 2024
// This is only intended to provide information for programmers, but not as the main UI.
// It also also not well thought-out, just going with the flow.

// flipped
const pieces = {
  Z: [
    [
      [0, 0, 0],
      [0, 1, 1],
      [1, 1, 0]
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 0, 1]
    ],
    [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    [
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 0]
    ],
  ],
  L: [
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 1]
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0]
    ],
    [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 1, 1],
      [0, 1, 0],
      [0, 1, 0]
    ],
  ],
  O: [
    [
      [1, 1],
      [1, 1]
    ],
    [
      [1, 1],
      [1, 1]
    ],
    [
      [1, 1],
      [1, 1]
    ],
    [
      [1, 1],
      [1, 1]
    ],
  ],
  S: [
    [
      [0, 0, 0],
      [1, 1, 0],
      [0, 1, 1]
    ],
    [
      [0, 0, 1],
      [0, 1, 1],
      [0, 1, 0]
    ],
    [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [1, 0, 0]
    ],
  ],
  I: [
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0]
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0]
    ],
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0]
    ],
  ],
  J: [
    [
      [0, 0, 0],
      [1, 1, 1],
      [1, 0, 0]
    ],
    [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 0]
    ],
    [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1]
    ],
  ],
  T: [
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0]
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 0]
    ],
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 1, 0]
    ],
  ]
};


class DebugBoardState {
  constructor(data) {
    this.board = data.board;
    this.hold = data.hold;
    this.next = data.next;
    this.current = data.current;
  }
}

const minoColors = {
  Z: "#ff0000",
  L: "#ff4400",
  O: "#ffff00",
  S: "#00ff00",
  I: "#00ffff",
  J: "#0000ff",
  T: "#ff00ff"
};

function renderState(state) {
  const tileSize = 16;
  
  const boardHeight = state.board.length;
  const boardWidth = state.board[0].length;
  
  const canvas = document.createElement("canvas");
  // needs space for hold and next, so 4 tiles allocated for each one + 1 tile of padding
  canvas.width = (2 * 6 * tileSize) + tileSize * boardWidth;
  canvas.height = (2 * tileSize) + tileSize * boardHeight;
  
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = "#222222";
  ctx.fillRect(6 * tileSize, tileSize, tileSize * boardWidth, tileSize * boardHeight);
  
  for (let row=0; row<boardHeight; row++) {
    for (let column=0; column<boardWidth; column++) {
      const tile = state.board[row][column];
      if (tile !== "") {
        ctx.fillStyle = minoColors[tile];
        ctx.fillRect(tileSize * (6 + column), canvas.height - tileSize * (2 + row), tileSize, tileSize);
      }
    }
  }
  
  function renderPiece(piece, rotation, x, y) {
    
  }
  
  return canvas;
}

const demoStates = [
  new DebugBoardState({
    board: [
      ["O", "O", "S", "S", "", "", "", "J", "J", "I"],
      ["O", "O", "", "S", "S", "L", "L", "L", "J", "I"],
      ["Z", "", "", "", "", "", "", "L", "J", "I"],
      ["Z", "Z", "", "", "", "", "", "", "", "I"],
      ["", "Z", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
    ],
    hold: {
      piece: "T",
      allowed: true,
    },
    next: ["L", "O", "S", "I", "J"],
    current: {
      piece: "Z",
      position: [3, 15],
      rotation: 0,
      lockdown: 0, // 0 = none, 1 = full
    },
  })
];

export { renderState, demoStates };