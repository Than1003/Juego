/**
 * LEVELS_DATA
 * Catálogo maestro de los 5 niveles progresivos con:
 * - Pieza central: CADÁVER E INSPECCIÓN FORENSE (silueta de tiza, cinta amarilla, conos 1, 2, 3 y sub-escena de autopsia).
 * - Atmósfera cinematográfica Police Noir con iluminación claroscuro.
 * - Contenedores y Sub-escenas de zoom (cadáver, cajón, caja fuerte, basurero, cofre, vitrina).
 * - Cubiertas desplazables (solapas de chaquetas, tapetes, periódicos, cajas, cojines).
 * - Micro-evidencias de alta precisión diseñadas para la Lupa Forense (casquillos, huellas, relojes fracturados).
 */

// ====================================================================
// SUB-ESCENAS SVG (ZOOM FORENSE DE CADÁVERES Y CONTENEDORES)
// ====================================================================

// NIVEL 1: SUB-ESCENA 1 - INSPECCIÓN FORENSE DEL CADÁVER (Arthur Pendelton, Notario)
const L1_CORPSE_ZOOM_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <defs>
    <linearGradient id="suit_wool" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2c3038"/><stop offset="100%" stop-color="#14171c"/>
    </linearGradient>
    <linearGradient id="shirt_cloth" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f8f9fa"/><stop offset="100%" stop-color="#d9dee3"/>
    </linearGradient>
    <linearGradient id="blood_dry" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#800b14"/><stop offset="100%" stop-color="#400408"/>
    </linearGradient>
    <filter id="corp_shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#000" flood-opacity="0.8"/>
    </filter>
  </defs>

  <!-- Suelo de parquet en penumbra con silueta de tiza forense -->
  <rect x="0" y="0" width="1280" height="720" fill="#0d0907"/>
  <path d="M 60,60 L 1220,60 M 60,180 L 1220,180 M 60,300 L 1220,300 M 60,420 L 1220,420 M 60,540 L 1220,540 M 60,660 L 1220,660" stroke="#1c130d" stroke-width="2"/>
  
  <!-- Trazado de tiza pericial del cuerpo -->
  <path d="M 120,480 Q 200,420 380,440 Q 560,300 740,240 Q 980,260 1120,360 Q 1180,500 1100,640 Q 820,680 480,660 Q 240,640 120,480 Z" 
        fill="none" stroke="rgba(255, 255, 255, 0.45)" stroke-width="4" stroke-dasharray="10, 8"/>

  <!-- Mancha de sangre principal bajo el torso -->
  <ellipse cx="680" cy="460" rx="420" ry="180" fill="url(#blood_dry)" opacity="0.9" filter="url(#corp_shadow)"/>
  <circle cx="530" cy="520" r="42" fill="#59080e" opacity="0.85"/>
  <circle cx="890" cy="490" r="30" fill="#4a060b" opacity="0.85"/>

  <!-- Torso de la víctima: Traje de raya diplomática -->
  <polygon points="260,660 480,260 920,240 1080,660" fill="url(#suit_wool)" filter="url(#corp_shadow)"/>
  
  <!-- Camisa blanca y corbata con orificio de bala mortal -->
  <polygon points="560,250 680,250 720,480 520,480" fill="url(#shirt_cloth)"/>
  <polygon points="610,250 635,250 645,460 600,460" fill="#7a1824"/>
  
  <!-- Quemadura de pólvora y herida de bala en el pecho (x: 580, y: 390, r: 22) -->
  <g id="zoom-bullet-wound" transform="translate(560, 370)">
    <circle cx="20" cy="20" r="18" fill="#111" opacity="0.6"/>
    <circle cx="20" cy="20" r="10" fill="#2d0a0d"/>
    <circle cx="20" cy="20" r="5" fill="#000"/>
    <line x1="20" y1="2" x2="20" y2="38" stroke="#500" stroke-width="2"/>
    <line x1="2" y1="20" x2="38" y2="20" stroke="#500" stroke-width="2"/>
  </g>

  <!-- Brazo izquierdo extendido con camisa y puño -->
  <polygon points="260,660 380,440 220,480 140,660" fill="url(#suit_wool)"/>
  <rect x="170" y="470" width="85" height="40" rx="4" fill="url(#shirt_cloth)" transform="rotate(-20 210 490)"/>

  <!-- 1. RELOJ DE PULSERA ROTO (x: 215, y: 485, r: 24) [Cristal roto a las 11:42 PM] -->
  <g id="zoom-wrist-watch" transform="translate(185, 455)">
    <!-- Correa de cuero -->
    <rect x="0" y="22" width="60" height="18" rx="3" fill="#3b2012" stroke="#1d0f07" stroke-width="1.5"/>
    <!-- Caja dorada del reloj -->
    <circle cx="30" cy="31" r="23" fill="#c59b27" stroke="#755a12" stroke-width="2"/>
    <circle cx="30" cy="31" r="18" fill="#fdfcf7"/>
    <!-- Agujas congeladas a las 11:42 PM -->
    <line x1="30" y1="31" x2="30" y2="17" stroke="#111" stroke-width="2"/>
    <line x1="30" y1="31" x2="42" y2="26" stroke="#111" stroke-width="1.8"/>
    <!-- Fracturas del cristal -->
    <line x1="18" y1="22" x2="30" y2="31" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="2, 1"/>
    <line x1="30" y1="31" x2="42" y2="40" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="2, 1"/>
  </g>

  <!-- 2. HUELLA DACTILAR ENSANGRENTADA en el puño (x: 245, y: 550, r: 18) [Micro-evidencia para Lupa] -->
  <g id="zoom-blood-fingerprint" transform="translate(230, 535)">
    <ellipse cx="15" cy="15" rx="14" ry="16" fill="none" stroke="#8b0000" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="15" cy="15" rx="9" ry="11" fill="none" stroke="#990000" stroke-width="1.8"/>
    <ellipse cx="15" cy="15" rx="4" ry="5" fill="none" stroke="#a30000" stroke-width="1.5"/>
  </g>

  <!-- 3. CASQUILLO DE BALA 9mm caído junto al torso (x: 960, y: 560, r: 16) [Micro-evidencia para Lupa] -->
  <g id="zoom-bullet-casing" transform="translate(945, 545)">
    <rect x="0" y="8" width="28" height="14" rx="2" fill="#d4af37" stroke="#8a6e1a" stroke-width="1.5" transform="rotate(25 14 15)"/>
    <ellipse cx="6" cy="15" rx="3" ry="7" fill="#8a6e1a" transform="rotate(25 14 15)"/>
    <ellipse cx="26" cy="15" rx="2.5" ry="6" fill="#111" transform="rotate(25 14 15)"/>
  </g>

  <!-- 4. GEMELO DEL SINDICATO en la manga (x: 880, y: 320, r: 18) -->
  <g id="zoom-syndicate-pin" transform="translate(865, 305)">
    <circle cx="15" cy="15" r="14" fill="#111" stroke="#d4af37" stroke-width="2.5"/>
    <path d="M 9,18 Q 15,6 21,18 Q 15,14 9,18 Z" fill="#d4af37"/>
    <circle cx="15" cy="12" r="2.5" fill="#e74c3c"/>
  </g>

  <!-- Bolsillo interior donde yace la Nota de Extorsión (x: 770, y: 390, r: 22) -->
  <g id="zoom-threat-note" transform="translate(740, 360)">
    <rect x="0" y="0" width="60" height="48" fill="#f4ebd9" stroke="#b09b78" stroke-width="2" filter="url(#corp_shadow)"/>
    <line x1="8" y1="12" x2="52" y2="12" stroke="#8b0000" stroke-width="2.5"/>
    <line x1="8" y1="24" x2="45" y2="24" stroke="#333" stroke-width="1.5"/>
    <line x1="8" y1="36" x2="40" y2="36" stroke="#333" stroke-width="1.5"/>
  </g>

  <!-- Regla métrica forense pericial en el borde inferior -->
  <g transform="translate(140, 685)">
    <rect x="0" y="0" width="1000" height="24" fill="#f1c40f" stroke="#111" stroke-width="2"/>
    <text x="12" y="17" fill="#111" font-family="monospace" font-size="12" font-weight="bold">ESCALA FORENSE OFICIAL // POLICIA CIENTÍFICA (0 - 50 CM)</text>
    <line x1="300" y1="0" x2="300" y2="24" stroke="#111" stroke-width="2"/>
    <line x1="500" y1="0" x2="500" y2="24" stroke="#111" stroke-width="2"/>
    <line x1="700" y1="0" x2="700" y2="24" stroke="#111" stroke-width="2"/>
    <line x1="900" y1="0" x2="900" y2="24" stroke="#111" stroke-width="2"/>
  </g>
</svg>
`;

// NIVEL 1: SUB-ESCENA 2 - CAJÓN DEL ESCRITORIO
const L1_DRAWER_ZOOM_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <defs>
    <linearGradient id="dw_wood" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3d2113"/><stop offset="100%" stop-color="#1f0f07"/>
    </linearGradient>
    <linearGradient id="dw_velvet" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#143d26"/><stop offset="100%" stop-color="#0a1f13"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="1280" height="720" fill="#0d0805"/>
  <rect x="140" y="60" width="1000" height="600" rx="8" fill="url(#dw_wood)" stroke="#120804" stroke-width="12"/>
  <rect x="170" y="90" width="940" height="540" rx="4" fill="url(#dw_velvet)" stroke="#09180f" stroke-width="4"/>
  <line x1="680" y1="90" x2="680" y2="630" stroke="#2b170c" stroke-width="8"/>
  <line x1="680" y1="360" x2="1110" y2="360" stroke="#2b170c" stroke-width="6"/>

  <!-- 1. Revólver .38 (x: 420, y: 350, r: 24) -->
  <g id="zoom-revolver" transform="translate(360, 310)">
    <rect x="0" y="24" width="75" height="18" rx="3" fill="#2d3436" stroke="#111" stroke-width="2"/>
    <rect x="55" y="18" width="34" height="30" rx="4" fill="#3d4447" stroke="#111" stroke-width="2"/>
    <line x1="64" y1="20" x2="64" y2="46" stroke="#111" stroke-width="2"/>
    <line x1="74" y1="20" x2="74" y2="46" stroke="#111" stroke-width="2"/>
    <path d="M 75,42 Q 95,65 85,95 Q 65,98 58,82 L 68,42 Z" fill="#693019" stroke="#3b190c" stroke-width="2.5"/>
  </g>

  <!-- 2. Expediente Confidencial (x: 900, y: 490, r: 26) -->
  <g id="zoom-dossier" transform="translate(820, 430)">
    <polygon points="0,20 35,0 130,0 145,20 145,95 0,95" fill="#d9b177" stroke="#9c753c" stroke-width="2.5"/>
    <rect x="25" y="45" width="95" height="24" fill="#a93226" transform="rotate(-8 72 57)"/>
    <text x="72" y="62" fill="#fff" font-family="monospace" font-size="12" font-weight="900" text-anchor="middle" transform="rotate(-8 72 57)">CONFIDENCIAL</text>
  </g>
</svg>
`;

// NIVEL 2: SUB-ESCENA 1 - INSPECCIÓN DEL INFORMANTE ASESINADO (Callejón)
const L2_CORPSE_ZOOM_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <defs>
    <linearGradient id="trench_cloth" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4a3e2d"/><stop offset="100%" stop-color="#241e15"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="1280" height="720" fill="#080b12"/>
  <!-- Charco de lluvia y asfalto mojado -->
  <ellipse cx="640" cy="460" rx="550" ry="200" fill="#141c2b" opacity="0.9"/>
  <!-- Tiza en el asfalto -->
  <path d="M 180,480 Q 320,380 540,420 Q 780,280 940,320 Q 1100,440 1060,580 Q 820,650 480,630 Z" 
        fill="none" stroke="rgba(255, 255, 255, 0.4)" stroke-width="3.5" stroke-dasharray="10, 8"/>

  <!-- Cuerpo del informante con gabardina empapada -->
  <polygon points="340,650 520,300 880,300 1020,650" fill="url(#trench_cloth)"/>
  
  <!-- 1. CAJA DE CERILLAS DEL BAR NOIR con teléfono anotado (x: 420, y: 460, r: 22) -->
  <g id="zoom-matchbook" transform="translate(395, 435)">
    <rect x="0" y="0" width="48" height="52" fill="#1b080a" stroke="#e74c3c" stroke-width="2"/>
    <text x="24" y="24" fill="#ff4d6d" font-family="'Impact', sans-serif" font-size="10" text-anchor="middle">BAR NOIR</text>
    <text x="24" y="42" fill="#f1c40f" font-family="monospace" font-size="8" text-anchor="middle">TEL: 555-8912</text>
  </g>

  <!-- 2. NAVAJA AUTOMÁTICA ensangrentada (x: 820, y: 480, r: 22) -->
  <g id="zoom-knife" transform="translate(790, 450)">
    <polygon points="0,20 40,5 65,12 25,28" fill="#cbd5e1" stroke="#334155" stroke-width="2"/>
    <polygon points="25,28 65,12 90,20 50,38" fill="#1e293b"/>
    <circle cx="28" cy="18" r="6" fill="#8b0000"/>
  </g>

  <!-- 3. BOLETO DE EMPEÑO OCULTO EN EL BOLSILLO (x: 640, y: 380, r: 20) -->
  <g id="zoom-ticket" transform="translate(615, 360)">
    <rect x="0" y="0" width="50" height="36" fill="#e2d4b7" stroke="#8a7350" stroke-width="1.5"/>
    <text x="25" y="16" fill="#222" font-family="monospace" font-size="8" font-weight="bold" text-anchor="middle">CASA EMPEÑO</text>
    <text x="25" y="28" fill="#b91c1c" font-family="monospace" font-size="9" font-weight="bold" text-anchor="middle">#9402-B</text>
  </g>

  <!-- Cinta policial pericial en el callejón -->
  <g transform="translate(20, 680)">
    <rect x="0" y="0" width="1240" height="28" fill="#f1c40f"/>
    <text x="30" y="19" fill="#111" font-family="monospace" font-size="12" font-weight="900">ESCENA DEL CRIMEN // POLICE LINE DO NOT CROSS // NO PASAR</text>
  </g>
</svg>
`;

// NIVEL 2: SUB-ESCENA 2 - CONTENEDOR INDUSTRIAL
const L2_DUMPSTER_ZOOM_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <rect x="0" y="0" width="1280" height="720" fill="#070a0e"/>
  <rect x="120" y="50" width="1040" height="620" fill="#1b3d2b" stroke="#060f0b" stroke-width="16" rx="10"/>
  <path d="M 160,540 Q 280,360 480,480 Q 720,340 920,490 Q 1080,400 1120,580 L 1120,650 L 160,650 Z" fill="#14181c"/>
  
  <!-- 1. Guante de cuero (x: 520, y: 390, r: 24) -->
  <g id="zoom-glove" transform="translate(485, 355)">
    <path d="M 15,0 Q 45,6 40,35 L 45,55 Q 22,60 10,44 Z" fill="#222"/>
    <circle cx="28" cy="28" r="9" fill="#991b1b"/>
  </g>
  <!-- 2. Jeringa médica (x: 880, y: 440, r: 22) -->
  <g id="zoom-syringe" transform="translate(855, 415)">
    <rect x="0" y="10" width="45" height="10" rx="2" fill="rgba(255,255,255,0.7)" stroke="#333" stroke-width="1.5"/>
    <line x1="45" y1="15" x2="65" y2="15" stroke="#ccc" stroke-width="2"/>
    <rect x="10" y="12" width="15" height="6" fill="#10b981"/>
  </g>
</svg>
`;

// NIVEL 3: SUB-ESCENA 1 - COFRE BLINDADO DEL ALMACÉN
const L3_CHEST_ZOOM_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <rect x="0" y="0" width="1280" height="720" fill="#0b0e14"/>
  <rect x="180" y="80" width="920" height="560" rx="12" fill="#2d3748" stroke="#1a202c" stroke-width="14"/>
  <rect x="220" y="120" width="840" height="480" rx="8" fill="#1a202c"/>

  <!-- 1. Pasaporte falso (x: 460, y: 320, r: 24) -->
  <g id="zoom-passport" transform="translate(425, 285)">
    <rect x="0" y="0" width="68" height="85" rx="4" fill="#1e3a8a" stroke="#172554" stroke-width="2"/>
    <circle cx="34" cy="35" r="16" fill="none" stroke="#d4af37" stroke-width="2"/>
    <text x="34" y="68" fill="#d4af37" font-family="sans-serif" font-size="8" font-weight="bold" text-anchor="middle">PASSPORT</text>
  </g>
  <!-- 2. Fajo de billetes falsos (x: 780, y: 410, r: 26) -->
  <g id="zoom-money" transform="translate(735, 375)">
    <rect x="0" y="0" width="90" height="65" rx="3" fill="#15803d" stroke="#166534" stroke-width="2"/>
    <ellipse cx="45" cy="32" rx="20" ry="14" fill="#86efac"/>
    <text x="45" y="38" fill="#14532d" font-family="monospace" font-size="16" font-weight="900" text-anchor="middle">$</text>
  </g>
</svg>
`;

// NIVEL 4: SUB-ESCENA 1 - CAJA FUERTE MURAL DEL LABORATORIO
const L4_SAFE_ZOOM_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <rect x="0" y="0" width="1280" height="720" fill="#030712"/>
  <rect x="150" y="60" width="980" height="600" rx="16" fill="#1f2937" stroke="#111827" stroke-width="18"/>
  <rect x="190" y="100" width="900" height="520" rx="8" fill="#0f172a"/>
  <line x1="190" y1="360" x2="1090" y2="360" stroke="#334155" stroke-width="8"/>

  <!-- 1. Cuaderno de fórmulas químicas (x: 440, y: 240, r: 24) -->
  <g id="zoom-notebook" transform="translate(405, 200)">
    <rect x="0" y="0" width="70" height="90" rx="3" fill="#0284c7" stroke="#0369a1" stroke-width="2"/>
    <rect x="8" y="0" width="6" height="90" fill="#38bdf8"/>
    <text x="38" y="45" fill="#fff" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle">FORMULA</text>
  </g>
  <!-- 2. Frasco de cianuro concentrado (x: 820, y: 480, r: 22) -->
  <g id="zoom-cyanide" transform="translate(800, 445)">
    <rect x="8" y="0" width="24" height="12" fill="#475569"/>
    <rect x="0" y="12" width="40" height="60" rx="4" fill="#dc2626" stroke="#991b1b" stroke-width="2"/>
    <circle cx="20" cy="40" r="10" fill="#fff"/>
    <text x="20" y="45" fill="#000" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">☠</text>
  </g>
</svg>
`;

// NIVEL 5: SUB-ESCENA 1 - VITRINA DE VENENOS DEL PENTHOUSE
const L5_SAFE_ZOOM_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <rect x="0" y="0" width="1280" height="720" fill="#050302"/>
  <rect x="200" y="60" width="880" height="600" rx="8" fill="#1a110a" stroke="#854d0e" stroke-width="12"/>
  <rect x="240" y="100" width="800" height="520" fill="#26170d"/>
  <line x1="240" y1="360" x2="1040" y2="360" stroke="#854d0e" stroke-width="6"/>

  <!-- 1. Daga ceremonial de plata (x: 520, y: 240, r: 24) -->
  <g id="zoom-dagger" transform="translate(485, 205)">
    <polygon points="35,0 45,45 35,65 25,45" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5"/>
    <rect x="20" y="65" width="30" height="8" rx="2" fill="#d4af37"/>
    <rect x="30" y="73" width="10" height="22" rx="2" fill="#450a0a"/>
  </g>
  <!-- 2. Pendrive / Llave con transferencias (x: 780, y: 480, r: 22) -->
  <g id="zoom-key" transform="translate(755, 455)">
    <circle cx="25" cy="20" r="14" fill="none" stroke="#d4af37" stroke-width="4"/>
    <line x1="25" y1="34" x2="25" y2="60" stroke="#d4af37" stroke-width="5"/>
    <line x1="25" y1="52" x2="35" y2="52" stroke="#d4af37" stroke-width="4"/>
  </g>
</svg>
`;

// ====================================================================
// CATÁLOGO MAESTRO DE LOS 5 NIVELES
// ====================================================================
export const LEVELS = [
  // ------------------------------------------------------------------
  // NIVEL 1: EL DESPACHO DEL NOTARIO (VÍCTIMA ARTHUR PENDELTON)
  // ------------------------------------------------------------------
  {
    levelNumber: 1,
    name: 'El Despacho del Notario',
    location: 'Distrito Financiero // 4to Piso',
    timeLimit: 75,
    difficultyTag: 'TUTORIAL / MODERADO',
    svgContent: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <defs>
    <linearGradient id="l1_wood" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#24140b"/><stop offset="100%" stop-color="#0f0704"/>
    </linearGradient>
    <linearGradient id="l1_desk" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3d1e11"/><stop offset="50%" stop-color="#2c140a"/><stop offset="100%" stop-color="#140803"/>
    </linearGradient>
    <linearGradient id="l1_light" x1="0%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="rgba(255, 230, 150, 0.28)"/><stop offset="100%" stop-color="rgba(255, 200, 100, 0)"/>
    </linearGradient>
    <linearGradient id="l1_blood_pool" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#700910"/><stop offset="100%" stop-color="#330306"/>
    </linearGradient>
  </defs>

  <!-- Paredes empapeladas de caoba y suelo de parquet sombrío -->
  <rect x="0" y="0" width="1280" height="470" fill="#180e08"/>
  <rect x="0" y="470" width="1280" height="250" fill="url(#l1_wood)"/>
  
  <!-- Ventana gótica con lluvia nocturna exterior -->
  <g transform="translate(540, 40)">
    <rect x="0" y="0" width="200" height="280" rx="100" fill="#08101a" stroke="#2c1a10" stroke-width="12"/>
    <line x1="100" y1="0" x2="100" y2="280" stroke="#2c1a10" stroke-width="6"/>
    <line x1="0" y1="140" x2="200" y2="140" stroke="#2c1a10" stroke-width="6"/>
    <!-- Relámpago tenue de tormenta -->
    <polygon points="90,20 120,90 100,100 130,170" fill="rgba(255,255,255,0.15)"/>
  </g>

  <!-- Librería de roble a la izquierda -->
  <rect x="40" y="80" width="160" height="400" fill="#24140b" stroke="#120904" stroke-width="4"/>
  <rect x="40" y="190" width="160" height="12" fill="#361f12"/>
  <rect x="40" y="300" width="160" height="12" fill="#361f12"/>
  <rect x="55" y="120" width="22" height="70" fill="#7a2424"/>
  <rect x="80" y="110" width="26" height="80" fill="#1b3854"/>

  <!-- Escritorio señorial de caoba -->
  <polygon points="180,440 1100,440 1060,540 220,540" fill="url(#l1_desk)" stroke="#1a0c06" stroke-width="2"/>
  <polygon points="220,540 1060,540 1055,565 225,565" fill="#1c0b04"/>

  <!-- Lámpara verde de banquero -->
  <g transform="translate(940, 330)">
    <ellipse cx="20" cy="120" rx="20" ry="6" fill="#8a6923"/>
    <path d="M 20,120 Q 25,60 0,35" fill="none" stroke="#a37c2a" stroke-width="5"/>
    <path d="M -22,28 Q 0,16 22,28 L 19,42 Q 0,34 -19,42 Z" fill="#175e38"/>
  </g>
  <polygon points="940,372 1160,720 320,720 620,410" fill="url(#l1_light)" style="mix-blend-mode: screen;" pointer-events="none"/>

  <!-- ========================================================================= -->
  <!-- PIEZA CENTRAL NARRATIVA: CADÁVER DE LA VÍCTIMA (ARTHUR PENDELTON)        -->
  <!-- ========================================================================= -->

  <!-- 1. Silueta de tiza trazada en el suelo por los peritos -->
  <path d="M 520,580 Q 560,540 640,550 Q 720,560 760,600 Q 750,640 700,645 Q 670,685 610,690 Q 550,685 530,640 Q 480,630 520,580 Z" 
        fill="none" stroke="rgba(255, 255, 255, 0.75)" stroke-width="3" stroke-dasharray="8, 6"/>

  <!-- 2. Charco de sangre de la víctima -->
  <ellipse cx="630" cy="615" rx="100" ry="40" fill="url(#l1_blood_pool)" opacity="0.9"/>

  <!-- 3. Cuerpo de la víctima caído en el suelo -->
  <g id="l1-corpse-body" transform="translate(530, 560)">
    <!-- Piernas y pantalones oscuros -->
    <polygon points="30,70 45,70 65,115 45,115" fill="#191c22"/>
    <polygon points="75,70 90,70 115,110 95,115" fill="#191c22"/>
    <!-- Zapatos oxford negros -->
    <ellipse cx="55" cy="118" rx="12" ry="5" fill="#050505"/>
    <ellipse cx="105" cy="115" rx="12" ry="5" fill="#050505"/>
    <!-- Torso en traje gris marengo -->
    <polygon points="20,20 110,15 130,75 10,75" fill="#242830"/>
    <!-- Camisa blanca y corbata con mancha de bala -->
    <polygon points="50,18 75,18 70,55 55,55" fill="#ede8dc"/>
    <polygon points="60,20 65,20 68,50 62,50" fill="#7a1824"/>
    <circle cx="64" cy="38" r="4.5" fill="#990000"/>
    <!-- Brazo extendido hacia la derecha -->
    <polygon points="105,30 160,55 155,65 100,45" fill="#242830"/>
    <circle cx="165" cy="60" r="6" fill="#ecd0b8"/> <!-- Mano -->
    <circle cx="158" cy="56" r="3.5" fill="#d4af37"/> <!-- Reloj -->
    <!-- Cabeza ladeada -->
    <ellipse cx="45" cy="10" rx="16" ry="18" fill="#ecd0b8"/>
    <path d="M 32,5 Q 45,-5 60,3 Q 55,18 32,14 Z" fill="#2d1c13"/> <!-- Cabello -->
  </g>

  <!-- 4. Conos de evidencia numerados (1, 2, 3) -->
  <!-- Cono #1 (cabeza del cadáver) -->
  <g transform="translate(510, 530)">
    <polygon points="12,0 0,26 24,26" fill="#f1c40f" stroke="#111" stroke-width="1.2"/>
    <text x="12" y="21" fill="#111" font-family="monospace" font-size="12" font-weight="900" text-anchor="middle">1</text>
  </g>
  <!-- Cono #2 (mano y casquillo de bala) -->
  <g transform="translate(720, 610)">
    <polygon points="12,0 0,26 24,26" fill="#f1c40f" stroke="#111" stroke-width="1.2"/>
    <text x="12" y="21" fill="#111" font-family="monospace" font-size="12" font-weight="900" text-anchor="middle">2</text>
  </g>
  <!-- Cono #3 (salpicadura de sangre cerca del escritorio) -->
  <g transform="translate(430, 540)">
    <polygon points="12,0 0,26 24,26" fill="#f1c40f" stroke="#111" stroke-width="1.2"/>
    <text x="12" y="21" fill="#111" font-family="monospace" font-size="12" font-weight="900" text-anchor="middle">3</text>
  </g>

  <!-- 5. Cinta amarilla de "CUIDADO ESCENA DEL CRIMEN // POLICE LINE DO NOT CROSS" cruzando el frente -->
  <g transform="translate(-10, 665) rotate(-3)">
    <rect x="0" y="0" width="1320" height="28" fill="#f1c40f" opacity="0.95" filter="url(#dw_shadow)"/>
    <line x1="0" y1="2" x2="1320" y2="2" stroke="#111" stroke-width="2"/>
    <line x1="0" y1="26" x2="1320" y2="26" stroke="#111" stroke-width="2"/>
    <text x="20" y="19" fill="#111" font-family="monospace" font-size="12" font-weight="900" letter-spacing="3">
      ⚠️ CUIDADO: ESCENA DEL CRIMEN ── POLICE LINE DO NOT CROSS ── DIVISIÓN FORENSE // NO PASAR ⚠️
    </text>
  </g>

  <!-- ================= OBJETOS DE LA SALA PRINCIPAL ================= -->
  <!-- Lupa sobre los papeles (x: 750, y: 460, r: 20) -->
  <g id="l1-magnifier" transform="translate(732, 442)">
    <path d="M 32,32 L 52,52" stroke="#4a2612" stroke-width="5" stroke-linecap="round"/>
    <circle cx="20" cy="20" r="18" fill="rgba(180, 220, 255, 0.25)" stroke="#c29a32" stroke-width="3"/>
  </g>
  <!-- Placa policial (x: 280, y: 520, r: 20) -->
  <g id="l1-badge" transform="translate(262, 502)">
    <path d="M 18,2 Q 36,2 36,18 L 32,36 Q 18,44 4,36 L 0,18 Q 0,2 18,2 Z" fill="#181818"/>
    <polygon points="18,6 21,14 30,14 23,19 25,27 18,22 11,27 13,19 6,14 15,14" fill="#e5b82c"/>
  </g>
  <!-- Frasco de veneno en la repisa izquierda (x: 120, y: 250, r: 18) -->
  <g id="l1-poison" transform="translate(106, 230)">
    <rect x="10" y="0" width="8" height="8" fill="#7a542b"/>
    <path d="M 10,8 Q 0,14 2,32 L 4,42 Q 14,46 24,42 L 26,32 Q 28,14 18,8 Z" fill="#12442a" stroke="#092416" stroke-width="1.2"/>
    <rect x="7" y="20" width="14" height="14" fill="#d9c298"/>
    <circle cx="14" cy="25" r="3" fill="#111"/>
  </g>
  <!-- Llave maestra oculta bajo el tapete (x: 580, y: 495, r: 18) -->
  <g id="l1-master-key" transform="translate(566, 481)">
    <circle cx="14" cy="14" r="12" fill="none" stroke="#d4af37" stroke-width="3"/>
    <line x1="24" y1="14" x2="42" y2="14" stroke="#d4af37" stroke-width="4"/>
    <line x1="36" y1="14" x2="36" y2="22" stroke="#d4af37" stroke-width="3"/>
    <line x1="42" y1="14" x2="42" y2="20" stroke="#d4af37" stroke-width="3"/>
  </g>
</svg>
    `,
    // Contenedores interactivos (Sub-escenas)
    containers: [
      {
        id: 'l1_corpse',
        name: 'Inspección Forense del Cadáver',
        hintName: 'el cadáver de la víctima Arthur Pendelton en el suelo',
        x: 620,
        y: 605,
        radius: 65,
        icon: '💀',
        subSceneSvg: L1_CORPSE_ZOOM_SVG
      },
      {
        id: 'l1_drawer',
        name: 'Cajón del Escritorio',
        hintName: 'el cajón cerrado del escritorio',
        x: 360,
        y: 590,
        radius: 36,
        icon: '🗄️',
        subSceneSvg: L1_DRAWER_ZOOM_SVG
      }
    ],
    // Cubiertas desplazables (en escena principal y sub-escenas)
    movableCovers: [
      {
        id: 'l1_desk_mat',
        viewId: 'MAIN',
        name: 'Tapete de Cuero',
        x: 380,
        y: 450,
        width: 440,
        height: 65,
        shiftDx: 130,
        shiftDy: -35,
        isShifted: false,
        coversObjectId: 'master_key',
        color: '#162e23',
        borderColor: '#b08b3e'
      },
      {
        id: 'l1_jacket_lapel',
        viewId: 'l1_corpse',
        name: 'Solapa de la Chaqueta',
        x: 720,
        y: 330,
        width: 110,
        height: 100,
        shiftDx: 85,
        shiftDy: -20,
        isShifted: false,
        coversObjectId: 'threat_note',
        color: '#1a1d24',
        borderColor: '#374151'
      }
    ],
    objects: [
      // Evidencias dentro de la Inspección Forense del Cadáver
      { id: 'broken_watch', name: 'Reloj roto (11:42 PM)', clue: 'Cristal roto en la muñeca izquierda del cadáver.', x: 215, y: 485, radius: 24, containerId: 'l1_corpse', coveredBy: null, found: false },
      { id: 'threat_note', name: 'Nota de extorsión', clue: 'Nota en el bolsillo interior; mueve la solapa de la chaqueta.', x: 770, y: 390, radius: 22, containerId: 'l1_corpse', coveredBy: 'l1_jacket_lapel', found: false },
      { id: 'bullet_wound', name: 'Quemadura de pólvora', clue: 'Impacto de bala en el pecho del cadáver.', x: 580, y: 390, radius: 22, containerId: 'l1_corpse', coveredBy: null, found: false },
      { id: 'blood_fingerprint', name: 'Huella ensangrentada', clue: 'Huella en el puño blanco del cadáver (Usa la Lupa).', x: 245, y: 550, radius: 18, containerId: 'l1_corpse', coveredBy: null, found: false },
      { id: 'bullet_casing', name: 'Casquillo 9mm', clue: 'Casquillo dorado junto al torso del cadáver.', x: 960, y: 560, radius: 16, containerId: 'l1_corpse', coveredBy: null, found: false },
      
      // Evidencias dentro del Cajón
      { id: 'revolver', name: 'Revólver .38', clue: 'Arma homicida dentro del cajón del escritorio.', x: 420, y: 350, radius: 24, containerId: 'l1_drawer', coveredBy: null, found: false },
      { id: 'dossier', name: 'Expediente Confidencial', clue: 'Dossier clasificado dentro del cajón.', x: 900, y: 490, radius: 26, containerId: 'l1_drawer', coveredBy: null, found: false },

      // Evidencias en la Escena Principal
      { id: 'master_key', name: 'Llave maestra', clue: 'Oculta bajo el tapete de cuero del escritorio.', x: 580, y: 495, radius: 18, containerId: null, coveredBy: 'l1_desk_mat', found: false },
      { id: 'magnifier', name: 'Lupa antigua', clue: 'Instrumento óptico sobre la mesa de trabajo.', x: 750, y: 460, radius: 20, containerId: null, coveredBy: null, found: false },
      { id: 'badge', name: 'Placa policial', clue: 'Insignia de detective en el borde del escritorio.', x: 280, y: 520, radius: 20, containerId: null, coveredBy: null, found: false }
    ]
  },

  // ------------------------------------------------------------------
  // NIVEL 2: CALLEJÓN TRASERO SOMBRÍO (INFORMANTE ASESINADO)
  // ------------------------------------------------------------------
  {
    levelNumber: 2,
    name: 'Callejón Trasero Sombrío',
    location: 'Distrito Portuario // Tras el Bar Noir',
    timeLimit: 65,
    difficultyTag: 'DIFÍCIL',
    svgContent: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <rect x="0" y="0" width="1280" height="720" fill="#080c14"/>
  <polygon points="0,0 380,120 380,560 0,720" fill="#241514" stroke="#120a09" stroke-width="2"/>
  <polygon points="1280,0 880,140 880,560 1280,720" fill="#241514" stroke="#120a09" stroke-width="2"/>
  <polygon points="0,720 380,560 880,560 1280,720" fill="#0d1118"/>
  
  <!-- Neón Bar Noir parpadeante -->
  <g transform="translate(930, 150)">
    <rect x="0" y="0" width="160" height="50" fill="#14080a" stroke="#4a151b" stroke-width="3" rx="4"/>
    <text x="80" y="32" fill="#ff4d6d" font-family="'Impact', sans-serif" font-size="20" letter-spacing="4" text-anchor="middle">BAR NOIR</text>
  </g>
  
  <!-- Escalera de incendios -->
  <g stroke="#161920" stroke-width="4">
    <line x1="210" y1="80" x2="210" y2="480"/><line x1="260" y1="95" x2="260" y2="495"/>
    <line x1="210" y1="160" x2="260" y2="175"/><line x1="210" y1="280" x2="260" y2="295"/>
  </g>
  
  <!-- Cadáver del Informante Frankie en el suelo del callejón -->
  <path d="M 460,590 Q 520,560 590,570 Q 640,610 580,640 Q 510,640 460,590 Z" 
        fill="none" stroke="rgba(255, 255, 255, 0.7)" stroke-width="2.5" stroke-dasharray="6, 5"/>
  <ellipse cx="540" cy="610" rx="60" ry="22" fill="#58080f" opacity="0.9"/>
  <!-- Cuerpo del informante -->
  <g id="l2-corpse-mini" transform="translate(480, 580)">
    <polygon points="20,10 80,10 95,45 10,45" fill="#382d20"/> <!-- Gabardina -->
    <ellipse cx="25" cy="5" rx="10" ry="12" fill="#d9b69c"/> <!-- Rostro -->
    <circle cx="85" cy="35" r="5" fill="#d9b69c"/> <!-- Mano -->
  </g>

  <!-- Cono policial #1 -->
  <g transform="translate(450, 560)">
    <polygon points="10,0 0,22 20,22" fill="#f1c40f" stroke="#111" stroke-width="1"/>
    <text x="10" y="18" fill="#111" font-family="monospace" font-size="10" font-weight="900" text-anchor="middle">1</text>
  </g>

  <!-- Cinta policial pericial cortando el callejón -->
  <g transform="translate(-10, 675) rotate(-2)">
    <rect x="0" y="0" width="1320" height="26" fill="#f1c40f" opacity="0.95"/>
    <text x="30" y="18" fill="#111" font-family="monospace" font-size="11" font-weight="900" letter-spacing="3">
      ⚠️ CUIDADO: ESCENA DEL CRIMEN // POLICE LINE DO NOT CROSS // ÁREA RESTRINGIDA ⚠️
    </text>
  </g>

  <!-- Palanca (x: 240, y: 380, r: 20) -->
  <g id="l2-crowbar" transform="translate(230, 360)">
    <path d="M 5,0 L 15,38 Q 16,42 22,40" fill="none" stroke="#68798e" stroke-width="4.5" stroke-linecap="round"/>
  </g>
  <!-- Encendedor Zippo (x: 680, y: 540, r: 18) -->
  <g id="l2-lighter" transform="translate(670, 530)">
    <rect x="0" y="6" width="16" height="18" rx="2" fill="#d4af37" stroke="#7a6217" stroke-width="1.2"/>
    <polygon points="0,6 6,0 18,0 16,6" fill="#f1c40f"/>
  </g>
  <!-- Botella rota (x: 830, y: 590, r: 18) -->
  <g id="l2-bottle" transform="translate(820, 575)">
    <polygon points="5,0 15,0 18,22 2,22" fill="#059669" opacity="0.7"/>
    <line x1="8" y1="22" x2="0" y2="30" stroke="#059669" stroke-width="2"/>
  </g>
  <!-- Huella de calzado (x: 390, y: 615, r: 20) -->
  <g id="l2-footprint" transform="translate(378, 600)">
    <ellipse cx="12" cy="14" rx="8" ry="14" fill="#1e293b" opacity="0.8"/>
    <ellipse cx="12" cy="30" rx="7" ry="7" fill="#1e293b" opacity="0.8"/>
  </g>
</svg>
    `,
    containers: [
      {
        id: 'l2_corpse',
        name: 'Informante Frankie Asesinado',
        hintName: 'el cuerpo de Frankie tirado en el suelo del callejón',
        x: 540,
        y: 605,
        radius: 55,
        icon: '💀',
        subSceneSvg: L2_CORPSE_ZOOM_SVG
      },
      {
        id: 'l2_dumpster',
        name: 'Contenedor de Basura',
        hintName: 'el contenedor verde industrial',
        x: 740,
        y: 470,
        radius: 46,
        icon: '🗑️',
        subSceneSvg: L2_DUMPSTER_ZOOM_SVG
      }
    ],
    movableCovers: [
      {
        id: 'l2_cardboard',
        viewId: 'MAIN',
        name: 'Caja de Cartón Húmeda',
        x: 630,
        y: 510,
        width: 140,
        height: 60,
        shiftDx: 95,
        shiftDy: -35,
        isShifted: false,
        coversObjectId: 'lighter',
        color: '#785338',
        borderColor: '#4d321f'
      }
    ],
    objects: [
      // En el cadáver del informante
      { id: 'bar_matchbook', name: 'Cerillas del Bar Noir', clue: 'En la mano del informante con un teléfono.', x: 420, y: 460, radius: 22, containerId: 'l2_corpse', coveredBy: null, found: false },
      { id: 'switchblade', name: 'Navaja ensangrentada', clue: 'Arma blanca clavada junto al informante.', x: 820, y: 480, radius: 22, containerId: 'l2_corpse', coveredBy: null, found: false },
      { id: 'pawn_ticket', name: 'Boleto de empeño', clue: 'Recibo en el abrigo del informante.', x: 640, y: 380, radius: 20, containerId: 'l2_corpse', coveredBy: null, found: false },
      // En el contenedor
      { id: 'glove', name: 'Guante ensangrentado', clue: 'Guante de cuero negro en el basurero.', x: 520, y: 390, radius: 24, containerId: 'l2_dumpster', coveredBy: null, found: false },
      { id: 'syringe', name: 'Jeringa médica', clue: 'Jeringa con anestésico en la basura.', x: 880, y: 440, radius: 22, containerId: 'l2_dumpster', coveredBy: null, found: false },
      // En el callejón principal
      { id: 'crowbar', name: 'Palanca de acero', clue: 'Junto a la escalera de incendios.', x: 240, y: 380, radius: 20, containerId: null, coveredBy: null, found: false },
      { id: 'lighter', name: 'Encendedor Zippo', clue: 'Oculto bajo la caja de cartón mojada.', x: 680, y: 540, radius: 18, containerId: null, coveredBy: 'l2_cardboard', found: false },
      { id: 'broken_glass', name: 'Botella rota', clue: 'Vidrio verde cerca del charco derecho.', x: 830, y: 590, radius: 18, containerId: null, coveredBy: null, found: false },
      { id: 'footprint', name: 'Huella de calzado', clue: 'Pisada de barro en el asfalto.', x: 390, y: 615, radius: 20, containerId: null, coveredBy: null, found: false }
    ]
  },

  // ------------------------------------------------------------------
  // NIVEL 3: ALMACÉN PORTUARIO DEL MUELLE
  // ------------------------------------------------------------------
  {
    levelNumber: 3,
    name: 'Almacén Portuario del Muelle',
    location: 'Muelle 14 // Depósito Aduanero',
    timeLimit: 55,
    difficultyTag: 'MUY DIFÍCIL',
    svgContent: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <rect x="0" y="0" width="1280" height="720" fill="#0a0f16"/>
  <rect x="0" y="520" width="1280" height="200" fill="#1a1c22"/>
  <!-- Vigas metálicas y grúa -->
  <line x1="80" y1="0" x2="80" y2="520" stroke="#1e2530" stroke-width="12"/>
  <line x1="1200" y1="0" x2="1200" y2="520" stroke="#1e2530" stroke-width="12"/>
  <!-- Contenedor marítimo -->
  <rect x="140" y="180" width="360" height="340" fill="#7f1d1d" stroke="#450a0a" stroke-width="8"/>
  <!-- Cajas de madera apiladas -->
  <rect x="740" y="320" width="180" height="200" fill="#78350f" stroke="#451a03" stroke-width="4"/>
  <rect x="920" y="360" width="160" height="160" fill="#92400e" stroke="#451a03" stroke-width="4"/>

  <!-- Cinta policial amarilla delimitando la zona del depósito -->
  <g transform="translate(-10, 680) rotate(-1)">
    <rect x="0" y="0" width="1320" height="26" fill="#f1c40f"/>
    <text x="30" y="18" fill="#111" font-family="monospace" font-size="11" font-weight="900" letter-spacing="3">
      ⚠️ ESCENA DEL CRIMEN // ADUANA // NO PASAR ⚠️
    </text>
  </g>

  <!-- Ancla ornamental (x: 220, y: 580, r: 22) -->
  <g id="l3-anchor" transform="translate(205, 560)">
    <circle cx="15" cy="8" r="6" fill="none" stroke="#475569" stroke-width="3"/>
    <line x1="15" y1="14" x2="15" y2="38" stroke="#475569" stroke-width="3.5"/>
    <path d="M 3,28 Q 15,44 27,28" fill="none" stroke="#475569" stroke-width="3.5"/>
  </g>
  <!-- Llave de tubo (x: 680, y: 580, r: 18) -->
  <g id="l3-wrench" transform="translate(668, 568)">
    <line x1="0" y1="20" x2="26" y2="0" stroke="#94a3b8" stroke-width="4"/>
    <circle cx="26" cy="2" r="5" fill="#64748b"/>
  </g>
  <!-- Candado roto (x: 850, y: 545, r: 18) -->
  <g id="l3-padlock" transform="translate(838, 532)">
    <rect x="0" y="10" width="22" height="18" rx="2" fill="#d97706"/>
    <path d="M 4,10 L 4,4 Q 11,0 18,4" fill="none" stroke="#cbd5e1" stroke-width="2.5"/>
  </g>
</svg>
    `,
    containers: [
      {
        id: 'l3_chest',
        name: 'Cofre Blindado de Contrabando',
        hintName: 'el baúl metálico junto a los cajones',
        x: 820,
        y: 450,
        radius: 46,
        icon: '🧰',
        subSceneSvg: L3_CHEST_ZOOM_SVG
      }
    ],
    movableCovers: [
      {
        id: 'l3_tarp',
        viewId: 'MAIN',
        name: 'Lona Impermeable Azul',
        x: 640,
        y: 550,
        width: 130,
        height: 60,
        shiftDx: 90,
        shiftDy: -40,
        isShifted: false,
        coversObjectId: 'wrench',
        color: '#1e40af',
        borderColor: '#60a5fa'
      }
    ],
    objects: [
      { id: 'passport', name: 'Pasaporte falso', clue: 'Documento apócrifo dentro del cofre.', x: 460, y: 320, radius: 24, containerId: 'l3_chest', coveredBy: null, found: false },
      { id: 'money', name: 'Fajo de billetes', clue: 'Dinero no declarado en el baúl.', x: 780, y: 410, radius: 26, containerId: 'l3_chest', coveredBy: null, found: false },
      { id: 'anchor', name: 'Ancla metálica', clue: 'Pieza de hierro en el suelo izquierdo.', x: 220, y: 580, radius: 22, containerId: null, coveredBy: null, found: false },
      { id: 'wrench', name: 'Llave de tubo', clue: 'Oculta bajo la lona azul impermeable.', x: 680, y: 580, radius: 18, containerId: null, coveredBy: 'l3_tarp', found: false },
      { id: 'padlock', name: 'Candado forzado', clue: 'Cierre roto junto a las cajas de madera.', x: 850, y: 545, radius: 18, containerId: null, coveredBy: null, found: false }
    ]
  },

  // ------------------------------------------------------------------
  // NIVEL 4: LABORATORIO CLANDESTINO
  // ------------------------------------------------------------------
  {
    levelNumber: 4,
    name: 'Laboratorio Clandestino',
    location: 'Subsuelo del Hospital Abandonado',
    timeLimit: 50,
    difficultyTag: 'EXTREMO',
    svgContent: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <rect x="0" y="0" width="1280" height="720" fill="#030712"/>
  <rect x="0" y="490" width="1280" height="230" fill="#0f172a"/>
  <!-- Azulejos clínicos desgastados -->
  <line x1="0" y1="200" x2="1280" y2="200" stroke="#1e293b" stroke-width="1.5"/>
  <line x1="0" y1="350" x2="1280" y2="350" stroke="#1e293b" stroke-width="1.5"/>
  <!-- Mesa de mezclas químicas -->
  <rect x="220" y="420" width="840" height="120" fill="#1e293b" stroke="#334155" stroke-width="3"/>
  <rect x="240" y="540" width="40" height="160" fill="#0f172a"/>
  <rect x="1000" y="540" width="40" height="160" fill="#0f172a"/>

  <!-- Cinta policial pericial -->
  <g transform="translate(-10, 680)">
    <rect x="0" y="0" width="1320" height="26" fill="#f1c40f"/>
    <text x="30" y="18" fill="#111" font-family="monospace" font-size="11" font-weight="900" letter-spacing="3">
      ⚠️ PELIGRO BIOLÓGICO // POLICE LINE DO NOT CROSS // ESCENA DEL CRIMEN ⚠️
    </text>
  </g>

  <!-- Matraz Erlenmeyer con líquido verde (x: 480, y: 400, r: 20) -->
  <g id="l4-flask" transform="translate(465, 380)">
    <polygon points="12,0 18,0 28,32 2,32" fill="rgba(16,185,129,0.7)" stroke="#059669" stroke-width="2"/>
  </g>
  <!-- Microscopio óptico (x: 820, y: 390, r: 22) -->
  <g id="l4-microscope" transform="translate(805, 365)">
    <rect x="10" y="35" width="24" height="8" rx="2" fill="#475569"/>
    <path d="M 22,35 L 22,12 L 12,2" stroke="#64748b" stroke-width="4"/>
  </g>
  <!-- Bisturí quirúrgico (x: 350, y: 550, r: 18) -->
  <g id="l4-scalpel" transform="translate(338, 538)">
    <polygon points="0,15 25,2 28,5 5,18" fill="#cbd5e1"/>
    <rect x="5" y="15" width="15" height="5" fill="#475569" transform="rotate(-25 12 17)"/>
  </g>
</svg>
    `,
    containers: [
      {
        id: 'l4_safe',
        name: 'Caja Fuerte Mural',
        hintName: 'la caja fuerte empotrada en el muro',
        x: 640,
        y: 280,
        radius: 46,
        icon: '🔒',
        subSceneSvg: L4_SAFE_ZOOM_SVG
      }
    ],
    movableCovers: [
      {
        id: 'l4_book',
        viewId: 'MAIN',
        name: 'Atlas Anatómico Antiguo',
        x: 310,
        y: 520,
        width: 120,
        height: 60,
        shiftDx: 85,
        shiftDy: -35,
        isShifted: false,
        coversObjectId: 'scalpel',
        color: '#831843',
        borderColor: '#be185d'
      }
    ],
    objects: [
      { id: 'notebook', name: 'Fórmula química', clue: 'Cuaderno clasificado dentro de la caja fuerte.', x: 440, y: 240, radius: 24, containerId: 'l4_safe', coveredBy: null, found: false },
      { id: 'cyanide', name: 'Frasco de cianuro', clue: 'Toxina roja almacenada en la caja de seguridad.', x: 820, y: 480, radius: 22, containerId: 'l4_safe', coveredBy: null, found: false },
      { id: 'flask', name: 'Matraz de cultivo', clue: 'Recipiente verde sobre la mesa del laboratorio.', x: 480, y: 400, radius: 20, containerId: null, coveredBy: null, found: false },
      { id: 'microscope', name: 'Microscopio óptico', clue: 'Instrumento óptico sobre la bancada derecha.', x: 820, y: 390, radius: 22, containerId: null, coveredBy: null, found: false },
      { id: 'scalpel', name: 'Bisturí quirúrgico', clue: 'Oculto bajo el atlas anatómico.', x: 350, y: 550, radius: 18, containerId: null, coveredBy: 'l4_book', found: false }
    ]
  },

  // ------------------------------------------------------------------
  // NIVEL 5: EL PENTHOUSE DEL DON (CASO FINAL)
  // ------------------------------------------------------------------
  {
    levelNumber: 5,
    name: 'El Penthouse del Don',
    location: 'Rascacielos Torre Luxor // Piso 50',
    timeLimit: 45,
    difficultyTag: 'PESADILLA NOIR',
    svgContent: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <rect x="0" y="0" width="1280" height="720" fill="#040203"/>
  <rect x="0" y="510" width="1280" height="210" fill="#140a06"/>
  <!-- Ventanales con skyline de rascacielos nocturnos -->
  <g fill="#0b0809" stroke="#1f1412" stroke-width="4">
    <rect x="180" y="80" width="160" height="380"/>
    <rect x="380" y="40" width="220" height="420"/>
    <rect x="640" y="60" width="200" height="400"/>
    <rect x="880" y="100" width="180" height="360"/>
  </g>
  <!-- Luces de la ciudad exterior -->
  <circle cx="240" cy="220" r="2" fill="#facc15"/><circle cx="450" cy="180" r="2" fill="#f87171"/>
  <circle cx="720" cy="240" r="2" fill="#facc15"/><circle cx="950" cy="160" r="2" fill="#38bdf8"/>
  <!-- Sillón del Don -->
  <polygon points="520,380 760,380 800,560 480,560" fill="#450a0a" stroke="#7f1d1d" stroke-width="4"/>
  <!-- Mesa de mármol negro -->
  <ellipse cx="640" cy="580" rx="190" ry="45" fill="#09090b" stroke="#27272a" stroke-width="3"/>

  <!-- Cinta policial dorada de alta seguridad -->
  <g transform="translate(-10, 680)">
    <rect x="0" y="0" width="1320" height="26" fill="#f1c40f"/>
    <text x="30" y="18" fill="#111" font-family="monospace" font-size="11" font-weight="900" letter-spacing="3">
      ⚠️ INVESTIGACIÓN ESPECIAL // CASO NOIR #001 // CUIDADO ESCENA DEL CRIMEN ⚠️
    </text>
  </g>

  <!-- Copa de coñac envenenada derramada (x: 580, y: 570, r: 18) -->
  <g id="l5-glass" transform="translate(568, 558)">
    <polygon points="6,0 18,0 20,14 4,14" fill="rgba(255,255,255,0.3)" stroke="#fff" stroke-width="1"/>
    <ellipse cx="12" cy="18" rx="14" ry="4" fill="#7f1d1d"/>
  </g>
  <!-- Teléfono de baquelita rojo (x: 720, y: 570, r: 20) -->
  <g id="l5-phone" transform="translate(705, 555)">
    <rect x="0" y="10" width="28" height="18" rx="3" fill="#991b1b"/>
    <path d="M -4,6 Q 14,0 32,6" stroke="#b91c1c" stroke-width="5" stroke-linecap="round"/>
  </g>
</svg>
    `,
    containers: [
      {
        id: 'l5_cabinet',
        name: 'Vitrina de Venenos del Don',
        hintName: 'la vitrina de caoba y cristal',
        x: 880,
        y: 420,
        radius: 46,
        icon: '🍷',
        subSceneSvg: L5_SAFE_ZOOM_SVG
      }
    ],
    movableCovers: [
      {
        id: 'l5_cushion',
        viewId: 'MAIN',
        name: 'Cojín de Terciopelo Rojo',
        x: 690,
        y: 540,
        width: 110,
        height: 60,
        shiftDx: 85,
        shiftDy: -35,
        isShifted: false,
        coversObjectId: 'phone',
        color: '#881337',
        borderColor: '#be123c'
      }
    ],
    objects: [
      { id: 'dagger', name: 'Daga ceremonial', clue: 'Arma de plata dentro de la vitrina.', x: 520, y: 240, radius: 24, containerId: 'l5_cabinet', coveredBy: null, found: false },
      { id: 'usb', name: 'Llave de transferencias', clue: 'Copia digital en la vitrina del Don.', x: 780, y: 480, radius: 22, containerId: 'l5_cabinet', coveredBy: null, found: false },
      { id: 'glass', name: 'Copa de coñac envenenada', clue: 'Copa volcada con veneno sobre la mesa de mármol.', x: 580, y: 570, radius: 18, containerId: null, coveredBy: null, found: false },
      { id: 'phone', name: 'Teléfono rojo del Sindicato', clue: 'Oculto bajo el cojín de terciopelo del sillón.', x: 720, y: 570, radius: 20, containerId: null, coveredBy: 'l5_cushion', found: false }
    ]
  }
];
