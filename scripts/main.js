document.addEventListener("DOMContentLoaded", () => {
  const typeSelect = document.getElementById("type-select");
  const rowsInput = document.getElementById("init-rows");
  const colsInput = document.getElementById("init-cols");
  const generateBtn = document.getElementById("generate-btn");
  const matricesContainer = document.getElementById("matrices");

  // Elementos da área de operações
  const operationSelect = document.getElementById("operation-select");
  const operandASelect = document.getElementById("operand-a-select");
  const operandBSelect = document.getElementById("operand-b-select");
  const operandBLabel = document.getElementById("operand-b-label");
  const scalarInputContainer = document.getElementById(
    "scalar-input-container"
  );
  const scalarInput = document.getElementById("scalar-input");
  const executeBtn = document.getElementById("execute-operation-btn");
  const operationResult = document.getElementById("operation-result");
  const resultDisplay = document.getElementById("result-display");

  // Elementos dos exemplos
  const loadDemoMatricesBtn = document.getElementById("load-demo-matrices");
  const loadDemoVectorsBtn = document.getElementById("load-demo-vectors");
  const loadSystemDemoBtn = document.getElementById("load-system-demo");
  const clearAllBtn = document.getElementById("clear-all");

  let createdObjects = {};
  let nextLetterCode = 65;
  const linearAlgebra = new LinearAlgebra();
  // Add a variable to store current operation result
  let currentOperationResult = null;

  // Operações que precisam de dois operandos
  const twoOperandOperations = ["sum", "times", "dot"];
  // Operações que aceitam escalar como primeiro operando
  const scalarOperations = ["times"];

  // Função para criar exemplos pré-definidos
  function loadDemoMatrices() {
    clearAll();

    // Matriz A (2x3) - igual à demonstração
    createPredefinedMatrix("A", "matrix", 2, 3, [
      [1, 2, 3],
      [4, 5, 6],
    ]);

    // Matriz B (2x3) - igual à demonstração
    createPredefinedMatrix("B", "matrix", 2, 3, [
      [7, 8, 9],
      [10, 11, 12],
    ]);

    // Matriz C (3x2) - igual à demonstração
    createPredefinedMatrix("C", "matrix", 3, 2, [
      [1, 2],
      [3, 4],
      [5, 6],
    ]);

    showMessage(
      "Matrizes de demonstração carregadas! Experimente as operações.",
      "success"
    );
  }

  function loadDemoVectors() {
    clearAll();

    // Vetor X - igual à demonstração
    createPredefinedMatrix("X", "vector", 1, 3, [[1, 2, 3]]);

    // Vetor Y - igual à demonstração
    createPredefinedMatrix("Y", "vector", 1, 3, [[4, 5, 6]]);

    // Vetor Z (2D) - igual à demonstração
    createPredefinedMatrix("Z", "vector", 1, 2, [[1, 2]]);

    showMessage(
      "Vetores de demonstração carregados! Experimente as operações.",
      "success"
    );
  }

  function loadSystemDemo() {
    clearAll();

    // Sistema linear da demonstração
    createPredefinedMatrix("S", "matrix", 3, 4, [
      [2, 1, -1, 8],
      [-3, -1, 2, -11],
      [-2, 1, 2, -3],
    ]);

    // Sistema com infinitas soluções
    createPredefinedMatrix("I", "matrix", 2, 3, [
      [1, 2, 5],
      [2, 4, 10],
    ]);

    // Sistema inconsistente
    createPredefinedMatrix("N", "matrix", 3, 4, [
      [1, 1, 0, 2],
      [1, 1, 0, 3],
      [0, 0, 1, 1],
    ]);

    showMessage(
      "Sistemas lineares carregados! S: solução única, I: infinitas soluções, N: inconsistente.",
      "success"
    );
  }

  function createPredefinedMatrix(name, type, rows, cols, data) {
    createCard(name, type, rows, cols);

    if (type === "matrix") {
      const elements = data;
      createdObjects[name] = new Matrix(rows, cols, elements);
    } else {
      const elements = data[0];
      createdObjects[name] = new Vector(cols, elements);
    }

    // Atualizar visualização
    const card = document.getElementById(`card-${name}`);
    const saveBtn = card.querySelector(".btn");

    updateCardDisplay(card, name, type, rows, cols);
    saveBtn.textContent = "Editar";
    updateOperandSelects();
  }

  function clearAll() {
    createdObjects = {};
    nextLetterCode = 65;
    matricesContainer.innerHTML = "";
    operationResult.style.display = "none";
    updateOperandSelects();
  }

  function showMessage(text, type = "success") {
    const messageClass = type === "error" ? "error-message" : "success-message";
    const messageDiv = document.createElement("div");
    messageDiv.className = messageClass;
    messageDiv.textContent = text;

    // Remover mensagens anteriores
    const existingMessages = document.querySelectorAll(
      ".error-message, .success-message"
    );
    existingMessages.forEach((msg) => msg.remove());

    // Adicionar nova mensagem
    document
      .querySelector(".container")
      .insertBefore(messageDiv, document.getElementById("matrices"));

    // Remover após 5 segundos
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.remove();
      }
    }, 5000);
  }

  // Event listeners para os botões de exemplo
  loadDemoMatricesBtn.addEventListener("click", loadDemoMatrices);
  loadDemoVectorsBtn.addEventListener("click", loadDemoVectors);
  loadSystemDemoBtn.addEventListener("click", loadSystemDemo);
  clearAllBtn.addEventListener("click", clearAll);

  // Atualizar selects de operandos quando objetos são criados/removidos
  function updateOperandSelects() {
    // Limpar opções existentes
    operandASelect.innerHTML = '<option value="">Selecione</option>';
    operandBSelect.innerHTML = '<option value="">Selecione</option>';

    // Adicionar objetos criados
    Object.keys(createdObjects).forEach((name) => {
      const objType =
        createdObjects[name] instanceof Matrix ? "Matriz" : "Vetor";
      const optionA = document.createElement("option");
      optionA.value = name;
      optionA.textContent = `${objType} ${name}`;
      operandASelect.appendChild(optionA);

      const optionB = document.createElement("option");
      optionB.value = name;
      optionB.textContent = `${objType} ${name}`;
      operandBSelect.appendChild(optionB);
    });
  }

  // Controlar visibilidade dos campos baseado na operação selecionada
  operationSelect.addEventListener("change", () => {
    const operation = operationSelect.value;

    if (twoOperandOperations.includes(operation)) {
      operandBLabel.style.display = "flex";
    } else {
      operandBLabel.style.display = "none";
      operandBSelect.value = "";
    }

    if (scalarOperations.includes(operation)) {
      scalarInputContainer.style.display = "block";
    } else {
      scalarInputContainer.style.display = "none";
      scalarInput.value = "";
    }

    updateExecuteButtonState();
  });

  // Atualizar estado do botão executar
  function updateExecuteButtonState() {
    const operation = operationSelect.value;
    const operandA = operandASelect.value;
    const operandB = operandBSelect.value;
    const scalar = scalarInput.value;

    let canExecute = false;

    if (operation && operandA) {
      if (twoOperandOperations.includes(operation)) {
        // Para operações que precisam de dois operandos
        if (operation === "times" && scalar !== "") {
          // Multiplicação por escalar
          canExecute = true;
        } else if (operandB) {
          // Operação entre dois objetos
          canExecute = true;
        }
      } else {
        // Operações que precisam apenas de um operando
        canExecute = true;
      }
    }

    executeBtn.disabled = !canExecute;
  }

  operandASelect.addEventListener("change", updateExecuteButtonState);
  operandBSelect.addEventListener("change", updateExecuteButtonState);
  scalarInput.addEventListener("input", updateExecuteButtonState);

  // Executar operação
  executeBtn.addEventListener("click", () => {
    const operation = operationSelect.value;
    const operandAName = operandASelect.value;
    const operandBName = operandBSelect.value;
    const scalar = parseFloat(scalarInput.value);

    if (!operation || !operandAName) return;

    const operandA = createdObjects[operandAName];
    const operandB = operandBName ? createdObjects[operandBName] : null;

    let result = null;
    let operationInfo = "";

    try {
      switch (operation) {
        case "transpose":
          result = linearAlgebra.transpose(operandA);
          operationInfo = `Transposta de ${operandAName}`;
          break;
        case "sum":
          if (operandB) {
            result = linearAlgebra.sum(operandA, operandB);
            operationInfo = `${operandAName} + ${operandBName}`;
          }
          break;
        case "times":
          if (!isNaN(scalar) && scalarInput.value !== "") {
            result = linearAlgebra.times(scalar, operandA);
            operationInfo = `${scalar} × ${operandAName} (multiplicação escalar)`;
          } else if (operandB) {
            result = linearAlgebra.times(operandA, operandB);
            operationInfo = `${operandAName} × ${operandBName} (elemento a elemento)`;
          }
          break;
        case "dot":
          if (operandB) {
            result = linearAlgebra.dot(operandA, operandB);
            operationInfo = `${operandAName} · ${operandBName} (produto matricial)`;
          }
          break;
        case "gauss":
          result = linearAlgebra.gauss(operandA);
          operationInfo = `Eliminação Gaussiana de ${operandAName}`;
          break;
        case "solve":
          result = linearAlgebra.solve(operandA);
          operationInfo = `Solução do sistema linear ${operandAName}`;
          break;
      }

      if (result) {
        currentOperationResult = result;
        displayResult(result, operation, operationInfo);
        console.log(`Operação ${operation} executada:`, result);
      } else {
        currentOperationResult = null;
        showMessage(
          "Erro ao executar a operação. Verifique os parâmetros.",
          "error"
        );
      }
    } catch (error) {
      currentOperationResult = null;
      console.error("Erro na operação:", error);
      showMessage(`Erro: ${error.message}`, "error");
    }
  });

  // Exibir resultado melhorado
  function displayResult(result, operationName, operationInfo) {
    resultDisplay.innerHTML = "";

    // Adicionar informação da operação
    const infoDiv = document.createElement("div");
    infoDiv.className = "result-operation-info";
    infoDiv.textContent = operationInfo;
    resultDisplay.appendChild(infoDiv);

    const isMatrix = result instanceof Matrix;
    const isVector = result instanceof Vector;

    if (!isMatrix && !isVector) {
      const valueDiv = document.createElement("div");
      valueDiv.textContent = `Resultado: ${result}`;
      valueDiv.style.marginTop = "8px";
      valueDiv.style.fontWeight = "600";
      resultDisplay.appendChild(valueDiv);
      operationResult.style.display = "block";
      return;
    }

    // Criar visualização similar às matrizes/vetores
    const resultContainer = document.createElement("div");
    resultContainer.className = "matrix-visual";
    resultContainer.style.justifyContent = "flex-start";
    resultContainer.style.marginTop = "8px";

    const parenLeft = document.createElement("div");
    parenLeft.className = "paren";
    parenLeft.textContent = isMatrix ? "(" : "[";

    const grid = document.createElement("div");
    grid.className = "matrix-grid";

    if (isMatrix) {
      grid.style.gridTemplateColumns = `repeat(${result.cols}, 1fr)`;
      for (let i = 0; i < result.rows; i++) {
        for (let j = 0; j < result.cols; j++) {
          const cell = document.createElement("span");
          cell.className = "element-input";
          cell.style.border = "1px solid transparent";
          cell.style.background = "#f8fafc";
          cell.style.fontWeight = "500";
          const value = result.get(i, j);
          cell.textContent = value;
          grid.appendChild(cell);
        }
      }
    } else {
      grid.style.gridTemplateColumns = `repeat(${result.dim}, 1fr)`;
      for (let i = 0; i < result.dim; i++) {
        const cell = document.createElement("span");
        cell.className = "element-input";
        cell.style.border = "1px solid transparent";
        cell.style.background = "#f8fafc";
        cell.style.fontWeight = "500";
        const value = result.get(i);
        cell.textContent = value;
        grid.appendChild(cell);
      }
    }

    const parenRight = document.createElement("div");
    parenRight.className = "paren";
    parenRight.textContent = isMatrix ? ")" : "]";

    resultContainer.appendChild(parenLeft);
    resultContainer.appendChild(grid);
    resultContainer.appendChild(parenRight);

    resultDisplay.appendChild(resultContainer);

    // Adicionar informações extras para algumas operações
    if (operationName === "solve") {
      const solutionInfo = document.createElement("div");
      solutionInfo.className = "step-result";
      solutionInfo.innerHTML = `
        <div class="step-title">Interpretação da Solução:</div>
        ${
          isVector
            ? result.data
                .map((val, i) => `X<sub>${i + 1}</sub> = ${val}`)
                .join(", ")
            : "Resultado não é um vetor"
        }
      `;
      resultDisplay.appendChild(solutionInfo);
    }

    if (operationName === "gauss") {
      const gaussInfo = document.createElement("div");
      gaussInfo.className = "step-result";
      function formatEquation(row) {
        const variables = ["x", "y", "z", "w", "u", "v"];
        let equation = "";
        let isFirstTerm = true;

        for (let i = 0; i < row.length - 1; i++) {
          const coef = row[i];

          if (coef === 0) continue;

          if (coef > 0) {
            if (isFirstTerm) {
              equation += `${coef === 1 ? "" : coef}${variables[i]}`;
            } else {
              equation += ` + ${coef === 1 ? "" : coef}${variables[i]}`;
            }
          } else {
            if (isFirstTerm) {
              equation += `-${Math.abs(coef) === 1 ? "" : Math.abs(coef)}${
                variables[i]
              }`;
            } else {
              equation += ` - ${Math.abs(coef) === 1 ? "" : Math.abs(coef)}${
                variables[i]
              }`;
            }
          }

          isFirstTerm = false;
        }

        if (isFirstTerm) {
          equation = "0";
        }

        equation += ` = ${row[row.length - 1]}`;
        return equation;
      }

      let equationSystem = "";
      for (let i = 0; i < result.rows; i++) {
        const row = [];
        for (let j = 0; j < result.cols; j++) {
          row.push(result.get(i, j));
        }
        equationSystem += formatEquation(row) + "\n";
      }

      gaussInfo.innerHTML = `
        <div class="step-title">Sistema de equações após eliminação:</div>
        <pre>${equationSystem}</pre>
      `;

      resultDisplay.appendChild(gaussInfo);
    }

    operationResult.style.display = "block";
  }

  function updateCardDisplay(card, name, type, rows, cols) {
    const visualContainer = card.querySelector(".matrix-visual");
    const grid = visualContainer.querySelector(".matrix-grid");

    const displayGrid = document.createElement("div");
    displayGrid.className = "matrix-grid";
    displayGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    if (type === "matrix") {
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const cell = document.createElement("span");
          cell.className = "element-input";
          cell.style.border = "1px solid transparent";
          const value = createdObjects[name].get(i, j);
          cell.textContent = value;
          displayGrid.appendChild(cell);
        }
      }
    } else {
      for (let i = 0; i < cols; i++) {
        const cell = document.createElement("span");
        cell.className = "element-input";
        cell.style.border = "1px solid transparent";
        const value = createdObjects[name].get(i);
        cell.textContent = value;
        displayGrid.appendChild(cell);
      }
    }

    grid.replaceWith(displayGrid);
  }

  typeSelect.addEventListener("change", () => {
    if (typeSelect.value === "vector") {
      rowsInput.value = 1;
      rowsInput.disabled = true;
    } else {
      rowsInput.disabled = false;
    }
  });

  generateBtn.addEventListener("click", () => {
    if (nextLetterCode > 90) {
      showMessage("Limite de matrizes/vetores (A-Z) atingido.", "error");
      return;
    }

    const type = typeSelect.value;
    const rows = parseInt(rowsInput.value);
    const cols = parseInt(colsInput.value);
    const name = String.fromCharCode(nextLetterCode);

    if (
      (type === "matrix" && (rows < 1 || cols < 1)) ||
      (type === "vector" && cols < 1)
    ) {
      showMessage("As dimensões devem ser números positivos.", "error");
      return;
    }

    createCard(name, type, rows, cols);
    nextLetterCode++;
  });

  function createCard(name, type, rows, cols) {
    const card = document.createElement("div");
    card.className = "matrix-card";
    card.id = `card-${name}`;

    const cardHeader = document.createElement("div");
    cardHeader.className = "matrix-header";
    const cardName = document.createElement("span");
    cardName.className = "matrix-name";
    cardName.textContent = `${type === "matrix" ? "Matriz" : "Vetor"} ${name}`;

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.innerHTML = "&times;";

    cardHeader.appendChild(cardName);
    cardHeader.appendChild(removeBtn);

    const visualContainer = document.createElement("div");
    visualContainer.className = "matrix-visual";

    const parenLeft = document.createElement("div");
    parenLeft.className = "paren";
    parenLeft.textContent = type === "matrix" ? "(" : "[";

    const grid = document.createElement("div");
    grid.className = "matrix-grid";
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    const inputs = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const input = document.createElement("input");
        input.type = "number";
        input.className = "element-input";
        input.step = "any";
        input.placeholder = "0";
        grid.appendChild(input);
        inputs.push(input);
      }
    }

    const parenRight = document.createElement("div");
    parenRight.className = "paren";
    parenRight.textContent = type === "matrix" ? ")" : "]";

    visualContainer.appendChild(parenLeft);
    visualContainer.appendChild(grid);
    visualContainer.appendChild(parenRight);

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const saveBtn = document.createElement("button");
    saveBtn.className = "btn";
    saveBtn.textContent = "Salvar";

    actions.appendChild(saveBtn);

    card.appendChild(cardHeader);
    card.appendChild(visualContainer);
    card.appendChild(actions);

    matricesContainer.appendChild(card);

    saveBtn.addEventListener("click", () => {
      if (saveBtn.textContent === "Salvar" && !createdObjects[name]) {
        const elements = [];
        if (type === "matrix") {
          for (let i = 0; i < rows; i++) {
            const rowElements = [];
            for (let j = 0; j < cols; j++) {
              const val = parseFloat(inputs[i * cols + j].value);
              rowElements.push(isNaN(val) ? 0 : val);
            }
            elements.push(rowElements);
          }
          createdObjects[name] = new Matrix(rows, cols, elements);
        } else {
          for (let i = 0; i < cols; i++) {
            const val = parseFloat(inputs[i].value);
            elements.push(isNaN(val) ? 0 : val);
          }
          createdObjects[name] = new Vector(cols, elements);
        }

        updateCardDisplay(card, name, type, rows, cols);
        saveBtn.textContent = "Editar";
        console.log(`Objeto ${name} criado:`, createdObjects[name]);
        updateOperandSelects();
        showMessage(
          `${
            type === "matrix" ? "Matriz" : "Vetor"
          } ${name} criado com sucesso!`,
          "success"
        );
      } else if (saveBtn.textContent === "Salvar" && createdObjects[name]) {
        if (type === "matrix") {
          for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
              const val = parseFloat(inputs[i * cols + j].value);
              createdObjects[name].set(i, j, isNaN(val) ? 0 : val);
            }
          }
        } else {
          for (let i = 0; i < cols; i++) {
            const val = parseFloat(inputs[i].value);
            createdObjects[name].set(i, isNaN(val) ? 0 : val);
          }
        }

        updateCardDisplay(card, name, type, rows, cols);
        saveBtn.textContent = "Editar";
        console.log(`Objeto ${name} atualizado:`, createdObjects[name]);
        updateOperandSelects();
        showMessage(
          `${
            type === "matrix" ? "Matriz" : "Vetor"
          } ${name} atualizado com sucesso!`,
          "success"
        );
      } else if (saveBtn.textContent === "Editar") {
        const editGrid = document.createElement("div");
        editGrid.className = "matrix-grid";
        editGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

        const newInputs = [];
        if (type === "matrix") {
          for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
              const input = document.createElement("input");
              input.type = "number";
              input.className = "element-input";
              input.step = "any";
              input.value = createdObjects[name].get(i, j);
              editGrid.appendChild(input);
              newInputs.push(input);
            }
          }
        } else {
          for (let i = 0; i < cols; i++) {
            const input = document.createElement("input");
            input.type = "number";
            input.className = "element-input";
            input.step = "any";
            input.value = createdObjects[name].get(i);
            editGrid.appendChild(input);
            newInputs.push(input);
          }
        }

        const currentGrid = visualContainer.querySelector(".matrix-grid");
        currentGrid.replaceWith(editGrid);

        inputs.length = 0;
        inputs.push(...newInputs);
        saveBtn.textContent = "Salvar";
      }
    });

    removeBtn.addEventListener("click", () => {
      card.remove();
      delete createdObjects[name];
      updateOperandSelects();
      showMessage(
        `${type === "matrix" ? "Matriz" : "Vetor"} ${name} removido.`,
        "success"
      );
    });
  }

  document
    .getElementById("save-result-btn")
    .addEventListener("click", saveOperationResult);

  function saveOperationResult() {
    if (!currentOperationResult) {
      showMessage("Nenhum resultado disponível para salvar", "error");
      return;
    }

    const operation = operationSelect.value;
    const operandAName = operandASelect.value;
    const operandBName = operandBSelect.value;
    const scalarValue = scalarInput.value;

    let resultName = "";
    switch (operation) {
      case "transpose":
        resultName = `${operandAName}ᵀ`;
        break;
      case "sum":
        resultName = `${operandAName}+${operandBName}`;
        break;
      case "times":
        if (scalarValue && scalarValue !== "") {
          resultName = `${scalarValue}×${operandAName}`;
        } else {
          resultName = `${operandAName}×${operandBName}`;
        }
        break;
      case "dot":
        resultName = `${operandAName}·${operandBName}`;
        break;
      case "gauss":
        resultName = `G(${operandAName})`;
        break;
      case "solve":
        resultName = `Sol(${operandAName})`;
        break;
      default:
        resultName = `R${String.fromCharCode(nextLetterCode)}`;
        nextLetterCode++;
    }

    resultName = ensureUniqueName(resultName);

    const type = currentOperationResult instanceof Matrix ? "matrix" : "vector";

    if (type === "matrix") {
      const rows = currentOperationResult.rows;
      const cols = currentOperationResult.cols;
      const elements = [];

      for (let i = 0; i < rows; i++) {
        const rowElements = [];
        for (let j = 0; j < cols; j++) {
          rowElements.push(currentOperationResult.get(i, j));
        }
        elements.push(rowElements);
      }

      createPredefinedMatrix(resultName, type, rows, cols, elements);
    }
    // For vector, get dimension and elements
    else if (type === "vector") {
      const dim = currentOperationResult.dim;
      const elements = [];

      for (let i = 0; i < dim; i++) {
        elements.push(currentOperationResult.get(i));
      }

      createPredefinedMatrix(resultName, type, 1, dim, [elements]);
    }

    showMessage(
      `${
        type === "matrix" ? "Matriz" : "Vetor"
      } ${resultName} salvo com sucesso!`,
      "success"
    );
    operationResult.style.display = "none";
  }

  function ensureUniqueName(baseName) {
    // Get existing matrix names
    const existingNames = Object.keys(createdObjects);

    let name = baseName;
    let counter = 1;

    while (existingNames.includes(name)) {
      name = `${baseName}_${counter}`;
      counter++;
    }

    return name;
  }
});
