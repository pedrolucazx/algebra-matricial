# Algebra Matricial

Uma aplicação web interativa para operações de álgebra linear com matrizes e vetores.

## 📋 Descrição

Este projeto implementa uma calculadora web completa para álgebra linear, permitindo:

- Criação e edição de matrizes e vetores
- Operações matemáticas fundamentais
- Resolução de sistemas lineares
- Interface visual intuitiva

## 🚀 Funcionalidades

### Operações Suportadas

- **Transposta**: Transposição de matrizes e vetores
- **Soma**: Adição de matrizes/vetores de mesma dimensão
- **Multiplicação Escalar**: Multiplicação por número real
- **Multiplicação Matricial**: Produto matricial tradicional
- **Produto Elemento a Elemento**: Multiplicação elemento por elemento
- **Eliminação Gaussiana**: Redução à forma escalonada
- **Resolução de Sistemas**: Solução de sistemas lineares

### Interface

- Criação dinâmica de matrizes e vetores (A-Z)
- Exemplos pré-definidos para demonstração
- Visualização clara dos resultados
- Suporte a números decimais e negativos

## 🏗️ Estrutura do Projeto

```
algebra-matricial/
├── index.html          # Página principal
├── README.md           # Documentação
├── scripts/
│   ├── calc.js         # Classes Matrix, Vector, LinearAlgebra
│   ├── main.js         # Lógica da interface
│   └── main_new.js     # Versão alternativa
└── styles/
    └── style.css       # Estilos da aplicação
```

## 🎯 Como Usar

### 1. Abrir a Aplicação

Abra o arquivo [`index.html`](index.html) em um navegador web.

### 2. Criar Matrizes/Vetores

1. Selecione o tipo (Matriz ou Vetor)
2. Defina as dimensões (linhas e colunas)
3. Clique em "Gerar"
4. Preencha os valores
5. Clique em "Salvar"

### 3. Executar Operações

1. Selecione a operação desejada
2. Escolha os operandos
3. Para multiplicação escalar, insira o valor
4. Clique em "Executar"

### 4. Exemplos Pré-definidos

- **Matrizes de Demonstração**: Carrega matrizes A, B, C para testes
- **Vetores de Demonstração**: Carrega vetores X, Y, Z
- **Sistema Linear**: Carrega sistemas com diferentes tipos de solução

## 🔧 Classes Principais

### Matrix

```javascript
const matrix = new Matrix(rows, cols, elements);
matrix.get(i, j); // Obter elemento
matrix.set(i, j, value); // Definir elemento
```

### Vector

```javascript
const vector = new Vector(dim, elements);
vector.get(i); // Obter elemento
vector.set(i, value); // Definir elemento
```

### LinearAlgebra

```javascript
const la = new LinearAlgebra();
la.transpose(matrix); // Transposta
la.sum(a, b); // Soma
la.times(a, b); // Multiplicação
la.dot(a, b); // Produto matricial
la.gauss(matrix); // Eliminação gaussiana
la.solve(matrix); // Resolver sistema
```

## 📊 Exemplos de Uso

### Soma de Matrizes

```javascript
const A = new Matrix(2, 2, [
  [1, 2],
  [3, 4],
]);
const B = new Matrix(2, 2, [
  [5, 6],
  [7, 8],
]);
const resultado = la.sum(A, B); // [[6, 8], [10, 12]]
```

### Multiplicação Matricial

```javascript
const A = new Matrix(2, 3, [
  [1, 2, 3],
  [4, 5, 6],
]);
const B = new Matrix(3, 2, [
  [1, 2],
  [3, 4],
  [5, 6],
]);
const produto = la.dot(A, B); // Resultado 2x2
```

### Sistema Linear

```javascript
// Sistema: 2x + y - z = 8, -3x - y + 2z = -11, -2x + y + 2z = -3
const sistema = new Matrix(3, 4, [
  [2, 1, -1, 8],
  [-3, -1, 2, -11],
  [-2, 1, 2, -3],
]);
const solucao = la.solve(la.gauss(sistema)); // [2, 3, -1]
```

## 🎨 Características Visuais

- Design moderno com gradientes
- Parentêses dimensionáveis para matrizes
- Colchetes para vetores
- Feedback visual para operações
- Mensagens de erro e sucesso

## 🛠️ Tecnologias

- **HTML5**: Estrutura da página
- **CSS3**: Estilos e layout responsivo
- **JavaScript ES6+**: Lógica de negócio e interface
- **Classes nativas**: Orientação a objetos

## 📝 Tratamento de Erros

A aplicação trata diversos cenários:

- Dimensões incompatíveis para operações
- Sistemas lineares inconsistentes
- Sistemas com infinitas soluções
- Divisão por zero em operações

## 🔄 Casos Especiais

### Sistemas Lineares

- **Solução única**: Retorna vetor solução
- **Infinitas soluções**: Retorna solução particular
- **Inconsistente**: Exibe erro informativo

### Precisão Numérica

- Limpeza automática de erros de ponto flutuante
- Arredondamento inteligente para valores próximos a inteiros
- Tolerância de 1e-10 para comparações

## 🚧 Desenvolvimento

Para contribuir com o projeto:

1. Clone o repositório
2. Abra [`index.html`](index.html) em um navegador
3. As classes estão em [`scripts/calc.js`](scripts/calc.js)
4. A interface está em [`scripts/main.js`](scripts/main.js)
5. Estilos em [`styles/style.css`](styles/style.css)
