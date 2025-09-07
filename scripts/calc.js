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

  /**
   *  Somar duas matrizes ou dois vetores.
   * @param {Matrix|Vector} a -  A matriz ou o vetor a ser somado.
   * @param {Matrix|Vector} b -  A matriz ou o vetor a ser somado.
   * @returns {Matrix|Vector} - Uma matriz ou vetor resultante da soma.
   */
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

  /**
   *  multiplicar duas matrizes.
   * @param {Matrix|Vector} a - A matriz ou o vetor a ser multiplicado.
   * @param {Matrix|Vector} b - A matriz ou o vetor a ser multiplicado.
   * @returns {Matrix|Vector} - Uma matriz resultante da operação de multiplicação de matrizes.
   */
  dot(a, b) {
    if (a instanceof Matrix && b instanceof Matrix) {
      if (a.cols !== b.rows) {
        throw new Error(
          `Dimensões incompatíveis para multiplicação de matrizes: ${a.rows}x${a.cols} * ${b.rows}x${b.cols}`
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
          "Os vetores devem ter a mesma dimensão para o produto escalar"
        );
      }

      let result = 0;
      for (let i = 0; i < a.dim; i++) {
        result += a.get(i) * b.get(i);
      }

      return result;
    }

    if (a instanceof Matrix && b instanceof Vector) {
      if (a.cols !== b.dim) {
        throw new Error(
          `Dimensões incompatíveis para multiplicação matriz-vetor: ${a.rows}x${a.cols} * ${b.dim}`
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

    // Multiplicação vetor por matriz
    if (a instanceof Vector && b instanceof Matrix) {
      if (a.dim !== b.rows) {
        throw new Error(
          `Dimensões incompatíveis para multiplicação vetor-matriz: ${a.dim} * ${b.rows}x${b.cols}`
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

    throw new Error("Argumentos devem ser instâncias de Matrix ou Vector");
  }
  // ...existing code...

  /**
   *  Realizar a eliminação gaussiana em uma Matriz.
   * @param {Matrix} a - A matriz a qual deve-se realizar a eliminação gaussiana.
   * @returns {Matrix|Vector} -  Uma matriz com o resultado da eliminação gaussiana
   */
  gauss(a) {}

  /**
   *  sistema de equações lineares.
   * @param {Matrix} a - A matriz aumentada na qual deve-se realizar a eliminação gaussiana.
   * @returns {Matrix|Vector} -  Uma matriz com o resultado do sistema de equações lineares.
   */
  solve(a) {}
}

const la = new LinearAlgebra();
const m1 = new Vector(2, [
  [1, 2, 4],
  [2, 6, 0],
]);
const v2 = new Vector(2, [7, 8, 3]);

const product = la.dot(m1, v2);

console.log("Produto Escalar:", {
  product: product.data,
});
