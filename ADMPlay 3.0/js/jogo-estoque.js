// /js/game.js (Seu script principal do jogo modificado)

const player = document.getElementById('player');
const playerSprite = document.getElementById('player-sprite');
const gameContainer = document.getElementById('game-container');
const heldItemElement = document.getElementById('held-item');
const gameMessage = document.getElementById('game-message');
const collectableItems = document.querySelectorAll('.collectable-item');

let playerX = 0;
let playerY = 0;

function centerPlayer() {
    playerX = (gameContainer.offsetWidth / 2) - (player.offsetWidth / 2);
    playerY = (gameContainer.offsetHeight / 2) - (player.offsetHeight / 2);
    updatePlayerPosition();
}

let heldItem = null; 
let heldItemId = null; 

const moveSpeed = 5;
const keysPressed = {};

// MODIFICAÇÃO CHAVE: Define o gênero a partir do Local Storage
let currentGender = 'm'; 
const savedAvatar = localStorage.getItem('adm_player_avatar');
if (savedAvatar === 'male') {
    currentGender = 'm';
} else if (savedAvatar === 'female') {
    currentGender = 'f';
}

let currentDirection = 'front';
let isGameOver = false;

const possibleItems = [
    { type: 'wrench', color: '#e74c3c', symbol: '🔧' }, 
    { type: 'hammer', color: '#2ecc71', symbol: '🔨' }, 
    { type: 'box', color: '#3498db', symbol: '📦' },    
    { type: 'computer', color: '#f39c12', symbol: '💻' } 
];

let deliveryZones = {
    wrench: { symbol: '🔧', count: 0, max: 1, color: '#e74c3c', element: document.getElementById('zone-apple') }, 
    hammer: { symbol: '🔨', count: 0, max: 1, color: '#2ecc71', element: document.getElementById('zone-diamond') }, 
    box: { symbol: '📦', count: 0, max: 1, color: '#3498db', element: document.getElementById('zone-book') }, 
    computer: { symbol: '💻', count: 0, max: 1, color: '#f39c12', element: document.getElementById('zone-star') } 
};

function updatePlayerSprite() {
    // Usa o currentGender lido do localStorage ('m' ou 'f')
    const imgName = `player${currentGender}_${currentDirection}.png`;
    playerSprite.src = imgName;
}

function updatePlayerPosition() {
    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;
}

function updateZoneDisplay(zoneType) {
    const zone = deliveryZones[zoneType];
    zone.element.innerHTML = `<div class="zone-title">${zone.symbol}</div><div class="zone-count">${zone.count} / ${zone.max}</div>`;
    
    if (zone.count >= zone.max) {
        zone.element.style.borderColor = zone.color; 
        zone.element.style.backgroundColor = zone.color; 
        zone.element.style.color = '#2c3e50'; 
    } else {
        zone.element.style.borderColor = zone.color; 
        zone.element.style.backgroundColor = '#ecf0f1'; 
        zone.element.style.color = '#2c3e50';
    }
}

function checkCollision(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    return rect1.left < rect2.right &&
           rect1.right > rect2.left &&
           rect1.top < rect2.bottom &&
           rect1.bottom > rect2.top;
}

function respawnItem(itemId, itemType) {
    const item = document.getElementById(itemId);
    if (!item) return;

    const zone = deliveryZones[itemType];
    
    if (zone.count >= zone.max) {
        item.style.display = 'none';
        return;
    }

    const marginX = gameContainer.offsetWidth * 0.15;
    const marginY = gameContainer.offsetHeight * 0.15;
    
    const minX = marginX;
    const maxX = gameContainer.offsetWidth - marginX - item.offsetWidth;
    const minY = marginY;
    const maxY = gameContainer.offsetHeight - marginY - item.offsetHeight;

    let randomX = Math.random() * (maxX - minX) + minX;
    let randomY = Math.random() * (maxY - minY) + minY;

    item.style.left = `${randomX}px`;
    item.style.top = `${randomY}px`;
    item.style.display = 'flex'; 
}

function setupInitialItems() {
    collectableItems.forEach((item, index) => {
        const itemConfig = possibleItems[index]; 
        item.id = `item-${index}`; 
        item.dataset.type = itemConfig.type;
        item.textContent = itemConfig.symbol;
        item.style.backgroundColor = itemConfig.color;
        item.style.borderColor = '#2c3e50';
        respawnItem(item.id, itemConfig.type); 
    });
    Object.keys(deliveryZones).forEach(updateZoneDisplay);
}

function handleMovement() {
    let newDirection = currentDirection;
    let moved = false;

    if (keysPressed['a'] || keysPressed['arrowleft'] || keysPressed['btn-left']) {
        playerX -= moveSpeed;
        newDirection = 'left';
        moved = true;
    } else if (keysPressed['d'] || keysPressed['arrowright'] || keysPressed['btn-right']) {
        playerX += moveSpeed;
        newDirection = 'right';
        moved = true;
    }

    if (keysPressed['w'] || keysPressed['arrowup'] || keysPressed['btn-up']) {
        playerY -= moveSpeed;
        newDirection = 'back';
        moved = true;
    } else if (keysPressed['s'] || keysPressed['arrowdown'] || keysPressed['btn-down']) {
        playerY += moveSpeed;
        newDirection = 'front';
        moved = true;
    }
    
    const playerWidth = player.offsetWidth;
    const playerHeight = player.offsetHeight;
    const containerWidth = gameContainer.offsetWidth;
    const containerHeight = gameContainer.offsetHeight;

    playerX = Math.max(0, Math.min(playerX, containerWidth - playerWidth));
    playerY = Math.max(0, Math.min(playerY, containerHeight - playerHeight));

    updatePlayerPosition();

    if (moved && newDirection !== currentDirection) {
        currentDirection = newDirection;
        updatePlayerSprite();
    }
}

function checkWinCondition() {
    let allCompleted = true;
    for (const type in deliveryZones) {
        if (deliveryZones[type].count < deliveryZones[type].max) {
            allCompleted = false;
            break;
        }
    }
    if (allCompleted) {
        isGameOver = true;
        gameMessage.style.display = 'block';
    }
}

function checkInteractions() {
    if (heldItem) {
        const heldType = heldItem;
        const targetZone = deliveryZones[heldType];

        if (checkCollision(player, targetZone.element)) {
            if (targetZone.count < targetZone.max) {
                targetZone.count++;
                updateZoneDisplay(heldType);
                heldItemElement.textContent = `Segurando: Nada`;
                heldItemElement.style.color = '#ecf0f1';
                heldItem = null;
                respawnItem(heldItemId, heldType);
                heldItemId = null; 
                checkWinCondition();
                return;
            } else {
                heldItemElement.textContent = `Segurando: ${targetZone.symbol} (Zona Cheia!)`;
            }
        }
    } else { 
        collectableItems.forEach(item => {
            const itemType = item.dataset.type;
            const zone = deliveryZones[itemType];
            if (item.style.display !== 'none' && checkCollision(player, item) && zone.count < zone.max) {
                if (!heldItem) {
                    heldItem = itemType;
                    heldItemId = item.id; 
                    heldItemElement.textContent = `Segurando: ${item.textContent}`;
                    heldItemElement.style.color = item.style.backgroundColor; 
                    item.style.display = 'none'; 
                }
            }
        });
    }
}

document.addEventListener('keydown', (e) => keysPressed[e.key.toLowerCase()] = true);
document.addEventListener('keyup', (e) => keysPressed[e.key.toLowerCase()] = false);

const dPadButtons = document.querySelectorAll('.d-pad-btn');
dPadButtons.forEach(btn => {
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); keysPressed[btn.id] = true; });
    btn.addEventListener('touchend', (e) => { e.preventDefault(); keysPressed[btn.id] = false; });
    btn.addEventListener('mousedown', () => keysPressed[btn.id] = true);
    btn.addEventListener('mouseup', () => keysPressed[btn.id] = false);
    btn.addEventListener('mouseleave', () => keysPressed[btn.id] = false);
});

window.addEventListener('resize', () => {
    const maxX = gameContainer.offsetWidth - player.offsetWidth;
    const maxY = gameContainer.offsetHeight - player.offsetHeight;
    if (playerX > maxX) playerX = maxX;
    if (playerY > maxY) playerY = maxY;
    updatePlayerPosition();
});

function gameLoop() {
    if (!isGameOver) {
        handleMovement();
        checkInteractions(); 
    }
    requestAnimationFrame(gameLoop);
}

setTimeout(() => {
    centerPlayer();
    setupInitialItems(); 
    gameLoop();
    updatePlayerSprite();
}, 100);