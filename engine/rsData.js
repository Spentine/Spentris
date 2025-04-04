import { PieceMino } from "./stackerObjects.js";

/*
J, L, S, T, Z Tetromino Wall Kick Data
Test 1	Test 2	Test 3	Test 4	Test 5
0->R	( 0, 0)	(-1, 0)	(-1,+1)	( 0,-2)	(-1,-2)
0->L	( 0, 0)	(+1, 0)	(+1,+1)	( 0,-2)	(+1,-2)

R->0	( 0, 0)	(+1, 0)	(+1,-1)	( 0,+2)	(+1,+2)
R->2	( 0, 0)	(+1, 0)	(+1,-1)	( 0,+2)	(+1,+2)

2->R	( 0, 0)	(-1, 0)	(-1,+1)	( 0,-2)	(-1,-2)
2->L	( 0, 0)	(+1, 0)	(+1,+1)	( 0,-2)	(+1,-2)

L->0	( 0, 0)	(-1, 0)	(-1,-1)	( 0,+2)	(-1,+2)
L->2	( 0, 0)	(-1, 0)	(-1,-1)	( 0,+2)	(-1,+2)

0 -> 0
R -> 1
2 -> 2
L -> 3
*/

/*
  pieceKicks[x][y] will get the data rotating from x to y
  
  ex.
  - [0][1] will get the data rotating from 0 to R
  - [1][0] will get the data rotating from R to 0
  - [1][2] will get the data rotating from R to 2
*/
const pieceKicks = [
  [ // 0
    [{x: 0, y: 0}], // 0
    [{x: 0, y: 0}, {x: -1, y: 0}, {x: -1, y: 1}, {x: 0, y: -2}, {x: -1, y: -2}], // 1
    [{x: 0, y: 0}], // 2
    [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: -2}, {x: 1, y: -2}], // 3
  ],
  [ // 1
    [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: -1}, {x: 0, y: 2}, {x: 1, y: 2}], // 0
    [{x: 0, y: 0}], // 1
    [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: -1}, {x: 0, y: 2}, {x: 1, y: 2}], // 2
    [{x: 0, y: 0}], // 3
  ],
  [ // 2
    [{x: 0, y: 0}], // 0
    [{x: 0, y: 0}, {x: -1, y: 0}, {x: -1, y: 1}, {x: 0, y: -2}, {x: -1, y: -2}], // 1
    [{x: 0, y: 0}], // 2
    [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: -2}, {x: 1, y: -2}], // 3
  ],
  [ // 3
    [{x: 0, y: 0}, {x: -1, y: 0}, {x: -1, y: -1}, {x: 0, y: 2}, {x: -1, y: 2}], // 0
    [{x: 0, y: 0}], // 1
    [{x: 0, y: 0}, {x: -1, y: 0}, {x: -1, y: -1}, {x: 0, y: 2}, {x: -1, y: 2}], // 2
    [{x: 0, y: 0}], // 3
  ],
];

/*
I Tetromino Wall Kick Data
Test 1	Test 2	Test 3	Test 4	Test 5
0->R	( 0, 0)	(-2, 0)	(+1, 0)	(-2,-1)	(+1,+2)
0->L	( 0, 0)	(-1, 0)	(+2, 0)	(-1,+2)	(+2,-1)

R->0	( 0, 0)	(+2, 0)	(-1, 0)	(+2,+1)	(-1,-2)
R->2	( 0, 0)	(-1, 0)	(+2, 0)	(-1,+2)	(+2,-1)

2->R	( 0, 0)	(+1, 0)	(-2, 0)	(+1,-2)	(-2,+1)
2->L	( 0, 0)	(+2, 0)	(-1, 0)	(+2,+1)	(-1,-2)

L->0	( 0, 0)	(+1, 0)	(-2, 0)	(+1,-2)	(-2,+1)
L->2	( 0, 0)	(-2, 0)	(+1, 0)	(-2,-1)	(+1,+2)

0 -> 0
R -> 1
2 -> 2
L -> 3
*/

const IPieceKicks = [
  [ // 0
    [{x: 0, y: 0}], // 0
    [{x: 0, y: 0}, {x: -2, y: 0}, {x: 1, y: 0}, {x: -2, y: -1}, {x: 1, y: 2}], // 1
    [{x: 0, y: 0}], // 2
    [{x: 0, y: 0}, {x: -1, y: 0}, {x: 2, y: 0}, {x: -1, y: 2}, {x: 2, y: -1}], // 3
  ],
  [ // 1
    [{x: 0, y: 0}, {x: 2, y: 0}, {x: -1, y: 0}, {x: 2, y: 1}, {x: -1, y: -2}], // 0
    [{x: 0, y: 0}], // 1
    [{x: 0, y: 0}, {x: -1, y: 0}, {x: 2, y: 0}, {x: -1, y: 2}, {x: 2, y: -1}], // 2
    [{x: 0, y: 0}], // 3
  ],
  [ // 2
    [{x: 0, y: 0}], // 0
    [{x: 0, y: 0}, {x: 1, y: 0}, {x: -2, y: 0}, {x: 1, y: -2}, {x: -2, y: 1}], // 1
    [{x: 0, y: 0}], // 2
    [{x: 0, y: 0}, {x: 2, y: 0}, {x: -1, y: 0}, {x: 2, y: 1}, {x: -1, y: -2}], // 3
  ],
  [ // 3
    [{x: 0, y: 0}, {x: 1, y: 0}, {x: -2, y: 0}, {x: 1, y: -2}, {x: -2, y: 1}], // 0
    [{x: 0, y: 0}], // 1
    [{x: 0, y: 0}, {x: -2, y: 0}, {x: 1, y: 0}, {x: -2, y: -1}, {x: 1, y: 2}], // 2
    [{x: 0, y: 0}], // 3
  ],
];

const tetrominoMatrices = {
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
      [0, 1, 1],
      [0, 1, 0],
      [0, 1, 0]
    ],
    [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0]
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
      [1, 1, 0],
      [0, 1, 1],
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
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0]
    ],
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0]
    ],
  ],
  J: [
    [
      [0, 0, 0],
      [1, 1, 1],
      [1, 0, 0]
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1]
    ],
    [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 0]
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
      [0, 1, 1],
      [0, 1, 0]
    ],
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 0]
    ],
  ]
};

const tetrominoSpawnPositions = {
  Z: {x: 3, y: 20},
  L: {x: 3, y: 20},
  O: {x: 4, y: 20},
  S: {x: 3, y: 20},
  I: {x: 3, y: 19},
  J: {x: 3, y: 20},
  T: {x: 3, y: 20},
};

const SRSData = {
  pieces: ["Z", "L", "O", "S", "I", "J", "T"],
  matrices: tetrominoMatrices,
  kicks: {
    Z: pieceKicks,
    L: pieceKicks,
    O: pieceKicks,
    S: pieceKicks,
    I: IPieceKicks,
    J: pieceKicks,
    T: pieceKicks,
  },
  spawnPositions: tetrominoSpawnPositions,
};

// SRS Plus Data
// https://tetris.wiki/images/5/52/TETR.IO_180kicks.png
const SRSPlusPieceKicks = [
  [ // 0
    [{x: 0, y: 0}], // 0
    [{x: 0, y: 0}, {x: -1, y: 0}, {x: -1, y: 1}, {x: 0, y: -2}, {x: -1, y: -2}], // 1
    [{x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}, {x: -1, y: 1}, {x: 1, y: 0}, {x: -1, y: 0}], // 2
    [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: -2}, {x: 1, y: -2}], // 3
  ],
  [ // 1
    [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: -1}, {x: 0, y: 2}, {x: 1, y: 2}], // 0
    [{x: 0, y: 0}], // 1
    [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: -1}, {x: 0, y: 2}, {x: 1, y: 2}], // 2
    [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 2}, {x: 1, y: 1}, {x: 0, y: 2}, {x: 0, y: 1}], // 3
  ],
  [ // 2
    [{x: 0, y: 0}, {x: 0, y: -1}, {x: -1, y: -1}, {x: 1, y: -1}, {x: -1, y: 0}, {x: 1, y: 0}], // 0
    [{x: 0, y: 0}, {x: -1, y: 0}, {x: -1, y: 1}, {x: 0, y: -2}, {x: -1, y: -2}], // 1
    [{x: 0, y: 0}], // 2
    [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: -2}, {x: 1, y: -2}], // 3
  ],
  [ // 3
    [{x: 0, y: 0}, {x: -1, y: 0}, {x: -1, y: -1}, {x: 0, y: 2}, {x: -1, y: 2}], // 0
    [{x: 0, y: 0}, {x: -1, y: 0}, {x: -1, y: 2}, {x: -1, y: 1}, {x: 0, y: 2}, {x: 0, y: 1}], // 1
    [{x: 0, y: 0}, {x: -1, y: 0}, {x: -1, y: -1}, {x: 0, y: 2}, {x: -1, y: 2}], // 2
    [{x: 0, y: 0}], // 3
  ],
];

// symmetrical I piece kicks
// https://tetris.wiki/images/7/7d/TETR.IO_SRS%2Bkicks.png
const SRSPlusIPieceKicks = [
  [ // 0
    [{x: 0, y: 0}], // 0
    [{x: 0, y: 0}, {x: 1, y: 0}, {x: -2, y: 0}, {x: -2, y: -1}, {x: 1, y: 2}], // 1
    // invert x
    [{x: 0, y: 0}, {x: 0, y: 1}], // 2
    [{x: 0, y: 0}, {x: -1, y: 0}, {x: 2, y: 0}, {x: 2, y: -1}, {x: -1, y: 2}], // 3
  ],
  [ // 1
    [{x: 0, y: 0}, {x: -1, y: 0}, {x: 2, y: 0}, {x: -1, y: -2}, {x: 2, y: 1}], // 0
    [{x: 0, y: 0}], // 1
    // invert y
    [{x: 0, y: 0}, {x: -1, y: 0}, {x: 2, y: 0}, {x: -1, y: 2}, {x: 2, y: -1}], // 2
    [{x: 0, y: 0}, {x: 1, y: 0}], // 3
  ],
  [ // 2
    [{x: 0, y: 0}, {x: 0, y: -1}], // 0
    [{x: 0, y: 0}, {x: -2, y: 0}, {x: 1, y: 0}, {x: -2, y: 1}, {x: 1, y: -2}], // 1
    // invert x
    [{x: 0, y: 0}], // 2
    [{x: 0, y: 0}, {x: 2, y: 0}, {x: -1, y: 0}, {x: 2, y: 1}, {x: -1, y: -2}], // 3
  ],
  [ // 3
    [{x: 0, y: 0}, {x: 1, y: 0}, {x: -2, y: 0}, {x: 1, y: -2}, {x: -2, y: 1}], // 0
    [{x: 0, y: 0}, {x: -1, y: 0}], // 1
    // invert y
    [{x: 0, y: 0}, {x: 1, y: 0}, {x: -2, y: 0}, {x: 1, y: 2}, {x: -2, y: -1}], // 2
    [{x: 0, y: 0}], // 3
  ],
];

// made out of curiosity
/*
  function reverseKickOrder(table) {
    for (let rotations of table) {
      for (let kicks of rotations) {
        kicks.reverse();
      }
    }
    return table;
  }

  reverseKickOrder(SRSPlusPieceKicks);
  reverseKickOrder(SRSPlusIPieceKicks);
*/

const SRSPlusData = {
  pieces: ["Z", "L", "O", "S", "I", "J", "T"],
  matrices: tetrominoMatrices,
  kicks: {
    Z: SRSPlusPieceKicks,
    L: SRSPlusPieceKicks,
    O: SRSPlusPieceKicks,
    S: SRSPlusPieceKicks,
    I: SRSPlusIPieceKicks,
    J: SRSPlusPieceKicks,
    T: SRSPlusPieceKicks,
  },
  spawnPositions: tetrominoSpawnPositions,
};

/*
  function updateMatricies(rs) {
    const pieces = rs.pieces;
    const matrices = rs.matrices;
    
    for (let piece of pieces) {
      const pieceRotations = matrices[piece];
      for (let matrixIndex in pieceRotations) {
        const matrix = pieceRotations[matrixIndex];
        for (let row of matrix) {
          for (let i in row) {
            if (row[i] === 0) {
              row[i] = new PieceMino(0, 0, matrixIndex);
            } else if (row[i] === 1) {
              row[i] = new PieceMino(piece, 1, matrixIndex);
            }
          }
        }
      }
    }
  }
*/

export { SRSData, SRSPlusData };