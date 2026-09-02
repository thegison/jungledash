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
