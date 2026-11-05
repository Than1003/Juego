/**
 * CoordinateScaler
 * Transforma coordenadas de pantalla (CSS / clientX, clientY)
 * a coordenadas virtuales nativas del Canvas (1280x720) de forma determinista y precisa.
 */
export class CoordinateScaler {
  /**
   * @param {number} virtualWidth Ancho nativo del juego (1280)
   * @param {number} virtualHeight Alto nativo del juego (720)
   */
  constructor(virtualWidth = 1280, virtualHeight = 720) {
    this.virtualWidth = virtualWidth;
    this.virtualHeight = virtualHeight;
  }

  /**
   * Convierte coordenadas de un evento del mouse/touch al espacio de coordenadas del Canvas.
   * @param {HTMLCanvasElement} canvas Elemento Canvas
   * @param {number} clientX Posición X del puntero en pantalla
   * @param {number} clientY Posición Y del puntero en pantalla
   * @returns {{ x: number, y: number, isInside: boolean }} Coordenadas virtuales calculadas
   */
  clientToVirtual(canvas, clientX, clientY) {
    const rect = canvas.getBoundingClientRect();

    // Comprobar si el clic ocurrió dentro del área visible del canvas
    const isInside = (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    );

    // Factor de escala entre el tamaño renderizado en CSS y la resolución interna
    const scaleX = this.virtualWidth / rect.width;
    const scaleY = this.virtualHeight / rect.height;

    const x = Math.round((clientX - rect.left) * scaleX);
    const y = Math.round((clientY - rect.top) * scaleY);

    return {
      x: Math.max(0, Math.min(this.virtualWidth, x)),
      y: Math.max(0, Math.min(this.virtualHeight, y)),
      isInside
    };
  }

  /**
   * Convierte coordenadas virtuales al espacio CSS en pantalla (útil para overlays DOM)
   * @param {HTMLCanvasElement} canvas
   * @param {number} virtualX
   * @param {number} virtualY
   * @returns {{ screenX: number, screenY: number }}
   */
  virtualToClient(canvas, virtualX, virtualY) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = rect.width / this.virtualWidth;
    const scaleY = rect.height / this.virtualHeight;

    return {
      screenX: rect.left + (virtualX * scaleX),
      screenY: rect.top + (virtualY * scaleY)
    };
  }
}

