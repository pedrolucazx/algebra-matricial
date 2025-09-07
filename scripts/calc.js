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

    // Criar uma cópia da matriz para não modificar a original
    const resultData = [];
    for (let i = 0; i < a.rows; i++) {
      resultData[i] = [];
      for (let j = 0; j < a.cols; j++) {
        resultData[i][j] = a.get(i, j);
      }
    }

    const result = new Matrix(a.rows, a.cols, resultData);

    // Eliminação gaussiana (Gauss-Jordan) para formar escalonada reduzida
    for (let i = 0; i < Math.min(result.rows, result.cols); i++) {
      // Encontrar o pivô (elemento não zero na coluna i a partir da linha i)
      let pivotRow = i;
      for (let k = i + 1; k < result.rows; k++) {
        if (Math.abs(result.get(k, i)) > Math.abs(result.get(pivotRow, i))) {
          pivotRow = k;
        }
      }

      // Se o pivô é zero, pular esta coluna
      if (Math.abs(result.get(pivotRow, i)) < 1e-10) {
        continue;
      }

      // Trocar linhas se necessário
      if (pivotRow !== i) {
        for (let j = 0; j < result.cols; j++) {
          const temp = result.get(i, j);
          result.set(i, j, result.get(pivotRow, j));
          result.set(pivotRow, j, temp);
        }
      }

      // Normalizar a linha do pivô (fazer o pivô = 1)
      const pivot = result.get(i, i);
      for (let j = 0; j < result.cols; j++) {
        result.set(i, j, result.get(i, j) / pivot);
      }

      // Eliminar todas as outras linhas (acima e abaixo do pivô)
      for (let k = 0; k < result.rows; k++) {
        if (k !== i && Math.abs(result.get(k, i)) > 1e-10) {
          const factor = result.get(k, i);
          for (let j = 0; j < result.cols; j++) {
            result.set(k, j, result.get(k, j) - factor * result.get(i, j));
          }
        }
      }
    }

    // Limpar pequenos erros de ponto flutuante
    for (let i = 0; i < result.rows; i++) {
      for (let j = 0; j < result.cols; j++) {
        const value = result.get(i, j);
        if (Math.abs(value) < 1e-10) {
          result.set(i, j, 0);
        } else if (Math.abs(value - Math.round(value)) < 1e-10) {
          result.set(i, j, Math.round(value));
        } else if (Math.abs(value - Math.round(value * 2) / 2) < 1e-10) {
          result.set(i, j, Math.round(value * 2) / 2);
        }
      }
    }

    return result;
  }

  solve(a) {
    if (!(a instanceof Matrix)) {
      throw new Error("Argumento deve ser uma instância de Matrix");
    }

    // Verificar se o sistema tem solução
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

    // Encontrar variáveis livres e de base
    const pivotCols = [];
    const freeVars = [];

    for (let i = 0; i < n; i++) {
      let pivotCol = -1;
      for (let j = 0; j < m; j++) {
        if (Math.abs(a.get(i, j)) > 1e-10) {
          pivotCol = j;
          break;
        }
      }
      if (pivotCol !== -1) {
        pivotCols.push(pivotCol);
      }
    }

    // Identificar variáveis livres
    for (let j = 0; j < m; j++) {
      if (!pivotCols.includes(j)) {
        freeVars.push(j);
      }
    }

    if (freeVars.length > 0) {
      // Sistema com infinitas soluções - retornar solução particular
      const solution = new Array(m).fill(0);

      // Para cada linha com pivô, calcular o valor da variável de base
      let rowIndex = 0;
      for (const pivotCol of pivotCols) {
        // Encontrar a linha correspondente a este pivô
        while (rowIndex < n && Math.abs(a.get(rowIndex, pivotCol)) < 1e-10) {
          rowIndex++;
        }
        if (rowIndex < n) {
          solution[pivotCol] = a.get(rowIndex, m); // termo independente
          rowIndex++;
        }
      }

      return new Vector(m, solution);
    } else {
      // Sistema com solução única
      const solution = new Array(m).fill(0);

      // Extrair a solução da matriz escalonada reduzida
      for (let i = 0; i < Math.min(n, m); i++) {
        // Encontrar o pivô nesta linha
        let pivotCol = -1;
        for (let j = 0; j < m; j++) {
          if (Math.abs(a.get(i, j)) > 1e-10) {
            pivotCol = j;
            break;
          }
        }

        if (pivotCol !== -1) {
          solution[pivotCol] = a.get(i, m); // termo independente
        }
      }

      return new Vector(m, solution);
    }
  }
}

// ============================================
// DEMONSTRAÇÕES DAS CLASSES E MÉTODOS
// ============================================

console.log("=".repeat(50));
console.log("DEMONSTRAÇÃO DAS CLASSES DE ÁLGEBRA LINEAR");
console.log("=".repeat(50));

// Instanciar a classe LinearAlgebra
const la = new LinearAlgebra();

// ============================================
// DEMONSTRAÇÃO DA CLASSE MATRIX
// ============================================
console.log("\n📊 CLASSE MATRIX:");
console.log("-".repeat(30));

// Criar matrizes de exemplo
const matrixA = new Matrix(2, 3, [
  [1, 2, 3],
  [4, 5, 6],
]);

const matrixB = new Matrix(2, 3, [
  [7, 8, 9],
  [10, 11, 12],
]);

const matrixC = new Matrix(3, 2, [
  [1, 2],
  [3, 4],
  [5, 6],
]);

console.log("Matriz A (2x3):");
console.log(matrixA.data);
console.log("\nMétodos da Matriz A:");
console.log(`get(0, 1): ${matrixA.get(0, 1)}`);
console.log(`get(1, 2): ${matrixA.get(1, 2)}`);

// Demonstrar set
matrixA.set(0, 0, 99);
console.log(`Após set(0, 0, 99): get(0, 0) = ${matrixA.get(0, 0)}`);
matrixA.set(0, 0, 1); // Restaurar valor original

console.log("\nMatriz B (2x3):");
console.log(matrixB.data);

console.log("\nMatriz C (3x2):");
console.log(matrixC.data);

// ============================================
// DEMONSTRAÇÃO DA CLASSE VECTOR
// ============================================
console.log("\n📐 CLASSE VECTOR:");
console.log("-".repeat(30));

const vectorX = new Vector(3, [1, 2, 3]);
const vectorY = new Vector(3, [4, 5, 6]);

console.log("Vetor X:");
console.log(vectorX.data);
console.log("\nMétodos do Vetor X:");
console.log(`get(0): ${vectorX.get(0)}`);
console.log(`get(2): ${vectorX.get(2)}`);

// Demonstrar set
vectorX.set(1, 99);
console.log(`Após set(1, 99): get(1) = ${vectorX.get(1)}`);
vectorX.set(1, 2); // Restaurar valor original

console.log("\nVetor Y:");
console.log(vectorY.data);

// ============================================
// DEMONSTRAÇÃO DA CLASSE LINEARALGEBRA
// ============================================
console.log("\n🔢 CLASSE LINEARALGEBRA:");
console.log("-".repeat(30));

// 1. MÉTODO TRANSPOSE
console.log("\n1️⃣ MÉTODO TRANSPOSE:");
console.log("Matriz A original:");
console.log(matrixA.data);
const transposeA = la.transpose(matrixA);
console.log("Transposta de A:");
console.log(transposeA.data);

console.log("\nVetor X original:");
console.log(vectorX.data);
const transposeX = la.transpose(vectorX);
console.log("Transposta de X:");
console.log(transposeX.data);

// 2. MÉTODO SUM
console.log("\n2️⃣ MÉTODO SUM:");
console.log("Soma de matrizes A + B:");
const sumMatrices = la.sum(matrixA, matrixB);
console.log(sumMatrices.data);

console.log("\nSoma de vetores X + Y:");
const sumVectors = la.sum(vectorX, vectorY);
console.log(sumVectors.data);

// 3. MÉTODO TIMES
console.log("\n3️⃣ MÉTODO TIMES:");
console.log("Multiplicação escalar: 2 * Matriz A:");
const scalarMatrix = la.times(2, matrixA);
console.log(scalarMatrix.data);

console.log("\nMultiplicação escalar: 3 * Vetor X:");
const scalarVector = la.times(3, vectorX);
console.log(scalarVector.data);

console.log("\nMultiplicação de matrizes A * C:");
const matrixProduct = la.times(matrixA, matrixC);
console.log(matrixProduct.data);

console.log("\nMultiplicação elemento a elemento de vetores X * Y:");
const vectorProduct = la.times(vectorX, vectorY);
console.log(vectorProduct.data);

// 4. MÉTODO DOT
console.log("\n4️⃣ MÉTODO DOT:");
console.log("Produto matricial A · C:");
const dotMatrices = la.dot(matrixA, matrixC);
console.log(dotMatrices.data);

// Criar vetor compatível para demonstrar dot produto vetor-matriz
const vectorZ = new Vector(2, [1, 2]);
console.log("\nVetor Z (dimensão 2):");
console.log(vectorZ.data);
console.log("Produto vetor-matriz Z · A:");
const dotVectorMatrix = la.dot(vectorZ, matrixA);
console.log(dotVectorMatrix.data);

console.log("\nProduto matriz-vetor C · vectorZ:");
const dotMatrixVector = la.dot(matrixC, vectorZ);
console.log(dotMatrixVector.data);

// 5. MÉTODO GAUSS
console.log("\n5️⃣ MÉTODO GAUSS:");
// Criar uma matriz para eliminação gaussiana
const systemMatrix = new Matrix(3, 4, [
  [2, 1, -1, 8],
  [-3, -1, 2, -11],
  [-2, 1, 2, -3],
]);

console.log("Matriz do sistema original:");
console.log(systemMatrix.data);

const gaussResult = la.gauss(systemMatrix);
console.log("Matriz após eliminação gaussiana:");
console.log(gaussResult.data);

// 6. MÉTODO SOLVE
console.log("\n6️⃣ MÉTODO SOLVE:");
console.log("Solução do sistema linear:");
const solution = la.solve(gaussResult);
console.log("Vetor solução:", solution.data);

// Verificar a solução
console.log("\nVerificação da solução:");
console.log("x =", solution.get(0));
console.log("y =", solution.get(1));
console.log("z =", solution.get(2));

// Exemplo com sistema que tem infinitas soluções
console.log("\n📝 EXEMPLO COM INFINITAS SOLUÇÕES:");
const infiniteSolutionsMatrix = new Matrix(2, 3, [
  [1, 2, 5],
  [2, 4, 10],
]);

console.log("Matriz do sistema com infinitas soluções:");
console.log(infiniteSolutionsMatrix.data);

const gaussInfinite = la.gauss(infiniteSolutionsMatrix);
console.log("Após eliminação gaussiana:");
console.log(gaussInfinite.data);

try {
  const infiniteSolution = la.solve(gaussInfinite);
  console.log("Solução particular:", infiniteSolution.data);
} catch (error) {
  console.log("Erro:", error.message);
}

// Exemplo com sistema inconsistente
console.log("\n❌ EXEMPLO COM SISTEMA INCONSISTENTE:");
const inconsistentMatrix = new Matrix(3, 4, [
  [1, 1, 0, 2],
  [1, 1, 0, 3],
  [0, 0, 1, 1],
]);

console.log("Matriz do sistema inconsistente:");
console.log(inconsistentMatrix.data);

const gaussInconsistent = la.gauss(inconsistentMatrix);
console.log("Após eliminação gaussiana:");
console.log(gaussInconsistent.data);

try {
  const inconsistentSolution = la.solve(gaussInconsistent);
  console.log("Solução:", inconsistentSolution.data);
} catch (error) {
  console.log("Erro:", error.message);
}

console.log("\n" + "=".repeat(50));
console.log("FIM DAS DEMONSTRAÇÕES");
console.log("=".repeat(50));
