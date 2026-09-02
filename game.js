// ==========================================
// Jungle Dash - 2D Platform Adventure Engine
// ==========================================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- Game State & Save Data ---
const SAVE_KEY = 'jungle_dash_save_v2';
let saveData = {
    coins: 0,
    unlockedLevels: [1],
    unlockedChars: ['adventurer'],
    selectedChar: 'adventurer',
    highScores: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, endless: 0 },
    levelStars: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
};

function loadSave() {
    try {
        const d = localStorage.getItem(SAVE_KEY);
        if (d) Object.assign(saveData, JSON.parse(d));
    } catch(e) {}
}

function saveGame() {
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    } catch(e) {}
}
loadSave();

// --- Characters Roster ---
const CHARACTERS = {
    adventurer: { id: 'adventurer', name: 'Adventurer', icon: '🤠', projectile: '🪃', cost: 0, speed: 1.0, jump: 1.0, ability: 'Balanced Explorer' },
    ninja:      { id: 'ninja',      name: 'Shadow Ninja', icon: '🥷', projectile: '🗡️', cost: 60, speed: 1.2, jump: 1.15, ability: '+20% Speed & Shuriken' },
    robot:      { id: 'robot',      name: 'Mecha Bot',   icon: '🤖', projectile: '⚡', cost: 120, speed: 0.95, jump: 1.0, ability: 'Magnetic Coin Aura' },
    knight:     { id: 'knight',     name: 'Iron Knight', icon: '🛡️', projectile: '🪓', cost: 180, speed: 0.9, jump: 0.95, ability: '+1 Extra Starting Life' },
    alien:      { id: 'alien',      name: 'Cosmic Alien',icon: '👽', projectile: '🛸', cost: 250, speed: 1.1, jump: 1.3, ability: 'Low-Gravity Float' },
    dinosaur:   { id: 'dinosaur',   name: 'Dino Rex',    icon: '🦖', projectile: '🔥', cost: 350, speed: 1.25, jump: 1.1, ability: 'Double Coin Multiplier' }
};

let currentLevelId = 1;
let gameMode = 'adventure';
let gameState = 'MENU';
let levelTime = 0;
let levelScore = 0;
let levelCoins = 0;
let levelSpecialStarsCollected = 0;
let enemiesDefeated = 0;
let comboMultiplier = 1;
let comboTimer = 0;
let screenShake = 0;

// Floating Score Popups
let scorePopups = [];
function addScorePopup(x, y, text, color = '#facc15') {
    scorePopups.push({ x, y, text, color, life: 40, vy: -1.5 });
}

// Particle System
class Particle {
    constructor(x, y, color, vx, vy, size, life) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.vx = vx;
        this.vy = vy;
        this.size = size;
        this.life = life;
        this.maxLife = life;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        this.size = Math.max(0, this.size * 0.95);
    }
    draw(ctx, camX) {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = Math.max(0, this.life / this.maxLife);
        ctx.beginPath();
        ctx.arc(this.x - camX, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}
let particles = [];
function spawnParticles(x, y, color, count = 8, speed = 3) {
    for (let i = 0; i < count; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = Math.random() * speed;
        particles.push(new Particle(x, y, color, Math.cos(ang) * spd, Math.sin(ang) * spd, 3 + Math.random() * 3, 20 + Math.random() * 20));
    }
}

function triggerCombo() {
    comboMultiplier++;
    comboTimer = 180;
    const cEl = document.getElementById('combo-display');
    cEl.classList.remove('hidden');
    cEl.innerText = `COMBO x${comboMultiplier}!`;
}

// Player Projectiles
class Projectile {
    constructor(x, y, vx, icon) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.icon = icon;
        this.life = 70;
    }
    update(enemies, boss) {
        this.x += this.vx;
        this.life--;

        // Check enemy hit
        for (let e of enemies) {
            if (!e.dead && Math.abs(this.x - (e.x + 16)) < 24 && Math.abs(this.y - (e.y + 14)) < 24) {
                e.takeHit();
                this.life = 0;
                break;
            }
        }
        // Check boss hit
        if (boss && !boss.dead && Math.abs(this.x - (boss.x + 34)) < 36 && Math.abs(this.y - (boss.y + 34)) < 36) {
            boss.takeHit();
            this.life = 0;
        }
    }
    draw(ctx, camX) {
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.icon, this.x - camX, this.y);
    }
}
let playerProjectiles = [];
// --- Input System ---
const keys = { left: false, right: false, up: false, down: false, dash: false, jumpPressed: false, jumpReleased: false };

window.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
    }
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keys.down = true;
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        if (!keys.up) keys.jumpPressed = true;
        keys.up = true;
    }
    if (e.key === 'Shift' || e.key === 'x' || e.key === 'X') keys.dash = true;
    if (e.key === 'f' || e.key === 'F' || e.key === 'z' || e.key === 'Z') {
        if (player && gameState === 'PLAYING') player.shoot();
    }
    if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') togglePause();
    audio.init();
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keys.down = false;
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        keys.up = false;
        keys.jumpPressed = false;
        keys.jumpReleased = true;
    }
});

// --- Player Entity ---
class Player {
    constructor(x, y, charKey) {
        this.x = x;
        this.y = y;
        this.w = 32;
        this.h = 42;
        this.vx = 0;
        this.vy = 0;
        this.respawnX = x;
        this.respawnY = y;
        this.charKey = charKey;
        this.char = CHARACTERS[charKey] || CHARACTERS.adventurer;
        this.maxHealth = this.char.id === 'knight' ? 4 : 3;
        this.health = this.maxHealth;
        this.onGround = false;
        this.canDoubleJump = true;
        this.facing = 1;
        this.invulnerableTimer = 0;
        this.dashCooldown = 0;
        this.dashingTimer = 0;
        this.shootCooldown = 0;
        this.coyoteTimer = 0;
        this.jumpBufferTimer = 0;
        this.powerups = { speed: 0, superJump: 0, shield: 0, magnet: 0, star: 0 };
    }

    shoot() {
        if (this.shootCooldown > 0) return;
        this.shootCooldown = 22;
        const pVx = this.facing * (this.char.id === 'ninja' ? 10 : 8);
        playerProjectiles.push(new Projectile(this.x + this.w/2, this.y + this.h/2 - 4, pVx, this.char.projectile));
        audio.playJump();
        spawnParticles(this.x + this.w/2, this.y + this.h/2, '#facc15', 5, 2);
    }

    update(platforms, levelGravity = 0.5) {
        const charSpeed = 4.8 * this.char.speed * (this.powerups.speed > 0 ? 1.5 : 1);
        const jumpPower = -11.8 * this.char.jump * (this.powerups.superJump > 0 ? 1.3 : 1);

        for (let p in this.powerups) {
            if (this.powerups[p] > 0) this.powerups[p]--;
        }
        if (this.invulnerableTimer > 0) this.invulnerableTimer--;
        if (this.dashCooldown > 0) this.dashCooldown--;
        if (this.shootCooldown > 0) this.shootCooldown--;
        if (this.jumpBufferTimer > 0) this.jumpBufferTimer--;

        if (this.onGround) this.coyoteTimer = 6;
        else if (this.coyoteTimer > 0) this.coyoteTimer--;

        if (keys.left) {
            this.vx = -charSpeed;
            this.facing = -1;
            if (this.onGround && Math.random() < 0.2) spawnParticles(this.x + this.w, this.y + this.h, '#a1a1aa', 1, 1);
        } else if (keys.right) {
            this.vx = charSpeed;
            this.facing = 1;
            if (this.onGround && Math.random() < 0.2) spawnParticles(this.x, this.y + this.h, '#a1a1aa', 1, 1);
        } else {
            this.vx *= 0.75;
            if (Math.abs(this.vx) < 0.1) this.vx = 0;
        }

        if (keys.dash && this.dashCooldown === 0) {
            this.vx = this.facing * 12;
            this.dashCooldown = 50;
            this.dashingTimer = 10;
            audio.playJump();
            spawnParticles(this.x + this.w/2, this.y + this.h/2, '#38bdf8', 10, 4);
        }
        if (this.dashingTimer > 0) {
            this.dashingTimer--;
            this.vy = 0;
        }

        if (keys.jumpPressed) {
            this.jumpBufferTimer = 6;
            keys.jumpPressed = false;
        }

        if (this.jumpBufferTimer > 0) {
            if (this.coyoteTimer > 0) {
                this.vy = jumpPower;
                this.onGround = false;
                this.coyoteTimer = 0;
                this.canDoubleJump = true;
                this.jumpBufferTimer = 0;
                audio.playJump();
                spawnParticles(this.x + this.w/2, this.y + this.h, '#fde047', 8, 3);
            } else if (this.canDoubleJump) {
                this.vy = jumpPower * 0.92;
                this.canDoubleJump = false;
                this.jumpBufferTimer = 0;
                audio.playJump();
                spawnParticles(this.x + this.w/2, this.y + this.h, '#67e8f9', 10, 3);
            }
        }

        if (keys.jumpReleased) {
            if (this.vy < -4) this.vy = -4;
            keys.jumpReleased = false;
        }

        if (!this.dashingTimer) {
            const grav = this.char.id === 'alien' ? levelGravity * 0.65 : levelGravity;
            this.vy += grav;
            if (this.vy > 14) this.vy = 14;
        }

        this.onGround = false;
        this.x += this.vx;
        this.handleHorizontalPlatformCollision(platforms);

        this.y += this.vy;
        this.handleVerticalPlatformCollision(platforms);
    }

    handleHorizontalPlatformCollision(platforms) {
        for (let p of platforms) {
            if (p.type === 'hazard' || p.type === 'spring') continue;
            if (this.x < p.x + p.w && this.x + this.w > p.x && this.y < p.y + p.h - 4 && this.y + this.h > p.y + 4) {
                if (this.vx > 0) this.x = p.x - this.w;
                else if (this.vx < 0) this.x = p.x + p.w;
                this.vx = 0;
            }
        }
    }

    handleVerticalPlatformCollision(platforms) {
        for (let p of platforms) {
            if (this.x + 4 < p.x + p.w && this.x + this.w - 4 > p.x && this.y < p.y + p.h && this.y + this.h > p.y) {
                if (p.type === 'hazard') {
                    this.takeDamage('hazard');
                    continue;
                }
                if (p.type === 'spring') {
                    this.vy = -16.5;
                    this.canDoubleJump = true;
                    screenShake = 6;
                    audio.playJump();
                    spawnParticles(p.x + p.w/2, p.y, '#f59e0b', 12, 4);
                    continue;
                }
                if (this.vy >= 0 && this.y + this.h - this.vy <= p.y + 12) {
                    if (keys.down && p.type === 'normal') {
                        continue; // Drop through semi-solid
                    }
                    this.y = p.y - this.h;
                    this.vy = 0;
                    this.onGround = true;
                    this.canDoubleJump = true;
                    if (p.type === 'crumble' && p.timer === 0) p.timer = 1;
                    if (p.vx) this.x += p.vx;
                } else if (this.vy < 0 && p.type === 'ground') {
                    this.y = p.y + p.h;
                    this.vy = 0;
                }
            }
        }
    }

    takeDamage(reason = 'enemy') {
        if (this.invulnerableTimer > 0) return;
        if (this.powerups.shield > 0) {
            this.powerups.shield = 0;
            this.invulnerableTimer = 60;
            audio.playHurt();
            spawnParticles(this.x + this.w/2, this.y + this.h/2, '#38bdf8', 15, 4);
            addScorePopup(this.x, this.y, 'SHIELD BROKEN!', '#38bdf8');
            return;
        }
        if (this.powerups.star > 0) return;

        this.health--;
        this.invulnerableTimer = 60;
        this.vy = -7;
        this.vx = -this.facing * 5;
        screenShake = 8;
        audio.playHurt();
        spawnParticles(this.x + this.w/2, this.y + this.h/2, '#ef4444', 12, 3);
        updateHUD();

        if (this.health <= 0) {
            triggerGameOver(reason === 'hazard' ? 'Fell into a hazard!' : 'Defeated by enemy!');
        }
    }

    respawnAtCheckpoint() {
        this.health = this.maxHealth;
        this.x = this.respawnX;
        this.y = this.respawnY;
        this.vx = 0;
        this.vy = 0;
        this.invulnerableTimer = 90;
        updateHUD();
    }

    draw(ctx, camX) {
        if (this.invulnerableTimer > 0 && Math.floor(Date.now() / 50) % 2 === 0) return;

        const drawX = this.x - camX;
        const drawY = this.y;

        ctx.save();
        ctx.translate(drawX + this.w / 2, drawY + this.h / 2);
        if (this.facing === -1) ctx.scale(-1, 1);

        if (this.powerups.star > 0) {
            ctx.strokeStyle = `hsl(${(Date.now()/4)%360}, 100%, 55%)`;
            ctx.lineWidth = 4;
            ctx.strokeRect(-this.w/2 - 4, -this.h/2 - 4, this.w + 8, this.h + 8);
        } else if (this.powerups.shield > 0) {
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3;
            ctx.strokeRect(-this.w/2 - 6, -this.h/2 - 6, this.w + 12, this.h + 12);
        }

        ctx.fillStyle = this.char.icon;
        ctx.font = '34px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.char.icon, 0, 0);
        if (this.dashingTimer > 0) {
            ctx.fillStyle = '#38bdf8';
            ctx.globalAlpha = 0.4;
            ctx.fillRect(-this.w/2 - 2, -this.h/2 - 2, this.w + 4, this.h + 4);
            ctx.globalAlpha = 1;
        }

        ctx.restore();
    }
}

// --- Game Engine, Camera & Rendering ---
let player = null;
let cameraX = 0;
let endlessNextX = 1200;
let currentMap = null;

function startLevel(lvlId, mode = 'adventure') {
    gameMode = mode;
    currentLevelId = lvlId;
    gameState = 'PLAYING';
    levelTime = 0;
    levelScore = 0;
    levelCoins = 0;
    levelSpecialStarsCollected = 0;
    enemiesDefeated = 0;
    comboMultiplier = 1;
    comboTimer = 0;
    particles = [];
    scorePopups = [];
    playerProjectiles = [];

    hideAllScreens();
    document.getElementById('hud').classList.remove('hidden');

    player = new Player(80, 360, saveData.selectedChar);

    if (gameMode === 'adventure') {
        currentMap = generateLevel(lvlId);
        document.getElementById('progress-wrap').classList.remove('hidden');
        if (currentMap.boss) {
            document.getElementById('boss-bar-container').classList.remove('hidden');
            document.getElementById('boss-name').innerText = currentMap.boss.name;
            updateBossBar(currentMap.boss);
        } else {
            document.getElementById('boss-bar-container').classList.add('hidden');
        }
    } else {
        currentMap = {
            platforms: [{ x: 0, y: 460, w: 900, h: 80, type: 'ground' }],
            collectibles: [],
            enemies: [],
            checkpoints: [],
            boss: null,
            finishX: 99999999,
            theme: THEMES[1]
        };
        endlessNextX = 900;
        const initialChunk = generateEndlessChunk(endlessNextX);
        currentMap.platforms.push(...initialChunk.platforms);
        currentMap.collectibles.push(...initialChunk.collectibles);
        currentMap.enemies.push(...initialChunk.enemies);
        endlessNextX = initialChunk.nextX;
        document.getElementById('boss-bar-container').classList.add('hidden');
        document.getElementById('progress-wrap').classList.add('hidden');
    }

    cameraX = 0;
    audio.startBGM();
    updateHUD();
}

function updateHUD() {
    if (!player) return;
    const hpStr = '❤️'.repeat(Math.max(0, player.health)) + '🖤'.repeat(Math.max(0, player.maxHealth - player.health));
    document.getElementById('hearts-display').innerText = hpStr;
    document.getElementById('score-display').innerText = levelScore;
    document.getElementById('coin-count').innerText = levelCoins;
    document.getElementById('stars-level-display').innerText = `⭐ ${levelSpecialStarsCollected}/3`;

    const mins = Math.floor(levelTime / 60).toString().padStart(2, '0');
    const secs = Math.floor(levelTime % 60).toString().padStart(2, '0');
    document.getElementById('timer-display').innerText = `${mins}:${secs}`;

    if (gameMode === 'adventure' && currentMap) {
        const pct = Math.min(100, Math.max(0, (player.x / currentMap.finishX) * 100));
        document.getElementById('progress-fill').style.width = `${pct}%`;
        document.getElementById('player-marker').style.left = `${pct}%`;
    }

    const pContainer = document.getElementById('active-powerups');
    pContainer.innerHTML = '';
    for (let p in player.powerups) {
        if (player.powerups[p] > 0) {
            const icon = p === 'speed' ? '⚡' : p === 'superJump' ? '🦘' : p === 'shield' ? '🛡️' : p === 'magnet' ? '🧲' : '⭐';
            const div = document.createElement('div');
            div.className = 'powerup-badge';
            div.innerText = `${icon} ${Math.ceil(player.powerups[p] / 60)}s`;
            pContainer.appendChild(div);
        }
    }
}

function updateBossBar(boss) {
    const pct = Math.max(0, (boss.hp / boss.maxHp) * 100);
    document.getElementById('boss-hp-fill').style.width = `${pct}%`;
}

function togglePause() {
    if (gameState === 'PLAYING') {
        gameState = 'PAUSED';
        document.getElementById('pause-screen').classList.remove('hidden');
    } else if (gameState === 'PAUSED') {
        gameState = 'PLAYING';
        document.getElementById('pause-screen').classList.add('hidden');
    }
}

function triggerGameOver(reason = 'Game Over!') {
    gameState = 'GAMEOVER';
    audio.playGameOver();
    document.getElementById('gameover-reason').innerText = reason;
    document.getElementById('go-score').innerText = levelScore;
    document.getElementById('go-coins').innerText = `+${levelCoins}`;
    
    saveData.coins += levelCoins;
    if (gameMode === 'endless' && levelScore > (saveData.highScores.endless || 0)) {
        saveData.highScores.endless = levelScore;
    }
    saveGame();

    document.getElementById('gameover-screen').classList.remove('hidden');
}

function triggerWin() {
    gameState = 'WIN';
    audio.playWin();
    
    saveData.coins += levelCoins;
    if (!saveData.unlockedLevels.includes(currentLevelId + 1) && currentLevelId < 5) {
        saveData.unlockedLevels.push(currentLevelId + 1);
    }
    if (levelScore > (saveData.highScores[currentLevelId] || 0)) {
        saveData.highScores[currentLevelId] = levelScore;
    }
    if (levelSpecialStarsCollected > (saveData.levelStars[currentLevelId] || 0)) {
        saveData.levelStars[currentLevelId] = levelSpecialStarsCollected;
    }
    saveGame();

    const mins = Math.floor(levelTime / 60).toString().padStart(2, '0');
    const secs = Math.floor(levelTime % 60).toString().padStart(2, '0');
    document.getElementById('win-level-title').innerText = `Level ${currentLevelId} - ${currentMap.theme.name}`;
    document.getElementById('win-stars-display').innerText = '⭐'.repeat(Math.max(1, levelSpecialStarsCollected));
    document.getElementById('win-time').innerText = `${mins}:${secs}`;
    document.getElementById('win-coins').innerText = `+${levelCoins}`;
    document.getElementById('win-enemies').innerText = `${enemiesDefeated}`;
    document.getElementById('win-score').innerText = levelScore;
    document.getElementById('win-screen').classList.remove('hidden');
}

// --- Game Loop & Render ---
function gameLoop() {
    requestAnimationFrame(gameLoop);

    if (gameState === 'PLAYING' && player && currentMap) {
        levelTime += 1/60;
        if (Math.floor(levelTime * 60) % 30 === 0) updateHUD();

        if (comboTimer > 0) {
            comboTimer--;
            if (comboTimer <= 0) {
                comboMultiplier = 1;
                document.getElementById('combo-display').classList.add('hidden');
            }
        }

        if (screenShake > 0) screenShake *= 0.9;
        if (screenShake < 0.1) screenShake = 0;

        for (let p of currentMap.platforms) {
            if (p.update) p.update();
        }

        player.update(currentMap.platforms, currentMap.theme.grav);

        if (player.y > 600) {
            player.takeDamage('hazard');
            if (player.health > 0) player.respawnAtCheckpoint();
        }

        const targetCamX = player.x - 280;
        cameraX += (targetCamX - cameraX) * 0.12;
        if (cameraX < 0) cameraX = 0;

        if (gameMode === 'endless') {
            levelScore = Math.max(levelScore, Math.floor(player.x / 10) + levelCoins * 50);
            if (player.x > endlessNextX - 1200) {
                const newChunk = generateEndlessChunk(endlessNextX);
                currentMap.platforms.push(...newChunk.platforms);
                currentMap.collectibles.push(...newChunk.collectibles);
                currentMap.enemies.push(...newChunk.enemies);
                endlessNextX = newChunk.nextX;
            }
        }

        if (currentMap.checkpoints) {
            for (let cp of currentMap.checkpoints) cp.update(player);
        }

        for (let c of currentMap.collectibles) c.update(player);
        for (let e of currentMap.enemies) e.update(player);
        if (currentMap.boss) currentMap.boss.update(player);

        for (let i = playerProjectiles.length - 1; i >= 0; i--) {
            const pr = playerProjectiles[i];
            pr.update(currentMap.enemies, currentMap.boss);
            if (pr.life <= 0) playerProjectiles.splice(i, 1);
        }

        if (gameMode === 'adventure' && player.x >= currentMap.finishX) {
            if (!currentMap.boss || currentMap.boss.dead) {
                triggerWin();
            }
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            if (particles[i].life <= 0) particles.splice(i, 1);
        }

        for (let i = scorePopups.length - 1; i >= 0; i--) {
            const sp = scorePopups[i];
            sp.y += sp.vy;
            sp.life--;
        }
    }

    render();
}

function render() {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * screenShake;
        const shakeY = (Math.random() - 0.5) * screenShake;
        ctx.translate(shakeX, shakeY);
    }

    if (!currentMap) {
        ctx.restore();
        return;
    }

    const theme = currentMap.theme || THEMES[1];

    const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    skyGrad.addColorStop(0, theme.sky1);
    skyGrad.addColorStop(1, theme.sky2);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = theme.bg;
    for (let i = -1; i < 7; i++) {
        const hillX = i * 360 - (cameraX * 0.25) % 360;
        ctx.beginPath();
        ctx.arc(hillX + 180, 580, 220, 0, Math.PI, true);
        ctx.fill();
    }

    for (let p of currentMap.platforms) {
        if (p.x + p.w < cameraX - 50 || p.x > cameraX + canvas.width + 50) continue;

        if (p.type === 'hazard') {
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(p.x - cameraX, p.y, p.w, p.h);
            ctx.fillStyle = '#991b1b';
            for (let sx = p.x; sx < p.x + p.w; sx += 16) {
                ctx.beginPath();
                ctx.moveTo(sx - cameraX, p.y + p.h);
                ctx.lineTo(sx + 8 - cameraX, p.y);
                ctx.lineTo(sx + 16 - cameraX, p.y + p.h);
                ctx.fill();
            }
        } else if (p.type === 'spring') {
            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(p.x - cameraX, p.y, p.w, p.h);
            ctx.font = '16px sans-serif';
            ctx.fillText('🌀', p.x - cameraX + p.w/2 - 8, p.y + 15);
        } else {
            const pX = (p.shake ? p.x + p.shake : p.x) - cameraX;
            ctx.fillStyle = p.type === 'moving' ? '#0284c7' : (p.type === 'crumble' ? '#d97706' : theme.ground);
            ctx.fillRect(pX, p.y, p.w, p.h);
            ctx.fillStyle = theme.top;
            ctx.fillRect(pX, p.y, p.w, 6);
        }
    }

    if (currentMap.checkpoints) {
        for (let cp of currentMap.checkpoints) cp.draw(ctx, cameraX);
    }

    if (gameMode === 'adventure') {
        const chestX = currentMap.finishX - cameraX;
        ctx.font = '40px sans-serif';
        ctx.fillText('🏆', chestX, 430);
    }

    if (player) player.draw(ctx, cameraX);
    for (let c of currentMap.collectibles) c.draw(ctx, cameraX);
    for (let e of currentMap.enemies) e.draw(ctx, cameraX);
    if (currentMap.boss) currentMap.boss.draw(ctx, cameraX);
    for (let pr of playerProjectiles) pr.draw(ctx, cameraX);
    for (let pt of particles) pt.draw(ctx, cameraX);

    for (let sp of scorePopups) {
        ctx.fillStyle = sp.color;
        ctx.font = 'bold 14px Fredoka One, sans-serif';
        ctx.globalAlpha = Math.max(0, sp.life / 40);
        ctx.fillText(sp.text, sp.x - cameraX, sp.y);
    }

    ctx.globalAlpha = 1;
    ctx.restore();
}

// --- Game Loop & Render Start ---
gameLoop();

// --- UI Navigation & Shop Management ---
function hideAllScreens() {
    document.querySelectorAll('.screen-overlay').forEach(el => el.classList.add('hidden'));
    document.getElementById('hud').classList.add('hidden');
}

function showTitleScreen() {
    gameState = 'MENU';
    audio.stopBGM();
    hideAllScreens();
    document.getElementById('title-screen').classList.remove('hidden');
    document.getElementById('total-coins-title').innerText = saveData.coins;
}

function populateLevelSelect() {
    const grid = document.getElementById('levels-grid');
    grid.innerHTML = '';
    
    for (let i = 1; i <= 5; i++) {
        const theme = THEMES[i];
        const isUnlocked = saveData.unlockedLevels.includes(i);
        const starsEarned = saveData.levelStars[i] || 0;
        const card = document.createElement('div');
        card.className = `level-card ${isUnlocked ? '' : 'locked'}`;
        card.innerHTML = `
            <div style="font-size: 32px;">${i === 1 ? '🌴' : i === 2 ? '🏜️' : i === 3 ? '❄️' : i === 4 ? '🌋' : '🚀'}</div>
            <div style="font-weight: 800; font-size: 14px;">${theme.name}</div>
            <div style="font-size: 12px; color: #fbbf24;">${'⭐'.repeat(starsEarned)}${'☆'.repeat(3 - starsEarned)}</div>
            <div style="font-size: 11px; color: #94a3b8;">Level ${i}</div>
        `;
        if (isUnlocked) {
            card.onclick = () => startLevel(i, 'adventure');
        }
        grid.appendChild(card);
    }
}

function populateShop() {
    const cont = document.getElementById('characters-container');
    document.getElementById('shop-coins').innerText = saveData.coins;
    cont.innerHTML = '';

    for (let key in CHARACTERS) {
        const c = CHARACTERS[key];
        const isOwned = saveData.unlockedChars.includes(key);
        const isSelected = saveData.selectedChar === key;

        const card = document.createElement('div');
        card.className = `char-card ${isSelected ? 'selected' : ''}`;
        
        let btnHtml = '';
        if (isSelected) {
            btnHtml = `<button class="menu-btn" style="background:#16a34a; font-size:12px; padding:5px 10px;" disabled>EQUIPPED</button>`;
        } else if (isOwned) {
            btnHtml = `<button class="menu-btn select-btn" style="font-size:12px; padding:5px 10px;" data-char="${key}">EQUIP</button>`;
        } else {
            const canAfford = saveData.coins >= c.cost;
            btnHtml = `<button class="menu-btn buy-btn" style="background:${canAfford ? '#eab308' : '#475569'}; font-size:12px; padding:5px 10px;" data-char="${key}" ${canAfford ? '' : 'disabled'}>BUY 🪙 ${c.cost}</button>`;
        }

        card.innerHTML = `
            <div style="font-size: 38px;">${c.icon}</div>
            <div style="font-weight: bold; font-size: 15px;">${c.name}</div>
            <div style="font-size: 11px; color: #94a3b8;">${c.ability}</div>
            <div style="font-size: 11px; color: #cbd5e1;">Weapon: ${c.projectile}</div>
            ${btnHtml}
        `;

        cont.appendChild(card);
    }

    cont.querySelectorAll('.select-btn').forEach(btn => {
        btn.onclick = () => {
            saveData.selectedChar = btn.getAttribute('data-char');
            saveGame();
            populateShop();
        };
    });
    cont.querySelectorAll('.buy-btn').forEach(btn => {
        btn.onclick = () => {
            const k = btn.getAttribute('data-char');
            const cost = CHARACTERS[k].cost;
            if (saveData.coins >= cost) {
                saveData.coins -= cost;
                saveData.unlockedChars.push(k);
                saveData.selectedChar = k;
                audio.playGem();
                saveGame();
                populateShop();
            }
        };
    });
}

// --- Menu Button Event Bindings ---
document.getElementById('btn-play-adventure').onclick = () => {
    audio.init();
    startLevel(1, 'adventure');
};

document.getElementById('btn-play-endless').onclick = () => {
    audio.init();
    startLevel(1, 'endless');
};

document.getElementById('btn-level-select').onclick = () => {
    populateLevelSelect();
    hideAllScreens();
    document.getElementById('level-select-screen').classList.remove('hidden');
};

document.getElementById('btn-character-shop').onclick = () => {
    populateShop();
    hideAllScreens();
    document.getElementById('shop-screen').classList.remove('hidden');
};

document.getElementById('btn-instructions').onclick = () => {
    hideAllScreens();
    document.getElementById('instructions-screen').classList.remove('hidden');
};

document.getElementById('btn-back-from-levels').onclick = showTitleScreen;
document.getElementById('btn-back-from-shop').onclick = showTitleScreen;
document.getElementById('btn-back-from-instructions').onclick = showTitleScreen;

document.getElementById('btn-sound').onclick = () => {
    audio.init();
    const isOn = audio.toggle();
    document.getElementById('btn-sound').innerText = isOn ? '🔊' : '🔇';
};

document.getElementById('btn-menu-floating').onclick = () => {
    gameState = 'MENU';
    showTitleScreen();
};
document.getElementById('btn-pause').onclick = togglePause;
document.getElementById('btn-resume').onclick = togglePause;
document.getElementById('btn-restart-level').onclick = () => startLevel(currentLevelId, gameMode);
document.getElementById('btn-quit-to-menu').onclick = showTitleScreen;

document.getElementById('btn-retry').onclick = () => {
    if (player && player.respawnX !== 80) {
        player.respawnAtCheckpoint();
        gameState = 'PLAYING';
        hideAllScreens();
        document.getElementById('hud').classList.remove('hidden');
    } else {
        startLevel(currentLevelId, gameMode);
    }
};

document.getElementById('btn-go-menu').onclick = showTitleScreen;
document.getElementById('btn-replay-level').onclick = () => startLevel(currentLevelId, 'adventure');
document.getElementById('btn-win-menu').onclick = showTitleScreen;
document.getElementById('btn-next-level').onclick = () => {
    if (currentLevelId < 5) startLevel(currentLevelId + 1, 'adventure');
    else showTitleScreen();
};

// Initial Start
showTitleScreen();
