/**
 * ParticleSystem
 * Motor de física de partículas 2D para efectos de hallazgo de evidencias y celebración de victoria.
 */
export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  /**
   * Genera una explosión de chispas doradas y estrellas al asegurar una evidencia
   * @param {number} x
   * @param {number} y
   * @param {number} count
   */
  emitEvidenceSparkles(x, y, count = 35) {
    const colors = ['#f1c40f', '#f39c12', '#ffeaa7', '#ffffff', '#2ecc71'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6.5 + 2.0;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4.5 + 2.0,
        alpha: 1.0,
        decay: Math.random() * 0.025 + 0.015,
        color: colors[Math.floor(Math.random() * colors.length)],
        gravity: 0.12,
        friction: 0.96,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
        type: Math.random() > 0.5 ? 'sparkle' : 'circle'
      });
    }
  }

  /**
   * Genera una lluvia de confeti investigativo y orbes dorados al resolver el caso
   * @param {number} width
   * @param {number} height
   * @param {number} count
   */
  emitVictoryConfetti(width = 1280, height = 720, count = 120) {
    const colors = ['#f1c40f', '#e67e22', '#2ecc71', '#3498db', '#9b59b6', '#ffffff'];

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * width,
        y: -10 - (Math.random() * 100),
        vx: (Math.random() - 0.5) * 4.0,
        vy: Math.random() * 4.5 + 2.0,
        size: Math.random() * 7 + 4,
        alpha: 1.0,
        decay: Math.random() * 0.005 + 0.003,
        color: colors[Math.floor(Math.random() * colors.length)],
        gravity: 0.05,
        friction: 0.99,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.15,
        type: 'ribbon'
      });
    }
  }

  /**
   * Actualiza la física de todas las partículas activas
   */
  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      p.vx *= p.friction;
      p.vy = (p.vy * p.friction) + p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.vRot;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  /**
   * Dibuja todas las partículas en el contexto 2D del Canvas
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    if (this.particles.length === 0) return;

    ctx.save();

    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      if (p.type === 'sparkle') {
        // Estrella de 4 puntas reluciente
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 1.5);
        ctx.lineTo(p.size * 0.4, -p.size * 0.4);
        ctx.lineTo(p.size * 1.5, 0);
        ctx.lineTo(p.size * 0.4, p.size * 0.4);
        ctx.lineTo(0, p.size * 1.5);
        ctx.lineTo(-p.size * 0.4, p.size * 0.4);
        ctx.lineTo(-p.size * 1.5, 0);
        ctx.lineTo(-p.size * 0.4, -p.size * 0.4);
        ctx.closePath();
        ctx.fill();
      } else if (p.type === 'ribbon') {
        // Tira rectangular de confeti
        ctx.fillRect(-p.size / 2, -p.size, p.size, p.size * 1.6);
      } else {
        // Círculo brillante
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    ctx.restore();
  }

  /**
   * Limpia todas las partículas activas
   */
  clear() {
    this.particles = [];
  }
}

