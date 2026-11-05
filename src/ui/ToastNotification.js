/**
 * ToastNotification
 * Despliega alertas flotantes contextuales estilo teletipo policial / dossier.
 */
export class ToastNotification {
  /**
   * @param {HTMLElement} containerElement
   */
  constructor(containerElement) {
    this.container = containerElement;
    this.activeToasts = [];
  }

  /**
   * Muestra un mensaje en pantalla
   * @param {string} message
   * @param {'info'|'success'|'warning'|'danger'} type
   * @param {number} durationMs
   */
  show(message, type = 'info', durationMs = 3000) {
    if (!this.container) return;

    const toast = document.createElement('div');
    toast.className = `investigation-toast toast-${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✓';
    if (type === 'warning') icon = '⚠️';
    if (type === 'danger') icon = '✖';

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-text">${message}</span>
    `;

    this.container.appendChild(toast);

    // Animación de entrada
    requestAnimationFrame(() => {
      toast.classList.add('toast-visible');
    });

    // Auto-destrucción
    setTimeout(() => {
      toast.classList.remove('toast-visible');
      toast.classList.add('toast-fadeout');

      setTimeout(() => {
        if (toast.parentNode === this.container) {
          this.container.removeChild(toast);
        }
      }, 400);
    }, durationMs);
  }
}

