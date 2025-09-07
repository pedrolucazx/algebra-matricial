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

  let createdObjects = {};
  let nextLetterCode = 65;
  const linearAlgebra = new LinearAlgebra();

  // Operações que precisam de dois operandos
  const twoOperandOperations = ["sum", "times", "dot"];
  // Operações que aceitam escalar como primeiro operando
  const scalarOperations = ["times"];

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

    try {
      switch (operation) {
        case "transpose":
          result = linearAlgebra.transpose(operandA);
          break;
        case "sum":
          if (operandB) {
            result = linearAlgebra.sum(operandA, operandB);
          }
          break;
        case "times":
          if (!isNaN(scalar) && scalarInput.value !== "") {
            result = linearAlgebra.times(scalar, operandA);
          } else if (operandB) {
            result = linearAlgebra.times(operandA, operandB);
          }
          break;
        case "dot":
          if (operandB) {
            result = linearAlgebra.dot(operandA, operandB);
          }
          break;
        case "gauss":
          result = linearAlgebra.gauss(operandA);
          break;
        case "solve":
          result = linearAlgebra.solve(operandA);
          break;
      }

      if (result) {
        displayResult(result, operation);
      } else {
        alert("Erro ao executar a operação. Verifique os parâmetros.");
      }
    } catch (error) {
      console.error("Erro na operação:", error);
      alert("Erro ao executar a operação: " + error.message);
    }
  });

  // Exibir resultado
  function displayResult(result, operationName) {
    resultDisplay.innerHTML = "";

    const isMatrix = result instanceof Matrix;
    const isVector = result instanceof Vector;

    if (!isMatrix && !isVector) {
      resultDisplay.textContent = `Resultado: ${result}`;
      operationResult.style.display = "block";
      return;
    }

    // Criar visualização similar às matrizes/vetores
    const resultContainer = document.createElement("div");
    resultContainer.className = "matrix-visual";
    resultContainer.style.justifyContent = "flex-start";

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
          cell.textContent = result.get(i, j);
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
        cell.textContent = result.get(i);
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
    operationResult.style.display = "block";
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
      alert("Limite de matrizes/vetores (A-Z) atingido.");
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
      alert("As dimensões devem ser números positivos.");
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

        const displayGrid = document.createElement("div");
        displayGrid.className = "matrix-grid";
        displayGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

        if (type === "matrix") {
          for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
              const cell = document.createElement("span");
              cell.className = "element-input";
              cell.style.border = "1px solid transparent";
              cell.textContent = createdObjects[name].get(i, j);
              displayGrid.appendChild(cell);
            }
          }
        } else {
          for (let i = 0; i < cols; i++) {
            const cell = document.createElement("span");
            cell.className = "element-input";
            cell.style.border = "1px solid transparent";
            cell.textContent = createdObjects[name].get(i);
            displayGrid.appendChild(cell);
          }
        }

        grid.replaceWith(displayGrid);
        saveBtn.textContent = "Editar";
        console.log(`Objeto ${name} criado:`, createdObjects[name]);
        updateOperandSelects();
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

        const displayGrid = document.createElement("div");
        displayGrid.className = "matrix-grid";
        displayGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

        if (type === "matrix") {
          for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
              const cell = document.createElement("span");
              cell.className = "element-input";
              cell.style.border = "1px solid transparent";
              cell.textContent = createdObjects[name].get(i, j);
              displayGrid.appendChild(cell);
            }
          }
        } else {
          for (let i = 0; i < cols; i++) {
            const cell = document.createElement("span");
            cell.className = "element-input";
            cell.style.border = "1px solid transparent";
            cell.textContent = createdObjects[name].get(i);
            displayGrid.appendChild(cell);
          }
        }

        const currentGrid = visualContainer.querySelector(".matrix-grid");
        currentGrid.replaceWith(displayGrid);

        saveBtn.textContent = "Editar";
        console.log(
          `Objeto ${name} atualizado usando SET:`,
          createdObjects[name]
        );
        updateOperandSelects();
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
    });
  }
});
