/**
 * CrimeScene
 * Administra el estado interactivo, contenedores (sub-escenas),
 * cubiertas desplazables y detección de precisión para el nivel en curso.
 */
export class CrimeScene {
  constructor() {
    this.levelNumber = 1;
    this.name = '';
    this.location = '';
    this.timeLimit = 70;
    this.width = 1280;
    this.height = 720;
    this.image = null;
    this.containerImages = new Map();
    this.isLoaded = false;
    this.objects = [];
    this.containers = [];
    this.movableCovers = [];
  }

  /**
   * Carga la configuración del nivel actual
   * @param {object} levelData
   * @param {HTMLImageElement} mainImage
   * @param {Map<string, HTMLImageElement>} containerImagesMap
   */
  loadLevel(levelData, mainImage, containerImagesMap = new Map()) {
    this.levelNumber = levelData.levelNumber;
    this.name = levelData.name;
    this.location = levelData.location;
    this.timeLimit = levelData.timeLimit;
    this.image = mainImage;
    this.containerImages = containerImagesMap;
    this.isLoaded = true;

    // Clonar contenedores y cubiertas
    this.containers = (levelData.containers || []).map(c => ({ ...c }));
    this.movableCovers = (levelData.movableCovers || []).map(cov => ({ ...cov, isShifted: false }));

    // Clonar objetos
    this.objects = levelData.objects.map(obj => ({
      ...obj,
      found: false
    }));
  }

  getAllObjects() {
    return this.objects;
  }

  getRemainingObjects() {
    return this.objects.filter(obj => !obj.found);
  }

  /**
   * Detecta si un clic en la sala principal impactó en un contenedor interactivo
   * @param {number} x
   * @param {number} y
   * @returns {object|null}
   */
  getContainerAt(x, y) {
    for (const container of this.containers) {
      const distance = Math.hypot(x - container.x, y - container.y);
      if (distance <= container.radius) {
        return container;
      }
    }
    return null;
  }

  /**
   * Detecta si un clic impactó en una cubierta desplazable en la vista activa
   * @param {number} x
   * @param {number} y
   * @param {string} currentView 'MAIN' o id del contenedor
   * @returns {object|null}
   */
  getCoverAt(x, y, currentView = 'MAIN') {
    for (const cover of this.movableCovers) {
      const coverView = cover.viewId || 'MAIN';
      if (coverView !== currentView) continue;

      const curX = cover.isShifted ? cover.x + cover.shiftDx : cover.x;
      const curY = cover.isShifted ? cover.y + cover.shiftDy : cover.y;

      if (
        x >= curX &&
        x <= curX + cover.width &&
        y >= curY &&
        y <= curY + cover.height
      ) {
        return cover;
      }
    }
    return null;
  }

  /**
   * Obtiene la cubierta que protege a un objeto
   * @param {string} objectId
   * @returns {object|null}
   */
  getCoverForObject(objectId) {
    return this.movableCovers.find(cov => cov.coversObjectId === objectId) || null;
  }

  /**
   * Comprueba el impacto de un clic según la vista activa (MAIN o contenedor sub-escena)
   * @param {number} x
   * @param {number} y
   * @param {string} currentView 'MAIN' o id del contenedor
   * @returns {{ hit: object|null, isCovered: boolean, cover: object|null }}
   */
  checkHit(x, y, currentView = 'MAIN') {
    const activeObjects = this.getRemainingObjects();

    for (const item of activeObjects) {
      const itemInThisView = (currentView === 'MAIN' && !item.containerId) || (item.containerId === currentView);

      if (!itemInThisView) continue;

      const distance = Math.hypot(x - item.x, y - item.y);
      if (distance <= item.radius) {
        // Verificar si el objeto está cubierto por un elemento no desplazado
        if (item.coveredBy) {
          const cover = this.movableCovers.find(c => c.id === item.coveredBy);
          if (cover && !cover.isShifted) {
            return { hit: null, isCovered: true, cover };
          }
        }
        return { hit: item, isCovered: false, cover: null };
      }
    }

    return { hit: null, isCovered: false, cover: null };
  }

  markFound(id) {
    const item = this.objects.find(obj => obj.id === id);
    if (item && !item.found) {
      item.found = true;
      return item;
    }
    return null;
  }

  reset() {
    this.objects.forEach(obj => {
      obj.found = false;
    });
    this.movableCovers.forEach(cov => {
      cov.isShifted = false;
    });
  }
}
