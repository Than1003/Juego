/**
 * InputHandler
 * Captura y procesa interacciones de usuario (ratón y gestos táctiles),
 * traduciendo los eventos del navegador al espacio del Canvas.
 */
export class InputHandler {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {import('../core/CoordinateScaler.js').CoordinateScaler} scaler
   * @param {Function} onClickCallback
   */
  constructor(canvas, scaler, onClickCallback) {
    this.canvas = canvas;
    this.scaler = scaler;
    this.onClickCallback = onClickCallback;
    this.clickRipples = [];

    this._bindEvents();
  }

  _bindEvents() {
    this.canvas.addEventListener('click', (e) => {
      this._handleInteraction(e.clientX, e.clientY);
    });

    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        this._handleInteraction(touch.clientX, touch.clientY);
      }
    }, { passive: true });
  }

  _handleInteraction(clientX, clientY) {
    const coords = this.scaler.clientToVirtual(this.canvas, clientX, clientY);

    if (!coords.isInside) return;

    // Registrar onda visual en las coordenadas del clic para feedback instantáneo
    this.addClickRipple(coords.x, coords.y);

    if (typeof this.onClickCallback === 'function') {
      this.onClickCallback(coords.x, coords.y);
    }
  }

  /**
   * Añade una onda visual animada en el punto pulsado.
   * @param {number} x
   * @param {number} y
   */
  addClickRipple(x, y) {
    this.clickRipples.push({
      x,
      y,
      radius: 4,
      maxRadius: 28,
      alpha: 1.0,
      color: '#e74c3c'
    });
  }

  /**
   * Actualiza las animaciones de las ondas de clic.
   */
  updateRipples() {
    for (let i = this.clickRipples.length - 1; i >= 0; i--) {
      const ripple = this.clickRipples[i];
      ripple.radius += 1.8;
      ripple.alpha -= 0.05;

      if (ripple.alpha <= 0) {
        this.clickRipples.splice(i, 1);
      }
    }
  }

  /**
   * Obtiene las ondas de clic activas para renderizado.
   * @returns {Array}
   */
  getRipples() {
    return this.clickRipples;
  }
}

