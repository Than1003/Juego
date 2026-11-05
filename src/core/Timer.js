/**
 * Timer
 * Gestiona el reloj de cuenta regresiva de la investigación,
 * con soporte para penalizaciones por clics fallidos, pausas y eventos de expiración.
 */
export class Timer {
  /**
   * @param {object} config
   * @param {number} config.totalSeconds Duración total en segundos (default: 90)
   * @param {Function} config.onTick Callback ejecutado cada segundo con los segundos restantes
   * @param {Function} config.onExpire Callback ejecutado al llegar a 0
   */
  constructor({ totalSeconds = 90, onTick = () => {}, onExpire = () => {} } = {}) {
    this.totalSeconds = totalSeconds;
    this.remainingSeconds = totalSeconds;
    this.onTick = onTick;
    this.onExpire = onExpire;
    this.intervalId = null;
    this.isRunning = false;
  }

  /**
   * Inicia el temporizador de cuenta regresiva
   */
  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.onTick(this.remainingSeconds, this.getFormattedTime());

    this.intervalId = setInterval(() => {
      this.remainingSeconds--;

      this.onTick(this.remainingSeconds, this.getFormattedTime());

      if (this.remainingSeconds <= 0) {
        this.stop();
        this.remainingSeconds = 0;
        this.onExpire();
      }
    }, 1000);
  }

  /**
   * Detiene el temporizador
   */
  stop() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Aplica una penalización de tiempo (clic erróneo en la escena)
   * @param {number} seconds Segundos a restar
   */
  penalize(seconds = 2) {
    if (!this.isRunning) return;

    this.remainingSeconds = Math.max(0, this.remainingSeconds - seconds);
    this.onTick(this.remainingSeconds, this.getFormattedTime(), true);

    if (this.remainingSeconds <= 0) {
      this.stop();
      this.remainingSeconds = 0;
      this.onExpire();
    }
  }

  /**
   * Reinicia el temporizador al tiempo inicial
   * @param {number} [newTotalSeconds]
   */
  reset(newTotalSeconds) {
    this.stop();
    if (typeof newTotalSeconds === 'number') {
      this.totalSeconds = newTotalSeconds;
    }
    this.remainingSeconds = this.totalSeconds;
    this.onTick(this.remainingSeconds, this.getFormattedTime());
  }

  /**
   * Devuelve el tiempo restante en formato estándar de detective "MM:SS"
   * @returns {string}
   */
  getFormattedTime() {
    const minutes = Math.floor(this.remainingSeconds / 60);
    const seconds = this.remainingSeconds % 60;
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    return `${mm}:${ss}`;
  }
}

