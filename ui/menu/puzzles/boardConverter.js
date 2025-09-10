/*

Handles conversion of board input to the correct board format

*/

/**
 * converts board into text format
 * @param {string[][]} board - 2D array representing the board (matrix only)
 * @return {string} - text representation of the board
 */
function convertBoardToText(board) {
  board = structuredClone(board); // clone board to avoid mutating original
  
  // remove last rows until a non-empty row is found
  while (board.length > 0) {
    const lastRow = board[board.length - 1];
    const isEmpty = lastRow.every(cell => cell === null);
    
    if (isEmpty) board.pop();
    else break;
  }
  
  // convert board cells to characters in place
  board.forEach(row => row.forEach((cell, colIndex) => {
    row[colIndex] = (
      cell === null
        ? "-"
        : cell
    );
  }));

  // convert board rows to strings
  board.forEach((row, rowIndex) => {
    board[rowIndex] = row.join("");
  });
  
  // the bottom row is normally the first row
  // but it should be the last in text format
  board.reverse(); // reverse board rows

  // join board rows with newlines
  return board.join("\n");
}

/**
 * converts text to board
 * @param {string} text - text representation of the board
 * @param {number} width - width of the board
 * @param {number} height - height of the board
 * @return {string[][]} - 2D array representing the board (matrix only)
 */
function convertTextToBoard(text, width, height) {
  const board = [];
  
  /*
    approach is weird because text input is from human
    first there must be newlines to separate rows
    reverse the rows to make the bottom row the last row
  */
  
  // split text into rows
  const rows = text.split("\n");
  
  // reverse rows
  rows.reverse();
  
  /*
    then the row strings are implemented interestingly
      if the length of the row is equal then assume " " and "-" to be empty
      if the length of the row is greater, assume only "-" to be empty, if it's still greater then omit the extra characters at the end
      if the length of the row is less, assume the rest are empty
      if the length of the row is 0, omit it
  */
  
  for (let rowIndex=0; rowIndex<rows.length; rowIndex++) {
    const rowString = rows[rowIndex];
    
    if (rowString.length === 0) {
      // remove row
      rows.splice(rowIndex, 1);
      rowIndex--;
      continue;
    }
    
    const allowedChars = {
      "Z": "Z",
      "L": "L",
      "O": "O",
      "S": "S",
      "I": "I",
      "J": "J",
      "T": "T"
    };
    
    const convertChar = (char) => (
      char in allowedChars
        ? allowedChars[char]
        : null
    );
    
    const row = [];
    board.push(row);
    
    if (rowString.length === width) {
      for (const char of rowString) {
        row.push(convertChar(char));
      }
      continue;
    }
    
    if (rowString.length > width) {
      // remove spaces
      for (const char of rowString) {
        if (char !== " ") row.push(convertChar(char));
      }
      
      // truncate to width if too long
      while (row.length > width) row.pop();
      
      // fill with empty if too short
      while (row.length < width) row.push(null);
      
      continue;
    }
    
    if (rowString.length < width) {
      for (const char of rowString) {
        row.push(convertChar(char));
      }
      
      // fill with empty
      while (row.length < width) row.push(null);
      
      continue;
    }
  }
  
  // push empty rows
  while (board.length < height) {
    const emptyRow = new Array(width).fill(null);
    board.push(emptyRow);
  }
  
  return board;
}

export { convertBoardToText, convertTextToBoard };