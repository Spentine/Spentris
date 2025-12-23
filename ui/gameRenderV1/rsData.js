// taken and stripped from the engine
// for modularity purposes
// not good for memory but good for modularity

const SRSData = transformMatrices({
  pieces: ["Z", "L", "O", "S", "I", "J", "T"],
  matrices: {
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
  },
});

/**
 * Transforms matrices to be more digestible by the game
 * will replace 0s with nulls and replace the number with the piece key
 * @param {Object} data - the data
 * @returns {Object} - the transformed data
 */
function transformMatrices(data) {
  const transformedData = {
    pieces: data.pieces,
    matrices: {},
  };
  const matrices = data.matrices;

  for (const key of data.pieces) {
    transformedData.matrices[key] = matrices[key].map(matrix =>
      matrix.map(row =>
        row.map(item => (item === 0 ? null : key))
      )
    );
  }

  return transformedData;
}

export { SRSData };