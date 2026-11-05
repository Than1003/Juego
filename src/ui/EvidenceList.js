/**
 * EvidenceList
 * Administra la barra visual inferior de evidencias para cualquier nivel activo,
 * con iconos temáticos específicos para cada uno de los 40 objetos de la campaña.
 */
export class EvidenceList {
  constructor(containerElement, counterElement) {
    this.container = containerElement;
    this.counter = counterElement;
    this.itemsMap = new Map();

    // Catálogo completo de iconos temáticos para los 5 niveles
    this.iconsMap = {
      // Evidencias Forenses y Cadáver
      broken_watch: '⌚',
      threat_note: '✉️',
      bullet_wound: '🎯',
      blood_fingerprint: '🩸',
      bullet_casing: '💥',
      master_key: '🗝️',
      bar_matchbook: '🔥',
      switchblade: '🗡️',
      pawn_ticket: '🎫',
      glove: '🧤',
      broken_glass: '🍾',
      anchor: '⚓',
      wrench: '🔧',
      padlock: '🔒',
      money: '💵',
      notebook: '📘',
      cyanide: '☠️',
      glass: '🍷',
      dagger: '🗡️',
      usb: '💾',
      phone: '☎️',
      // Nivel 1: Despacho
      revolver: '🔫',
      magnifier: '🔍',
      badge: '🛡️',
      poison: '🧪',
      pocket_watch: '⏱️',
      dossier: '📁',
      // Nivel 2: Callejón
      crowbar: '🦯',
      lighter: '🔥',
      bloody_glove: '🧤',
      mask: '🎭',
      necklace: '📿',
      footprint: '👣',
      syringe: '💉',
      // Nivel 3: Almacén
      dynamite: '🧨',
      keys: '🗝️',
      pliers: '✂️',
      compass: '🧭',
      passport: '🛂',
      hook: '🪝',
      bullet_box: '📦',
      flask: '🍾',
      // Nivel 4: Laboratorio
      microscope: '🔬',
      cyanide_vial: '🧪',
      scalpel: '🔪',
      diary: '📖',
      burner: '🕯️',
      test_tube: '🧪',
      gas_mask: '🤿',
      chemical_formula: '📄',
      cassette: '📼',
      // Nivel 5: Salón Secreto
      gold_ingot: '🪙',
      derringer: '🔫',
      diamond_ring: '💍',
      cipher_wheel: '⚙️',
      ledger: '📓',
      champagne: '🥂',
      poker_ace: '🂡',
      cigar: '🚬',
      vinyl: '💿',
      seal: '🩸'
    };
  }

  /**
   * Reconstruye el catálogo visual de evidencias según el nivel cargado
   * @param {Array<{ id: string, name: string, clue: string }>} objects
   */
  init(objects) {
    this.container.innerHTML = '';
    this.itemsMap.clear();

    objects.forEach(item => {
      const card = document.createElement('div');
      card.className = 'evidence-card';
      card.id = `evidence-${item.id}`;
      card.setAttribute('title', item.clue || item.name);

      const icon = this.iconsMap[item.id] || '🔍';

      card.innerHTML = `
        <div class="evidence-icon-box">
          <span class="evidence-icon">${icon}</span>
        </div>
        <div class="evidence-info">
          <span class="evidence-name">${item.name}</span>
          <span class="evidence-status-label">PENDIENTE</span>
        </div>
        <div class="evidence-stamp-box">
          <span class="evidence-check">✓</span>
          <span class="evidence-stamp">ASEGURADA</span>
        </div>
      `;

      this.container.appendChild(card);
      this.itemsMap.set(item.id, card);
    });

    this.updateCounter(0, objects.length);
  }

  markAsFound(id, foundCount, totalCount) {
    const card = this.itemsMap.get(id);
    if (card) {
      card.classList.remove('evidence-hinted');
      card.classList.add('found');
      card.classList.add('just-found');

      const statusLabel = card.querySelector('.evidence-status-label');
      if (statusLabel) {
        statusLabel.textContent = 'ASEGURADA';
      }

      setTimeout(() => {
        card.classList.remove('just-found');
      }, 700);
    }

    this.updateCounter(foundCount, totalCount);
  }

  highlightHint(id) {
    const card = this.itemsMap.get(id);
    if (card && !card.classList.contains('found')) {
      card.classList.add('evidence-hinted');

      setTimeout(() => {
        card.classList.remove('evidence-hinted');
      }, 4500);
    }
  }

  updateCounter(found, total) {
    if (this.counter) {
      this.counter.textContent = `${found} / ${total}`;
    }
  }

  reset() {
    this.itemsMap.forEach(card => {
      card.classList.remove('found', 'just-found', 'evidence-hinted');
      const statusLabel = card.querySelector('.evidence-status-label');
      if (statusLabel) {
        statusLabel.textContent = 'PENDIENTE';
      }
    });
  }
}
