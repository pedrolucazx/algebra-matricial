class Matrix {
  constructor(rows, cols, elements) {
    this.rows = rows;
    this.cols = cols;
    this.data = elements;
  }

  get(i, j) {
    return this.data[i][j];
  }

  set(i, j, value) {
    this.data[i][j] = value;
  }
}

class Vector {
  constructor(dim, elements) {
    this.dim = dim;
    this.data = elements;
  }

  get(i) {
    return this.data[i];
  }

  set(i, value) {
    this.data[i] = value;
  }
}

class LinearAlgebra {
  transpose(matrixOrVector) {
    if (matrixOrVector instanceof Matrix) {
      const transposedData = [];
      for (let j = 0; j < matrixOrVector.cols; j++) {
        transposedData[j] = [];
        for (let i = 0; i < matrixOrVector.rows; i++) {
          transposedData[j][i] = matrixOrVector.get(i, j);
        }
      }
      return new Matrix(
        matrixOrVector.cols,
        matrixOrVector.rows,
        transposedData
      );
    } else if (matrixOrVector instanceof Vector) {
      return new Vector(1, matrixOrVector.data);
    } else {
      throw new Error("Argumento deve ser uma instância de Matrix ou Vector");
    }
  }

  sum(a, b) {
    if (a instanceof Matrix && b instanceof Matrix) {
      if (a.rows !== b.rows || a.cols !== b.cols) {
        throw new Error(
          "As matrizes devem ter as mesmas dimensões para serem somadas"
        );
      }

      const resultData = [];
      for (let i = 0; i < a.rows; i++) {
        resultData[i] = [];
        for (let j = 0; j < a.cols; j++) {
          resultData[i][j] = a.get(i, j) + b.get(i, j);
        }
      }

      return new Matrix(a.rows, a.cols, resultData);
    } else if (a instanceof Vector && b instanceof Vector) {
      if (a.dim !== b.dim) {
        throw new Error(
          "Os vetores devem ter a mesma dimensão para serem somados"
        );
      }

      const resultData = [];
      for (let i = 0; i < a.dim; i++) {
        resultData[i] = a.get(i) + b.get(i);
      }
      return new Vector(a.dim, resultData);
    } else {
      throw new Error(
        "Ambos os argumentos devem ser do mesmo tipo (Matrix ou Vector)"
      );
    }
  }

  times(a, b) {
    if (typeof a === "number" && b instanceof Matrix) {
      const resultData = [];
      for (let i = 0; i < b.rows; i++) {
        resultData[i] = [];
        for (let j = 0; j < b.cols; j++) {
          resultData[i][j] = a * b.get(i, j);
        }
      }
      return new Matrix(b.rows, b.cols, resultData);
    }

    if (typeof a === "number" && b instanceof Vector) {
      const resultData = [];
      for (let i = 0; i < b.dim; i++) {
        resultData[i] = a * b.get(i);
      }
      return new Vector(b.dim, resultData);
    }

    if (a instanceof Matrix && typeof b === "number") {
      const resultData = [];
      for (let i = 0; i < a.rows; i++) {
        resultData[i] = [];
        for (let j = 0; j < a.cols; j++) {
          resultData[i][j] = a.get(i, j) * b;
        }
      }
      return new Matrix(a.rows, a.cols, resultData);
    }

    if (a instanceof Vector && typeof b === "number") {
      const resultData = [];
      for (let i = 0; i < a.dim; i++) {
        resultData[i] = a.get(i) * b;
      }
      return new Vector(a.dim, resultData);
    }

    if (a instanceof Matrix && b instanceof Matrix) {
      if (a.cols !== b.rows) {
        throw new Error(
          `Dimensões incompatíveis para multiplicação de matrizes: ${a.rows}x${a.cols} * ${b.rows}x${b.cols}. O número de colunas da primeira matriz deve ser igual ao número de linhas da segunda matriz.`
        );
      }

      const resultData = [];
      for (let i = 0; i < a.rows; i++) {
        resultData[i] = [];
        for (let j = 0; j < b.cols; j++) {
          let sum = 0;
          for (let k = 0; k < a.cols; k++) {
            sum += a.get(i, k) * b.get(k, j);
          }
          resultData[i][j] = sum;
        }
      }
      return new Matrix(a.rows, b.cols, resultData);
    }

    if (a instanceof Vector && b instanceof Vector) {
      if (a.dim !== b.dim) {
        throw new Error(
          "Os vetores devem ter a mesma dimensão para multiplicação elemento a elemento"
        );
      }

      const resultData = [];
      for (let i = 0; i < a.dim; i++) {
        resultData[i] = a.get(i) * b.get(i);
      }
      return new Vector(a.dim, resultData);
    }

    throw new Error("Argumentos inválidos para multiplicação.");
  }

  dot(a, b) {
    if (a instanceof Matrix && b instanceof Matrix) {
      if (a.cols !== b.rows) {
        throw new Error(
          `Dimensões incompatíveis para multiplicação de matrizes: ${a.rows}x${a.cols} * ${b.rows}x${b.cols}. O número de colunas da primeira matriz deve ser igual ao número de linhas da segunda matriz.`
        );
      }

      const resultData = [];
      for (let i = 0; i < a.rows; i++) {
        resultData[i] = [];
        for (let j = 0; j < b.cols; j++) {
          let sum = 0;
          for (let k = 0; k < a.cols; k++) {
            sum += a.get(i, k) * b.get(k, j);
          }
          resultData[i][j] = sum;
        }
      }
      return new Matrix(a.rows, b.cols, resultData);
    }
    throw new Error("Argumentos devem ser um Matrix");
  }

  gauss(inputMatrix) {
    if (!(inputMatrix instanceof Matrix)) {
      throw new Error("Argumento deve ser uma Matrix");
    }

    const resultMatrix = new Matrix(
      inputMatrix.rows,
      inputMatrix.cols,
      inputMatrix.data
    );
    const rowCount = resultMatrix.rows;
    const columnCount = resultMatrix.cols;

    let currentPivotRow = 0;
    for (
      let currentPivotCol = 0;
      currentPivotCol < columnCount && currentPivotRow < rowCount;
      currentPivotCol++
    ) {
      let maxElementRow = currentPivotRow;
      let maxAbsoluteValue = Math.abs(
        resultMatrix.get(maxElementRow, currentPivotCol)
      );
      for (
        let rowIndex = currentPivotRow + 1;
        rowIndex < rowCount;
        rowIndex++
      ) {
        const currentAbsoluteValue = Math.abs(
          resultMatrix.get(rowIndex, currentPivotCol)
        );
        if (currentAbsoluteValue > maxAbsoluteValue) {
          maxAbsoluteValue = currentAbsoluteValue;
          maxElementRow = rowIndex;
        }
      }

      if (maxAbsoluteValue < 1e-10) continue;

      if (maxElementRow !== currentPivotRow) {
        const tempRow = resultMatrix.data[currentPivotRow];
        resultMatrix.data[currentPivotRow] = resultMatrix.data[maxElementRow];
        resultMatrix.data[maxElementRow] = tempRow;
      }

      for (
        let rowIndex = currentPivotRow + 1;
        rowIndex < rowCount;
        rowIndex++
      ) {
        const eliminationFactor =
          resultMatrix.get(rowIndex, currentPivotCol) /
          resultMatrix.get(currentPivotRow, currentPivotCol);
        if (Math.abs(eliminationFactor) < 1e-10) continue;
        for (
          let colIndex = currentPivotCol;
          colIndex < columnCount;
          colIndex++
        ) {
          const newElementValue =
            resultMatrix.get(rowIndex, colIndex) -
            eliminationFactor * resultMatrix.get(currentPivotRow, colIndex);
          resultMatrix.set(
            rowIndex,
            colIndex,
            Math.abs(newElementValue) < 1e-10 ? 0 : newElementValue
          );
        }
        resultMatrix.set(rowIndex, currentPivotCol, 0);
      }

      currentPivotRow++;
    }

    return resultMatrix;
  }

  solve(augmentedMatrix) {
    if (!(augmentedMatrix instanceof Matrix)) {
      throw new Error("Argumento deve ser uma Matrix");
    }

    const equationCount = augmentedMatrix.rows;
    const augmentedColumnCount = augmentedMatrix.cols;
    if (augmentedColumnCount !== equationCount + 1) {
      throw new Error("solve: espera matriz aumentada");
    }

    for (let rowIndex = 0; rowIndex < equationCount; rowIndex++) {
      let isRowAllZeros = true;
      for (let colIndex = 0; colIndex < equationCount; colIndex++) {
        if (Math.abs(augmentedMatrix.get(rowIndex, colIndex)) > 1e-10) {
          isRowAllZeros = false;
          break;
        }
      }
      if (
        isRowAllZeros &&
        Math.abs(augmentedMatrix.get(rowIndex, equationCount)) > 1e-10
      ) {
        throw new Error("Sistema inconsistente");
      }
    }

    const solutionVector = new Array(equationCount).fill(0);
    for (let rowIndex = equationCount - 1; rowIndex >= 0; rowIndex--) {
      let substitutionSum = 0;
      for (let colIndex = rowIndex + 1; colIndex < equationCount; colIndex++) {
        substitutionSum +=
          augmentedMatrix.get(rowIndex, colIndex) * solutionVector[colIndex];
      }

      const pivotElement = augmentedMatrix.get(rowIndex, rowIndex);
      const constantTerm = augmentedMatrix.get(rowIndex, equationCount);

      if (Math.abs(pivotElement) < 1e-10) {
        if (Math.abs(constantTerm - substitutionSum) < 1e-10) {
          throw new Error(`Sistema indeterminado`);
        } else {
          throw new Error(`Sistema inconsistente`);
        }
      }

      solutionVector[rowIndex] =
        (constantTerm - substitutionSum) / pivotElement;
    }

    const solutionMatrixData = solutionVector.map((value) => [value]);
    return new Matrix(equationCount, 1, solutionMatrixData);
  }
}
