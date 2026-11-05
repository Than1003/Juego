import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class ThreeSceneEngine {
  constructor(canvas) {
    this.canvas = canvas;

    // --- Renderer ---
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      logarithmicDepthBuffer: true,
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    this.renderer.toneMappingExposure = 1.4;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(canvas.clientWidth || window.innerWidth, canvas.clientHeight || window.innerHeight);

    // --- Scene ---
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x040508);
    this.scene.fog = new THREE.FogExp2(0x040508, 0.07);

    // --- Camera ---
    const aspect = (canvas.clientWidth || window.innerWidth) / (canvas.clientHeight || window.innerHeight);
    this.camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 100);
    this.camera.position.set(0, 2.4, 6.5);
    this.camera.lookAt(0, 0.5, 0);

    // --- Controls ---
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;
    this.controls.minDistance = 0.8;
    this.controls.maxDistance = 9;
    this.controls.maxPolarAngle = 0.78 * Math.PI;
    this.controls.target.set(0, 0.5, 0);
    this.controls.update();

    // --- Raycaster ---
    this.raycaster = new THREE.Raycaster();

    // --- Clock ---
    this.clock = new THREE.Clock();

    // --- Data Maps ---
    this.containers = new Map();
    this.covers = new Map();
    this.evidenceMeshes = new Map();
    this.evidenceData = new Map();

    // --- Arrays ---
    this.interactiveObjects = [];
    this.containerTriggers = [];
    this.coverObjects = [];
    this.wallsAndFloor = [];

    // --- Hover state ---
    this.hoveredMesh = null;
    this._origEmissive = new Map();
    this._origEmissiveIntensity = new Map();

    // --- Camera animation state ---
    this.cameraAnim = null;
    this.defaultCamPos = new THREE.Vector3(0, 2.4, 6.5);
    this.defaultCamTarget = new THREE.Vector3(0, 0.5, 0);
    this.isZoomed = false;

    // --- Found pulse animations ---
    this._foundPulses = [];

    // --- Build the scene ---
    this._buildLights();
    this._buildRoom();
    this._buildFurniture();
    this._buildCorpse();

    // --- Resize listener ---
    this._resizeHandler = this._handleResize.bind(this);
    window.addEventListener('resize', this._resizeHandler);
  }

  // =========================================================
  // LIGHTING
  // =========================================================

  _buildLights() {
    // 1. Ambient
    this.ambientLight = new THREE.AmbientLight(0x0a0d1a, 0.5);
    this.scene.add(this.ambientLight);

    // 2. Flashlight (SpotLight)
    this.flashlight = new THREE.SpotLight(0xf5e8c8, 5.5, 14, Math.PI * 0.11, 0.35);
    this.flashlight.castShadow = true;
    this.flashlight.shadow.mapSize.width = 1024;
    this.flashlight.shadow.mapSize.height = 1024;
    this.scene.add(this.flashlight);

    // 3. Flashlight target
    this.flashlightTarget = new THREE.Object3D();
    this.scene.add(this.flashlightTarget);
    this.flashlight.target = this.flashlightTarget;

    // 4. Moonlight PointLight
    const moonlight = new THREE.PointLight(0x1a2d4f, 1.2, 8);
    moonlight.position.set(-4, 2.5, -4);
    this.scene.add(moonlight);

    // 5. Desk lamp PointLight (starts off)
    this.deskLamp = new THREE.PointLight(0xffcb6b, 0, 3.5, 2);
    this.deskLamp.position.set(3.5, 1.4, 1.5);
    this.scene.add(this.deskLamp);

    // 6. Red accent PointLight
    const redAccent = new THREE.PointLight(0x4d0000, 0.8, 5);
    redAccent.position.set(-4.5, 2.8, -4);
    this.scene.add(redAccent);
  }

  // =========================================================
  // PROCEDURAL TEXTURES
  // =========================================================

  _makeWoodTexture(baseColor = '#2c1a0e', grainOpacity = 0.15) {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, size, size);

    for (let i = 0; i < 40; i++) {
      const y0 = Math.random() * size;
      const cp1x = Math.random() * size;
      const cp1y = y0 + (Math.random() - 0.5) * 60;
      const cp2x = Math.random() * size;
      const cp2y = cp1y + (Math.random() - 0.5) * 60;
      const y1 = y0 + (Math.random() - 0.5) * 100;

      ctx.beginPath();
      ctx.moveTo(0, y0);
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, size, y1);
      ctx.strokeStyle = `rgba(0,0,0,${grainOpacity * Math.random()})`;
      ctx.lineWidth = Math.random() * 2 + 0.5;
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    return tex;
  }

  _makeConcreteTexture() {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#1a1a26';
    ctx.fillRect(0, 0, size, size);

    const imgData = ctx.getImageData(0, 0, size, size);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 20;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);

    return new THREE.CanvasTexture(canvas);
  }

  _makeFloorTexture() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const woodColors = ['#1a0e06', '#221208', '#2a160a', '#1e1008'];
    const tileW = 64;
    const tileH = 128;

    for (let row = 0; row < Math.ceil(size / tileH); row++) {
      const offset = (row % 2 === 0) ? 0 : tileW / 2;
      for (let col = -1; col < Math.ceil(size / tileW) + 1; col++) {
        const x = col * tileW + offset;
        const y = row * tileH;
        const color = woodColors[Math.floor(Math.random() * woodColors.length)];
        ctx.fillStyle = color;
        ctx.fillRect(x, y, tileW - 1, tileH - 1);

        // Wood grain strokes
        ctx.save();
        ctx.strokeStyle = 'rgba(0,0,0,0.12)';
        ctx.lineWidth = 0.8;
        for (let g = 0; g < 6; g++) {
          const gx = x + Math.random() * tileW;
          ctx.beginPath();
          ctx.moveTo(gx, y);
          ctx.lineTo(gx + (Math.random() - 0.5) * 10, y + tileH);
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    return tex;
  }

  // =========================================================
  // ROOM
  // =========================================================

  _buildRoom() {
    const concreteTexture = this._makeConcreteTexture();
    const floorTexture = this._makeFloorTexture();

    const wallMat = new THREE.MeshStandardMaterial({
      map: concreteTexture,
      color: 0x14141e,
      roughness: 0.95,
    });

    // Floor
    const floorGeo = new THREE.PlaneGeometry(10, 10);
    const floorMat = new THREE.MeshStandardMaterial({ map: floorTexture, roughness: 0.9 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    floor.userData = { type: 'floor' };
    this.scene.add(floor);
    this.wallsAndFloor.push(floor);

    // Walls
    const wallDefs = [
      { pos: [0, 1.5, -5], rot: [0, 0, 0] },             // Back
      { pos: [0, 1.5, 5], rot: [0, Math.PI, 0] },         // Front
      { pos: [-5, 1.5, 0], rot: [0, Math.PI / 2, 0] },    // Left
      { pos: [5, 1.5, 0], rot: [0, -Math.PI / 2, 0] },    // Right
    ];

    for (const def of wallDefs) {
      const wallGeo = new THREE.PlaneGeometry(10, 3);
      const wall = new THREE.Mesh(wallGeo, wallMat);
      wall.position.set(...def.pos);
      wall.rotation.set(...def.rot);
      wall.receiveShadow = true;
      this.scene.add(wall);
      this.wallsAndFloor.push(wall);
    }

    // Ceiling
    const ceilGeo = new THREE.PlaneGeometry(10, 10);
    const ceilMat = new THREE.MeshStandardMaterial({ color: 0x0d0d14, roughness: 1.0 });
    const ceiling = new THREE.Mesh(ceilGeo, ceilMat);
    ceiling.position.set(0, 3, 0);
    ceiling.rotation.set(Math.PI / 2, 0, 0);
    this.scene.add(ceiling);
    this.wallsAndFloor.push(ceiling);

    // Window glass pane
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x0a1520,
      transparent: true,
      opacity: 0.6,
      emissive: new THREE.Color(0x040d1a),
      emissiveIntensity: 0.4,
      roughness: 0.1,
      metalness: 0.3,
    });
    const glassGeo = new THREE.PlaneGeometry(1.6, 1.4);
    const glassPane = new THREE.Mesh(glassGeo, glassMat);
    glassPane.position.set(-3, 1.8, -4.98);
    this.scene.add(glassPane);

    // Window cross bars
    const barMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8 });
    const hBar = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.04, 0.04), barMat);
    hBar.position.set(-3, 1.8, -4.97);
    this.scene.add(hBar);
    const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.4, 0.04), barMat);
    vBar.position.set(-3, 1.8, -4.97);
    this.scene.add(vBar);

    // Baseboards
    const baseboardMat = new THREE.MeshStandardMaterial({ color: 0x0a0a10, roughness: 0.9 });
    const baseboardDefs = [
      { size: [10, 0.1, 0.05], pos: [0, 0.05, -4.97] },   // Back
      { size: [10, 0.1, 0.05], pos: [0, 0.05, 4.97] },     // Front
      { size: [0.05, 0.1, 10], pos: [-4.97, 0.05, 0] },    // Left
      { size: [0.05, 0.1, 10], pos: [4.97, 0.05, 0] },     // Right
    ];
    for (const bd of baseboardDefs) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(...bd.size), baseboardMat);
      mesh.position.set(...bd.pos);
      this.scene.add(mesh);
    }
  }

  // =========================================================
  // FURNITURE
  // =========================================================

  _buildFurniture() {
    this._buildDesk();
    this._buildWardrobe();
    this._buildSofa();
    this._buildBookshelf();
    this._buildBed();
    this._buildTV();
    this._buildRug();
    this._buildFridge();
  }

  _buildDesk() {
    const deskGroup = new THREE.Group();
    deskGroup.position.set(3.8, 0, 1.5);
    this.scene.add(deskGroup);

    const woodMat = new THREE.MeshStandardMaterial({ map: this._makeWoodTexture(), roughness: 0.7 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.3 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x0a080a, roughness: 0.9 });

    // Desktop
    const desktop = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.07, 0.9), woodMat);
    desktop.position.y = 0.76;
    desktop.castShadow = true;
    desktop.receiveShadow = true;
    deskGroup.add(desktop);

    // Side panels
    for (const sx of [-0.87, 0.87]) {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.75, 0.9), woodMat);
      panel.position.set(sx, 0.375, 0);
      panel.castShadow = true;
      deskGroup.add(panel);
    }

    // Back panel
    const backPanel = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.75, 0.05), woodMat);
    backPanel.position.set(0, 0.375, -0.42);
    backPanel.castShadow = true;
    deskGroup.add(backPanel);

    // Drawer group
    const drawerGroup = new THREE.Group();
    drawerGroup.position.set(-0.3, 0.5, 0.42);
    deskGroup.add(drawerGroup);

    // Drawer front
    const drawerFrontMat = new THREE.MeshStandardMaterial({ map: this._makeWoodTexture('#3a2010'), roughness: 0.6 });
    const drawerFront = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.18, 0.04), drawerFrontMat);
    drawerFront.userData = {
      type: 'container_trigger',
      containerId: 'desk_drawer',
      name: 'Cajón del Escritorio',
    };
    drawerFront.castShadow = true;
    drawerGroup.add(drawerFront);

    // Handle
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.12, 8), goldMat);
    handle.rotation.z = Math.PI / 2;
    handle.position.set(0, 0, 0.04);
    drawerGroup.add(handle);

    // Drawer interior
    const interior = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.14, 0.4), darkMat);
    interior.position.set(0, 0, -0.22);
    drawerGroup.add(interior);

    // Register container
    this.containers.set('desk_drawer', {
      group: drawerGroup,
      isOpen: false,
      animType: 'slide_z',
      closedZ: 0.42,
      openZ: 0.95,
      animating: false,
    });

    this.interactiveObjects.push(drawerFront);
    this.containerTriggers.push(drawerFront);

    // Desk lamp
    this._buildDeskLamp(deskGroup);

    // Paper
    const paperMat = new THREE.MeshStandardMaterial({ color: 0xf4edd0, roughness: 0.95 });
    const paper = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.005, 0.22), paperMat);
    // World position (3.5, 0.795, 1.3) — convert from deskGroup space
    paper.position.set(3.5 - 3.8, 0.795, 1.3 - 1.5);
    paper.rotation.y = 0.15;
    deskGroup.add(paper);
  }

  _buildDeskLamp(deskGroup) {
    const lampGroup = new THREE.Group();
    lampGroup.position.set(0.65, 0.76, -0.2);
    deskGroup.add(lampGroup);

    const greenMat = new THREE.MeshStandardMaterial({ color: 0x1b4030, roughness: 0.7 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.3 });

    // Base
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.04, 16), greenMat);
    lampGroup.add(base);

    // Arm
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.6, 8), goldMat);
    arm.position.y = 0.32;
    arm.rotation.z = 0.2;
    lampGroup.add(arm);

    // Shade
    const shade = new THREE.Mesh(
      new THREE.ConeGeometry(0.14, 0.14, 12, 1, true),
      new THREE.MeshStandardMaterial({ color: 0x1b4030, roughness: 0.7, side: THREE.DoubleSide })
    );
    shade.position.set(0.1, 0.62, 0);
    shade.rotation.z = Math.PI;
    shade.userData = { type: 'lamp_toggle', name: 'Lámpara de escritorio' };
    lampGroup.add(shade);

    this.interactiveObjects.push(shade);
  }

  _buildWardrobe() {
    const wardGroup = new THREE.Group();
    wardGroup.position.set(3.5, 0, -3.2);
    this.scene.add(wardGroup);

    const woodMat = new THREE.MeshStandardMaterial({ map: this._makeWoodTexture('#1c0e06'), roughness: 0.75 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.3 });

    // Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.4, 0.65), woodMat);
    body.position.y = 1.2;
    body.castShadow = true;
    body.receiveShadow = true;
    wardGroup.add(body);

    // Door pivot
    const doorPivot = new THREE.Group();
    doorPivot.position.set(-0.7, 1.2, 0.33);
    wardGroup.add(doorPivot);

    // Door mesh (pivot at left edge, so offset x by half width)
    const doorMat = new THREE.MeshStandardMaterial({ map: this._makeWoodTexture('#241208'), roughness: 0.65 });
    const doorMesh = new THREE.Mesh(new THREE.BoxGeometry(1.38, 2.36, 0.045), doorMat);
    doorMesh.position.x = 0.69;
    doorMesh.castShadow = true;
    doorMesh.userData = {
      type: 'container_trigger',
      containerId: 'wardrobe',
      name: 'Armario',
    };
    doorPivot.add(doorMesh);

    // Handle sphere
    const handleSphere = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 10), goldMat);
    handleSphere.position.set(1.2, 0, 0.04);
    doorPivot.add(handleSphere);

    // Register
    this.containers.set('wardrobe', {
      pivot: doorPivot,
      isOpen: false,
      animType: 'rotate_y',
      openAngle: -Math.PI * 0.78,
      animating: false,
    });

    this.interactiveObjects.push(doorMesh);
    this.containerTriggers.push(doorMesh);
  }

  _buildSofa() {
    const sofaGroup = new THREE.Group();
    sofaGroup.position.set(-3.5, 0, 1.8);
    this.scene.add(sofaGroup);

    const sofaMat = new THREE.MeshStandardMaterial({ color: 0x1a1226, roughness: 0.9 });

    // Seat
    const seat = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.35, 0.75), sofaMat);
    seat.position.y = 0.35;
    seat.castShadow = true;
    seat.receiveShadow = true;
    sofaGroup.add(seat);

    // Backrest
    const backrest = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.6, 0.18), sofaMat);
    backrest.position.set(0, 0.78, -0.3);
    backrest.castShadow = true;
    sofaGroup.add(backrest);

    // Armrests
    for (const ax of [-0.78, 0.78]) {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.5, 0.75), sofaMat);
      arm.position.set(ax, 0.52, 0);
      arm.castShadow = true;
      sofaGroup.add(arm);
    }

    // Cushion
    const cushionMat = new THREE.MeshStandardMaterial({ color: 0x2d1a24, roughness: 0.85 });
    const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.4), cushionMat);
    cushion.position.set(0.35, 0.57, 0.1);
    cushion.castShadow = true;
    cushion.userData = {
      type: 'cover_trigger',
      coverId: 'sofa_cushion',
      name: 'Cojín del sofá',
    };
    sofaGroup.add(cushion);

    this.covers.set('sofa_cushion', {
      mesh: cushion,
      parentGroup: sofaGroup,
      isShifted: false,
      shiftOffset: { x: -0.65, y: 0.15, z: 0 },
      originalLocalPos: cushion.position.clone(),
      coveredId: 'phone',
      animating: false,
      name: 'Cojín del sofá',
    });

    this.interactiveObjects.push(cushion);
    this.coverObjects.push(cushion);
  }

  _buildBookshelf() {
    const shelfGroup = new THREE.Group();
    shelfGroup.position.set(-3.8, 0, -3.5);
    this.scene.add(shelfGroup);

    const darkWoodMat = new THREE.MeshStandardMaterial({ map: this._makeWoodTexture('#120a04'), roughness: 0.8 });

    // Frame
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.2, 0.35), darkWoodMat);
    frame.position.y = 1.1;
    frame.castShadow = true;
    frame.receiveShadow = true;
    shelfGroup.add(frame);

    // Shelves
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x1a0e06, roughness: 0.85 });
    const shelfYPositions = [0.5, 1.0, 1.5, 2.0];
    for (const sy of shelfYPositions) {
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.03, 0.33), shelfMat);
      shelf.position.y = sy;
      shelfGroup.add(shelf);
    }

    // Books
    const bookColors = [0x7a2424, 0x1b3854, 0x2d6b2d, 0x6b4c1b, 0x4a1a5c, 0x1a4a3c];
    for (const sy of shelfYPositions) {
      let xCursor = -0.6;
      while (xCursor < 0.6) {
        const bookW = 0.05 + Math.random() * 0.06;
        const bookH = 0.15 + Math.random() * 0.1;
        const bookColor = bookColors[Math.floor(Math.random() * bookColors.length)];
        const bookMat = new THREE.MeshStandardMaterial({ color: bookColor, roughness: 0.9 });
        const book = new THREE.Mesh(new THREE.BoxGeometry(bookW, bookH, 0.28), bookMat);
        book.position.set(xCursor + bookW / 2, sy + bookH / 2 + 0.016, 0);
        shelfGroup.add(book);
        xCursor += bookW + 0.005;
      }
    }
  }

  _buildBed() {
    const bedGroup = new THREE.Group();
    bedGroup.position.set(-0.5, 0, -3.8);
    this.scene.add(bedGroup);

    const frameMat = new THREE.MeshStandardMaterial({ map: this._makeWoodTexture('#1a0a04'), roughness: 0.8 });
    const mattressMat = new THREE.MeshStandardMaterial({ color: 0x0e1428, roughness: 0.9 });
    const pillowMat = new THREE.MeshStandardMaterial({ color: 0xd0cec4, roughness: 0.95 });

    // Frame
    const bedFrame = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.28, 2.0), frameMat);
    bedFrame.position.y = 0.14;
    bedFrame.castShadow = true;
    bedFrame.receiveShadow = true;
    bedGroup.add(bedFrame);

    // Mattress
    const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.22, 1.9), mattressMat);
    mattress.position.y = 0.39;
    mattress.castShadow = true;
    bedGroup.add(mattress);

    // Pillow
    const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.1, 0.4), pillowMat);
    pillow.position.set(0, 0.51, -0.72);
    bedGroup.add(pillow);

    // Headboard
    const headboard = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.75, 0.1), frameMat);
    headboard.position.set(0, 0.5, -0.95);
    headboard.castShadow = true;
    bedGroup.add(headboard);
  }

  _buildTV() {
    const tvGroup = new THREE.Group();
    tvGroup.position.set(4.9, 1.6, -0.5);
    tvGroup.rotation.y = -Math.PI / 2;
    this.scene.add(tvGroup);

    const blackMat = new THREE.MeshStandardMaterial({ color: 0x080808, roughness: 0.5, metalness: 0.3 });

    // Bezel
    const bezel = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.82, 0.07), blackMat);
    bezel.castShadow = true;
    tvGroup.add(bezel);

    // Screen
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x020408,
      emissive: new THREE.Color(0x020408),
      emissiveIntensity: 0.05,
      roughness: 0.3,
    });
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.73), screenMat);
    screen.position.z = 0.038;
    tvGroup.add(screen);

    // Stand
    const stand = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.06, 0.2), blackMat);
    stand.position.y = -0.44;
    tvGroup.add(stand);
  }

  _buildRug() {
    const rugGroup = new THREE.Group();
    rugGroup.position.set(0, 0, 0.5);
    this.scene.add(rugGroup);

    const rugMat = new THREE.MeshStandardMaterial({ color: 0x1a0d1a, roughness: 1.0 });
    const rugMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 1.5), rugMat);
    rugMesh.rotation.x = -Math.PI / 2;
    rugMesh.position.y = 0.004;
    rugMesh.receiveShadow = true;
    rugMesh.userData = {
      type: 'cover_trigger',
      coverId: 'rug',
      name: 'Alfombra de lana',
    };
    rugGroup.add(rugMesh);

    this.covers.set('rug', {
      mesh: rugMesh,
      parentGroup: rugGroup,
      isShifted: false,
      shiftOffset: { x: 0, y: 0, z: 1.7 },
      originalLocalPos: rugMesh.position.clone(),
      coveredId: 'knife',
      animating: false,
      name: 'Alfombra de lana',
    });

    this.interactiveObjects.push(rugMesh);
    this.coverObjects.push(rugMesh);
  }

  _buildFridge() {
    const fridgeGroup = new THREE.Group();
    fridgeGroup.position.set(-4.2, 0, 3.8);
    this.scene.add(fridgeGroup);

    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1e, metalness: 0.6, roughness: 0.4 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.3 });

    // Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.7, 0.65), bodyMat);
    body.position.y = 0.85;
    body.castShadow = true;
    body.receiveShadow = true;
    fridgeGroup.add(body);

    // Door
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x222228, metalness: 0.5, roughness: 0.5 });
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.68, 1.68, 0.04), doorMat);
    door.position.set(0, 0.85, 0.345);
    door.castShadow = true;
    door.userData = {
      type: 'container_trigger',
      containerId: 'fridge',
      name: 'Nevera',
    };
    fridgeGroup.add(door);

    // Handle
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.3, 0.06), goldMat);
    handle.position.set(0.28, 0.85, 0.37);
    fridgeGroup.add(handle);

    // Register
    this.containers.set('fridge', {
      mesh: door,
      isOpen: false,
      animType: 'slide_z',
      closedZ: 0.345,
      openZ: 0.72,
      animating: false,
    });

    this.interactiveObjects.push(door);
    this.containerTriggers.push(door);
  }

  // =========================================================
  // CORPSE
  // =========================================================

  _buildCorpse() {
    const corpseGroup = new THREE.Group();
    this.scene.add(corpseGroup);

    // 1. Blood pool
    const bloodMat = new THREE.MeshStandardMaterial({
      color: 0x580a0f,
      emissive: new THREE.Color(0x580a0f),
      emissiveIntensity: 0.15,
      roughness: 1.0,
    });
    const blood = new THREE.Mesh(new THREE.CircleGeometry(0.9, 20), bloodMat);
    blood.rotation.x = -Math.PI / 2;
    blood.position.set(0, 0.003, -0.3);
    blood.scale.x = 1.6;
    corpseGroup.add(blood);

    // 2. Chalk outline
    const shape = new THREE.Shape();
    const outlinePoints = [
      [0, 0.6], [0.2, 0.5], [0.25, 0.3], [0.65, 0.2], [1.1, -0.1], [0.9, -0.3],
      [0.6, -0.1], [0.45, -0.5], [0.35, -0.8], [0.3, -1.4], [0.1, -1.8],
      [-0.1, -1.75], [-0.25, -1.3], [-0.4, -0.75], [-0.5, -0.5], [-0.65, 0.1],
      [-1.0, -0.05], [-0.6, -0.25], [-0.6, 0], [-0.25, 0.3], [-0.2, 0.5],
    ];
    shape.moveTo(outlinePoints[0][0], outlinePoints[0][1]);
    for (let i = 1; i < outlinePoints.length; i++) {
      shape.lineTo(outlinePoints[i][0], outlinePoints[i][1]);
    }
    shape.closePath();

    const chalkMat = new THREE.MeshStandardMaterial({
      color: 0xd8d4c8,
      transparent: true,
      opacity: 0.65,
      emissive: new THREE.Color(0x888880),
      emissiveIntensity: 0.1,
      roughness: 1.0,
    });
    const chalkMesh = new THREE.Mesh(new THREE.ShapeGeometry(shape), chalkMat);
    chalkMesh.rotation.x = -Math.PI / 2;
    chalkMesh.position.set(0, 0.005, -0.4);
    chalkMesh.scale.set(0.9, 0.9, 0.9);
    corpseGroup.add(chalkMesh);

    // 3. Body mesh
    this._buildBodyMesh(corpseGroup);

    // 4. Crime tape
    this._buildCrimeTape(corpseGroup);

    // 5. Evidence cones
    this._buildEvidenceCones(corpseGroup);

    // 6. Corpse hitbox
    const hitboxMat = new THREE.MeshStandardMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const hitbox = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.4, 2.0), hitboxMat);
    hitbox.position.set(0, 0.2, -0.5);
    hitbox.userData = {
      type: 'container_trigger',
      containerId: 'corpse_inspection',
      name: 'Inspección Forense del Cadáver',
    };
    corpseGroup.add(hitbox);
    this.interactiveObjects.push(hitbox);
    this.containerTriggers.push(hitbox);

    // 7. Register corpse inspection
    this.containers.set('corpse_inspection', {
      type: 'corpse_zoom',
      zoomCamPos: { x: 0, y: 2.4, z: 0.5 },
      zoomCamTarget: { x: 0, y: 0, z: -0.5 },
      isOpen: false,
    });
  }

  _buildBodyMesh(parent) {
    const bodyGroup = new THREE.Group();
    bodyGroup.position.set(0, 0, -0.5);
    bodyGroup.rotation.y = 0.15;
    parent.add(bodyGroup);

    const suitMat = new THREE.MeshStandardMaterial({ color: 0x14171e, roughness: 0.9 });
    const shirtMat = new THREE.MeshStandardMaterial({ color: 0xe8e0d4, roughness: 0.95 });
    const bloodMat = new THREE.MeshStandardMaterial({ color: 0x600a10, roughness: 1.0 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xc0987a, roughness: 0.85 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x0f1118, roughness: 0.9 });
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0x040404, roughness: 0.8 });

    // Torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.12, 0.65), suitMat);
    torso.position.y = 0.065;
    bodyGroup.add(torso);

    // Shirt
    const shirt = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.13, 0.5), shirtMat);
    shirt.position.set(0, 0.065, 0.1);
    bodyGroup.add(shirt);

    // Blood stain
    const stain = new THREE.Mesh(new THREE.CircleGeometry(0.08, 12), bloodMat);
    stain.rotation.x = -Math.PI / 2;
    stain.position.set(0.04, 0.133, 0.15);
    bodyGroup.add(stain);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 8), skinMat);
    head.scale.y = 0.75;
    head.position.set(-0.15, 0.1, 0.5);
    bodyGroup.add(head);

    // Left arm
    const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.1, 0.14), suitMat);
    leftArm.position.set(-0.52, 0.065, 0.3);
    leftArm.rotation.z = 0.3;
    bodyGroup.add(leftArm);

    // Right arm
    const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.14), suitMat);
    rightArm.position.set(0.47, 0.065, 0.1);
    rightArm.rotation.z = -0.2;
    bodyGroup.add(rightArm);

    // Left hand
    const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 6), skinMat);
    leftHand.position.set(-0.76, 0.065, 0.42);
    bodyGroup.add(leftHand);

    // Right hand
    const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 6), skinMat);
    rightHand.position.set(0.68, 0.065, 0.1);
    bodyGroup.add(rightHand);

    // Left leg
    const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.1, 0.9), pantsMat);
    leftLeg.position.set(-0.14, 0.065, -0.57);
    bodyGroup.add(leftLeg);

    // Right leg
    const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.1, 0.9), pantsMat);
    rightLeg.position.set(0.14, 0.065, -0.5);
    bodyGroup.add(rightLeg);

    // Shoes
    const shoePositions = [[-0.14, -1.0], [0.14, -0.93]];
    for (const [sx, sz] of shoePositions) {
      const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.07, 0.3), shoeMat);
      shoe.position.set(sx, 0.035, sz);
      bodyGroup.add(shoe);
    }
  }

  _buildCrimeTape(parent) {
    const polePositions = [[-2, -2.5], [2, -2.5], [2, 2], [-2, 2]];
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.3 });
    const tapeMat = new THREE.MeshStandardMaterial({
      color: 0xf1c40f,
      emissive: new THREE.Color(0xf1c40f),
      emissiveIntensity: 0.3,
      roughness: 0.9,
      side: THREE.DoubleSide,
    });

    // Poles
    for (const [px, pz] of polePositions) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.0, 8), goldMat);
      pole.position.set(px, 0.5, pz);
      parent.add(pole);
    }

    // Tape strips connecting poles
    const tapeConnections = [
      [0, 1], // bottom
      [1, 2], // right
      [2, 3], // top
      [3, 0], // left
    ];
    const tapeHeights = [0.65, 0.5];

    for (const [ai, bi] of tapeConnections) {
      const a = polePositions[ai];
      const b = polePositions[bi];
      const dx = b[0] - a[0];
      const dz = b[1] - a[1];
      const length = Math.sqrt(dx * dx + dz * dz);
      const angle = Math.atan2(dz, dx);

      for (const ty of tapeHeights) {
        const tape = new THREE.Mesh(new THREE.PlaneGeometry(length, 0.1), tapeMat);
        tape.position.set((a[0] + b[0]) / 2, ty, (a[1] + b[1]) / 2);
        tape.rotation.y = -angle;
        parent.add(tape);
      }
    }
  }

  _buildEvidenceCones(parent) {
    const coneMat = new THREE.MeshStandardMaterial({
      color: 0xf1c40f,
      emissive: new THREE.Color(0xf1c40f),
      emissiveIntensity: 0.4,
      roughness: 0.6,
    });
    const conePositions = [
      [-0.6, 0.11, 0.3],
      [0.7, 0.11, -0.5],
      [-0.3, 0.11, -1.2],
    ];
    for (const [cx, cy, cz] of conePositions) {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.22, 4), coneMat);
      cone.position.set(cx, cy, cz);
      parent.add(cone);
    }
  }

  // =========================================================
  // EVIDENCE
  // =========================================================

  placeEvidenceObjects(levelObjects) {
    // Clear previous evidence
    for (const [, mesh] of this.evidenceMeshes) {
      this.scene.remove(mesh);
    }
    this.evidenceMeshes.clear();
    this.evidenceData.clear();
    this.interactiveObjects = this.interactiveObjects.filter(
      (obj) => !(obj.userData && obj.userData.type === 'evidence')
    );

    for (const obj of levelObjects) {
      const { id, name, clue, position3D, containerId, coveredBy } = obj;
      const geo = this._getEvidenceGeometry(id);
      const colorHex = this._getEvidenceColor(id);
      const color = new THREE.Color(colorHex);

      const mat = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.6,
        roughness: 0.3,
        emissive: color.clone().multiplyScalar(0.1),
        emissiveIntensity: 0.2,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(position3D.x, position3D.y, position3D.z);
      mesh.castShadow = true;
      mesh.userData = {
        type: 'evidence',
        id,
        name,
        clue,
        found: false,
        containerId: containerId || null,
        coveredBy: coveredBy || null,
      };
      mesh.visible = !containerId && !coveredBy;

      this.evidenceMeshes.set(id, mesh);
      this.evidenceData.set(id, mesh.userData);
      this.scene.add(mesh);
      this.interactiveObjects.push(mesh);
    }
  }

  _getEvidenceGeometry(id) {
    const idLower = id.toLowerCase();
    if (/watch|ring|badge/.test(idLower)) return new THREE.TorusGeometry(0.04, 0.012, 8, 16);
    if (/key|knife|scalpel|sword|dagger/.test(idLower)) return new THREE.BoxGeometry(0.1, 0.012, 0.018);
    if (/note|document|dossier|passport|ticket/.test(idLower)) return new THREE.BoxGeometry(0.07, 0.004, 0.1);
    if (/phone|usb|lighter/.test(idLower)) return new THREE.BoxGeometry(0.07, 0.012, 0.13);
    if (/flask|vial|cyanide|glass/.test(idLower)) return new THREE.CylinderGeometry(0.02, 0.025, 0.09, 10);
    if (/casing|bullet/.test(idLower)) return new THREE.CylinderGeometry(0.008, 0.01, 0.03, 8);
    if (/revolver|gun/.test(idLower)) return new THREE.BoxGeometry(0.14, 0.055, 0.025);
    if (/fingerprint/.test(idLower)) return new THREE.CircleGeometry(0.04, 12);
    return new THREE.SphereGeometry(0.04, 8, 6);
  }

  _getEvidenceColor(id) {
    const idLower = id.toLowerCase();
    if (/note|document|passport|dossier|ticket/.test(idLower)) return 0xf4edd0;
    if (/flask|vial|glass/.test(idLower)) return 0x2d8a4a;
    if (/cyanide|blood|wound/.test(idLower)) return 0x8b0000;
    if (/phone|usb/.test(idLower)) return 0x1a1a2e;
    if (/casing|knife|scalpel/.test(idLower)) return 0xa8a8b0;
    if (/lighter/.test(idLower)) return 0xd4af37;
    if (/fingerprint/.test(idLower)) return 0xcc4444;
    return 0xd4af37;
  }

  // =========================================================
  // INTERACTION
  // =========================================================

  getObjectAtClick(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    );
    this.raycaster.setFromCamera(mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);
    for (const hit of intersects) {
      let obj = hit.object;
      while (obj) {
        if (obj.userData && obj.userData.type) {
          return { ...obj.userData, worldPoint: hit.point, mesh: obj };
        }
        obj = obj.parent;
      }
    }
    return null;
  }

  getHoveredObject(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    );
    this.raycaster.setFromCamera(mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);
    for (const hit of intersects) {
      let obj = hit.object;
      while (obj) {
        if (obj.userData && obj.userData.type) {
          return { ...obj.userData, worldPoint: hit.point, mesh: obj };
        }
        obj = obj.parent;
      }
    }
    return null;
  }

  openContainer(containerId) {
    const container = this.containers.get(containerId);
    if (!container) return null;

    if (container.type === 'corpse_zoom') {
      this._animateCameraTo(container.zoomCamPos, container.zoomCamTarget);
      this.isZoomed = true;
      this.controls.enabled = false;
      container.isOpen = true;
      return { isOpen: true };
    }

    container.isOpen = !container.isOpen;
    container.animating = true;

    for (const [id, data] of this.evidenceData) {
      if (data.containerId === containerId) {
        const mesh = this.evidenceMeshes.get(id);
        if (mesh && !data.found) {
          mesh.visible = container.isOpen;
        }
      }
    }

    return { isOpen: container.isOpen };
  }

  exitCorpseView() {
    if (!this.isZoomed) return;
    this._animateCameraTo(this.defaultCamPos, this.defaultCamTarget);
    this.isZoomed = false;
    this.controls.enabled = true;

    const container = this.containers.get('corpse_inspection');
    if (container) {
      container.isOpen = false;
      for (const [id, data] of this.evidenceData) {
        if (data.containerId === 'corpse_inspection') {
          const mesh = this.evidenceMeshes.get(id);
          if (mesh && !data.found) {
            mesh.visible = false;
          }
        }
      }
    }
  }

  _animateCameraTo(targetPos, targetLookAt) {
    this.cameraAnim = {
      startPos: this.camera.position.clone(),
      endPos: new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z),
      startTarget: this.controls.target.clone(),
      endTarget: new THREE.Vector3(targetLookAt.x, targetLookAt.y, targetLookAt.z),
      progress: 0,
      duration: 1.2,
    };
    this.controls.enabled = false;
  }

  shiftCover(coverId) {
    const cover = this.covers.get(coverId);
    if (!cover) return;

    cover.isShifted = !cover.isShifted;
    cover.animating = true;

    if (cover.coveredId) {
      const mesh = this.evidenceMeshes.get(cover.coveredId);
      const data = this.evidenceData.get(cover.coveredId);
      if (mesh && data && !data.found) {
        mesh.visible = cover.isShifted;
      }
    }
  }

  markEvidenceFound(id) {
    const mesh = this.evidenceMeshes.get(id);
    const data = this.evidenceData.get(id);
    if (!mesh || !data) return;

    data.found = true;
    mesh.userData.found = true;

    // Remove from interactiveObjects
    const idx = this.interactiveObjects.indexOf(mesh);
    if (idx !== -1) this.interactiveObjects.splice(idx, 1);

    // Found pulse animation
    this._foundPulses.push({
      mesh,
      elapsed: 0,
      duration: 0.6,
      originalScale: mesh.scale.clone(),
    });
  }

  updateFlashlight(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    );
    this.raycaster.setFromCamera(mouse, this.camera);
    const ray = this.raycaster.ray;
    this.flashlight.position.copy(this.camera.position);
    const target = ray.origin.clone().addScaledVector(ray.direction, 8);
    this.flashlightTarget.position.copy(target);
  }

  setFlashlightEnabled(enabled) {
    this.flashlight.intensity = enabled ? 5.5 : 1.0;
    this.ambientLight.intensity = enabled ? 0.4 : 1.4;
  }

  toggleDeskLamp() {
    this.deskLamp.intensity = this.deskLamp.intensity > 0 ? 0 : 2.5;
    return this.deskLamp.intensity > 0;
  }

  updateHover(clientX, clientY) {
    const hit = this.getHoveredObject(clientX, clientY);
    const newMesh = hit ? hit.mesh : null;

    // Restore previous hovered mesh
    if (this.hoveredMesh && this.hoveredMesh !== newMesh) {
      const mats = Array.isArray(this.hoveredMesh.material)
        ? this.hoveredMesh.material
        : [this.hoveredMesh.material];
      for (const mat of mats) {
        if (mat && mat.emissive) {
          const orig = this._origEmissive.get(this.hoveredMesh);
          const origIntensity = this._origEmissiveIntensity.get(this.hoveredMesh);
          if (orig !== undefined) mat.emissive.copy(orig);
          if (origIntensity !== undefined) mat.emissiveIntensity = origIntensity;
        }
      }
      this._origEmissive.delete(this.hoveredMesh);
      this._origEmissiveIntensity.delete(this.hoveredMesh);
    }

    // Apply hover highlight
    if (newMesh && newMesh !== this.hoveredMesh) {
      const mats = Array.isArray(newMesh.material) ? newMesh.material : [newMesh.material];
      for (const mat of mats) {
        if (mat && mat.emissive) {
          this._origEmissive.set(newMesh, mat.emissive.clone());
          this._origEmissiveIntensity.set(newMesh, mat.emissiveIntensity);
          mat.emissive.set(0xffcc44);
          mat.emissiveIntensity = 0.6;
        }
      }
    }

    this.hoveredMesh = newMesh;
    return hit || null;
  }

  _handleResize() {
    const parent = this.canvas.parentElement;
    const w = parent ? parent.clientWidth : window.innerWidth;
    const h = parent ? parent.clientHeight : window.innerHeight;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  // =========================================================
  // RENDER LOOP
  // =========================================================

  render() {
    const delta = this.clock.getDelta();

    // Controls update
    if (this.controls.enabled) {
      this.controls.update();
    }

    // Container animations
    for (const [, container] of this.containers) {
      if (!container.animating) continue;

      if (container.animType === 'slide_z') {
        const targetZ = container.isOpen
          ? (container.openZ !== undefined ? container.openZ : container.openZ)
          : (container.closedZ !== undefined ? container.closedZ : container.closedZ);

        // Determine object to move
        const movable = container.group || container.mesh;
        if (!movable) continue;

        const currentZ = movable.position.z;
        const diff = targetZ - currentZ;
        movable.position.z += diff * 0.14;
        if (Math.abs(diff) < 0.001) {
          movable.position.z = targetZ;
          container.animating = false;
        }

      } else if (container.animType === 'rotate_y') {
        const targetAngle = container.isOpen ? container.openAngle : 0;
        const pivot = container.pivot;
        if (!pivot) continue;

        const diff = targetAngle - pivot.rotation.y;
        pivot.rotation.y += diff * 0.14;
        if (Math.abs(diff) < 0.001) {
          pivot.rotation.y = targetAngle;
          container.animating = false;
        }

      } else if (container.animType === 'door_slide_z') {
        const targetZ = container.isOpen ? container.openZ : container.closedZ;
        const mesh = container.mesh;
        if (!mesh) continue;

        const diff = targetZ - mesh.position.z;
        mesh.position.z += diff * 0.14;
        if (Math.abs(diff) < 0.001) {
          mesh.position.z = targetZ;
          container.animating = false;
        }
      }
    }

    // Cover animations
    for (const [, cover] of this.covers) {
      if (!cover.animating) continue;
      const mesh = cover.mesh;
      const orig = cover.originalLocalPos;
      const offset = cover.shiftOffset;

      const targetPos = cover.isShifted
        ? new THREE.Vector3(orig.x + offset.x, orig.y + offset.y, orig.z + offset.z)
        : orig.clone();

      mesh.position.lerp(targetPos, 0.15);
      if (mesh.position.distanceTo(targetPos) < 0.002) {
        mesh.position.copy(targetPos);
        cover.animating = false;
      }
    }

    // Camera animation
    if (this.cameraAnim) {
      const anim = this.cameraAnim;
      anim.progress += delta / anim.duration;
      const t = Math.min(anim.progress, 1);
      // Ease in-out quadratic
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      this.camera.position.lerpVectors(anim.startPos, anim.endPos, eased);
      this.controls.target.lerpVectors(anim.startTarget, anim.endTarget, eased);
      this.camera.lookAt(this.controls.target);

      if (t >= 1) {
        this.cameraAnim = null;
        if (this.isZoomed) {
          this.controls.enabled = true;
          this.controls.maxDistance = 4;
        } else {
          this.controls.maxDistance = 9;
        }
      }
    }

    // Found pulse animations
    for (let i = this._foundPulses.length - 1; i >= 0; i--) {
      const pulse = this._foundPulses[i];
      pulse.elapsed += delta;
      const t = Math.min(pulse.elapsed / pulse.duration, 1);

      // Scale up to 1.5x
      const scaleFactor = 1 + 0.5 * Math.sin(t * Math.PI);
      pulse.mesh.scale.copy(pulse.originalScale).multiplyScalar(scaleFactor);

      // Fade out
      const mats = Array.isArray(pulse.mesh.material)
        ? pulse.mesh.material
        : [pulse.mesh.material];
      for (const mat of mats) {
        if (mat) {
          mat.transparent = true;
          mat.opacity = 1 - t;
        }
      }

      if (t >= 1) {
        pulse.mesh.visible = false;
        this._foundPulses.splice(i, 1);
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  // =========================================================
  // DISPOSE
  // =========================================================

  dispose() {
    window.removeEventListener('resize', this._resizeHandler);
    this.renderer.dispose();
  }
}
