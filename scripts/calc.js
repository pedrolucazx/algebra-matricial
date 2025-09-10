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

    if (a instanceof Vector && b instanceof Matrix) {
      if (a.dim !== b.rows) {
        throw new Error(
          `Dimensões incompatíveis para multiplicação vetor-matriz: vetor dimensão ${a.dim} * matriz ${b.rows}x${b.cols}. A dimensão do vetor deve ser igual ao número de linhas da matriz.`
        );
      }

      const resultData = [];
      for (let j = 0; j < b.cols; j++) {
        let sum = 0;
        for (let i = 0; i < a.dim; i++) {
          sum += a.get(i) * b.get(i, j);
        }
        resultData[j] = sum;
      }
      return new Vector(b.cols, resultData);
    }

    if (a instanceof Matrix && b instanceof Vector) {
      if (a.cols !== b.dim) {
        throw new Error(
          `Dimensões incompatíveis para multiplicação matriz-vetor: matriz ${a.rows}x${a.cols} * vetor dimensão ${b.dim}. O número de colunas da matriz deve ser igual à dimensão do vetor.`
        );
      }

      const resultData = [];
      for (let i = 0; i < a.rows; i++) {
        let sum = 0;
        for (let j = 0; j < a.cols; j++) {
          sum += a.get(i, j) * b.get(j);
        }
        resultData[i] = sum;
      }
      return new Vector(a.rows, resultData);
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

    throw new Error("Argumentos devem ser instâncias de Matrix ou Vector");
  }

  gauss(a) {
    if (!(a instanceof Matrix)) {
      throw new Error("Argumento deve ser uma instância de Matrix");
    }

    const result = new Matrix(
      a.rows,
      a.cols,
      a.data.map((row) => [...row])
    );

    const n = result.rows;
    const m = result.cols;

    // FASE 1: Zerar elementos abaixo do pivô da primeira coluna
    let pivotRow = 0;
    let pivotCol = 0;

    // Validação do pivô
    if (Math.abs(result.get(pivotRow, pivotCol)) < 1e-10) {
      // Procurar linha abaixo com elemento não-nulo
      let found = false;
      for (let i = pivotRow + 1; i < n; i++) {
        if (Math.abs(result.get(i, pivotCol)) > 1e-10) {
          const temp = result.data[pivotRow];
          result.data[pivotRow] = result.data[i];
          result.data[i] = temp;
          found = true;
          break;
        }
      }
      if (!found) {
        throw new Error(
          "Sistema não possui solução única (pivô zero na coluna 0)"
        );
      }
    }

    // Eliminação abaixo do pivô da primeira coluna
    for (let i = pivotRow + 1; i < n; i++) {
      const k = result.get(i, pivotCol) / result.get(pivotRow, pivotCol);
      for (let j = pivotCol; j < m; j++) {
        const newValue = result.get(i, j) - k * result.get(pivotRow, j);
        result.set(i, j, newValue);
      }
      // Zerar explicitamente o elemento abaixo do pivô
      result.set(i, pivotCol, 0);
    }

    // FASE 2: Zerar elementos abaixo do pivô da segunda coluna
    pivotRow = 1;
    pivotCol = 1;

    // Validação do pivô
    if (Math.abs(result.get(pivotRow, pivotCol)) < 1e-10) {
      // Procurar linha abaixo com elemento não-nulo
      let found = false;
      for (let i = pivotRow + 1; i < n; i++) {
        if (Math.abs(result.get(i, pivotCol)) > 1e-10) {
          // Troca de linhas
          const temp = result.data[pivotRow];
          result.data[pivotRow] = result.data[i];
          result.data[i] = temp;
          found = true;
          break;
        }
      }
      if (!found) {
        throw new Error(
          "Sistema não possui solução única (pivô zero na coluna 1)"
        );
      }
    }

    // Eliminação abaixo do pivô da segunda coluna
    for (let i = pivotRow + 1; i < n; i++) {
      const v = result.get(i, pivotCol) / result.get(pivotRow, pivotCol);
      for (let j = pivotCol; j < m; j++) {
        const newValue = result.get(i, j) - v * result.get(pivotRow, j);
        result.set(i, j, newValue);
      }
      // Zerar explicitamente o elemento abaixo do pivô
      result.set(i, pivotCol, 0);
    }

    return result;
  }

  solve(a) {
    if (!(a instanceof Matrix)) {
      throw new Error("Argumento deve ser uma instância de Matrix");
    }

    const n = a.rows;
    const m = a.cols - 1; // número de variáveis (última coluna é dos termos independentes)

    // Verificar inconsistência: linha da forma [0 0 ... 0 | c] onde c ≠ 0
    for (let i = 0; i < n; i++) {
      let allZeros = true;
      for (let j = 0; j < m; j++) {
        if (Math.abs(a.get(i, j)) > 1e-10) {
          allZeros = false;
          break;
        }
      }
      if (allZeros && Math.abs(a.get(i, m)) > 1e-10) {
        throw new Error("Sistema inconsistente: não há solução");
      }
    }

    const x3 = a.get(2, 3) / a.get(2, 2);
    const x2 = (a.get(1, 3) - a.get(1, 2) * x3) / a.get(1, 1);
    const x1 =
      (a.get(0, 3) - a.get(0, 2) * x3 - a.get(0, 1) * x2) / a.get(0, 0);

    return new Vector(3, [x1, x2, x3]);
  }
}
