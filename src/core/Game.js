import { CoordinateScaler } from './CoordinateScaler.js';
import { CrimeScene } from '../scenes/CrimeScene.js';
import { LevelManager } from './LevelManager.js';
import { InputHandler } from '../engine/InputHandler.js';
import { CanvasRenderer } from '../engine/CanvasRenderer.js';
import { SoundEffects } from '../engine/SoundEffects.js';
import { Timer } from './Timer.js';
import { ScoreManager } from './ScoreManager.js';
import { HintManager } from './HintManager.js';
import { EvidenceList } from '../ui/EvidenceList.js';
import { ToastNotification } from '../ui/ToastNotification.js';

export const GAME_STATES = {
  MENU: 'MENU',
  PLAYING: 'PLAYING',
  LEVEL_COMPLETE: 'LEVEL_COMPLETE',
  CAMPAIGN_COMPLETE: 'CAMPAIGN_COMPLETE',
  DEFEAT: 'DEFEAT'
};

export class Game {
  constructor({
    canvas,
    menuOverlay,
    levelCompleteModal,
    campaignCompleteModal,
    defeatModal,
    zoomNavBarElement,
    zoomTitleElement,
    timerElement,
    scoreElement,
    comboElement,
    starsHeaderElement,
    levelBadgeElement,
    levelDifficultyElement,
    hintBtn,
    hintCountElement,
    hintProgressElement,
    evidenceContainer,
    evidenceCounterElement,
    debugLogElement,
    coordsElement,
    toastContainer
  }) {
    this.canvas = canvas;
    this.menuOverlay = menuOverlay;
    this.levelCompleteModal = levelCompleteModal;
    this.campaignCompleteModal = campaignCompleteModal;
    this.defeatModal = defeatModal;
    this.zoomNavBarElement = zoomNavBarElement;
    this.zoomTitleElement = zoomTitleElement;
    this.timerElement = timerElement;
    this.scoreElement = scoreElement;
    this.comboElement = comboElement;
    this.starsHeaderElement = starsHeaderElement;
    this.levelBadgeElement = levelBadgeElement;
    this.levelDifficultyElement = levelDifficultyElement;
    this.hintBtn = hintBtn;
    this.hintCountElement = hintCountElement;
    this.hintProgressElement = hintProgressElement;
    this.coordsElement = coordsElement;
    this.debugLogElement = debugLogElement;

    this.state = GAME_STATES.MENU;
    this.currentView = 'MAIN'; // 'MAIN' o id del contenedor en zoom
    this.scaler = new CoordinateScaler(1280, 720);
    this.levelManager = new LevelManager();
    this.scene = new CrimeScene();
    this.renderer = new CanvasRenderer(this.canvas, this.scene);
    this.soundEffects = new SoundEffects();

    this.toasts = new ToastNotification(toastContainer);

    this.timer = new Timer({
      totalSeconds: 70,
      onTick: this._handleTimerTick.bind(this),
      onExpire: this._handleTimerExpire.bind(this)
    });

    this.scoreManager = new ScoreManager({
      onScoreUpdate: this._handleScoreUpdate.bind(this),
      onComboUpdate: this._handleComboUpdate.bind(this)
    });

    this.hintManager = new HintManager({
      scene: this.scene,
      maxHints: 3,
      rechargeTimeSeconds: 20,
      onHintStateChange: this._handleHintStateChange.bind(this)
    });

    this.evidenceList = new EvidenceList(evidenceContainer, evidenceCounterElement);

    this.inputHandler = new InputHandler(
      this.canvas,
      this.scaler,
      this.handleCanvasClick.bind(this)
    );

    this.animationFrameId = null;
    this.lowTimeAlerted = false;
    this._trackMouseHover();
  }

  async init() {
    this.log('Inicializando motor de campaña con capas y contenedores interactivos...');
    await this._loadCurrentLevelData();
    this._updateLiveStars();
    this._gameLoop();
  }

  async _loadCurrentLevelData() {
    const levelData = this.levelManager.getCurrentLevel();
    this.log(`Cargando Nivel ${levelData.levelNumber}: "${levelData.name}"...`);

    const mainImg = await this.levelManager.loadCurrentLevelImage();

    // Pre-cargar imágenes de sub-escenas de contenedores
    const containerImagesMap = new Map();
    if (levelData.containers) {
      for (const container of levelData.containers) {
        const subImg = await this.levelManager.loadContainerImage(container);
        containerImagesMap.set(container.id, subImg);
      }
    }

    this.scene.loadLevel(levelData, mainImg, containerImagesMap);
    this.evidenceList.init(this.scene.getAllObjects());
    this._updateLevelHUD();

    this.currentView = 'MAIN';
    this.renderer.setCurrentView('MAIN');
    this._hideZoomNav();

    this.timer.reset(levelData.timeLimit);
    this.renderer.clearFoundMarkers();
    this.log(`Nivel ${levelData.levelNumber} preparado (${levelData.objects.length} evidencias | ${levelData.timeLimit}s).`);
  }

  _updateLevelHUD() {
    const level = this.levelManager.getCurrentLevel();
    if (this.levelBadgeElement) {
      this.levelBadgeElement.textContent = `NIVEL ${level.levelNumber}/5 // ${level.name.toUpperCase()}`;
    }
    if (this.levelDifficultyElement) {
      this.levelDifficultyElement.textContent = `${level.location} [${level.difficultyTag}]`;
    }
  }

  startGame() {
    this.soundEffects.init();
    this.state = GAME_STATES.PLAYING;
    this.lowTimeAlerted = false;
    this._hideModals();
    this.timer.start();
    this.hintManager.startRechargeTimer();

    const level = this.levelManager.getCurrentLevel();
    this.toasts.show(`¡NIVEL ${level.levelNumber}! Hay objetos dentro de contenedores y bajo cubiertas.`, 'info', 4000);
    this.log(`¡INVESTIGACIÓN EN CURSO! Nivel ${level.levelNumber} iniciado.`);
  }

  async advanceToNextLevel() {
    if (!this.levelManager.hasNextLevel()) return;

    this.levelManager.advanceLevel();
    await this._loadCurrentLevelData();

    this.lowTimeAlerted = false;
    this._hideModals();
    this.state = GAME_STATES.PLAYING;
    this.timer.start();
    this.hintManager.startRechargeTimer();

    const level = this.levelManager.getCurrentLevel();
    this.soundEffects.playCombo(level.levelNumber);
    this.toasts.show(`¡NIVEL ${level.levelNumber}: ${level.name}! Tiempo: ${level.timeLimit}s`, 'warning', 4000);
    this.log(`--- AVANZANDO A NIVEL ${level.levelNumber}: ${level.name} ---`);
  }

  async retryCurrentLevel() {
    await this._loadCurrentLevelData();
    this.lowTimeAlerted = false;
    this._hideModals();
    this.state = GAME_STATES.PLAYING;
    this.timer.start();
    this.hintManager.startRechargeTimer();
    this.toasts.show('Reintentando nivel. ¡Revisa cajones y cubiertas!', 'info', 2500);
  }

  async restartFullCampaign() {
    this.levelManager.resetCampaign();
    this.scoreManager.reset();
    this.hintManager.reset();
    await this._loadCurrentLevelData();

    this.lowTimeAlerted = false;
    this._hideModals();
    this.state = GAME_STATES.PLAYING;
    this.timer.start();
    this.hintManager.startRechargeTimer();
    this.toasts.show('Campaña reiniciada desde el Nivel 1.', 'info', 3000);
    this.log('=== CAMPAÑA COMPLETA REINICIADA AL NIVEL 1 ===');
  }

  toggleSound() {
    const isMuted = this.soundEffects.toggleMute();
    this.toasts.show(isMuted ? '🔇 Audio silenciado' : '🔊 Audio activado', 'info', 2000);
    return isMuted;
  }

  /**
   * Entra en la vista ampliada (Zoom / Sub-escena) de un contenedor
   * @param {object} container
   */
  enterContainerView(container) {
    this.currentView = container.id;
    this.renderer.setCurrentView(container.id);
    this.soundEffects.playCombo(3);
    this._showZoomNav(container.name);
    this.toasts.show(`Examinando: "${container.name}"`, 'info', 2500);
    this.log(`[ZOOM] Inspeccionando interior de "${container.name}".`);
  }

  /**
   * Sale del contenedor y regresa a la sala principal
   */
  exitContainerView() {
    this.currentView = 'MAIN';
    this.renderer.setCurrentView('MAIN');
    this._hideZoomNav();
    this.soundEffects.playTick(false);
    this.toasts.show('Regresaste a la escena principal.', 'info', 1800);
    this.log('[ZOOM] Regreso a la escena principal.');
  }

  _showZoomNav(title) {
    if (this.zoomNavBarElement) {
      this.zoomNavBarElement.classList.remove('hidden');
    }
    if (this.zoomTitleElement) {
      this.zoomTitleElement.textContent = `INSPECCIONANDO: ${title.toUpperCase()}`;
    }
  }

  _hideZoomNav() {
    if (this.zoomNavBarElement) {
      this.zoomNavBarElement.classList.add('hidden');
    }
  }

  /**
   * Sistema de pistas inteligente con orientación hacia contenedores y cubiertas
   */
  useHint() {
    if (this.state !== GAME_STATES.PLAYING) return;

    const remaining = this.scene.getRemainingObjects();
    if (remaining.length === 0) return;

    if (this.hintManager.availableHints <= 0) {
      this.soundEffects.playMiss();
      this.toasts.show('Sin pistas disponibles. Espera a la recarga de la lupa.', 'warning', 2500);
      return;
    }

    // Seleccionar una evidencia pendiente aleatoria
    const targetObject = remaining[Math.floor(Math.random() * remaining.length)];

    // Caso A: El objeto está dentro de un contenedor cerrado
    if (targetObject.containerId) {
      const container = this.scene.containers.find(c => c.id === targetObject.containerId);

      if (this.currentView === 'MAIN') {
        // Guiar al jugador a abrir el contenedor primero
        this.hintManager.useHint();
        this.soundEffects.playHint();
        this.renderer.addHintBeacon(container.x, container.y, container.radius, `¡Abre ${container.name}!`);
        this.evidenceList.highlightHint(targetObject.id);
        this.toasts.show(`💡 "${targetObject.name}" está dentro de ${container.hintName}. ¡Ábrelo primero!`, 'warning', 4500);
        this.log(`[PISTA] La evidencia está dentro de "${container.name}".`, 'warning');
        return;
      } else if (this.currentView === targetObject.containerId) {
        // Ya estamos dentro del contenedor correcto
        this.hintManager.useHint();
        this.soundEffects.playHint();
        this.renderer.addHintBeacon(targetObject.x, targetObject.y, targetObject.radius, targetObject.name);
        this.evidenceList.highlightHint(targetObject.id);
        this.toasts.show(`💡 ¡Inspecciona "${targetObject.name}" aquí dentro!`, 'info', 4000);
        return;
      } else {
        // Estamos en otro contenedor distinto
        this.toasts.show(`💡 Sal de este contenedor. La pista apunta a "${container.name}".`, 'warning', 4000);
        return;
      }
    }

    // Caso B: El objeto está bajo una cubierta desplazable
    if (targetObject.coveredBy) {
      const cover = this.scene.movableCovers.find(c => c.id === targetObject.coveredBy);
      const coverView = cover ? (cover.viewId || 'MAIN') : 'MAIN';

      // Si la cubierta vive dentro de un contenedor, el jugador debe entrar primero
      if (coverView !== 'MAIN' && this.currentView !== coverView) {
        // Buscar el contenedor que aloja esa cubierta
        const parentContainer = this.scene.containers.find(c => c.id === coverView);
        if (parentContainer) {
          this.hintManager.useHint();
          this.soundEffects.playHint();
          this.renderer.addHintBeacon(parentContainer.x, parentContainer.y, parentContainer.radius, `¡Abre ${parentContainer.name}!`);
          this.evidenceList.highlightHint(targetObject.id);
          this.toasts.show(`💡 Abre "${parentContainer.name}" y luego mueve "${cover.name}" para hallar "${targetObject.name}".`, 'warning', 5000);
        } else {
          this.toasts.show(`💡 Accede al contenedor correcto para mover "${cover ? cover.name : 'la cubierta'}"`, 'warning', 3500);
        }
        return;
      }

      // Si la cubierta está en la sala principal pero el jugador está en sub-escena
      if (coverView === 'MAIN' && this.currentView !== 'MAIN') {
        this.toasts.show('💡 Sal a la escena principal para mover esa cubierta.', 'warning', 3000);
        return;
      }

      this.hintManager.useHint();
      this.soundEffects.playHint();

      if (cover && !cover.isShifted) {
        this.renderer.addHintBeacon(cover.x + cover.width / 2, cover.y + cover.height / 2, 35, `¡Mueve ${cover.name}!`);
        this.evidenceList.highlightHint(targetObject.id);
        this.toasts.show(`💡 "${targetObject.name}" está oculta bajo "${cover.name}". ¡Desplázala a un lado!`, 'warning', 4500);
      } else {
        this.renderer.addHintBeacon(targetObject.x, targetObject.y, targetObject.radius, targetObject.name);
        this.evidenceList.highlightHint(targetObject.id);
        this.toasts.show(`💡 Inspecciona "${targetObject.name}" ya descubierta.`, 'info', 4000);
      }
      return;
    }

    // Caso C: Objeto libre — puede estar en MAIN o dentro de un contenedor/cadáver
    if (this.currentView !== 'MAIN' && targetObject.containerId !== this.currentView) {
      // El objeto está en otro lugar; orientar al jugador
      if (targetObject.containerId) {
        const parentContainer = this.scene.containers.find(c => c.id === targetObject.containerId);
        if (parentContainer && this.currentView !== targetObject.containerId) {
          this.toasts.show(`💡 Sal a la escena principal y abre "${parentContainer.name}".`, 'warning', 3500);
          return;
        }
      } else {
        this.toasts.show('💡 Sal a la escena principal para encontrar este indicio.', 'warning', 3000);
        return;
      }
    }

    this.hintManager.useHint();
    this.soundEffects.playHint();
    this.renderer.addHintBeacon(targetObject.x, targetObject.y, targetObject.radius, targetObject.name);
    this.evidenceList.highlightHint(targetObject.id);
    this.toasts.show(`💡 Pista revelada: Inspecciona "${targetObject.name}"`, 'info', 4000);
    this.log(`[PISTA] Radar enfocado en "${targetObject.name}".`, 'warning');
  }

  /**
   * Manejador de clics interactivo con soporte de Contenedores y Cubiertas
   * @param {number} x
   * @param {number} y
   */
  handleCanvasClick(x, y) {
    if (this.state !== GAME_STATES.PLAYING) return;

    this.soundEffects.init();

    // ================= MODO SALA PRINCIPAL =================
    if (this.currentView === 'MAIN') {
      // 1. Clic sobre un contenedor interactivo (Cajón, Caja Fuerte, Contenedor)
      const container = this.scene.getContainerAt(x, y);
      if (container) {
        this.enterContainerView(container);
        return;
      }

      // 2. Clic sobre una cubierta desplazable (Tapete, Libro, Caja, Lona)
      const cover = this.scene.getCoverAt(x, y);
      if (cover) {
        cover.isShifted = !cover.isShifted;
        this.soundEffects.playCombo(2);
        this.toasts.show(
          cover.isShifted ? `Moviste "${cover.name}" a un lado.` : `Regresaste "${cover.name}" a su posición.`,
          'info',
          2500
        );
        this.log(`[ACCIÓN] ${cover.isShifted ? 'Desplazaste' : 'Repusiste'} "${cover.name}".`);
        return;
      }

      // 3. Clic sobre una evidencia de la sala principal
      const { hit, isCovered, cover: blockingCover } = this.scene.checkHit(x, y, 'MAIN');

      if (isCovered && blockingCover) {
        this.soundEffects.playMiss();
        this.toasts.show(`Está cubierto por "${blockingCover.name}". ¡Muévela a un lado primero!`, 'warning', 2600);
        return;
      }

      if (hit) {
        this._collectObject(hit, 'MAIN');
        return;
      }

      // 4. Clic en espacio vacío de la sala principal (-50 pts y -3s)
      this._applyMisclick(x, y);
      return;
    }

    // ================= MODO SUB-ESCENA (DENTRO DE UN CONTENEDOR O CADÁVER) =================

    // 1. Comprobar primero si hay una cubierta desplazable dentro de la sub-escena
    const subCover = this.scene.getCoverAt(x, y, this.currentView);
    if (subCover) {
      subCover.isShifted = !subCover.isShifted;
      this.soundEffects.playCombo(2);
      const msg = subCover.isShifted
        ? `Moviste "${subCover.name}" a un lado.`
        : `Regresaste "${subCover.name}" a su posición.`;
      this.toasts.show(msg, 'info', 2500);
      this.log(`[ACCIÓN] ${subCover.isShifted ? 'Desplazaste' : 'Repusiste'} "${subCover.name}" dentro de la inspección.`);
      return;
    }

    // 2. Comprobar evidencias de la sub-escena
    const { hit: subHit, isCovered: subIsCovered, cover: subBlockingCover } = this.scene.checkHit(x, y, this.currentView);

    if (subIsCovered && subBlockingCover) {
      this.soundEffects.playMiss();
      this.toasts.show(`Está cubierto por "${subBlockingCover.name}". ¡Muévelo primero!`, 'warning', 2600);
      return;
    }

    if (subHit) {
      this._collectObject(subHit, this.currentView);
    } else {
      // Clic en espacio vacío dentro del contenedor
      this._applyMisclick(x, y);
    }
  }

  _collectObject(hitObject, viewId) {
    this.scene.markFound(hitObject.id);
    const { pointsEarned, multiplier } = this.scoreManager.registerHit();
    const remaining = this.scene.getRemainingObjects().length;
    const total = this.scene.getAllObjects().length;
    const foundCount = total - remaining;

    this.soundEffects.playHit();
    if (multiplier >= 2) {
      setTimeout(() => this.soundEffects.playCombo(multiplier), 120);
    }
    this.renderer.emitEvidenceSparkles(hitObject.x, hitObject.y);

    this.evidenceList.markAsFound(hitObject.id, foundCount, total);
    this.renderer.addFoundMarker(hitObject.x, hitObject.y, hitObject.radius, hitObject.name, viewId);

    const comboText = multiplier > 1 ? ` (Combo x${multiplier})` : '';
    this.toasts.show(`¡Asegurado: ${hitObject.name}! +${pointsEarned} pts${comboText}`, 'success', 2200);
    this.log(`[EVIDENCIA ASEGURADA] "${hitObject.name}" (+${pointsEarned} pts)${comboText}`, 'success');

    if (multiplier >= 4) {
      this.toasts.show(`🔥 ¡RACHA INVESTIGATIVA! Multiplicador x${multiplier}`, 'warning', 2000);
    }

    if (remaining === 0) {
      this._handleLevelFinished();
    }
  }

  _applyMisclick(x, y) {
    this.soundEffects.playMiss();
    this.scoreManager.registerMisclick();
    this.timer.penalize(3);
    this._flashTimerPenalty();
    this.toasts.show('Pista falsa: -50 pts y -3s', 'danger', 1800);
    this.log(`[PISTA FALSA] Clic en (${x}, ${y}). Penalización: -50 pts y -3s.`, 'warning');
  }

  _handleLevelFinished() {
    this.timer.stop();
    this.hintManager.stopRechargeTimer();

    const remainingSecs = this.timer.remainingSeconds;
    const timeBonus = this.scoreManager.applyTimeBonus(remainingSecs);
    const levelScore = this.scoreManager.score;
    const stars = this.scoreManager.calculateStars();
    const timeUsed = this.scene.timeLimit - remainingSecs;
    const currentLevel = this.levelManager.getCurrentLevel();

    this.levelManager.recordLevelCompletion(levelScore, stars, timeUsed);
    this.soundEffects.playVictory();
    this.renderer.emitVictoryConfetti();

    if (this.levelManager.hasNextLevel()) {
      this.state = GAME_STATES.LEVEL_COMPLETE;
      this.toasts.show(`¡NIVEL ${currentLevel.levelNumber} COMPLETADO! Bonus: +${timeBonus} pts`, 'success', 4000);
      this.log(`¡NIVEL ${currentLevel.levelNumber} COMPLETADO! Tiempo: ${timeUsed}s | Bonus: +${timeBonus} pts.`, 'success');

      this._showLevelCompleteModal({
        levelNumber: currentLevel.levelNumber,
        levelName: currentLevel.name,
        timeUsed,
        timeBonus,
        levelScore,
        stars
      });
    } else {
      this.state = GAME_STATES.CAMPAIGN_COMPLETE;
      this.toasts.show('🏆 ¡CASO RESUELTO! Has completado las 5 escenas del sindicato.', 'success', 6000);
      this.log(`=== ¡CAMPAÑA COMPLETADA! Caso cerrado con éxito. Total: ${this.levelManager.campaignScore} pts. ===`, 'success');

      this._showCampaignCompleteModal({
        totalScore: this.levelManager.campaignScore,
        maxCombo: this.scoreManager.maxComboReached,
        totalMisclicks: this.scoreManager.totalMisclicks
      });
    }
  }

  _handleTimerExpire() {
    if (this.state !== GAME_STATES.PLAYING) return;

    this.state = GAME_STATES.DEFEAT;
    this.hintManager.stopRechargeTimer();
    const foundCount = this.scene.getAllObjects().length - this.scene.getRemainingObjects().length;
    const level = this.levelManager.getCurrentLevel();

    this.soundEffects.playDefeat();
    this.toasts.show('¡Tiempo agotado! El rastro del sospechoso se enfrió.', 'danger', 5000);
    this.log(`[NIVEL ${level.levelNumber} FALLIDO] Tiempo agotado. Evidencias: ${foundCount} / ${level.objects.length}.`, 'warning');

    this._showDefeatModal({
      levelNumber: level.levelNumber,
      levelName: level.name,
      foundCount,
      totalCount: level.objects.length,
      currentScore: this.scoreManager.score
    });
  }

  _handleTimerTick(remainingSeconds, formattedTime) {
    if (!this.timerElement) return;

    this.timerElement.textContent = formattedTime;

    if (remainingSeconds <= 15) {
      this.timerElement.classList.add('time-critical');
      this.soundEffects.playTick(true);

      if (!this.lowTimeAlerted) {
        this.lowTimeAlerted = true;
        this.toasts.show('⚠️ ¡ALERTA: Menos de 15 segundos restantes!', 'warning', 3000);
      }
    } else {
      this.timerElement.classList.remove('time-critical');
    }
  }

  _flashTimerPenalty() {
    if (!this.timerElement) return;
    this.timerElement.classList.add('penalty-flash');
    setTimeout(() => {
      this.timerElement.classList.remove('penalty-flash');
    }, 400);
  }

  _handleScoreUpdate(currentScore, delta, isPositive) {
    if (!this.scoreElement) return;

    this.scoreElement.textContent = currentScore.toLocaleString('es-ES');
    this.scoreElement.classList.add(isPositive ? 'score-bump-up' : 'score-bump-down');

    this._updateLiveStars();

    setTimeout(() => {
      this.scoreElement.classList.remove('score-bump-up', 'score-bump-down');
    }, 350);
  }

  _updateLiveStars() {
    if (!this.starsHeaderElement) return;
    const stars = this.scoreManager.calculateStars();
    this.starsHeaderElement.textContent = '★'.repeat(stars) + '☆'.repeat(5 - stars);
  }

  _handleComboUpdate(multiplier, isActive) {
    if (!this.comboElement) return;

    if (isActive && multiplier > 1) {
      this.comboElement.textContent = `COMBO x${multiplier}`;
      this.comboElement.classList.add('visible', 'pulse');
    } else {
      this.comboElement.textContent = '';
      this.comboElement.classList.remove('visible', 'pulse');
    }
  }

  _handleHintStateChange({ availableHints, maxHints, cooldownProgress }) {
    if (this.hintCountElement) {
      this.hintCountElement.textContent = `${availableHints}/${maxHints}`;
    }

    if (this.hintBtn) {
      if (availableHints <= 0) {
        this.hintBtn.classList.add('disabled');
      } else {
        this.hintBtn.classList.remove('disabled');
      }
    }

    if (this.hintProgressElement) {
      this.hintProgressElement.style.width = `${cooldownProgress}%`;
    }
  }

  _showLevelCompleteModal(stats) {
    if (!this.levelCompleteModal) return;

    const starsHtml = '★'.repeat(stats.stars) + '☆'.repeat(5 - stats.stars);

    this.levelCompleteModal.querySelector('#level-complete-tag').textContent = `NIVEL ${stats.levelNumber} COMPLETADO`;
    this.levelCompleteModal.querySelector('#level-complete-name').textContent = stats.levelName;
    this.levelCompleteModal.querySelector('#level-complete-stars').innerHTML = starsHtml;
    this.levelCompleteModal.querySelector('#level-complete-score').textContent = stats.levelScore.toLocaleString('es-ES');
    this.levelCompleteModal.querySelector('#level-complete-bonus').textContent = `+${stats.timeBonus.toLocaleString('es-ES')} (${stats.timeUsed}s)`;
    this.levelCompleteModal.querySelector('#level-complete-next-num').textContent = `NIVEL ${stats.levelNumber + 1}`;

    this.levelCompleteModal.classList.remove('hidden');
  }

  _showCampaignCompleteModal(stats) {
    if (!this.campaignCompleteModal) return;

    this.campaignCompleteModal.querySelector('#campaign-total-score').textContent = stats.totalScore.toLocaleString('es-ES');
    this.campaignCompleteModal.querySelector('#campaign-max-combo').textContent = `x${stats.maxCombo}`;
    this.campaignCompleteModal.querySelector('#campaign-total-misclicks').textContent = stats.totalMisclicks;

    this.campaignCompleteModal.classList.remove('hidden');
  }

  _showDefeatModal(stats) {
    if (!this.defeatModal) return;

    this.defeatModal.querySelector('#defeat-level-title').textContent = `NIVEL ${stats.levelNumber}: ${stats.levelName.toUpperCase()}`;
    this.defeatModal.querySelector('#defeat-found').textContent = `${stats.foundCount} / ${stats.totalCount}`;
    this.defeatModal.querySelector('#defeat-score').textContent = stats.currentScore.toLocaleString('es-ES');

    this.defeatModal.classList.remove('hidden');
  }

  _hideModals() {
    if (this.menuOverlay) this.menuOverlay.classList.add('hidden');
    if (this.levelCompleteModal) this.levelCompleteModal.classList.add('hidden');
    if (this.campaignCompleteModal) this.campaignCompleteModal.classList.add('hidden');
    if (this.defeatModal) this.defeatModal.classList.add('hidden');
  }

  toggleDebug() {
    const isDebug = this.renderer.toggleDebug();
    this.log(`Modo depuración de Hitboxes: ${isDebug ? 'ACTIVADO' : 'DESACTIVADO'}`, isDebug ? 'warning' : 'normal');
    return isDebug;
  }

  log(message, type = 'normal') {
    if (!this.debugLogElement) return;

    const entry = document.createElement('div');
    entry.className = `log-entry log-${type}`;
    const timestamp = new Date().toLocaleTimeString('es-ES', { hour12: false });
    entry.innerHTML = `<span class="log-time">[${timestamp}]</span> ${message}`;

    this.debugLogElement.appendChild(entry);
    this.debugLogElement.scrollTop = this.debugLogElement.scrollHeight;
  }

  _trackMouseHover() {
    this.canvas.addEventListener('mousemove', (e) => {
      const coords = this.scaler.clientToVirtual(this.canvas, e.clientX, e.clientY);
      if (this.coordsElement) {
        this.coordsElement.textContent = `X: ${coords.x} | Y: ${coords.y}`;
      }
    });

    this.canvas.addEventListener('mouseleave', () => {
      if (this.coordsElement) {
        this.coordsElement.textContent = 'X: --- | Y: ---';
      }
    });
  }

  _gameLoop() {
    this.inputHandler.updateRipples();
    this.renderer.render(this.inputHandler.getRipples());
    this.animationFrameId = requestAnimationFrame(() => this._gameLoop());
  }
}
