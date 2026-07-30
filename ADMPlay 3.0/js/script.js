/* =========================================
   1. SISTEMA DE PARTÍCULAS (GLOBAL)
   ========================================= */
   (function() {
    const stage = document.getElementById('stage');
    // Só roda se existir a div 'stage' na página
    if (!stage) return;
  
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    stage.appendChild(canvas);
  
    let W, H;
    const particles = [];
    const particleCount = 55; 
    const connectionDistance = 160;
  
    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
  
    class Particle {
      constructor() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 1.0;
        this.vy = (Math.random() - 0.5) * 1.0;
        this.size = Math.random() * 2 + 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;
      }
      draw() {
        ctx.fillStyle = 'rgba(0, 119, 182, 0.5)'; 
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  
    function animate() {
      ctx.clearRect(0, 0, W, H);
      
      // Desenha conexões
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
  
          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 119, 182, ${0.3 - (dist / connectionDistance) * 0.3})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
  
      // Atualiza partículas
      particles.forEach(p => {
        p.update();
        p.draw();
      });
  
      requestAnimationFrame(animate);
    }
    animate();
  })();
  
  /* =========================================
     2. WIDGET DE ACESSIBILIDADE (GLOBAL)
     ========================================= */
  (function() {
      const btn = document.getElementById('access-btn');
      const panel = document.getElementById('access-panel');
      const closeBtn = document.getElementById('close-access');
      const resetBtn = document.getElementById('reset-access');
      const fontSlider = document.getElementById('font-slider');
      const fontSizeDisplay = document.getElementById('font-size-val');
  
      if (btn && panel) {
          btn.addEventListener('click', () => panel.classList.toggle('hidden'));
          if(closeBtn) closeBtn.addEventListener('click', () => panel.classList.add('hidden'));
      }
  
      if (fontSlider) {
          fontSlider.addEventListener('input', (e) => {
              const val = e.target.value;
              if(fontSizeDisplay) fontSizeDisplay.textContent = val + '%';
              document.documentElement.style.setProperty('--font-scale', val + '%');
          });
      }
  
      window.toggleAccess = function(mode) {
          const body = document.body;
          const className = 'acc-' + mode;
          body.classList.toggle(className);
          
          if (mode === 'high-contrast' && body.classList.contains(className)) {
               body.classList.remove('acc-invert');
          }
          updateButtons();
      };
  
      function updateButtons() {
          const buttons = document.querySelectorAll('.access-grid button');
          buttons.forEach(b => {
              const onclickVal = b.getAttribute('onclick');
              if(onclickVal) {
                  const mode = onclickVal.match(/'([^']+)'/)[1];
                  if (document.body.classList.contains('acc-' + mode)) {
                      b.classList.add('active');
                  } else {
                      b.classList.remove('active');
                  }
              }
          });
      }
  
      if (resetBtn) {
          resetBtn.addEventListener('click', () => {
              const body = document.body;
              const classes = Array.from(body.classList).filter(c => c.startsWith('acc-'));
              classes.forEach(c => body.classList.remove(c));
              
              if(fontSlider) {
                  fontSlider.value = 100;
                  if(fontSizeDisplay) fontSizeDisplay.textContent = '100%';
                  document.documentElement.style.setProperty('--font-scale', '100%');
              }
              updateButtons();
          });
      }
  })();
  
  /* =========================================
     3. JOGO DA MEMÓRIA (LÓGICA ESPECÍFICA)
     ========================================= */
  document.addEventListener('DOMContentLoaded', () => {
      
      // Verificação de segurança: Só roda se estiver na página do jogo
      const gameBoard = document.getElementById("game-board");
      if (!gameBoard) return; 
  
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
  
      // --- FUNÇÕES DO JOGO ---
  
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
          
          if(movesCount) movesCount.textContent = moves;
          if(timeDisplay) timeDisplay.textContent = "00:00";
          if(winMessage) winMessage.classList.add("hidden");
          
          clearInterval(timer);
          timer = setInterval(updateTimer, 1000);
          
          createCards();
      }
  
      function createCards() {
          const shuffledItems = shuffle([...items]);
          gameBoard.innerHTML = '';
  
          shuffledItems.forEach(item => {
              const card = document.createElement("div");
              card.classList.add("card"); // Usado no CSS para perspectiva
              card.dataset.item = item;
  
              // Face da Frente (Que contem o ícone)
              // No CSS Tech, a 'front-face' é a que gira para aparecer
              const frontFace = document.createElement("div");
              frontFace.classList.add("front-face");
              frontFace.textContent = item;
  
              // Face de Trás (Capa)
              // No CSS Tech, a 'back-face' é a capa padrão
              const backFace = document.createElement("div");
              backFace.classList.add("back-face");
              // Se quiser texto na capa, coloque aqui. O CSS já põe um '?'
  
              card.appendChild(frontFace);
              card.appendChild(backFace);
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
          // .closest garante que pegamos a div .card mesmo clicando no ícone
          const card = e.target.closest('.card'); 
          
          // Validações
          if (!card || card.classList.contains("flip") || flippedCards.length === 2) return;
  
          // Inicia timer no primeiro clique se necessário (segurança)
          if (!isPlaying) {
              isPlaying = true;
              timer = setInterval(updateTimer, 1000);
          }
  
          // Adiciona classe 'flip' (compatível com o CSS)
          card.classList.add("flip");
          flippedCards.push(card);
  
          if (flippedCards.length === 2) {
              moves++;
              if(movesCount) movesCount.textContent = moves;
              checkMatch();
          }
      }
  
      function checkMatch() {
          const [card1, card2] = flippedCards;
  
          if (card1.dataset.item === card2.dataset.item) {
              // PAR ENCONTRADO
              matchedCards += 2;
              
              // Remove listener para não clicar mais
              card1.removeEventListener('click', flipCard);
              card2.removeEventListener('click', flipCard);
  
              // Mostra Info
              showItemInfo(card1.dataset.item);
  
              flippedCards = [];
  
              if (matchedCards === items.length) {
                  setTimeout(endGame, 500); // Pequeno delay para vitória
              }
  
          } else {
              // ERRO: Desvira após tempo
              setTimeout(() => {
                  card1.classList.remove("flip");
                  card2.classList.remove("flip");
                  flippedCards = [];
              }, 1000);
          }
      }
  
      function endGame() {
          clearInterval(timer);
          isPlaying = false;
          
          if(finalTimeDisplay) finalTimeDisplay.textContent = timeDisplay.textContent;
          if(finalMovesDisplay) finalMovesDisplay.textContent = moves;
          if(winMessage) winMessage.classList.remove("hidden");
      }
  
      if(resetBtn) resetBtn.addEventListener("click", startGame);
      if(playAgainBtn) playAgainBtn.addEventListener("click", startGame);
  
      // --- TELA INICIAL (INTRO) ---
      const introScreen = document.getElementById("intro-screen");
      const yesBtn = document.getElementById("yes-btn");
      const noBtn = document.getElementById("no-btn");
      const startBtn = document.getElementById("start-btn");
      const introInfo = document.getElementById("intro-info");
  
      if (introScreen) {
          // Se houver tela de intro, não inicia o jogo automaticamente
          
          if(yesBtn) {
              yesBtn.addEventListener("click", () => {
                  introInfo.innerHTML = `
                  <p>Ótimo! Nosso protocolo foca em <strong>controle de estoque</strong>. 
                  Combine os pares de ícones logísticos.</p>`;
                  introInfo.classList.remove("hidden");
                  startBtn.classList.remove("hidden");
              });
          }
  
          if(noBtn) {
              noBtn.addEventListener("click", () => {
                  introInfo.innerHTML = `
                  <h3>Instruções Operacionais:</h3>
                  <ul>
                      <li>Clique em dois cartões para revelar o conteúdo.</li>
                      <li>Identifique padrões idênticos.</li>
                      <li>Complete a varredura no menor tempo possível.</li>
                  </ul>`;
                  introInfo.classList.remove("hidden");
                  startBtn.classList.remove("hidden");
              });
          }
  
          if(startBtn) {
              startBtn.addEventListener("click", () => {
                  introScreen.classList.add("hidden"); // Esconde modal
                  startGame(); // Começa o jogo
              });
          }
      } else {
          // Se não tiver tela de intro (fallback), começa direto
          startGame();
      }
  
      // --- EXPLICAÇÕES DOS ITENS (INFO BOX) ---
      const infoBox = document.getElementById("info-box");
      const infoText = document.getElementById("info-text");
      const closeInfo = document.getElementById("close-info");
  
      const itemDescriptions = {
          "📦": "📦 ARMAZÉM: Local físico de estocagem e gestão de inventário.",
          "🏷️": "🏷️ ETIQUETA: Identificação crucial para rastreabilidade.",
          "📊": "📊 KPIS: Indicadores de performance para tomada de decisão.",
          "📥": "📥 RECEBIMENTO: Processo de entrada e conferência de materiais.",
          "🛒": "🛒 COMPRAS: Setor responsável pela aquisição de insumos.",
          "🚚": "🚚 LOGÍSTICA: Transporte e distribuição eficiente.",
          "🏭": "🏭 PRODUÇÃO: Transformação de matéria-prima em produto.",
          "🏪": "🏪 VAREJO: Ponto final da cadeia de suprimentos."
      };
  
      function showItemInfo(item) {
          if(!infoBox || !infoText) return;
          
          infoText.textContent = itemDescriptions[item] || "Dado não catalogado.";
          infoBox.classList.remove("hidden");
      }
  
      if(closeInfo) {
          closeInfo.addEventListener("click", () => {
              infoBox.classList.add("hidden");
          });
      }
  
  });