import { Game } from './core/Game.js';

document.addEventListener('DOMContentLoaded', async () => {
  const canvas = document.getElementById('crime-canvas');
  const menuOverlay = document.getElementById('menu-overlay');
  const levelCompleteModal = document.getElementById('level-complete-modal');
  const campaignCompleteModal = document.getElementById('campaign-complete-modal');
  const defeatModal = document.getElementById('defeat-modal');

  const zoomNavBarElement = document.getElementById('zoom-nav-bar');
  const zoomTitleElement = document.getElementById('zoom-title');
  const zoomBackBtn = document.getElementById('zoom-back-btn');

  const timerElement = document.getElementById('timer-display');
  const scoreElement = document.getElementById('score-display');
  const comboElement = document.getElementById('combo-display');
  const starsHeaderElement = document.getElementById('header-stars');
  const levelBadgeElement = document.getElementById('level-badge');
  const levelDifficultyElement = document.getElementById('level-difficulty');

  const hintBtn = document.getElementById('hint-btn');
  const hintCountElement = document.getElementById('hint-count');
  const hintProgressElement = document.getElementById('hint-progress-bar');
  const evidenceContainer = document.getElementById('evidence-list');
  const evidenceCounterElement = document.getElementById('evidence-counter');
  const debugLogElement = document.getElementById('debug-log');
  const coordsElement = document.getElementById('mouse-coords');
  const toastContainer = document.getElementById('toast-container');

  const startBtn = document.getElementById('start-btn');
  const nextLevelBtn = document.getElementById('next-level-btn');
  const campaignRestartBtn = document.getElementById('campaign-restart-btn');
  const defeatRetryBtn = document.getElementById('defeat-retry-btn');
  const toggleDebugBtn = document.getElementById('toggle-debug-btn');
  const toggleSoundBtn = document.getElementById('toggle-sound-btn');

  const game = new Game({
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
  });

  // Inicio de campaña
  startBtn.addEventListener('click', () => {
    game.startGame();
  });

  // Botón para salir del zoom del contenedor y volver a la sala principal
  zoomBackBtn.addEventListener('click', () => {
    game.exitContainerView();
  });

  // Atajo con tecla ESC para salir del contenedor
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && game.currentView !== 'MAIN') {
      game.exitContainerView();
    }
  });

  // Avanzar al siguiente nivel
  nextLevelBtn.addEventListener('click', () => {
    game.advanceToNextLevel();
  });

  // Reintento del nivel actual
  defeatRetryBtn.addEventListener('click', () => {
    game.retryCurrentLevel();
  });

  // Reinicio de toda la campaña
  campaignRestartBtn.addEventListener('click', () => {
    game.restartFullCampaign();
  });

  // Pista inteligente
  hintBtn.addEventListener('click', () => {
    game.useHint();
  });

  // Alternar audio
  toggleSoundBtn.addEventListener('click', () => {
    const isMuted = game.toggleSound();
    toggleSoundBtn.textContent = isMuted ? '🔇 Silenciado' : '🔊 Audio';
    toggleSoundBtn.classList.toggle('active', isMuted);
  });

  // Alternar hitboxes
  toggleDebugBtn.addEventListener('click', () => {
    const isDebug = game.toggleDebug();
    toggleDebugBtn.classList.toggle('active', isDebug);
    toggleDebugBtn.textContent = isDebug ? '👁️ Ocultar Hitboxes' : '🎯 Hitboxes';
  });

  // Inicializar juego en Nivel 1
  await game.init();
});
