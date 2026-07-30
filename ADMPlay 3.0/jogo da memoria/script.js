const gameBoard = document.getElementById("game-board");
const resetBtn = document.getElementById("reset-btn");
const playAgainBtn = document.getElementById("play-again-btn");
const movesCount = document.getElementById("moves-count");
const timeDisplay = document.getElementById("time");
const finalTimeDisplay = document.getElementById("final-time");
const finalMovesDisplay = document.getElementById("final-moves");
const winMessage = document.getElementById("win-message");

const items = [
    '📦', '📦', '🏷️', '🏷️', '📊', '📊', '📥', '📥', 
    '🛒', '🛒', '🚚', '🚚', '🏭', '🏭', '🏪', '🏪'
];

let moves = 0;
let timer;
let seconds = 0;
let isPlaying = false;
let flippedCards = [];
let matchedCards = 0;

function updateTimer() {
    seconds++;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function startGame() {
    moves = 0;
    seconds = 0;
    matchedCards = 0;
    flippedCards = [];
    isPlaying = true;
    
    movesCount.textContent = moves;
    timeDisplay.textContent = "00:00";
    winMessage.classList.add("hidden");
    
    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
    
    createCards();
}

function createCards() {
    const shuffledItems = shuffle([...items]);
    gameBoard.innerHTML = '';

    shuffledItems.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.item = item;

        const front = document.createElement("div");
        front.classList.add("card-front");

        const back = document.createElement("div");
        back.classList.add("card-back");

        back.textContent = item;

        card.appendChild(front);
        card.appendChild(back);
        gameBoard.appendChild(card);
        card.addEventListener("click", flipCard);
    });
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function flipCard(e) {
    const card = e.target.closest('.card');
    if (!card || card.classList.contains("flipped") || flippedCards.length === 2) return;

    if (!isPlaying) {
        isPlaying = true;
        timer = setInterval(updateTimer, 1000);
    }

    card.classList.add("flipped");
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        moves++;
        movesCount.textContent = moves;
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.item === card2.dataset.item) {

        // PAR ENCONTRADO
        matchedCards += 2;

        // MOSTRA A INFORMAÇÃO DO ITEM
        showItemInfo(card1.dataset.item);

        flippedCards = [];

        if (matchedCards === items.length) {
            endGame();
        }

    } else {
        // Se ERRO, desvira as cartas
        setTimeout(() => {
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
            flippedCards = [];
        }, 1000);
    }
}


function endGame() {
    clearInterval(timer);
    isPlaying = false;
    
    finalTimeDisplay.textContent = timeDisplay.textContent;
    finalMovesDisplay.textContent = moves;
    winMessage.classList.remove("hidden");
}

resetBtn.addEventListener("click", startGame);
playAgainBtn.addEventListener("click", startGame);

// Inicia o jogo
startGame();

// ---- Tela inicial ----
const introScreen = document.getElementById("intro-screen");
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");
const startBtn = document.getElementById("start-btn");
const introInfo = document.getElementById("intro-info");

yesBtn.addEventListener("click", () => {
  introInfo.innerHTML = `
    <p>Ótimo! Nosso jogo da memória tem como tema o <strong>controle de estoque</strong>. 
    Combine os pares de ícones relacionados à logística e administração.</p>`;
  introInfo.classList.remove("hidden");
  startBtn.classList.remove("hidden");
});

noBtn.addEventListener("click", () => {
  introInfo.innerHTML = `
    <h3>Como jogar:</h3>
    <ul>
      <li>Clique em duas cartas para virá-las.</li>
      <li>Se formarem um par, elas permanecerão viradas.</li>
      <li>Encontre todos os pares no menor tempo possível!</li>
    </ul>
    <p>Nosso tema é sobre <strong>estoque e logística</strong>, unindo diversão e aprendizado!</p>`;
  introInfo.classList.remove("hidden");
  startBtn.classList.remove("hidden");
});

startBtn.addEventListener("click", () => {
  introScreen.classList.add("hidden");
  startGame();
});

// Remove o "startGame()" automático
// startGame();

// ---- EXPLICAÇÕES DOS ITENS APÓS MATCH ----
const infoBox = document.getElementById("info-box");
const infoText = document.getElementById("info-text");
const closeInfo = document.getElementById("close-info");

const itemDescriptions = {
    "📦": "📦 ARMAZÉM / ESTOQUE: Representa os produtos armazenados e a gestão de estoque.",
    "🏷️": "🏷️ ETIQUETA / IDENTIFICAÇÃO: Controle e classificação de produtos.",
    "📊": "📊 CONTROLE E INDICADORES: Relatórios, gráficos e KPIs administrativos.",
    "📥": "📥 ENTRADA DE MATERIAIS: Materiais que chegam ao armazém.",
    "🛒": "🛒 COMPRAS: Processo de aquisição de mercadorias.",
    "🚚": "🚚 TRANSPORTE E ENTREGA: Logística de envio e recebimento.",
    "🏭": "🏭 PRODUÇÃO: Entrada e saída de produtos na linha de fabricação.",
    "🏪": "🏪 LOJA / DISTRIBUIÇÃO: Ponto de venda ou distribuição final."
};

// Exibir informação somente quando houver par correto
function showItemInfo(item) {
    infoText.textContent = itemDescriptions[item] || "Informação não encontrada.";
    infoBox.classList.remove("hidden");
}

// Fechar explicação
closeInfo.addEventListener("click", () => {
    infoBox.classList.add("hidden");
});

