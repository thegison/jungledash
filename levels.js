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
