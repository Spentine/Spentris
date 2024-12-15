// Spentine 13 November 2024
// This is only intended to provide information for programmers, but not as the main UI.
// It also also not well thought-out, just going with the flow.

// flipped vertically (lower index appears higher on text)
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
    this.values = data.values
  }
}

const minoColors = {
  Z: "#ff0000",
  L: "#ff4400",
  O: "#ffff00",
  S: "#00ff00",
  I: "#00ffff",
  J: "#0000ff",
  T: "#ff00ff",
};

function renderState(state) {
  const tileSize = 24;
  
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
  ctx.fillRect(
    6 * tileSize,
    tileSize,
    tileSize * boardWidth,
    tileSize * boardHeight
  );
  
  // converts a board index to screen position
  function getBoardPosition(column, row) {
    return {
      x: tileSize * (6 + column),
      y: canvas.height - tileSize * (2 + row)
    };
  }
  
  for (let row=0; row<boardHeight; row++) {
    for (let column=0; column<boardWidth; column++) {
      const tile = state.board[row][column];
      if (tile !== "") {
        ctx.fillStyle = minoColors[tile];
        const pos = getBoardPosition(column, row);
        ctx.fillRect(pos.x, pos.y, tileSize, tileSize);
      }
    }
  }
  
  function renderPiece(piece, rotation, x, y, color=minoColors[piece]) {
    // piece data
    const data = pieces[piece][rotation];
    
    // set color
    ctx.fillStyle = color;
    
    // render piece
    for (let row=0; row<data.length; row++) {
      for (let column=0; column<data[0].length; column++) {
        if (data[row][column]) {
          ctx.fillRect(
            tileSize * column + x,
            - tileSize * row + y,
            tileSize,
            tileSize
          );
        }
      }
    }
  }
  
  const currentPiecePos = getBoardPosition(
    state.current.position[0],
    state.current.position[1]
  );
  
  // render current piece
  renderPiece(
    state.current.piece,
    state.current.rotation,
    currentPiecePos.x,
    currentPiecePos.y
  );
  
  // mark index
  ctx.fillStyle = "#ffffff";
  ctx.globalAlpha = 0.2
  
  ctx.fillRect(
    currentPiecePos.x + tileSize / 4 - 1,
    currentPiecePos.y + tileSize / 4 + 1,
    tileSize / 2,
    tileSize / 2
  );
  
  ctx.globalAlpha = 1
  
  if (state.hold.piece !== null) {
    const color = (
      state.hold.allowed
        ? minoColors[state.hold.piece]
        : "#888888"
    );
    renderPiece(
      state.hold.piece,
      0,
      tileSize,
      tileSize * 5,
      color
    );
  }
  
  for (let i=0; i<state.next.length; i++) {
    renderPiece(
      state.next[i],
      0,
      tileSize * (7 + boardWidth),
      tileSize * (5 + 4 * i),
    );
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
    values: {
      score: 1234,
      time: 567890 // ms
    }
  })
];

export { renderState, demoStates };