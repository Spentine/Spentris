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
  - `validatePosition` to verify movement
- `moveRight`
  - `validatePosition` to verify movement
- `softDrop`
  - movement handled in `update`
- `hardDrop`
  - `validatePosition` to verify movement down
  - `placePiece` to place piece after on floor
- `rotate`
  - `validatePosition` to verify kicks
  - will split up into 3 for the inputs
- `holdPiece`
  - `spawnPiece` to fetch the hold / next piece

- `moveLeftInput`
- `moveRightInput`
- `softDropInput`
- `hardDropInput`
- `rotateCCWInput`
- `rotateCWInput`
- `rotate180Input`
- `holdPieceInput`

Secondary Functions

- `placePiece`
  - `spawnPiece` to spawn the next piece
  - `generateNext` to load more of the next queue

Tertiary Functions

- `spawnPiece`
  - `validatePosition` to check whether the game continues
- `generateNext`
- `validatePosition`

## ARR-Gravity Handling

Routine

- Calculate timestamps for next ARR and Gravity movements.
- Attempt to execute the current movement.
  - If the ARR flag is `true`, then use ARR rather than Gravity with the timestamp at the current time. Have it alternate with another flag `currentAffect` = `true` on start.
  