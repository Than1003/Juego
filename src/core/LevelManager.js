import { LEVELS } from '../scenes/levels_data.js';

/**
 * LevelManager
 * Administra el progreso de la campaña entre los 5 niveles,
 * la carga dinámica de escenas SVG principales y sub-escenas de contenedores.
 */
export class LevelManager {
  constructor() {
    this.levels = LEVELS;
    this.currentLevelIndex = 0;
    this.cachedMainImages = new Map();
    this.cachedContainerImages = new Map();
    this.campaignScore = 0;
    this.levelStats = [];
  }

  getCurrentLevel() {
    return this.levels[this.currentLevelIndex];
  }

  hasNextLevel() {
    return this.currentLevelIndex < this.levels.length - 1;
  }

  advanceLevel() {
    if (this.hasNextLevel()) {
      this.currentLevelIndex++;
    }
    return this.getCurrentLevel();
  }

  resetCampaign() {
    this.currentLevelIndex = 0;
    this.campaignScore = 0;
    this.levelStats = [];
    this.resetCurrentLevelObjects();
  }

  resetCurrentLevelObjects() {
    const level = this.getCurrentLevel();
    level.objects.forEach(obj => {
      obj.found = false;
    });
    if (level.movableCovers) {
      level.movableCovers.forEach(cov => {
        cov.isShifted = false;
      });
    }
  }

  recordLevelCompletion(levelScore, stars, timeUsed) {
    this.campaignScore += levelScore;
    this.levelStats.push({
      levelNumber: this.currentLevelIndex + 1,
      name: this.getCurrentLevel().name,
      score: levelScore,
      stars,
      timeUsed
    });
  }

  /**
   * Carga la imagen SVG principal del nivel actual
   * @returns {Promise<HTMLImageElement>}
   */
  async loadCurrentLevelImage() {
    const level = this.getCurrentLevel();

    if (this.cachedMainImages.has(level.levelNumber)) {
      return this.cachedMainImages.get(level.levelNumber);
    }

    return this._createImageFromSvg(level.svgContent, this.cachedMainImages, level.levelNumber);
  }

  /**
   * Carga la imagen SVG de una sub-escena de contenedor
   * @param {object} container
   * @returns {Promise<HTMLImageElement>}
   */
  async loadContainerImage(container) {
    if (this.cachedContainerImages.has(container.id)) {
      return this.cachedContainerImages.get(container.id);
    }

    return this._createImageFromSvg(container.subSceneSvg, this.cachedContainerImages, container.id);
  }

  _createImageFromSvg(svgString, cacheMap, key) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      img.onload = () => {
        URL.revokeObjectURL(url);
        cacheMap.set(key, img);
        resolve(img);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error(`Error al decodificar SVG: ${key}`));
      };

      img.src = url;
    });
  }
}
