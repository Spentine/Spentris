// regular data tables
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

// birs data tables
/*
  local R=_strToVec{'+0+0','-1+0','-1-1','+0-1','-1+1','+1-1','+1+0','+0+1','+1+1','+0+2','-1+2','+1+2','-2+0','+2+0'}
  local L=_strToVec{'+0+0','+1+0','+1-1','+0-1','+1+1','-1-1','-1+0','+0+1','-1+1','+0+2','+1+2','-1+2','+2+0','-2+0'}
  local F=_strToVec{'+0+0','+0-1','+0+1','+0+2'}
*/
const rKicks = [
  {x: 0, y: 0}, {x: -1, y: 0}, {x: -1, y: -1}, {x: 0, y: -1},
  {x: -1, y: 1}, {x: 1, y: -1}, {x: 1, y: 0}, {x: 0, y: 1},
  {x: 1, y: 1}, {x: 0, y: 2}, {x: -1, y: 2}, {x: 1, y: 2},
  {x: -2, y: 0}, {x: 2, y: 0}
];
const lKicks = [
  {x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: -1}, {x: 0, y: -1},
  {x: 1, y: 1}, {x: -1, y: -1}, {x: -1, y: 0}, {x: 0, y: 1},
  {x: -1, y: 1}, {x: 0, y: 2}, {x: 1, y: 2}, {x: -1, y: 2},
  {x: 2, y: 0}, {x: -2, y: 0}
];
const fKicks = [
  {x: 0, y: 0}, {x: 0, y: -1}, {x: 0, y: 1}, {x: 0, y: 2}
];
const nKicks = [ // no kicks
  {x: 0, y: 0}
];

// create 180 kicks
/*
  {[02]=L,[20]=R,[13]=R,[31]=L},-- Z
  {[02]=R,[20]=L,[13]=R,[31]=L},-- S
  {[02]=L,[20]=R,[13]=L,[31]=R},-- J
  {[02]=R,[20]=L,[13]=L,[31]=R},-- L
  {[02]=F,[20]=F,[13]=L,[31]=R},-- T
  {[02]=F,[20]=F,[13]=F,[31]=F},-- O
  {[02]=F,[20]=F,[13]=R,[31]=L},-- I
*/
const pieceKicks = {
  Z: {"02": lKicks, "20": rKicks, "13": rKicks, "31": lKicks},
  S: {"02": rKicks, "20": lKicks, "13": rKicks, "31": lKicks},
  J: {"02": lKicks, "20": rKicks, "13": lKicks, "31": rKicks},
  L: {"02": rKicks, "20": lKicks, "13": lKicks, "31": rKicks},
  T: {"02": fKicks, "20": fKicks, "13": lKicks, "31": rKicks},
  O: {"02": fKicks, "20": fKicks, "13": fKicks, "31": fKicks},
  I: {"02": fKicks, "20": fKicks, "13": rKicks, "31": lKicks},
}

// convert 180 pieceKicks to a more usable format
for (const piece in pieceKicks) {
  // get short format
  const shortKicks = pieceKicks[piece];
  
  // standard format
  const newKicks = new Array(4)
    .fill(null).map(() => new Array(4).fill(nKicks));
  pieceKicks[piece] = newKicks;
  
  for (const key in shortKicks) {
    const initial = Number(key[0]);
    const final = Number(key[1]);
    
    const kicks = shortKicks[key];
    
    newKicks[initial][final] = kicks;
  }
}

// add cw and ccw kicks
/*
  list[i][01]=a; list[i][10]=b; list[i][03]=b; list[i][30]=a
  list[i][12]=a; list[i][21]=b; list[i][32]=b; list[i][23]=a
*/
for (const piece in pieceKicks) {
  const kicks = pieceKicks[piece];
  
  let a = rKicks;
  let b = lKicks;

  if (piece === "O") {
    [a, b] = [b, a]; // swap for O piece
  }
  
  kicks[0][1] = a; kicks[1][0] = b; kicks[0][3] = b; kicks[3][0] = a;
  kicks[1][2] = a; kicks[2][1] = b; kicks[3][2] = b; kicks[2][3] = a;
}

console.log(pieceKicks);

const BiRSData = {
  pieces: ["Z", "L", "O", "S", "I", "J", "T"],
  matrices: tetrominoMatrices,
  kicks: pieceKicks,
  spawnPositions: tetrominoSpawnPositions,
};

export { BiRSData };