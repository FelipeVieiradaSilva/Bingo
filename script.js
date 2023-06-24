const NUM_ROWS = 5;
const NUM_COLS = 5;
const MIN_NUM = 1;
const MAX_NUM = 75;

const COLUMN_LABELS = ['B', 'I', 'N', 'G', 'O'];
const COLUMN_RANGES = [
  { label: 'B', min: 1, max: 15 },
  { label: 'I', min: 16, max: 30 },
  { label: 'N', min: 31, max: 45 },
  { label: 'G', min: 46, max: 60 },
  { label: 'O', min: 61, max: 75 }
];

let players = [];
let intervalId;
let drawnNumbers = [];

function addPlayer() {
  const playerName = document.getElementById("player-name").value;
  if (!playerName) {
    alert("Por favor, insira o nome do jogador.");
    return;
  }

  const numCards = parseInt(document.getElementById("num-cards").value);
  if (isNaN(numCards) || numCards < 1 || numCards > 5) {
    alert("Por favor, insira um número válido de cartelas (entre 1 e 5).");
    return;
  }

  const playerSection = document.getElementById("players-section");

  const playerContainer = document.createElement("div");
  playerContainer.className = "player-container";

  const playerHeader = document.createElement("h2");
  playerHeader.textContent = playerName;
  playerContainer.appendChild(playerHeader);

  for (let i = 0; i < numCards; i++) {
    const cardNumber = players.length * 5 + i + 1;
    const cardContainer = document.createElement("div");
    cardContainer.className = "card-container";

    const cardHeader = document.createElement("h3");
    cardHeader.textContent = `Cartela ${cardNumber}`;
    cardContainer.appendChild(cardHeader);

    playerContainer.appendChild(cardContainer);
  }

  playerSection.appendChild(playerContainer);
  document.getElementById("player-name").value = "";
  document.getElementById("num-cards").value = "";
}

function startGame() {
  const playerContainers = document.getElementsByClassName("player-container");
  if (playerContainers.length === 0) {
    alert("Adicione pelo menos um jogador antes de iniciar o jogo.");
    return;
  }

  resetGame();

  for (let i = 0; i < playerContainers.length; i++) {
    const playerName = playerContainers[i].getElementsByTagName("h2")[0].textContent;
    const cardContainers = playerContainers[i].getElementsByClassName("card-container");
    const player = { name: playerName, cards: [] };

    for (let j = 0; j < cardContainers.length; j++) {
      const card = generateCard();
      player.cards.push(card);
      createCard(playerName, card, j + 1);
    }

    players.push(player);
  }

  intervalId = setInterval(drawNumber, 1000);
}

function resetGame() {
  players = [];
  clearInterval(intervalId);
  const boards = document.getElementById("bingo-boards");
  boards.innerHTML = "";
  document.getElementById("drawn-number").textContent = "";
  drawnNumbers = [];
}

function generateCard() {
  const card = [];

  for (let i = 0; i < NUM_COLS; i++) {
    const columnRange = COLUMN_RANGES[i];
    const columnValues = [];

    while (columnValues.length < NUM_ROWS) {
      const num = Math.floor(Math.random() * (columnRange.max - columnRange.min + 1)) + columnRange.min;
      if (!columnValues.includes(num)) {
        columnValues.push(num);
      }
    }

    card.push(columnValues);
  }

  return card;
}

function createCard(playerName, card, cardNumber) {
  const boards = document.getElementById("bingo-boards");

  const cardContainer = document.createElement("div");
  cardContainer.className = "board";

  const cardHeader = document.createElement("h2");
  cardHeader.textContent = `${playerName} - Cartela ${cardNumber}`;
  cardContainer.appendChild(cardHeader);

  const columnLabels = document.createElement("div");
  columnLabels.className = "row";

  for (let i = 0; i < NUM_COLS; i++) {
    const label = document.createElement("div");
    label.className = "column-label";
    label.textContent = COLUMN_LABELS[i];
    columnLabels.appendChild(label);
  }

  cardContainer.appendChild(columnLabels);

  for (let i = 0; i < NUM_ROWS; i++) {
    const rowContainer = document.createElement("div");
    rowContainer.className = "row";

    for (let j = 0; j < NUM_COLS; j++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.textContent = card[j][i];
      rowContainer.appendChild(cell);
    }

    cardContainer.appendChild(rowContainer);
  }

  boards.appendChild(cardContainer);
}

function drawNumber() {
  if (drawnNumbers.length === MAX_NUM - MIN_NUM + 1) {
    clearInterval(intervalId);
    alert("Todos os números foram sorteados.");
    return;
  }

  let drawnNumber;
  do {
    drawnNumber = Math.floor(Math.random() * (MAX_NUM - MIN_NUM + 1)) + MIN_NUM;
  } while (drawnNumbers.includes(drawnNumber));

  drawnNumbers.push(drawnNumber);

  const drawnNumbersContainer = document.getElementById("drawn-numbers");
  const numberItem = document.createElement("span");
  numberItem.textContent = drawnNumber + " ";
  drawnNumbersContainer.appendChild(numberItem);

  const boards = document.getElementsByClassName("board");

  let gameWon = false;

  for (let i = 0; i < boards.length; i++) {
    const cells = boards[i].getElementsByClassName("cell");

    for (let j = 0; j < cells.length; j++) {
      if (parseInt(cells[j].textContent) === drawnNumber) {
        cells[j].classList.add("marked");
        if (checkWin(cells)) {
          gameWon = true;
          break;
        }
      }
    }

    if (gameWon) {
      const playerName = boards[i].getElementsByTagName("h2")[0].textContent.split(" - ")[0];
      const cardNumber = parseInt(
        boards[i]
          .getElementsByTagName("h2")[0]
          .textContent.split(" - ")[1]
          .replace("Cartela ", "")
      );
      clearInterval(intervalId);
      alert(`Bingo! O jogador ${playerName} venceu na Cartela ${cardNumber}!`);
      break;
    }
  }

  document.getElementById("drawn-number").textContent = `Número Sorteado: ${drawnNumber}`;
}

function checkWin(cells) {
  for (let i = 0; i < cells.length; i++) {
    if (!cells[i].classList.contains("marked")) {
      return false;
    }
  }

  return true;
}

