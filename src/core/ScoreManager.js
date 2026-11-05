/**
 * ScoreManager
 * Gestiona el sistema de puntuación, multiplicadores de combo consecutivos,
 * penalizaciones por clics fallidos (-50 pts), bonificaciones de tiempo restante y cálculo de estrellas.
 */
export class ScoreManager {
  /**
   * @param {object} config
   * @param {Function} config.onScoreUpdate Callback al cambiar puntuación
   * @param {Function} config.onComboUpdate Callback al cambiar combo o multiplicador
   */
  constructor({ onScoreUpdate = () => {}, onComboUpdate = () => {} } = {}) {
    this.score = 0;
    this.baseObjectPoints = 1000;
    this.misclickPenalty = 50; // Penalización solicitada: 50 pts por clic fallido
    this.multiplier = 1;
    this.maxMultiplier = 5;
    this.comboTimeoutMs = 3500;
    this.comboTimer = null;

    // Estadísticas
    this.maxComboReached = 1;
    this.totalMisclicks = 0;
    this.timeBonusEarned = 0;

    this.onScoreUpdate = onScoreUpdate;
    this.onComboUpdate = onComboUpdate;
  }

  /**
   * Procesa el hallazgo de una evidencia correcta
   * @returns {{ pointsEarned: number, multiplier: number }}
   */
  registerHit() {
    const pointsEarned = this.baseObjectPoints * this.multiplier;
    this.score += pointsEarned;

    const currentMultiplier = this.multiplier;
    if (this.multiplier < this.maxMultiplier) {
      this.multiplier++;
    }

    if (this.multiplier > this.maxComboReached) {
      this.maxComboReached = this.multiplier;
    }

    this._startComboTimer();

    this.onScoreUpdate(this.score, pointsEarned, true);
    this.onComboUpdate(this.multiplier, true);

    return { pointsEarned, multiplier: currentMultiplier };
  }

  /**
   * Procesa un clic fallido en la escena (-50 puntos)
   * @returns {number} Puntos restados
   */
  registerMisclick() {
    this.totalMisclicks++;
    this.score = Math.max(0, this.score - this.misclickPenalty);
    this.resetCombo();

    this.onScoreUpdate(this.score, -this.misclickPenalty, false);
    return this.misclickPenalty;
  }

  /**
   * Añade el bonus de tiempo al ganar un nivel
   * @param {number} remainingSeconds
   * @returns {number}
   */
  applyTimeBonus(remainingSeconds) {
    this.timeBonusEarned = remainingSeconds * 100;
    this.score += this.timeBonusEarned;
    this.onScoreUpdate(this.score, this.timeBonusEarned, true);
    return this.timeBonusEarned;
  }

  resetCombo() {
    if (this.comboTimer) {
      clearTimeout(this.comboTimer);
      this.comboTimer = null;
    }
    this.multiplier = 1;
    this.onComboUpdate(this.multiplier, false);
  }

  _startComboTimer() {
    if (this.comboTimer) {
      clearTimeout(this.comboTimer);
    }

    this.comboTimer = setTimeout(() => {
      this.resetCombo();
    }, this.comboTimeoutMs);
  }

  calculateStars() {
    if (this.score >= 12000) return 5;
    if (this.score >= 9500) return 4;
    if (this.score >= 7000) return 3;
    if (this.score >= 4500) return 2;
    return 1;
  }

  reset() {
    this.resetCombo();
    this.score = 0;
    this.multiplier = 1;
    this.maxComboReached = 1;
    this.totalMisclicks = 0;
    this.timeBonusEarned = 0;
    this.onScoreUpdate(0, 0, false);
    this.onComboUpdate(1, false);
  }
}
