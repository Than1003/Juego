/**
 * HintManager
 * Gestiona el sistema de pistas (lupa investigativa),
 * administrando cargas limitadas, recarga progresiva por tiempo y selección de evidencias pendientes.
 */
export class HintManager {
  /**
   * @param {object} config
   * @param {import('../scenes/CrimeScene.js').CrimeScene} config.scene
   * @param {number} config.maxHints Cantidad máxima de pistas acumulables (default: 3)
   * @param {number} config.rechargeTimeSeconds Segundos para recargar una pista (default: 25)
   * @param {Function} config.onHintStateChange Callback con estado { availableHints, cooldownProgress }
   */
  constructor({
    scene,
    maxHints = 3,
    rechargeTimeSeconds = 25,
    onHintStateChange = () => {}
  }) {
    this.scene = scene;
    this.maxHints = maxHints;
    this.availableHints = maxHints;
    this.rechargeTimeSeconds = rechargeTimeSeconds;
    this.currentCooldown = 0; // en segundos
    this.cooldownInterval = null;
    this.onHintStateChange = onHintStateChange;
  }

  /**
   * Inicia el ciclo de recarga de pistas
   */
  startRechargeTimer() {
    if (this.cooldownInterval) clearInterval(this.cooldownInterval);

    this.cooldownInterval = setInterval(() => {
      if (this.availableHints < this.maxHints) {
        this.currentCooldown++;
        const progress = (this.currentCooldown / this.rechargeTimeSeconds) * 100;

        if (this.currentCooldown >= this.rechargeTimeSeconds) {
          this.availableHints++;
          this.currentCooldown = 0;
        }

        this._notifyState(progress);
      } else {
        this.currentCooldown = 0;
        this._notifyState(100);
      }
    }, 1000);
  }

  /**
   * Detiene el temporizador de recarga
   */
  stopRechargeTimer() {
    if (this.cooldownInterval) {
      clearInterval(this.cooldownInterval);
      this.cooldownInterval = null;
    }
  }

  /**
   * Solicita una pista para una evidencia pendiente no encontrada
   * @returns {object|null} Objeto de evidencia a revelar o null si no hay pistas/evidencias
   */
  useHint() {
    if (this.availableHints <= 0) {
      return null;
    }

    const remaining = this.scene.getRemainingObjects();
    if (remaining.length === 0) {
      return null;
    }

    // Seleccionar una evidencia pendiente aleatoria
    const randomIndex = Math.floor(Math.random() * remaining.length);
    const targetObject = remaining[randomIndex];

    this.availableHints--;
    this._notifyState(this.availableHints < this.maxHints ? (this.currentCooldown / this.rechargeTimeSeconds) * 100 : 100);

    return targetObject;
  }

  _notifyState(progress) {
    this.onHintStateChange({
      availableHints: this.availableHints,
      maxHints: this.maxHints,
      cooldownProgress: Math.min(100, Math.round(progress))
    });
  }

  /**
   * Reinicia las pistas al estado inicial de caso nuevo
   */
  reset() {
    this.availableHints = this.maxHints;
    this.currentCooldown = 0;
    this._notifyState(100);
  }
}

