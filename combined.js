// Audio Engine using Web Audio API for Jungle Dash
class SoundSystem {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.bgmPlaying = false;
        this.bgmTimer = null;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        if (!this.enabled && this.bgmPlaying) this.stopBGM();
        else if (this.enabled && !this.bgmPlaying) this.startBGM();
        return this.enabled;
    }

    playJump() {
        if (!this.enabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(450, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.13);
    }

    playCoin() {
        if (!this.enabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, now);
        osc.frequency.setValueAtTime(1318.51, now + 0.07);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.23);
    }

    playGem() {
        if (!this.enabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(783.99, now + 0.08);
        osc.frequency.setValueAtTime(1046.50, now + 0.16);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.31);
    }

    playStomp() {
        if (!this.enabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.13);
    }

    playHurt() {
        if (!this.enabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.linearRampToValueAtTime(40, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.21);
    }

    playPowerup() {
        if (!this.enabled || !this.ctx) return;
        const notes = [261.6, 329.6, 392.0, 523.25, 659.25];
        const now = this.ctx.currentTime;
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.05);
            gain.gain.setValueAtTime(0.15, now + idx * 0.05);
            gain.gain.linearRampToValueAtTime(0.01, now + idx * 0.05 + 0.12);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.05);
            osc.stop(now + idx * 0.05 + 0.13);
        });
    }
    playWin() {
        if (!this.enabled || !this.ctx) return;
        const notes = [523.25, 659.25, 783.99, 1046.5];
        const now = this.ctx.currentTime;
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.12);
            gain.gain.setValueAtTime(0.2, now + idx * 0.12);
            gain.gain.linearRampToValueAtTime(0.01, now + idx * 0.12 + 0.2);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.12);
            osc.stop(now + idx * 0.12 + 0.21);
        });
    }

    playGameOver() {
        if (!this.enabled || !this.ctx) return;
        const notes = [440, 392, 349, 293];
        const now = this.ctx.currentTime;
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now + idx * 0.16);
            gain.gain.setValueAtTime(0.18, now + idx * 0.16);
            gain.gain.linearRampToValueAtTime(0.01, now + idx * 0.16 + 0.22);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.16);
            osc.stop(now + idx * 0.16 + 0.23);
        });
    }

    startBGM() {
        if (!this.enabled || !this.ctx || this.bgmPlaying) return;
        this.bgmPlaying = true;
        let step = 0;
        const bass = [130.81, 130.81, 164.81, 146.83, 130.81, 174.61, 196.00, 164.81];
        const melody = [261.63, 0, 329.63, 392.00, 0, 329.63, 261.63, 392.00];

        const loop = () => {
            if (!this.bgmPlaying || !this.enabled || !this.ctx) return;
            const now = this.ctx.currentTime;
            
            const bOsc = this.ctx.createOscillator();
            const bGain = this.ctx.createGain();
            bOsc.type = 'triangle';
            bOsc.frequency.setValueAtTime(bass[step % bass.length], now);
            bGain.gain.setValueAtTime(0.05, now);
            bGain.gain.linearRampToValueAtTime(0.001, now + 0.18);
            bOsc.connect(bGain);
            bGain.connect(this.ctx.destination);
            bOsc.start(now);
            bOsc.stop(now + 0.19);

            const mFreq = melody[step % melody.length];
            if (mFreq > 0) {
                const mOsc = this.ctx.createOscillator();
                const mGain = this.ctx.createGain();
                mOsc.type = 'sine';
                mOsc.frequency.setValueAtTime(mFreq, now);
                mGain.gain.setValueAtTime(0.035, now);
                mGain.gain.linearRampToValueAtTime(0.001, now + 0.15);
                mOsc.connect(mGain);
                mGain.connect(this.ctx.destination);
                mOsc.start(now);
                mOsc.stop(now + 0.16);
            }

            step++;
            this.bgmTimer = setTimeout(loop, 220);
        };
        loop();
    }

    stopBGM() {
        this.bgmPlaying = false;
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
    }
}
const audio = new SoundSystem();

// ==========================================
// Jungle Dash - Levels, Entities & Hazards
// ==========================================

console.log("levels.js loading...");

// --- Collectible Items ---
class Collectible {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.w = 26;
        this.h = 26;
        this.type = type;
        this.baseY = y;
        this.collected = false;
        this.animOffset = Math.random() * 10;
    }

    update(player) {
        if (this.collected) return;
        this.y = this.baseY + Math.sin(Date.now() / 180 + this.animOffset) * 5;

        if ((player.powerups.magnet > 0 || player.char.id === 'robot') && ['coin', 'gem'].includes(this.type)) {
            const dx = (player.x + player.w/2) - (this.x + this.w/2);
            const dy = (player.y + player.h/2) - (this.y + this.h/2);
            const dist = Math.hypot(dx, dy);
            if (dist < 220) {
                this.x += (dx / dist) * 8.5;
                this.y += (dy / dist) * 8.5;
            }
        }

        if (player.x < this.x + this.w && player.x + player.w > this.x &&
            player.y < this.y + this.h && player.y + player.h > this.y) {
            this.collected = true;
            this.onCollect(player);
        }
    }

    onCollect(player) {
        const isDino = player.char.id === 'dinosaur';
        if (this.type === 'coin') {
            const val = isDino ? 2 : 1;
            levelCoins += val;
            levelScore += 100 * val;
            audio.playCoin();
            spawnParticles(this.x + 13, this.y + 13, '#facc15', 6, 2);
            addScorePopup(this.x, this.y, `+${100 * val}`, '#facc15');
        } else if (this.type === 'gem') {
            const val = isDino ? 10 : 5;
            levelCoins += val;
            levelScore += 500;
            audio.playGem();
            spawnParticles(this.x + 13, this.y + 13, '#38bdf8', 10, 3);
            addScorePopup(this.x, this.y, `+500 虫`, '#38bdf8');
        } else if (this.type === 'star_special') {
            levelSpecialStarsCollected++;
            levelScore += 1000;
            audio.playGem();
            spawnParticles(this.x + 13, this.y + 13, '#f59e0b', 16, 4);
            addScorePopup(this.x, this.y, '⭐ STAR FOUND! +1000', '#f59e0b');
        } else if (this.type === 'speed') {
            player.powerups.speed = 420;
            audio.playPowerup();
            spawnParticles(this.x + 13, this.y + 13, '#fbbf24', 12, 3);
            addScorePopup(this.x, this.y, 'SPEED BURST!', '#fbbf24');
        } else if (this.type === 'jump') {
            player.powerups.superJump = 420;
            audio.playPowerup();
            spawnParticles(this.x + 13, this.y + 13, '#a855f7', 12, 3);
            addScorePopup(this.x, this.y, 'SUPER JUMP!', '#a855f7');
        } else if (this.type === 'shield') {
            player.powerups.shield = 600;
            audio.playPowerup();
            spawnParticles(this.x + 13, this.y + 13, '#38bdf8', 12, 3);
            addScorePopup(this.x, this.y, 'SHIELD ACTIVE!', '#38bdf8');
        } else if (this.type === 'magnet') {
            player.powerups.magnet = 480;
            audio.playPowerup();
            spawnParticles(this.x + 13, this.y + 13, '#ec4899', 12, 3);
            addScorePopup(this.x, this.y, 'COIN MAGNET!', '#ec4899');
        } else if (this.type === 'star_inv') {
            player.powerups.star = 360;
            audio.playPowerup();
            spawnParticles(this.x + 13, this.y + 13, '#eab308', 18, 4);
            addScorePopup(this.x, this.y, 'INVINCIBLE!', '#eab308');
        } else if (this.type === 'heart') {
            if (player.health < player.maxHealth) player.health++;
            audio.playPowerup();
            spawnParticles(this.x + 13, this.y + 13, '#ef4444', 12, 3);
            addScorePopup(this.x, this.y, '+1 HP ❤️', '#ef4444');
        }
        updateHUD();
    }

    draw(ctx, camX) {
        if (this.collected) return;
        const drawX = this.x - camX;
        ctx.font = '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        let icon = '🪙';
        if (this.type === 'gem') icon = '💎';
        else if (this.type === 'star_special') icon = '⭐';
        else if (this.type === 'speed') icon = '⚡';
        else if (this.type === 'jump') icon = '🦘';
        else if (this.type === 'shield') icon = '🛡️';
        else if (this.type === 'magnet') icon = '🧲';
        else if (this.type === 'star_inv') icon = '✨';
        else if (this.type === 'heart') icon = '❤️';

        ctx.fillText(icon, drawX + 13, this.y + 13);
    }
}
// --- Checkpoint Flag ---
class Checkpoint {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 32;
        this.h = 48;
        this.activated = false;
    }
    update(player) {
        if (!this.activated && player.x < this.x + this.w && player.x + player.w > this.x &&
            player.y < this.y + this.h && player.y + player.h > this.y) {
            this.activated = true;
            player.respawnX = this.x;
            player.respawnY = this.y - 10;
            audio.playGem();
            spawnParticles(this.x + 16, this.y + 20, '#22c55e', 20, 4);
            addScorePopup(this.x, this.y - 10, '圸 CHECKPOINT SAVED!', '#22c55e');
        }
    }
    draw(ctx, camX) {
        const drawX = this.x - camX;
        ctx.font = '32px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(this.activated ? '🚩' : '🏁', drawX + 16, this.y + 36);
    }
}

// --- Dynamic Interactive Platforms ---
class MovingPlatform {
    constructor(x, y, w, h, dx, dy, speed = 1.2) {
        this.startX = x;
        this.startY = y;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.dx = dx;
        this.dy = dy;
        this.speed = speed;
        this.vx = 0;
        this.vy = 0;
        this.t = Math.random() * Math.PI * 2;
        this.type = 'moving';
    }
    update() {
        this.t += 0.03 * this.speed;
        const prevX = this.x;
        const prevY = this.y;
        this.x = this.startX + Math.sin(this.t) * this.dx;
        this.y = this.startY + Math.sin(this.t) * this.dy;
        this.vx = this.x - prevX;
        this.vy = this.y - prevY;
    }
}

class CrumblingPlatform {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.baseY = y;
        this.timer = 0;
        this.type = 'crumble';
    }
    update() {
        if (this.timer > 0) {
            this.timer++;
            if (this.timer >= 35 && this.timer < 110) {
                this.y += 6;
            } else if (this.timer >= 110) {
                this.y = this.baseY;
                this.timer = 0;
            }
        }
    }
}
// --- Enemies ---
class Enemy {
    constructor(x, y, type = 'slime', patrolDist = 120) {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.w = 32;
        this.h = 28;
        this.type = type;
        this.vx = type === 'bat' ? 1.8 : 1.3;
        this.patrolDist = patrolDist;
        this.dead = false;
        this.baseY = y;
        this.animTimer = Math.random() * 100;
        this.falling = false;
    }

    update(player) {
        if (this.dead) return;
        this.animTimer += 0.1;

        if (this.type === 'icicle') {
            if (!this.falling && Math.abs(player.x - this.x) < 70 && player.y > this.y) {
                this.falling = true;
            }
            if (this.falling) {
                this.y += 7;
                if (this.y > 600) this.dead = true;
            }
        } else if (this.type === 'bat') {
            this.x += this.vx;
            this.y = this.baseY + Math.sin(this.animTimer) * 28;
            if (Math.abs(this.x - this.startX) > this.patrolDist) this.vx *= -1;
        } else {
            this.x += this.vx;
            if (Math.abs(this.x - this.startX) > this.patrolDist) this.vx *= -1;
        }

        if (player.x < this.x + this.w && player.x + player.w > this.x &&
            player.y < this.y + this.h && player.y + player.h > this.y) {
            
            if ((player.vy > 0 && player.y + player.h - player.vy <= this.y + 16) || player.powerups.star > 0) {
                this.dead = true;
                player.vy = -10.5;
                levelScore += 300 * comboMultiplier;
                enemiesDefeated++;
                triggerCombo();
                audio.playStomp();
                spawnParticles(this.x + 16, this.y + 14, '#ef4444', 16, 4);
                addScorePopup(this.x, this.y, `STOMP! +${300 * comboMultiplier}`, '#f87171');
                updateHUD();
            } else {
                player.takeDamage('enemy');
            }
        }
    }

    takeHit() {
        if (this.dead) return;
        this.dead = true;
        levelScore += 250 * comboMultiplier;
        enemiesDefeated++;
        triggerCombo();
        audio.playStomp();
        spawnParticles(this.x + 16, this.y + 14, '#f59e0b', 16, 4);
        addScorePopup(this.x, this.y, `HIT! +${250 * comboMultiplier}`, '#f59e0b');
        updateHUD();
    }

    draw(ctx, camX) {
        if (this.dead) return;
        const drawX = this.x - camX;
        ctx.font = '26px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        let icon = '🐢';
        if (this.type === 'bat') icon = '🦇';
        else if (this.type === 'scorpion') icon = '🦂';
        else if (this.type === 'icicle') icon = '❄️';
        else if (this.type === 'drone') icon = '🚁';

        ctx.fillText(icon, drawX + 16, this.y + 14);
    }
}

// --- Epic Boss Entity with Phases & Attacks ---
class Boss {
    constructor(x, y, name, maxHp = 8) {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.baseY = y;
        this.w = 68;
        this.h = 68;
        this.name = name;
        this.maxHp = maxHp;
        this.hp = maxHp;
        this.vx = 2.2;
        this.dead = false;
        this.hitCooldown = 0;
        this.projectiles = [];
        this.attackTimer = 0;
        this.phase = 1;
    }

    update(player) {
        if (this.dead) return;
        if (this.hitCooldown > 0) this.hitCooldown--;

        this.phase = this.hp <= this.maxHp * 0.5 ? 2 : 1;
        const currentSpeed = this.phase === 2 ? 3.4 : 2.2;
        this.x += (this.vx > 0 ? currentSpeed : -currentSpeed);
        if (Math.abs(this.x - this.startX) > 180) this.vx *= -1;

        this.attackTimer++;
        const attackInterval = this.phase === 2 ? 75 : 110;
        if (this.attackTimer > attackInterval) {
            this.attackTimer = 0;
            const dir = player.x < this.x ? -1 : 1;
            const pSpeed = this.phase === 2 ? 5.5 : 4.2;
            
            this.projectiles.push({ x: this.x + 34, y: this.y + 34, vx: dir * pSpeed, vy: 0, life: 120, icon: '🔥' });
            
            if (this.phase === 2) {
                this.projectiles.push({ x: this.x + 34, y: this.y + 34, vx: dir * pSpeed, vy: -1.8, life: 120, icon: '💥' });
                this.projectiles.push({ x: this.x + 34, y: this.y + 34, vx: dir * pSpeed, vy: 1.8, life: 120, icon: '💥' });
            }
        }

        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life--;

            if (player.x < p.x + 14 && player.x + player.w > p.x - 14 &&
                player.y < p.y + 14 && player.y + player.h > p.y - 14) {
                player.takeDamage('enemy');
                this.projectiles.splice(i, 1);
                continue;
            }
            if (p.life <= 0) this.projectiles.splice(i, 1);
        }

        if (player.x < this.x + this.w && player.x + player.w > this.x &&
            player.y < this.y + this.h && player.y + player.h > this.y) {
            
            if (player.vy > 0 && player.y + player.h - player.vy <= this.y + 24 && this.hitCooldown === 0) {
                this.takeHit(player);
                player.vy = -12;
            } else if (this.hitCooldown === 0) {
                player.takeDamage('enemy');
            }
        }
    }

    takeHit(player = null) {
        if (this.hitCooldown > 0 || this.dead) return;
        this.hp--;
        this.hitCooldown = 45;
        audio.playStomp();
        spawnParticles(this.x + 34, this.y + 34, '#f97316', 20, 5);
        screenShake = 12;
        addScorePopup(this.x + 34, this.y, 'BOSS HIT! -1 HP', '#ef4444');
        updateBossBar(this);

        if (this.hp <= 0) {
            this.dead = true;
            levelScore += 3000;
            audio.playWin();
            spawnParticles(this.x + 34, this.y + 34, '#fbbf24', 45, 8);
            addScorePopup(this.x + 34, this.y, '醇 BOSS DEFEATED! +3000', '#fbbf24');
            updateHUD();
        }
    }

    draw(ctx, camX) {
        if (this.dead) return;
        const drawX = this.x - camX;

        if (this.hitCooldown > 0 && Math.floor(Date.now() / 50) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }

        ctx.fillStyle = '#8b2500';
        ctx.fillRect(drawX, this.y, 68, 68);
        ctx.font = 'bold 28px sans-serif';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('👹', drawX + 34, this.y + 34);

        ctx.globalAlpha = 1;

        // Draw boss health bar
        ctx.fillStyle = '#555';
        ctx.fillRect(drawX, this.y - 15, 68, 8);
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(drawX, this.y - 15, (this.hp / this.maxHp) * 68, 8);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(drawX, this.y - 15, 68, 8);
    }
}

// --- Themes & Handcrafted Level Layouts ---
const THEMES = {
    1: { name: 'Green Jungle', bg: '#064e3b', sky1: '#065f46', sky2: '#022c22', ground: '#15803d', top: '#4ade80', grav: 0.5 },
    2: { name: 'Desert Dunes', bg: '#78350f', sky1: '#92400e', sky2: '#451a03', ground: '#d97706', top: '#fde047', grav: 0.5 },
    3: { name: 'Ice Mountain', bg: '#0c4a6e', sky1: '#075985', sky2: '#082f49', ground: '#0284c7', top: '#e0f2fe', grav: 0.48 },
    4: { name: 'Volcano Core', bg: '#450a0a', sky1: '#7f1d1d', sky2: '#1c0505', ground: '#b91c1c', top: '#f97316', grav: 0.5 },
    5: { name: 'Space World', bg: '#09090b', sky1: '#1e1b4b', sky2: '#020617', ground: '#6366f1', top: '#c084fc', grav: 0.28 }
};

function generateLevel(lvlId) {
    const theme = THEMES[lvlId] || THEMES[1];
    const platforms = [];
    const collectibles = [];
    const enemies = [];
    const checkpoints = [];
    let boss = null;
    let finishX = 3200;

    platforms.push({ x: 0, y: 460, w: 550, h: 80, type: 'ground' });

    if (lvlId === 1) {
        finishX = 2900;
        checkpoints.push(new Checkpoint(1450, 412));

        platforms.push({ x: 180, y: 320, w: 120, h: 22, type: 'normal' });
        collectibles.push(new Collectible(240, 270, 'star_special'));

        platforms.push({ x: 620, y: 410, w: 140, h: 22, type: 'normal' });
        collectibles.push(new Collectible(670, 360, 'coin'));
        collectibles.push(new Collectible(720, 360, 'coin'));
        enemies.push(new Enemy(680, 380, 'slime', 50));

        platforms.push({ x: 840, y: 340, w: 130, h: 22, type: 'normal' });
        collectibles.push(new Collectible(890, 290, 'gem'));
        collectibles.push(new Collectible(940, 290, 'speed'));

        platforms.push(new MovingPlatform(1050, 350, 120, 20, 100, 0, 1.2));
        platforms.push({ x: 1050, y: 490, w: 280, h: 30, type: 'hazard' });

        platforms.push({ x: 1380, y: 460, w: 450, h: 80, type: 'ground' });
        collectibles.push(new Collectible(1550, 410, 'heart'));
        enemies.push(new Enemy(1620, 430, 'slime', 80));

        platforms.push({ x: 1720, y: 440, w: 60, h: 20, type: 'spring' });
        platforms.push({ x: 1800, y: 220, w: 140, h: 20, type: 'normal' });
        collectibles.push(new Collectible(1860, 160, 'star_special'));

        platforms.push(new CrumblingPlatform(2000, 340, 100, 20));
        platforms.push(new CrumblingPlatform(2150, 340, 100, 20));
        collectibles.push(new Collectible(2080, 290, 'magnet'));

        platforms.push({ x: 2320, y: 380, w: 120, h: 20, type: 'normal' });
        enemies.push(new Enemy(2360, 350, 'bat', 60));
        collectibles.push(new Collectible(2370, 320, 'star_special'));

        platforms.push({ x: 2500, y: 460, w: 500, h: 80, type: 'ground' });
        enemies.push(new Enemy(2620, 430, 'slime', 70));
        enemies.push(new Enemy(2740, 430, 'slime', 70));
    }
    else if (lvlId === 2) {
        finishX = 3100;
        checkpoints.push(new Checkpoint(1550, 412));

        platforms.push({ x: 600, y: 460, w: 200, h: 30, type: 'hazard' });
        platforms.push(new MovingPlatform(620, 360, 110, 20, 80, 0, 1.4));
        collectibles.push(new Collectible(660, 300, 'coin'));

        platforms.push({ x: 800, y: 460, w: 350, h: 80, type: 'ground' });
        platforms.push({ x: 920, y: 310, w: 100, h: 20, type: 'normal' });
        collectibles.push(new Collectible(960, 250, 'star_special'));
        enemies.push(new Enemy(900, 430, 'scorpion', 80));

        platforms.push(new CrumblingPlatform(1200, 390, 90, 20));
        platforms.push(new CrumblingPlatform(1340, 340, 90, 20));
        collectibles.push(new Collectible(1270, 290, 'jump'));

        platforms.push({ x: 1480, y: 460, w: 400, h: 80, type: 'ground' });
        collectibles.push(new Collectible(1680, 410, 'star_inv'));

        platforms.push({ x: 1950, y: 360, w: 90, h: 20, type: 'normal' });
        platforms.push({ x: 2100, y: 280, w: 90, h: 20, type: 'normal' });
        collectibles.push(new Collectible(2140, 220, 'star_special'));

        platforms.push(new MovingPlatform(2250, 320, 100, 20, 0, 70, 1.3));
        collectibles.push(new Collectible(2290, 260, 'star_special'));

        platforms.push({ x: 2450, y: 460, w: 700, h: 80, type: 'ground' });
        enemies.push(new Enemy(2600, 430, 'scorpion', 100));
        enemies.push(new Enemy(2800, 430, 'bat', 80));
    }
    else if (lvlId === 3) {
        finishX = 3200;
        checkpoints.push(new Checkpoint(1600, 412));

        platforms.push({ x: 600, y: 390, w: 130, h: 22, type: 'normal' });
        enemies.push(new Enemy(650, 150, 'icicle', 0));
        collectibles.push(new Collectible(650, 330, 'star_special'));

        platforms.push({ x: 800, y: 320, w: 120, h: 22, type: 'normal' });
        enemies.push(new Enemy(850, 120, 'icicle', 0));
        collectibles.push(new Collectible(850, 260, 'shield'));

        platforms.push(new MovingPlatform(980, 300, 100, 20, 0, 80, 1.2));
        platforms.push({ x: 1140, y: 220, w: 120, h: 20, type: 'normal' });
        collectibles.push(new Collectible(1190, 160, 'star_special'));

        platforms.push({ x: 1350, y: 460, w: 500, h: 80, type: 'ground' });
        platforms.push({ x: 1420, y: 440, w: 80, h: 20, type: 'spring' });
        enemies.push(new Enemy(1550, 430, 'bat', 70));

        platforms.push({ x: 1900, y: 350, w: 110, h: 20, type: 'normal' });
        platforms.push(new CrumblingPlatform(2060, 350, 100, 20));
        platforms.push(new CrumblingPlatform(2200, 350, 100, 20));
        collectibles.push(new Collectible(2140, 290, 'heart'));
        collectibles.push(new Collectible(2260, 290, 'gem'));
    }
    else if (lvlId === 4) {
        finishX = 3300;
        checkpoints.push(new Checkpoint(1600, 412));

        platforms.push({ x: 600, y: 480, w: 250, h: 40, type: 'hazard' });
        platforms.push(new MovingPlatform(630, 360, 100, 20, 70, 0, 1.4));
        collectibles.push(new Collectible(670, 300, 'star_special'));

        platforms.push({ x: 880, y: 340, w: 140, h: 22, type: 'normal' });
        enemies.push(new Enemy(940, 310, 'bat', 60));
        collectibles.push(new Collectible(940, 280, 'shield'));

        platforms.push({ x: 1080, y: 260, w: 120, h: 20, type: 'normal' });
        collectibles.push(new Collectible(1130, 200, 'star_special'));

        platforms.push({ x: 1260, y: 350, w: 110, h: 20, type: 'spring' });
        platforms.push({ x: 1440, y: 460, w: 400, h: 80, type: 'ground' });

        platforms.push(new MovingPlatform(1900, 350, 110, 20, 80, 0, 1.5));
        platforms.push(new CrumblingPlatform(2100, 330, 90, 20));
        collectibles.push(new Collectible(2140, 270, 'star_special'));

        platforms.push({ x: 2350, y: 440, w: 1000, h: 100, type: 'ground' });
        platforms.push({ x: 2500, y: 320, w: 120, h: 20, type: 'normal' });
        platforms.push({ x: 2800, y: 320, w: 120, h: 20, type: 'normal' });
        collectibles.push(new Collectible(2650, 380, 'heart'));
        boss = new Boss(2700, 370, 'Ignis Magma Drake', 8);
    }
    else if (lvlId === 5) {
        finishX = 3500;
        checkpoints.push(new Checkpoint(1700, 412));

        platforms.push({ x: 600, y: 360, w: 120, h: 20, type: 'normal' });
        collectibles.push(new Collectible(650, 300, 'star_special'));

        platforms.push(new MovingPlatform(780, 280, 110, 20, 0, 80, 1.3));
        collectibles.push(new Collectible(820, 200, 'star_inv'));

        platforms.push({ x: 960, y: 220, w: 130, h: 20, type: 'normal' });
        enemies.push(new Enemy(1020, 180, 'drone', 50));
        collectibles.push(new Collectible(1020, 150, 'star_special'));

        platforms.push({ x: 1150, y: 320, w: 100, h: 20, type: 'spring' });
        platforms.push({ x: 1300, y: 160, w: 140, h: 20, type: 'normal' });
        collectibles.push(new Collectible(1360, 100, 'star_special'));

        platforms.push({ x: 1520, y: 460, w: 450, h: 80, type: 'ground' });
        enemies.push(new Enemy(1680, 430, 'drone', 70));

        platforms.push(new MovingPlatform(2030, 330, 110, 20, 90, 0, 1.5));
        platforms.push(new MovingPlatform(2260, 260, 110, 20, 0, 80, 1.4));

        platforms.push({ x: 2500, y: 440, w: 1100, h: 100, type: 'ground' });
        platforms.push({ x: 2680, y: 300, w: 140, h: 20, type: 'normal' });
        platforms.push({ x: 3000, y: 300, w: 140, h: 20, type: 'normal' });
        collectibles.push(new Collectible(2840, 380, 'heart'));
        boss = new Boss(2900, 360, 'Vortex Alien Overlord', 10);
    }

    return { platforms, collectibles, enemies, checkpoints, boss, finishX, theme };
}

function generateEndlessChunk(startX) {
    const chunkPlatforms = [];
    const chunkCollectibles = [];
    const chunkEnemies = [];

    let currX = startX;
    for (let i = 0; i < 6; i++) {
        const w = 120 + Math.random() * 110;
        const gap = 80 + Math.random() * 80;
        const y = 300 + Math.random() * 140;
        currX += gap;

        const isSpring = Math.random() < 0.15;
        const isHazard = Math.random() < 0.15;
        const isMoving = Math.random() < 0.2;

        if (isHazard) {
            chunkPlatforms.push({ x: currX, y: 470, w: w, h: 20, type: 'hazard' });
        } else if (isMoving) {
            chunkPlatforms.push(new MovingPlatform(currX, y, w, 22, 60, 0, 1.2));
            chunkCollectibles.push(new Collectible(currX + w/2, y - 30, 'coin'));
        } else if (isSpring) {
            chunkPlatforms.push({ x: currX, y: y, w: 60, h: 20, type: 'spring' });
        } else {
            chunkPlatforms.push({ x: currX, y: y, w: w, h: 22, type: 'normal' });
            
            const r = Math.random();
            if (r < 0.45) chunkCollectibles.push(new Collectible(currX + w/2, y - 30, 'coin'));
            else if (r < 0.7) chunkCollectibles.push(new Collectible(currX + w/2, y - 30, 'gem'));
            else if (r < 0.8) chunkCollectibles.push(new Collectible(currX + w/2, y - 30, 'speed'));
            else if (r < 0.9) chunkCollectibles.push(new Collectible(currX + w/2, y - 30, 'magnet'));

            if (Math.random() < 0.35) {
                chunkEnemies.push(new Enemy(currX + w/2, y - 30, Math.random() < 0.5 ? 'slime' : 'bat'));
            }
        }
        currX += w;
    }

    return { platforms: chunkPlatforms, collectibles: chunkCollectibles, enemies: chunkEnemies, nextX: currX };
}

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

        for (let e of enemies) {
            if (!e.dead && Math.abs(this.x - (e.x + 16)) < 24 && Math.abs(this.y - (e.y + 14)) < 24) {
                e.takeHit();
                this.life = 0;
                break;
            }
        }
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
                        continue;
                    }
                    this.y = p.y - this.h;
                    this.vy = 0;
                    this.onGround = true;
                    this.canDoubleJump = true;
                    if (p.type === 'crumble' && p.timer === 0) p.timer = 1;
                    if (p.vx) this.x += p.vx;
                } else if (this.vy < 0 && p.type === 'ground') {
                    this.y = p.y + this.h;
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

gameLoop();

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

showTitleScreen();
