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
      throw new Error("O argumento deve ser uma Matrix");
    }

    const numberOfRows = inputMatrix.rows;
    const numberOfColumns = inputMatrix.cols;
    const matrixClone = inputMatrix.data.map((row) => [...row]);

    for (
      let currentColumn = 0;
      currentColumn < Math.min(numberOfRows, numberOfColumns - 1);
      currentColumn++
    ) {
      /*
       * 1. Encontrar o melhor pivô(linha com maior valor absoluto na coluna atual)
       */
      let bestPivotRow = currentColumn;
      let maxPivotValue = Math.abs(matrixClone[currentColumn][currentColumn]);

      for (
        let rowIndex = currentColumn + 1;
        rowIndex < numberOfRows;
        rowIndex++
      ) {
        if (Math.abs(matrixClone[rowIndex][currentColumn]) > maxPivotValue) {
          maxPivotValue = Math.abs(matrixClone[rowIndex][currentColumn]);
          bestPivotRow = rowIndex;
        }
      }

      /*
       * maxPivotValue < 1e-10 (0.0000000001)  significa que o valor do pivô é muito próximo de zero,
       */
      if (maxPivotValue < 1e-10) continue;

      /*
       * 2. Trocar linhas (se necessário)
       */
      if (bestPivotRow !== currentColumn) {
        [matrixClone[currentColumn], matrixClone[bestPivotRow]] = [
          matrixClone[bestPivotRow],
          matrixClone[currentColumn],
        ];
      }

      // 3. Eliminação abaixo do pivô
      for (
        let targetRow = currentColumn + 1;
        targetRow < numberOfRows;
        targetRow++
      ) {
        if (Math.abs(matrixClone[targetRow][currentColumn]) < 1e-10) continue;

        const eliminationFactor =
          matrixClone[targetRow][currentColumn] /
          matrixClone[currentColumn][currentColumn];

        /*
         * L1 = L1 - fator * L2
         */
        for (
          let elementIndex = currentColumn;
          elementIndex < numberOfColumns;
          elementIndex++
        ) {
          matrixClone[targetRow][elementIndex] -=
            eliminationFactor * matrixClone[currentColumn][elementIndex];
        }
      }
    }

    return new Matrix(numberOfRows, numberOfColumns, matrixClone);
  }

  solve(augmentedMatrix) {
    const totalRows = augmentedMatrix.rows;
    const totalColumns = augmentedMatrix.cols;
    const matrixClone = augmentedMatrix.data.map((row) => [...row]);
    const solutionVector = Array(totalRows).fill(0);

    for (let currentRow = totalRows - 1; currentRow >= 0; currentRow--) {
      let knownTermsSum = 0;
      for (
        let variableIndex = currentRow + 1;
        variableIndex < totalRows;
        variableIndex++
      ) {
        knownTermsSum +=
          matrixClone[currentRow][variableIndex] *
          solutionVector[variableIndex];
      }

      const diagonalCoefficient = matrixClone[currentRow][currentRow];
      const constantTerm =
        matrixClone[currentRow][totalColumns - 1] - knownTermsSum;

      // Verificação de sistema sem solução única
      if (Math.abs(diagonalCoefficient) < 1e-10) {
        if (Math.abs(constantTerm) < 1e-10) {
          throw new Error("Sistema indeterminado (infinitas soluções).");
        } else {
          throw new Error("Sistema impossível (sem solução).");
        }
      }

      solutionVector[currentRow] = constantTerm / diagonalCoefficient;
    }

    return new Matrix(
      totalRows,
      1,
      solutionVector.map((value) => [value])
    );
  }
}
