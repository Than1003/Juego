/**
 * SoundEffects
 * Motor de síntesis de audio procedural en tiempo real utilizando la Web Audio API nativa.
 * Genera efectos sonoros cinematográficos de alta fidelidad sin necesidad de archivos externos.
 */
export class SoundEffects {
  constructor() {
    this.audioCtx = null;
    this.isMuted = false;
    this.masterGain = null;
  }

  /**
   * Inicializa o reactiva el AudioContext tras la primera interacción del usuario
   */
  init() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.setValueAtTime(0.7, this.audioCtx.currentTime);
        this.masterGain.connect(this.audioCtx.destination);
      }
    }

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  /**
   * Alterna el estado de silencio
   * @returns {boolean} Nuevo estado de silencio (true = silenciado)
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(
        this.isMuted ? 0 : 0.7,
        this.audioCtx.currentTime
      );
    }
    return this.isMuted;
  }

  /**
   * Sonido al encender/apagar la linterna de policía
   * @param {boolean} isOn
   */
  playFlashlightSwitch(isOn = true) {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(isOn ? 1800 : 900, now);
    osc.frequency.exponentialRampToValueAtTime(isOn ? 900 : 450, now + 0.04);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  /**
   * Sonido al activar/desactivar la lupa forense
   * @param {boolean} isOn
   */
  playMagnifierToggle(isOn = true) {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(isOn ? 880 : 660, now);
    osc.frequency.exponentialRampToValueAtTime(isOn ? 1320 : 440, now + 0.12);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  /**
   * Acorde dramático y misterioso al abrir la inspección forense del cadáver
   */
  playCorpseZoom() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    // Acorde menor tenso (D2, A2, F3)
    const freqs = [73.42, 110.00, 174.61];

    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.18 - (i * 0.03), now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 1.3);
    });
  }

  /**
   * Sonido al asegurar una evidencia (arpegio brillante y resonante)
   */
  playHit() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    const frequencies = [523.25, 659.25, 783.99, 1046.50]; // Acorde C Mayor brillante (C5, E5, G5, C6)

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0, now + idx * 0.05);
      gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.05 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.45);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.5);
    });
  }

  /**
   * Sonido especial al alcanzar rachas altas de combo
   * @param {number} multiplier
   */
  playCombo(multiplier = 2) {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const baseFreq = 440 + (multiplier * 90);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.25);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  /**
   * Sonido de clic fallido (grave y opaco con penalización)
   */
  playMiss() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.2);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    // Filtro pasabajo para darle textura amortiguada
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, now);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  /**
   * Sonido etéreo de radar / sonar al activar una Pista (Hint)
   */
  playHint() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.5);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.65);
  }

  /**
   * Sonido del reloj de bolsillo en cuenta regresiva (tic-tac tenso)
   * @param {boolean} isCritical
   */
  playTick(isCritical = false) {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(isCritical ? 1200 : 800, now);

    gain.gain.setValueAtTime(isCritical ? 0.15 : 0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  /**
   * Fanfarria triunfal al resolver el caso
   */
  playVictory() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    // Acorde victorioso ascendente
    const notes = [
      { f: 523.25, t: 0.00 }, // C5
      { f: 659.25, t: 0.12 }, // E5
      { f: 783.99, t: 0.24 }, // G5
      { f: 1046.5, t: 0.36 }, // C6
      { f: 1318.5, t: 0.48 }  // E6
    ];

    notes.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, now + note.t);

      gain.gain.setValueAtTime(0.28, now + note.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + 0.65);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + note.t);
      osc.stop(now + note.t + 0.7);
    });
  }

  /**
   * Sonido lúgubre al agotarse el tiempo (Caso archivado)
   */
  playDefeat() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    const notes = [
      { f: 330, t: 0.0 },  // E4
      { f: 311, t: 0.25 }, // Eb4
      { f: 293, t: 0.5 },  // D4
      { f: 220, t: 0.75 }  // A3
    ];

    notes.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(note.f, now + note.t);

      gain.gain.setValueAtTime(0.22, now + note.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + 0.5);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now + note.t);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + note.t);
      osc.stop(now + note.t + 0.55);
    });
  }
}

