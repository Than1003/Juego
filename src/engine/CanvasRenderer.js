import { ParticleSystem } from './ParticleSystem.js';

/**
 * CanvasRenderer
 * Motor gráfico 2D multicapa con soporte avanzado para:
 * - Escena principal y sub-escenas vectoriales (zoom-in en cadáver y contenedores).
 * - MODO LINTERNA: Escenario en penumbra con halo de luz direccional interactivo.
 * - LUPA FORENSE 2X: Lente de aumento óptico con montura de latón para micro-evidencias.
 * - Cubiertas desplazables en escena principal y en el cadáver (solapa de chaqueta, tapetes, etc.).
 * - Atmósfera cinematográfica Police Noir (viñeta, sello pericial y partículas).
 */
export class CanvasRenderer {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {import('../scenes/CrimeScene.js').CrimeScene} scene
   */
  constructor(canvas, scene) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.scene = scene;
    this.showDebug = false;
    this.currentView = 'MAIN'; // 'MAIN' o id del contenedor/cadáver
    this.foundMarkers = [];
    this.activeHints = [];
    this.particleSystem = new ParticleSystem();
    this.pulseAnim = 0;

    // Herramientas de detective
    this.flashlightEnabled = false;
    this.magnifierEnabled = false;
    this.mouseVirtualX = -1;
    this.mouseVirtualY = -1;

    // Canvas auxiliar para la lupa de aumento 2x y composición multicapa
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCanvas.width = 1280;
    this.offscreenCanvas.height = 720;
    this.offCtx = this.offscreenCanvas.getContext('2d');
  }

  setCurrentView(viewId = 'MAIN') {
    this.currentView = viewId;
  }

  setFlashlight(enabled) {
    this.flashlightEnabled = Boolean(enabled);
  }

  setMagnifier(enabled) {
    this.magnifierEnabled = Boolean(enabled);
  }

  setMouseVirtual(x, y) {
    this.mouseVirtualX = x;
    this.mouseVirtualY = y;
  }

  toggleDebug() {
    this.showDebug = !this.showDebug;
    return this.showDebug;
  }

  addFoundMarker(x, y, radius, label, viewId = 'MAIN') {
    this.foundMarkers.push({
      x,
      y,
      radius,
      label,
      viewId,
      pulse: 0
    });
  }

  clearFoundMarkers() {
    this.foundMarkers = [];
    this.activeHints = [];
    this.particleSystem.clear();
  }

  addHintBeacon(x, y, radius, label, durationMs = 4500) {
    this.activeHints.push({
      x,
      y,
      radius,
      label,
      viewId: this.currentView,
      startTime: performance.now(),
      duration: durationMs
    });
  }

  emitEvidenceSparkles(x, y) {
    this.particleSystem.emitEvidenceSparkles(x, y, 40);
  }

  emitVictoryConfetti() {
    this.particleSystem.emitVictoryConfetti(this.canvas.width, this.canvas.height, 140);
  }

  /**
   * Bucle de renderizado principal multicapa
   * @param {Array} ripples
   * @param {number} mouseX
   * @param {number} mouseY
   */
  render(ripples = [], mouseX = -1, mouseY = -1) {
    const { ctx, canvas } = this;
    if (mouseX >= 0 && mouseY >= 0) {
      this.mouseVirtualX = mouseX;
      this.mouseVirtualY = mouseY;
    }

    this.pulseAnim += 0.04;

    // =========================================================================
    // CAPA 1: DIBUJAR LA ESCENA BASE EN EL CANVAS AUXILIAR (OFFSCREEN)
    // =========================================================================
    const offCtx = this.offCtx;
    offCtx.clearRect(0, 0, canvas.width, canvas.height);

    if (this.currentView === 'MAIN') {
      if (this.scene.isLoaded && this.scene.image) {
        offCtx.drawImage(this.scene.image, 0, 0, canvas.width, canvas.height);
      }
      this._renderMovableCovers(offCtx);
      this._renderContainerPrompts(offCtx);
    } else {
      const subImg = this.scene.containerImages.get(this.currentView);
      if (subImg) {
        offCtx.drawImage(subImg, 0, 0, canvas.width, canvas.height);
      } else {
        offCtx.fillStyle = '#0a0d14';
        offCtx.fillRect(0, 0, canvas.width, canvas.height);
      }
      this._renderMovableCovers(offCtx);
      this._renderSubSceneHeader(offCtx);
    }

    // Radares de pistas y marcas en la escena base
    this._renderHints(offCtx);
    this._renderFoundMarkers(offCtx);

    // =========================================================================
    // CAPA 2: COPIAR ESCENA AL CANVAS PRINCIPAL
    // =========================================================================
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(this.offscreenCanvas, 0, 0, canvas.width, canvas.height);

    // =========================================================================
    // CAPA 3: MODO LINTERNA (PENUMBRA POLICIAL CON HAZ DE LUZ RADIAL)
    // =========================================================================
    if (this.flashlightEnabled) {
      this._renderFlashlight(ctx, this.mouseVirtualX, this.mouseVirtualY);
    }

    // =========================================================================
    // CAPA 4: LUPA FORENSE 2X (AMPLIACIÓN ÓPTICA PARA MICRO-EVIDENCIAS)
    // =========================================================================
    if (this.magnifierEnabled && this.mouseVirtualX >= 0 && this.mouseVirtualY >= 0) {
      this._renderMagnifier(ctx, this.mouseVirtualX, this.mouseVirtualY);
    }

    // =========================================================================
    // CAPA 5: ATMÓSFERA POLICIAL NOIR (VIÑETA Y FILTRO CINEMATOGRÁFICO)
    // =========================================================================
    this._renderNoirAtmosphere(ctx);

    // =========================================================================
    // CAPA 6: ONDAS DE CLIC, PARTÍCULAS Y DEBUG
    // =========================================================================
    this._renderRipples(ctx, ripples);

    this.particleSystem.update();
    this.particleSystem.draw(ctx);

    if (this.showDebug) {
      this._renderDebugOverlay(ctx);
    }
  }

  /**
   * Renderiza las cubiertas que pueden ser desplazadas a un lado
   */
  _renderMovableCovers(ctx) {
    for (const cover of this.scene.movableCovers) {
      const coverView = cover.viewId || 'MAIN';
      if (coverView !== this.currentView) continue;

      ctx.save();
      const curX = cover.isShifted ? cover.x + cover.shiftDx : cover.x;
      const curY = cover.isShifted ? cover.y + cover.shiftDy : cover.y;

      if (cover.isShifted) {
        // Silueta discontinua en la posición original
        ctx.beginPath();
        ctx.rect(cover.x, cover.y, cover.width, cover.height);
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = 'rgba(241, 196, 15, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.shadowColor = 'rgba(0,0,0,0.85)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 6;
      }

      ctx.fillStyle = cover.color || '#263238';
      ctx.strokeStyle = cover.borderColor || '#cfd8dc';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.roundRect(curX, curY, cover.width, cover.height, 6);
      ctx.fill();
      ctx.stroke();

      // Rótulo interactivo sobre la cubierta
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = cover.isShifted ? '#f1c40f' : '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      const label = cover.isShifted ? `↩ ${cover.name} (Desplazado)` : `✋ Mover: ${cover.name}`;
      ctx.fillText(label, curX + cover.width / 2, curY + cover.height / 2 + 4);

      ctx.restore();
    }
  }

  /**
   * Renderiza los marcadores y llamadas visuales de los contenedores y el cadáver
   */
  _renderContainerPrompts(ctx) {
    for (const container of this.scene.containers) {
      ctx.save();
      const pulse = Math.sin(this.pulseAnim) * 2.5;
      const isCorpse = container.id.includes('corpse') || container.icon === '💀';

      // Anillo exterior de atención
      ctx.beginPath();
      ctx.arc(container.x, container.y, container.radius + pulse, 0, Math.PI * 2);
      ctx.strokeStyle = isCorpse ? 'rgba(231, 76, 60, 0.85)' : 'rgba(212, 175, 55, 0.7)';
      ctx.lineWidth = isCorpse ? 2.5 : 2;
      ctx.setLineDash(isCorpse ? [6, 4] : [4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Badge circular con icono
      ctx.fillStyle = isCorpse ? 'rgba(40, 10, 12, 0.92)' : 'rgba(10, 15, 25, 0.88)';
      ctx.beginPath();
      ctx.arc(container.x, container.y, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = isCorpse ? '#e74c3c' : '#d4af37';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(container.icon || '🔍', container.x, container.y);

      // Etiqueta flotante
      ctx.fillStyle = isCorpse ? '#ff6b6b' : '#f1c40f';
      ctx.font = 'bold 10px monospace';
      const promptText = isCorpse ? '💀 INSPECCIONAR CADÁVER' : `🔍 ${container.name.toUpperCase()}`;
      ctx.fillText(promptText, container.x, container.y - container.radius - 8);

      ctx.restore();
    }
  }

  /**
   * Encabezado temático para sub-escenas
   */
  _renderSubSceneHeader(ctx) {
    ctx.save();
    const container = this.scene.containers.find(c => c.id === this.currentView);
    const title = container ? container.name : 'Inspección de Contenedor';
    const isCorpse = container && (container.id.includes('corpse') || container.icon === '💀');

    ctx.fillStyle = isCorpse ? 'rgba(25, 8, 10, 0.92)' : 'rgba(10, 14, 22, 0.9)';
    ctx.fillRect(0, 0, this.canvas.width, 42);
    ctx.strokeStyle = isCorpse ? '#8b0000' : '#2d384c';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0, 0, this.canvas.width, 42);

    ctx.fillStyle = isCorpse ? '#ff4d4d' : '#d4af37';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const headerText = isCorpse
      ? `🔬 PROTOCOLO FORENSE: ${title.toUpperCase()} // RECOLECTA EVIDENCIAS EN EL CUERPO  [ESC / VOLVER]`
      : `🔍 INSPECCIONANDO INTERIOR: ${title.toUpperCase()}  [ESC / VOLVER]`;

    ctx.fillText(headerText, this.canvas.width / 2, 21);

    ctx.restore();
  }

  /**
   * MODO LINTERNA: Genera un velo oscuro con haz de luz en tiempo real
   */
  _renderFlashlight(ctx, mouseX, mouseY) {
    ctx.save();
    const cx = (mouseX >= 0) ? mouseX : this.canvas.width / 2;
    const cy = (mouseY >= 0) ? mouseY : this.canvas.height / 2;

    const innerRadius = 75;
    const beamRadius = 175;

    // Crear máscara radial invertida
    const grad = ctx.createRadialGradient(cx, cy, innerRadius, cx, cy, beamRadius);
    grad.addColorStop(0, 'rgba(5, 7, 12, 0)');
    grad.addColorStop(0.5, 'rgba(5, 7, 12, 0.35)');
    grad.addColorStop(0.85, 'rgba(5, 7, 12, 0.88)');
    grad.addColorStop(1, 'rgba(4, 6, 10, 0.96)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Aro de borde óptico de la lente de la linterna
    ctx.beginPath();
    ctx.arc(cx, cy, beamRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 235, 180, 0.15)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Centro con sutil tinte cálido
    const warmCore = ctx.createRadialGradient(cx, cy, 0, cx, cy, innerRadius);
    warmCore.addColorStop(0, 'rgba(255, 240, 200, 0.08)');
    warmCore.addColorStop(1, 'rgba(255, 240, 200, 0)');
    ctx.fillStyle = warmCore;
    ctx.beginPath();
    ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * LUPA FORENSE 2X: Zoom óptico preciso con montura de latón
   */
  _renderMagnifier(ctx, mouseX, mouseY) {
    ctx.save();
    const lensRadius = 92;
    const zoom = 2.2;

    const srcW = (lensRadius * 2) / zoom;
    const srcH = (lensRadius * 2) / zoom;
    const srcX = mouseX - srcW / 2;
    const srcY = mouseY - srcH / 2;

    // 1. Recorte circular de la lente
    ctx.save();
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, lensRadius, 0, Math.PI * 2);
    ctx.clip();

    // Dibujar escena magnificada desde el canvas auxiliar
    ctx.drawImage(
      this.offscreenCanvas,
      srcX, srcY, srcW, srcH,
      mouseX - lensRadius, mouseY - lensRadius, lensRadius * 2, lensRadius * 2
    );

    // Tinte óptico azulino y retícula de precisión
    ctx.fillStyle = 'rgba(180, 220, 255, 0.05)';
    ctx.fill();

    // Retícula forense en cruz
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(mouseX - 15, mouseY);
    ctx.lineTo(mouseX + 15, mouseY);
    ctx.moveTo(mouseX, mouseY - 15);
    ctx.lineTo(mouseX, mouseY + 15);
    ctx.stroke();

    ctx.restore();

    // 2. Montura de latón / dorada vintage
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, lensRadius, 0, Math.PI * 2);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#c59b27';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(mouseX, mouseY, lensRadius - 3, 0, Math.PI * 2);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#fff8db';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(mouseX, mouseY, lensRadius + 3, 0, Math.PI * 2);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#61480f';
    ctx.stroke();

    // 3. Brillo y reflejo de curvatura de vidrio
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, lensRadius - 10, -Math.PI * 0.75, -Math.PI * 0.25);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 4. Mango de madera de la lupa (extendiéndose en ángulo inferior derecho)
    const handleStartX = mouseX + lensRadius * 0.707;
    const handleStartY = mouseY + lensRadius * 0.707;
    const handleEndX = handleStartX + 50;
    const handleEndY = handleStartY + 50;

    ctx.beginPath();
    ctx.moveTo(handleStartX, handleStartY);
    ctx.lineTo(handleEndX, handleEndY);
    ctx.strokeStyle = '#4a2511';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Virola de metal del mango
    ctx.beginPath();
    ctx.moveTo(handleStartX, handleStartY);
    ctx.lineTo(handleStartX + 12, handleStartY + 12);
    ctx.strokeStyle = '#c59b27';
    ctx.lineWidth = 16;
    ctx.lineCap = 'butt';
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Atmósfera cinematográfica Police Noir
   */
  _renderNoirAtmosphere(ctx) {
    ctx.save();

    // Viñeta perimetral oscura
    const w = this.canvas.width;
    const h = this.canvas.height;
    const vignette = ctx.createRadialGradient(w / 2, h / 2, w * 0.35, w / 2, h / 2, w * 0.65);
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, 'rgba(2, 4, 8, 0.65)');

    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);

    // Marca de agua pericial sutil en la esquina inferior izquierda
    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.font = '9px monospace';
    ctx.fillText('DIVISIÓN DE HOMICIDIOS // ARCHIVO CLASIFICADO', 18, h - 14);

    ctx.restore();
  }

  _renderHints(ctx) {
    const now = performance.now();

    for (let i = this.activeHints.length - 1; i >= 0; i--) {
      const hint = this.activeHints[i];
      const elapsed = now - hint.startTime;

      if (elapsed > hint.duration) {
        this.activeHints.splice(i, 1);
        continue;
      }

      const progress = elapsed / hint.duration;
      const alpha = Math.max(0, 1 - progress);

      ctx.save();
      const grad = ctx.createRadialGradient(hint.x, hint.y, 10, hint.x, hint.y, hint.radius * 2.5);
      grad.addColorStop(0, `rgba(241, 196, 15, ${0.5 * alpha})`);
      grad.addColorStop(0.6, `rgba(230, 126, 34, ${0.25 * alpha})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.arc(hint.x, hint.y, hint.radius * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      for (let wave = 0; wave < 3; wave++) {
        const waveProgress = ((elapsed + wave * 500) % 1500) / 1500;
        const waveRadius = hint.radius + (waveProgress * 60);
        const waveAlpha = (1 - waveProgress) * alpha;

        ctx.beginPath();
        ctx.arc(hint.x, hint.y, waveRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(241, 196, 15, ${waveAlpha})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`¡${hint.label}!`, hint.x, hint.y - hint.radius - 20);

      ctx.restore();
    }
  }

  _renderFoundMarkers(ctx) {
    ctx.save();
    for (const marker of this.foundMarkers) {
      if (marker.viewId !== this.currentView) continue;

      marker.pulse += 0.05;
      const pulseSize = Math.sin(marker.pulse) * 3;

      ctx.beginPath();
      ctx.arc(marker.x, marker.y, marker.radius + 6 + pulseSize, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(241, 196, 15, 0.85)';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.arc(marker.x, marker.y, marker.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(46, 204, 113, 0.25)';
      ctx.fill();
      ctx.strokeStyle = '#2ecc71';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#f1c40f';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✓', marker.x, marker.y);

      ctx.fillStyle = '#ffffff';
      ctx.font = '11px monospace';
      ctx.fillText(marker.label, marker.x, marker.y - marker.radius - 12);
    }
    ctx.restore();
  }

  _renderRipples(ctx, ripples) {
    ctx.save();
    for (const r of ripples) {
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(231, 76, 60, ${r.alpha})`;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }
    ctx.restore();
  }

  _renderDebugOverlay(ctx) {
    ctx.save();

    if (this.currentView === 'MAIN') {
      for (const c of this.scene.containers) {
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 210, 255, 0.9)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#00d2d3';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`[ZONA: ${c.name}]`, c.x, c.y - c.radius - 6);
      }

      for (const cov of this.scene.movableCovers) {
        if ((cov.viewId || 'MAIN') !== 'MAIN') continue;
        const curX = cov.isShifted ? cov.x + cov.shiftDx : cov.x;
        const curY = cov.isShifted ? cov.y + cov.shiftDy : cov.y;
        ctx.strokeStyle = 'rgba(255, 0, 128, 0.9)';
        ctx.lineWidth = 2;
        ctx.strokeRect(curX, curY, cov.width, cov.height);
        ctx.fillStyle = '#ff0080';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`[CUBIERTA: ${cov.name}]`, curX + 10, curY - 6);
      }
    } else {
      // Cubiertas dentro de sub-escenas
      for (const cov of this.scene.movableCovers) {
        if ((cov.viewId || 'MAIN') !== this.currentView) continue;
        const curX = cov.isShifted ? cov.x + cov.shiftDx : cov.x;
        const curY = cov.isShifted ? cov.y + cov.shiftDy : cov.y;
        ctx.strokeStyle = 'rgba(255, 0, 128, 0.9)';
        ctx.lineWidth = 2;
        ctx.strokeRect(curX, curY, cov.width, cov.height);
        ctx.fillStyle = '#ff0080';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`[CUBIERTA: ${cov.name}]`, curX + 10, curY - 6);
      }
    }

    const objects = this.scene.getAllObjects().filter(o =>
      (this.currentView === 'MAIN' && !o.containerId) || (o.containerId === this.currentView)
    );

    for (const item of objects) {
      const strokeColor = item.found ? 'rgba(46, 204, 113, 0.8)' : 'rgba(231, 76, 60, 0.9)';
      ctx.beginPath();
      ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = strokeColor;
      ctx.font = '10px monospace';
      ctx.fillText(`${item.name} (${item.x},${item.y}) r:${item.radius}`, item.x, item.y - item.radius - 6);
    }

    ctx.restore();
  }
}
