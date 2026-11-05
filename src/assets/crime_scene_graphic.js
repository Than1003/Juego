/**
 * Escena Gráfica Vectorial (SVG) de Alta Calidad - Escena del Crimen: Despacho Detective Noir
 * Resolución Virtual Nativa: 1280 x 720 px
 * Diseñado con objetos integrados exactamente en sus coordenadas de hitbox.
 */
export const CRIME_SCENE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <defs>
    <!-- Gradiente de la pared de fondo -->
    <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#141824"/>
      <stop offset="60%" stop-color="#1c2233"/>
      <stop offset="100%" stop-color="#181c2b"/>
    </linearGradient>

    <!-- Gradiente de piso de madera oscura -->
    <linearGradient id="floorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1c130d"/>
      <stop offset="100%" stop-color="#0e0a07"/>
    </linearGradient>

    <!-- Gradiente del escritorio de caoba -->
    <linearGradient id="deskGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4a2717"/>
      <stop offset="25%" stop-color="#361a0e"/>
      <stop offset="100%" stop-color="#241109"/>
    </linearGradient>

    <!-- Luz de la lámpara de escritorio (Haz cónico cálido) -->
    <radialGradient id="lampLight" cx="60%" cy="30%" r="70%" fx="60%" fy="30%">
      <stop offset="0%" stop-color="rgba(255, 230, 150, 0.45)"/>
      <stop offset="45%" stop-color="rgba(255, 200, 100, 0.20)"/>
      <stop offset="85%" stop-color="rgba(255, 180, 50, 0.05)"/>
      <stop offset="100%" stop-color="rgba(0, 0, 0, 0)"/>
    </radialGradient>

    <!-- Gradiente de la ventana nocturna -->
    <linearGradient id="nightSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#070b16"/>
      <stop offset="70%" stop-color="#121b2f"/>
      <stop offset="100%" stop-color="#1e2c47"/>
    </linearGradient>

    <!-- Filtro de sombra profunda -->
    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="3" dy="5" stdDeviation="4" flood-color="#000" flood-opacity="0.7"/>
    </filter>
  </defs>

  <!-- ================= FONDO / HABITACIÓN ================= -->
  <!-- Pared de fondo -->
  <rect x="0" y="0" width="1280" height="480" fill="url(#wallGrad)"/>

  <!-- Moldura de pared intermedia -->
  <rect x="0" y="472" width="1280" height="12" fill="#2d1c13"/>
  <rect x="0" y="482" width="1280" height="4" fill="#120b07"/>

  <!-- Suelo de madera oscura -->
  <rect x="0" y="484" width="1280" height="236" fill="url(#floorGrad)"/>

  <!-- Tablones de madera del suelo (líneas de perspectiva) -->
  <g stroke="#261a12" stroke-width="1.5" opacity="0.4">
    <line x1="0" y1="530" x2="1280" y2="530"/>
    <line x1="0" y1="585" x2="1280" y2="585"/>
    <line x1="0" y1="650" x2="1280" y2="650"/>
    <line x1="120" y1="484" x2="60" y2="720"/>
    <line x1="320" y1="484" x2="260" y2="720"/>
    <line x1="560" y1="484" x2="520" y2="720"/>
    <line x1="800" y1="484" x2="820" y2="720"/>
    <line x1="1020" y1="484" x2="1080" y2="720"/>
    <line x1="1180" y1="484" x2="1240" y2="720"/>
  </g>

  <!-- ================= VENTANA NOCTURNA ================= -->
  <g id="window" transform="translate(420, 60)">
    <!-- Marco exterior -->
    <rect x="-10" y="-10" width="340" height="260" rx="4" fill="#231812" stroke="#120c09" stroke-width="3"/>
    <!-- Cristal con cielo nocturno -->
    <rect x="0" y="0" width="320" height="240" fill="url(#nightSky)"/>
    <!-- Siluetas de rascacielos lejanos con lluvia -->
    <rect x="20" y="140" width="45" height="100" fill="#0d131f"/>
    <rect x="80" y="100" width="60" height="140" fill="#090e18"/>
    <rect x="160" y="125" width="50" height="115" fill="#0b101c"/>
    <rect x="230" y="90" width="70" height="150" fill="#080c14"/>
    <!-- Ventanas iluminadas lejanas -->
    <circle cx="100" cy="130" r="1.5" fill="#ffd573" opacity="0.7"/>
    <circle cx="115" cy="150" r="1.5" fill="#ffd573" opacity="0.7"/>
    <circle cx="190" cy="160" r="1.5" fill="#ffd573" opacity="0.7"/>
    <circle cx="250" cy="120" r="1.5" fill="#ffd573" opacity="0.7"/>
    <circle cx="270" cy="140" r="1.5" fill="#ffd573" opacity="0.7"/>
    <!-- Persianas venecianas con sombras horizontales -->
    <g stroke="#1b120c" stroke-width="4" opacity="0.85">
      <line x1="0" y1="30" x2="320" y2="30"/>
      <line x1="0" y1="60" x2="320" y2="60"/>
      <line x1="0" y1="90" x2="320" y2="90"/>
      <line x1="0" y1="120" x2="320" y2="120"/>
      <line x1="0" y1="150" x2="320" y2="150"/>
      <line x1="0" y1="180" x2="320" y2="180"/>
      <line x1="0" y1="210" x2="320" y2="210"/>
    </g>
    <!-- Marco cruzado -->
    <rect x="155" y="0" width="10" height="240" fill="#231812"/>
    <rect x="0" y="115" width="320" height="10" fill="#231812"/>
  </g>

  <!-- ================= ESTANTERÍA DE LIBROS (IZQUIERDA) ================= -->
  <g id="bookshelf" transform="translate(30, 80)">
    <!-- Armazón estantería -->
    <rect x="0" y="0" width="180" height="420" fill="#29180e" stroke="#180e08" stroke-width="4"/>
    <!-- Baldas -->
    <rect x="0" y="100" width="180" height="14" fill="#3d2416"/>
    <rect x="0" y="210" width="180" height="14" fill="#3d2416"/>
    <rect x="0" y="320" width="180" height="14" fill="#3d2416"/>
    
    <!-- Libros balda 1 -->
    <rect x="15" y="30" width="22" height="70" fill="#8b2626"/>
    <rect x="40" y="20" width="28" height="80" fill="#1d3f5e"/>
    <rect x="71" y="25" width="20" height="75" fill="#2d5e37"/>
    <rect x="94" y="35" width="30" height="65" fill="#755a29"/>
    <rect x="127" y="18" width="25" height="82" fill="#542c59"/>

    <!-- Balda 2: Libros inclinados y el objeto escondido (Frasco de Veneno) -->
    <rect x="15" y="145" width="24" height="65" fill="#334455"/>
    <rect x="42" y="140" width="20" height="70" fill="#7a3424"/>
    
    <!-- Libros balda 3 -->
    <rect x="15" y="255" width="30" height="65" fill="#203d34"/>
    <rect x="48" y="250" width="26" height="70" fill="#6e4a27"/>
    <rect x="110" y="260" width="50" height="60" fill="#363945"/>
  </g>

  <!-- ================= TABLÓN DE EVIDENCIAS / CORCHO (DERECHA) ================= -->
  <g id="corkboard" transform="translate(1000, 70)">
    <!-- Marco de madera -->
    <rect x="0" y="0" width="250" height="280" fill="#875c36" stroke="#4a2e17" stroke-width="6" rx="3"/>
    <!-- Superficie corcho -->
    <rect x="10" y="10" width="230" height="260" fill="#b8834f"/>
    <!-- Fotos y recortes clavados -->
    <rect x="25" y="25" width="55" height="65" fill="#f4efe6" stroke="#d5c8b2" filter="url(#dropShadow)"/>
    <rect x="30" y="30" width="45" height="42" fill="#444"/>
    <circle cx="52" cy="27" r="3" fill="#c0392b"/> <!-- chincheta roja -->

    <rect x="110" y="35" width="65" height="80" fill="#f4efe6" stroke="#d5c8b2" transform="rotate(6 140 75)" filter="url(#dropShadow)"/>
    <circle cx="138" cy="40" r="3" fill="#c0392b"/>

    <rect x="40" y="140" width="80" height="50" fill="#eed9b3" stroke="#cca876" transform="rotate(-4 80 165)" filter="url(#dropShadow)"/>
    <!-- Texto simulado periódico -->
    <line x1="45" y1="150" x2="110" y2="150" stroke="#555" stroke-width="2"/>
    <line x1="45" y1="158" x2="105" y2="158" stroke="#555" stroke-width="1.5"/>
    <line x1="45" y1="166" x2="112" y2="166" stroke="#555" stroke-width="1.5"/>

    <rect x="145" y="150" width="60" height="70" fill="#f4efe6" stroke="#d5c8b2" filter="url(#dropShadow)"/>
    <rect x="150" y="155" width="50" height="45" fill="#303846"/>
    <circle cx="175" cy="153" r="3" fill="#c0392b"/>

    <!-- Hilos rojos de investigación de detective que unen evidencias -->
    <line x1="52" y1="27" x2="138" y2="40" stroke="#e74c3c" stroke-width="1.8"/>
    <line x1="138" y1="40" x2="80" y2="165" stroke="#e74c3c" stroke-width="1.8"/>
    <line x1="80" y1="165" x2="175" y2="153" stroke="#e74c3c" stroke-width="1.8"/>
  </g>

  <!-- ================= ESCRITORIO DE CAOBA (CENTRAL) ================= -->
  <g id="desk">
    <!-- Patas del escritorio -->
    <rect x="240" y="560" width="45" height="150" fill="#22120a"/>
    <rect x="990" y="560" width="45" height="150" fill="#22120a"/>
    <rect x="285" y="570" width="160" height="120" fill="#2e190d"/>
    <rect x="830" y="570" width="160" height="120" fill="#2e190d"/>
    <!-- Tiradores de cajón de bronce -->
    <circle cx="365" cy="630" r="6" fill="#c29a4a"/>
    <circle cx="910" cy="630" r="6" fill="#c29a4a"/>

    <!-- Tablero superior en perspectiva -->
    <!-- Cara superior del escritorio -->
    <polygon points="180,470 1100,470 1060,570 220,570" fill="url(#deskGrad)" stroke="#1a0c06" stroke-width="2"/>
    <!-- Borde frontal del escritorio -->
    <polygon points="220,570 1060,570 1055,595 225,595" fill="#241108"/>

    <!-- Tapete de cuero verde en el centro del escritorio -->
    <polygon points="380,480 890,480 870,555 400,555" fill="#1b382b" stroke="#0e1f17" stroke-width="2"/>
    <polygon points="382,482 888,482 868,553 402,553" fill="none" stroke="#b08b3e" stroke-width="1" opacity="0.6"/>
  </g>

  <!-- LÁMPARA DE ESCRITORIO (VERDE BANQUERO) Y LUZ CÓNICA -->
  <g id="desk-lamp" transform="translate(940, 360)">
    <!-- Base de latón -->
    <ellipse cx="20" cy="120" rx="22" ry="7" fill="#8a6923" stroke="#523d11" stroke-width="1.5"/>
    <path d="M 20,120 Q 25,60 0,35" fill="none" stroke="#a37c2a" stroke-width="6" stroke-linecap="round"/>
    <!-- Pantalla de cristal verde estilo banquero -->
    <path d="M -25,28 Q 0,16 25,28 L 22,44 Q 0,36 -22,44 Z" fill="#175e38" stroke="#0c3b22" stroke-width="2"/>
    <ellipse cx="0" cy="44" rx="22" ry="6" fill="#f7f1ce" opacity="0.9"/>
  </g>

  <!-- Haz de luz cálida proyectada en la escena -->
  <polygon points="940,404 1160,720 320,720 620,440" fill="url(#lampLight)" style="mix-blend-mode: screen;" pointer-events="none"/>

  <!-- Mancha de sangre misteriosa en la esquina del escritorio -->
  <path d="M 255,510 Q 275,512 285,525 Q 295,540 280,548 Q 260,555 245,540 Q 235,525 255,510 Z" fill="#691012" opacity="0.85"/>
  <circle cx="270" cy="552" r="3" fill="#691012" opacity="0.85"/>
  <circle cx="260" cy="558" r="2" fill="#691012" opacity="0.85"/>

  <!-- Papeles desordenados en el escritorio -->
  <g transform="translate(680, 475) rotate(-8)">
    <rect x="0" y="0" width="75" height="55" fill="#e8dfce" stroke="#cfc3ab" filter="url(#dropShadow)"/>
    <line x1="10" y1="12" x2="65" y2="12" stroke="#777" stroke-width="1.5"/>
    <line x1="10" y1="20" x2="60" y2="20" stroke="#777" stroke-width="1.5"/>
    <line x1="10" y1="28" x2="50" y2="28" stroke="#777" stroke-width="1.5"/>
  </g>

  <!-- Papelera metálica junto al escritorio -->
  <g transform="translate(1060, 580)">
    <ellipse cx="30" cy="15" rx="25" ry="8" fill="#3a404a" stroke="#222"/>
    <path d="M 5,15 L 12,85 Q 30,95 48,85 L 55,15 Z" fill="#2b3038" stroke="#1d2127" stroke-width="2"/>
  </g>

  <!-- Taza de café del detective -->
  <g transform="translate(350, 485)">
    <ellipse cx="14" cy="8" rx="14" ry="7" fill="#d9d2c5" stroke="#999"/>
    <ellipse cx="14" cy="7" rx="11" ry="5" fill="#3a2215"/>
    <path d="M 0,8 L 3,24 Q 14,29 25,24 L 28,8 Z" fill="#ece6db" stroke="#999"/>
    <!-- Asa -->
    <path d="M 26,10 Q 35,16 25,22" fill="none" stroke="#ccc" stroke-width="3"/>
  </g>


  <!-- ============================================================== -->
  <!-- ====== LOS 8 OBJETOS OCULTOS DE LA ESCENA DEL CRIMEN ======= -->
  <!-- ============================================================== -->

  <!-- 1. OBJETO: REVÓLVER CALIBRE 38 (x: 420, y: 510, radio: 45) -->
  <g id="item-revolver" transform="translate(390, 485)">
    <!-- Cañón y marco metálico pavonado -->
    <rect x="0" y="18" width="45" height="11" rx="2" fill="#2d333b" stroke="#181c20" stroke-width="1.5"/>
    <rect x="0" y="16" width="6" height="4" fill="#181c20"/> <!-- Mira delantera -->
    <rect x="36" y="14" width="22" height="18" rx="3" fill="#3a414b" stroke="#181c20" stroke-width="1.5"/> <!-- Tambor -->
    <!-- Ranuras del tambor -->
    <line x1="42" y1="16" x2="42" y2="30" stroke="#1a1e24" stroke-width="1.5"/>
    <line x1="48" y1="16" x2="48" y2="30" stroke="#1a1e24" stroke-width="1.5"/>
    <line x1="53" y1="16" x2="53" y2="30" stroke="#1a1e24" stroke-width="1.5"/>
    <!-- Empuñadura de madera de nogal -->
    <path d="M 48,28 Q 58,40 52,58 Q 42,60 38,50 L 42,28 Z" fill="#693019" stroke="#3b190c" stroke-width="1.5"/>
    <!-- Martillo y gatillo -->
    <path d="M 54,16 Q 58,10 52,14" fill="none" stroke="#2d333b" stroke-width="2"/>
    <path d="M 38,28 Q 30,34 38,40" fill="none" stroke="#2d333b" stroke-width="1.5"/>
  </g>

  <!-- 2. OBJETO: LUPA DE DETECTIVE (x: 750, y: 480, radio: 40) -->
  <g id="item-magnifier" transform="translate(720, 450)">
    <!-- Mango de madera oscura torneado -->
    <path d="M 46,46 L 72,72" stroke="#542e18" stroke-width="7" stroke-linecap="round"/>
    <path d="M 46,46 L 52,52" stroke="#c99f3b" stroke-width="8" stroke-linecap="square"/>
    <!-- Anillo de bronce -->
    <circle cx="28" cy="28" r="24" fill="none" stroke="#d4af37" stroke-width="4.5"/>
    <!-- Cristal con brillo/reflejo -->
    <circle cx="28" cy="28" r="22" fill="rgba(190, 230, 255, 0.35)" stroke="#a1cde8" stroke-width="1"/>
    <path d="M 16,16 Q 28,10 38,20" fill="none" stroke="#ffffff" stroke-width="2.5" opacity="0.8" stroke-linecap="round"/>
  </g>

  <!-- 3. OBJETO: PLACA POLICIAL DORADA (x: 290, y: 560, radio: 35) -->
  <g id="item-badge" transform="translate(268, 535)">
    <!-- Soporte de cuero negro -->
    <path d="M 22,2 Q 44,2 44,22 L 40,46 Q 22,54 4,46 L 0,22 Q 0,2 22,2 Z" fill="#1c1c1c" stroke="#000" stroke-width="1.5"/>
    <!-- Estrella/Escudo dorado -->
    <polygon points="22,8 26,18 36,18 28,24 31,34 22,28 13,34 16,24 8,18 18,18" fill="#ffd700" stroke="#b8860b" stroke-width="1.2"/>
    <circle cx="22" cy="22" r="5" fill="#1a3d6d" stroke="#ffd700" stroke-width="0.8"/>
  </g>

  <!-- 4. OBJETO: FRASCO DE VENENO CON CALAVERA (x: 120, y: 260, radio: 35) -->
  <g id="item-poison" transform="translate(100, 230)">
    <!-- Botella de vidrio verde veneno -->
    <rect x="15" y="0" width="10" height="12" fill="#8a6136" stroke="#4a3014"/> <!-- Tapón de corcho -->
    <rect x="14" y="10" width="12" height="6" fill="#1b4731" stroke="#0f2b1d"/> <!-- Cuello botella -->
    <path d="M 14,16 Q 2,24 4,45 L 6,60 Q 20,64 34,60 L 36,45 Q 38,24 26,16 Z" fill="#1c5c3c" stroke="#0c301e" stroke-width="1.8"/>
    <!-- Etiqueta de pergamino antigua -->
    <rect x="10" y="28" width="20" height="22" rx="2" fill="#ebd9b5" stroke="#876840" stroke-width="1"/>
    <!-- Calavera negra en la etiqueta -->
    <circle cx="20" cy="35" r="4.5" fill="#111"/>
    <rect x="18" y="38" width="4" height="4" fill="#111"/>
    <circle cx="18.5" cy="34.5" r="1.2" fill="#ebd9b5"/>
    <circle cx="21.5" cy="34.5" r="1.2" fill="#ebd9b5"/>
  </g>

  <!-- 5. OBJETO: RELOJ DE BOLSILLO VINTAGE (x: 580, y: 540, radio: 35) -->
  <g id="item-pocket-watch" transform="translate(555, 515)">
    <!-- Cadena dorada curva -->
    <path d="M 25,6 Q 10,-8 -12,4" fill="none" stroke="#d4af37" stroke-width="2" stroke-dasharray="3,2"/>
    <!-- Argolla superior -->
    <circle cx="25" cy="4" r="5" fill="none" stroke="#c99f3b" stroke-width="2"/>
    <!-- Caja exterior dorada -->
    <circle cx="25" cy="25" r="22" fill="#d4af37" stroke="#8c6d1f" stroke-width="2.5"/>
    <!-- Esfera interior blanca -->
    <circle cx="25" cy="25" r="17" fill="#fdfbf7" stroke="#444" stroke-width="1"/>
    <!-- Agujas del reloj marcando la hora del crimen (3:15) -->
    <line x1="25" y1="25" x2="25" y2="13" stroke="#222" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="25" y1="25" x2="35" y2="25" stroke="#222" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="25" cy="25" r="2" fill="#c0392b"/>
  </g>

  <!-- 6. OBJETO: EXPEDIENTE CONFIDENCIAL / DOSSIER (x: 820, y: 530, radio: 45) -->
  <g id="item-dossier" transform="translate(780, 495)">
    <!-- Carpeta Manila marrón clara -->
    <polygon points="0,15 25,0 75,0 85,15 85,68 0,68" fill="#d9b177" stroke="#9c753c" stroke-width="2" filter="url(#dropShadow)"/>
    <!-- Pestaña de archivo -->
    <rect x="4" y="18" width="77" height="46" fill="#eed5ab"/>
    <!-- Celo / Cinta roja 'TOP SECRET' -->
    <rect x="15" y="32" width="55" height="16" fill="#a93226" transform="rotate(-10 42 40)"/>
    <text x="42" y="44" fill="#ffffff" font-family="'Courier New', monospace" font-size="8" font-weight="900" text-anchor="middle" transform="rotate(-10 42 40)">CONFIDENCIAL</text>
  </g>

  <!-- 7. OBJETO: CUCHILLO ENSANGRENTADO (x: 180, y: 640, radio: 45) -->
  <g id="item-knife" transform="translate(145, 610)">
    <!-- Hoja de acero brillante -->
    <path d="M 28,30 L 72,12 Q 78,16 68,36 L 28,30 Z" fill="#d1d8e0" stroke="#718093" stroke-width="1.5"/>
    <!-- Mancha de sangre en la punta del filo -->
    <path d="M 55,20 Q 75,14 68,36 Q 60,32 55,20 Z" fill="#991b1b"/>
    <circle cx="50" cy="26" r="2" fill="#991b1b"/>
    <!-- Mango de madera remachado -->
    <path d="M 0,42 L 28,30 L 32,38 L 4,50 Z" fill="#4a2511" stroke="#261005" stroke-width="1.5"/>
    <circle cx="10" cy="42" r="1.5" fill="#d4af37"/>
    <circle cx="22" cy="36" r="1.5" fill="#d4af37"/>
  </g>

  <!-- 8. OBJETO: CASQUILLO DE BALA DORADO (x: 1080, y: 620, radio: 30) -->
  <g id="item-bullet" transform="translate(1065, 608)">
    <!-- Cuerpo del casquillo -->
    <rect x="0" y="4" width="26" height="11" rx="2" fill="#e0af34" stroke="#87620e" stroke-width="1.2" transform="rotate(25 13 9)"/>
    <!-- Base / Culote -->
    <rect x="22" y="3" width="4" height="13" rx="1" fill="#c9941a" stroke="#6e4f08" stroke-width="1" transform="rotate(25 13 9)"/>
    <!-- Destello de brillo metálico -->
    <line x1="3" y1="8" x2="22" y2="8" stroke="#fff4cc" stroke-width="1.5" transform="rotate(25 13 9)"/>
  </g>

  <!-- CINTA POLICIAL 'ESCENA DEL CRIMEN - NO PASAR' EN LA ESQUINA INFERIOR IZQUIERDA -->
  <g transform="translate(-10, 680) rotate(-7)">
    <polygon points="0,0 350,0 350,26 0,26" fill="#f1c40f" stroke="#b7950b" stroke-width="1.5"/>
    <text x="175" y="18" fill="#111" font-family="'Impact', sans-serif" font-size="14" letter-spacing="3" text-anchor="middle">CRIME SCENE - DO NOT CROSS</text>
  </g>
</svg>
`;

/**
 * Helper para convertir el SVG a una imagen cargable por Canvas
 * @returns {Promise<HTMLImageElement>}
 */
export function loadCrimeSceneImage() {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const blob = new Blob([CRIME_SCENE_SVG], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(new Error('Error al decodificar la imagen de la escena del crimen'));
    };

    img.src = url;
  });
}

