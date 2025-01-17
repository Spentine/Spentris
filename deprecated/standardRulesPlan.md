# Planning Document for `standardRules.js`

## Functions

Primary Functions

- `update`
  - `placePiece` when lock delay finishes
- `tick`
  - everything
- `initialize`
  - `spawnPiece` on game start
  - `generateNext` on game start

- `moveLeft`
  - `movePiece` to verify movement
- `moveRight`
  - `movePiece` to verify movement
- `softDrop`
  - movement handled in `update`
- `hardDrop`
  - `movePiece` to verify movement down
  - `placePiece` to place piece after on floor
- `rotate`
  - `movePiece` to verify movements
  - will split up into 3 for the inputs
- `holdPiece`
  - `spawnPiece` to fetch the hold / next piece

** make sure to cover keyup and keydown **
- `moveLeftInput`
- `moveRightInput`
- `softDropInput`
- `hardDropInput`
- `rotateCCWInput`
- `rotateCWInput`
- `rotate180Input`
- `holdPieceInput`

Secondary Functions (DONE)

- `placePiece`
  - `spawnPiece` to spawn the next piece
  - `generateNext` to load more of the next queue
- `movePiece`
  - `validatePosition`

Tertiary Functions (DONE)

- `spawnPiece`
  - `validatePosition` to check whether the game continues
- `generateNext`
- `validatePosition`