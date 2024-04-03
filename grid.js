import { canvas } from "./index.js";

export default (row, col) => {
  const targetGrid = [];
  for (let h = 0; h < row; h++) {
    targetGrid.push([]);
    for (let w = 0; w < col; w++) {
      targetGrid[h].push({
        x: (canvas.width / col) * w + canvas.width / (col * 2),
        y: (canvas.height / row) * h + canvas.height / (row * 2),
      });
    }
  }
  //[11][19]
  return [
    targetGrid[6][3],
    targetGrid[2][3],
    targetGrid[2][7],
    targetGrid[9][7],
    targetGrid[9][11],
    targetGrid[2][11],
    targetGrid[2][15],
    targetGrid[7][15],
    targetGrid[7][19],
  ];
};
