/* ============================================================================
   TECHUILLA AGENCY — CGI 3D CINEMA CAMERA & FLUID-HEAD TRIPOD ENGINE
   Built with Three.js PBR Materials, Procedural Leatherette Bump Map,
   Clockwise-Rotating Knurled Focus Ring on Scroll, and Optical Lens Portal.
   Strictly Non-Interactive (Zero Mouse / Orbit Reaction).
   ============================================================================ */
(function () {
  'use strict';

  function createLeatherBumpTexture() {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 4200; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const r = 1 + Math.random() * 2.1;
      const v = 90 + Math.floor(Math.random() * 110);
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 3);
    return tex;
  }

  function createLensMarkingsTexture() {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 1024;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, 1024, 1024);

    // Subtle dark satin ring background
    ctx.fillStyle = '#121316';
    ctx.fillRect(0, 0, 1024, 1024);

    // Outer engraved specular rings
    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(512, 512, 468, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255,102,0,0.55)';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(512, 512, 446, 0, Math.PI * 2);
    ctx.stroke();

    // Engraved lens specifications around the inner bezel
    ctx.save();
    ctx.translate(512, 512);
    ctx.fillStyle = 'rgba(240, 240, 240, 0.88)';
    ctx.font = 'bold 28px Inter, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const drawArcText = (str, radius, startAngle, step) => {
      for (let i = 0; i < str.length; i++) {
        const a = startAngle + i * step;
        ctx.save();
        ctx.rotate(a);
        ctx.fillText(str[i], 0, -radius);
        ctx.restore();
      }
    };
    drawArcText('TECHUILLA OPTICS  24mm  F1.4  GM', 402, -0.92, 0.058);
    drawArcText('0.24m / 0.79ft  •  Ø67', 402, 2.55, 0.058);
    ctx.restore();

    const tex = new THREE.CanvasTexture(c);
    return tex;
  }

  function createBadgeTexture(text, color, fontSize) {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 128;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, 512, 128);
    ctx.fillStyle = color || '#F2F2F2';
    ctx.font = `800 ${fontSize || 54}px Inter, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 66);
    const tex = new THREE.CanvasTexture(c);
    return tex;
  }

  // Ultra-High-Res Procedural Concentric Micro-Grooved Baffle & Bezel Texture (2048x2048)
  function createMicroBaffleTextures(maxAniso) {
    // 1. Albedo + Grazing Specular Sheen Map
    const c = document.createElement('canvas');
    c.width = 2048;
    c.height = 2048;
    const ctx = c.getContext('2d');
    const cx = 1024, cy = 1024;

    ctx.fillStyle = '#070709';
    ctx.fillRect(0, 0, 2048, 2048);

    // 110 precision lathe-turned concentric light-trap micro-grooves
    for (let r = 980; r >= 240; r -= 6.5) {
      const band = Math.floor((980 - r) / 145);
      const isStepEdge = Math.abs(((980 - r) % 145)) < 8;
      const grooveBright = isStepEdge ? 42 : (Math.sin(r * 0.95) * 0.5 + 0.5) * 20 + 8;
      ctx.strokeStyle = `rgb(${Math.round(grooveBright * 1.06)}, ${Math.round(grooveBright * 0.98)}, ${Math.round(grooveBright * 0.92)})`;
      ctx.lineWidth = isStepEdge ? 3.2 : 2.1;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      // Deep matte-black valley beside each micro-ridge
      ctx.strokeStyle = '#030304';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.arc(cx, cy, r - 3.1, 0, Math.PI * 2);
      ctx.stroke();

      // Subtle step shadow drop at each tiered barrel wall
      if (isStepEdge && band > 0) {
        ctx.strokeStyle = 'rgba(255, 198, 138, 0.22)';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.arc(cx, cy, r + 2.5, -0.65, 1.15);
        ctx.stroke();
      }
    }

    // Grazing warm golden-amber studio rim light catching the concentric micro-grooves
    // Right bevel sheen (2:30 - 5:30 o'clock)
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const sheenRight = ctx.createRadialGradient(cx + 620, cy + 220, 40, cx + 620, cy + 220, 680);
    sheenRight.addColorStop(0.0, 'rgba(255, 186, 112, 0.36)');
    sheenRight.addColorStop(0.45, 'rgba(215, 132, 68, 0.16)');
    sheenRight.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = sheenRight;
    ctx.fillRect(0, 0, 2048, 2048);

    // Left bevel sheen (8:30 - 11:00 o'clock)
    const sheenLeft = ctx.createRadialGradient(cx - 640, cy - 180, 30, cx - 640, cy - 180, 620);
    sheenLeft.addColorStop(0.0, 'rgba(255, 196, 132, 0.32)');
    sheenLeft.addColorStop(0.45, 'rgba(180, 115, 72, 0.14)');
    sheenLeft.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = sheenLeft;
    ctx.fillRect(0, 0, 2048, 2048);

    // Bottom inner warm bounce sheen (5:30 - 6:30 o'clock)
    const sheenBottom = ctx.createRadialGradient(cx + 90, cy + 620, 20, cx + 90, cy + 620, 360);
    sheenBottom.addColorStop(0.0, 'rgba(255, 178, 92, 0.28)');
    sheenBottom.addColorStop(0.55, 'rgba(180, 102, 42, 0.10)');
    sheenBottom.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = sheenBottom;
    ctx.fillRect(0, 0, 2048, 2048);
    ctx.restore();

    const mapTex = new THREE.CanvasTexture(c);
    mapTex.anisotropy = maxAniso || 8;

    // 2. Matching Smooth Concentric Micro-Groove Bump Map (Smooth Sine-Wave Ridges — Zero Aliasing / Moire!)
    const b = document.createElement('canvas');
    b.width = 512;
    b.height = 512;
    const bctx = b.getContext('2d');
    for (let y = 0; y < 512; y++) {
      const v = Math.round((Math.sin((y / 512) * Math.PI * 2 * 36) * 0.5 + 0.5) * 180 + 35);
      bctx.fillStyle = `rgb(${v},${v},${v})`;
      bctx.fillRect(0, y, 512, 1);
    }
    const bumpTex = new THREE.CanvasTexture(b);
    bumpTex.wrapS = THREE.RepeatWrapping;
    bumpTex.wrapT = THREE.RepeatWrapping;
    bumpTex.repeat.set(1, 1);
    bumpTex.anisotropy = maxAniso || 8;

    return { mapTex, bumpTex };
  }

  // Layer 1: Outer Multi-Coated Curved Glass Element (Sleek Curved Emerald-Cyan AR Crescent + Fine Concentric Rings)
  function createOuterOpticalCoatingTexture(maxAniso) {
    const c = document.createElement('canvas');
    c.width = 2048;
    c.height = 2048;
    const ctx = c.getContext('2d');
    const cx = 1024, cy = 1024;

    ctx.clearRect(0, 0, 2048, 2048);

    // Deep obsidian optical barrel depth vignette
    const baseGrad = ctx.createRadialGradient(cx, cy, 80, cx, cy, 990);
    baseGrad.addColorStop(0.00, 'rgba(2, 3, 5, 0.25)');
    baseGrad.addColorStop(0.35, 'rgba(4, 6, 10, 0.45)');
    baseGrad.addColorStop(0.66, 'rgba(7, 8, 12, 0.72)');
    baseGrad.addColorStop(0.86, 'rgba(5, 5, 8, 0.90)');
    baseGrad.addColorStop(1.00, 'rgba(2, 2, 4, 0.98)');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, 2048, 2048);

    // Crisp concentric internal lens element rim reflections
    const ringDefs = [
      { r: 948, w: 3.0, col: 'rgba(255, 205, 148, 0.30)' },
      { r: 878, w: 1.8, col: 'rgba(255, 255, 255, 0.14)' },
      { r: 785, w: 2.5, col: 'rgba(255, 190, 128, 0.24)' },
      { r: 688, w: 1.8, col: 'rgba(170, 230, 255, 0.16)' },
      { r: 580, w: 2.2, col: 'rgba(255, 220, 178, 0.20)' },
      { r: 462, w: 1.8, col: 'rgba(130, 220, 200, 0.18)' },
      { r: 350, w: 1.8, col: 'rgba(255, 205, 158, 0.20)' },
      { r: 248, w: 1.6, col: 'rgba(170, 225, 215, 0.22)' }
    ];
    ringDefs.forEach(rd => {
      ctx.strokeStyle = rd.col;
      ctx.lineWidth = rd.w;
      ctx.beginPath();
      ctx.arc(cx, cy, rd.r, 0, Math.PI * 2);
      ctx.stroke();
    });

    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    // Signature UPPER-RIGHT Curved Emerald-Cyan / Teal / Warm-Gold Anti-Reflective Crescent Band (1:15 - 2:45 o'clock)
    ctx.save();
    ctx.translate(cx, cy);
    // Broad soft emerald-teal curved band following lens curvature (not an oval blob!)
    ctx.filter = 'blur(26px)';
    ctx.strokeStyle = 'rgba(42, 218, 162, 0.62)';
    ctx.lineWidth = 115;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, 0, 560, -0.96, -0.22);
    ctx.stroke();

    // Inner bright mint-cyan specular highlight arc
    ctx.filter = 'blur(14px)';
    ctx.strokeStyle = 'rgba(182, 255, 232, 0.78)';
    ctx.lineWidth = 44;
    ctx.beginPath();
    ctx.arc(0, 0, 585, -0.84, -0.34);
    ctx.stroke();

    // Subtle golden-lime outer dispersion edge on upper-right arc
    ctx.filter = 'blur(18px)';
    ctx.strokeStyle = 'rgba(220, 210, 96, 0.36)';
    ctx.lineWidth = 34;
    ctx.beginPath();
    ctx.arc(0, 0, 490, -0.92, -0.28);
    ctx.stroke();

    // Signature LOWER-LEFT Secondary Emerald-Teal Curved AR Crescent (7:15 - 8:30 o'clock)
    ctx.filter = 'blur(22px)';
    ctx.strokeStyle = 'rgba(56, 212, 164, 0.44)';
    ctx.lineWidth = 76;
    ctx.beginPath();
    ctx.arc(0, 0, 625, 2.08, 2.74);
    ctx.stroke();

    // Bottom Warm Golden-Amber Curved Glass Rim Reflection (5:30 - 6:15 o'clock)
    ctx.filter = 'blur(16px)';
    ctx.strokeStyle = 'rgba(255, 174, 82, 0.46)';
    ctx.lineWidth = 32;
    ctx.beginPath();
    ctx.arc(0, 0, 745, 1.25, 1.85);
    ctx.stroke();

    ctx.filter = 'none';
    ctx.restore();

    ctx.restore();

    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = maxAniso || 8;
    return tex;
  }

  // Layer 2: Mid-Depth Chromatic Prism Element (Vivid Amber-Gold + Royal Blue + Magenta-Violet Left Prism Stack!)
  function createMidPrismCoatingTexture(maxAniso) {
    const c = document.createElement('canvas');
    c.width = 2048;
    c.height = 2048;
    const ctx = c.getContext('2d');
    const cx = 1024, cy = 1024;
    ctx.clearRect(0, 0, 2048, 2048);

    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    // Signature LEFT-SIDE Chromatic Prism Stack (Amber-Orange -> Crisp White-Gold -> Royal Blue -> Violet-Magenta)
    ctx.save();
    ctx.translate(cx, cy);

    // Warm Amber-Orange inner prism flare
    ctx.filter = 'blur(12px)';
    ctx.strokeStyle = 'rgba(255, 148, 52, 0.95)';
    ctx.lineWidth = 64;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, 0, 565, 2.82, 3.30);
    ctx.stroke();

    // Hot White-Gold highlight core right on the amber edge
    ctx.filter = 'blur(5px)';
    ctx.strokeStyle = 'rgba(255, 240, 205, 0.98)';
    ctx.lineWidth = 22;
    ctx.beginPath();
    ctx.arc(0, 0, 590, 2.90, 3.24);
    ctx.stroke();

    // Royal Blue / Cobalt prism dispersion outer band (just outside amber)
    ctx.filter = 'blur(14px)';
    ctx.strokeStyle = 'rgba(84, 142, 255, 0.92)';
    ctx.lineWidth = 74;
    ctx.beginPath();
    ctx.arc(0, 0, 685, 2.76, 3.48);
    ctx.stroke();

    // Magenta-Violet dispersion arc extending downward along lower-left curve
    ctx.filter = 'blur(16px)';
    ctx.strokeStyle = 'rgba(224, 92, 255, 0.80)';
    ctx.lineWidth = 54;
    ctx.beginPath();
    ctx.arc(0, 0, 645, 2.28, 2.98);
    ctx.stroke();

    // Tight inner royal-blue crescent reflection closer to optical center
    ctx.filter = 'blur(8px)';
    ctx.strokeStyle = 'rgba(104, 166, 255, 0.88)';
    ctx.lineWidth = 34;
    ctx.beginPath();
    ctx.arc(0, 0, 388, 2.70, 3.42);
    ctx.stroke();

    // Inner warm gold curved counter-reflection on lower-left-inner barrel
    ctx.filter = 'blur(10px)';
    ctx.strokeStyle = 'rgba(255, 192, 112, 0.56)';
    ctx.lineWidth = 26;
    ctx.beginPath();
    ctx.arc(0, 0, 448, 2.02, 2.78);
    ctx.stroke();

    // Inner upper-right teal-gold secondary coating arc (creates genuine 3D parallax against outer emerald layer!)
    ctx.filter = 'blur(10px)';
    ctx.strokeStyle = 'rgba(128, 248, 202, 0.72)';
    ctx.lineWidth = 38;
    ctx.beginPath();
    ctx.arc(0, 0, 395, -0.94, -0.24);
    ctx.stroke();

    ctx.filter = 'none';
    ctx.restore();

    // Razor-sharp concentric inner optical bevel rings
    [710, 610, 505, 390, 285, 195].forEach((r, idx) => {
      ctx.strokeStyle = idx % 2 === 0 ? 'rgba(255, 224, 186, 0.28)' : 'rgba(150, 205, 255, 0.24)';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    ctx.restore();

    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = maxAniso || 8;
    return tex;
  }

  // Layer 3: Deep Inner Optical Core & Jewel-Like Central Specular Glint
  function createDeepCoreOpticalTexture(maxAniso) {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 1024;
    const ctx = c.getContext('2d');
    const cx = 512, cy = 512;
    ctx.clearRect(0, 0, 1024, 1024);

    // Deep concentric optical tunnel micro-rings
    for (let r = 460; r >= 55; r -= 18) {
      ctx.strokeStyle = r < 160 ? 'rgba(190, 230, 220, 0.24)' : 'rgba(255, 205, 150, 0.14)';
      ctx.lineWidth = r < 160 ? 1.8 : 1.3;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    // Tight inner emerald-gold glint at 1:30
    ctx.filter = 'blur(4px)';
    ctx.strokeStyle = 'rgba(155, 255, 215, 0.72)';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(cx, cy, 128, -0.95, -0.35);
    ctx.stroke();

    // Tight inner cool white-cyan glint at 7:30 (matches the crisp inner double reflection in the reference!)
    ctx.strokeStyle = 'rgba(215, 245, 255, 0.85)';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(cx, cy, 118, 2.05, 2.55);
    ctx.stroke();

    // Pinpoint jewel-like optical center glint
    ctx.filter = 'none';
    const pin = ctx.createRadialGradient(cx + 16, cy - 12, 2, cx + 16, cy - 12, 42);
    pin.addColorStop(0.0, 'rgba(255, 252, 232, 0.92)');
    pin.addColorStop(0.35, 'rgba(150, 238, 205, 0.45)');
    pin.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = pin;
    ctx.fillRect(cx - 60, cy - 60, 120, 120);

    ctx.restore();

    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = maxAniso || 8;
    return tex;
  }

  window.initAboutCameraCGI = function (canvasEl) {
    if (!canvasEl || typeof THREE === 'undefined') return null;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasEl,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;

    const scene = new THREE.Scene();

    // Camera centered dead-on world y = 0.0 (exact lens optical axis!) so the circular aperture is ALWAYS at (50%, 50%) screen center!
    const camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.05, 60);
    camera.position.set(0, 0, 7.1);
    camera.lookAt(0, 0, 0);

    // Cinema Studio 3-Point + Softbox Lighting (matching our motion-blurred film set)
    const ambient = new THREE.AmbientLight(0x3a3240, 1.25);
    scene.add(ambient);

    // Warm Tungsten Key Light from Right Softbox
    const keyLight = new THREE.DirectionalLight(0xffd9ad, 2.8);
    keyLight.position.set(5.5, 3.2, 4.8);
    scene.add(keyLight);

    // Warm Secondary Softbox Fill from Left
    const fillLight = new THREE.DirectionalLight(0xffb878, 1.9);
    fillLight.position.set(-5.8, 2.4, 3.6);
    scene.add(fillLight);

    // Cool Twilight Rim Light from Top-Back to sculpt metallic bevels
    const rimLight = new THREE.DirectionalLight(0x88b0ff, 2.1);
    rimLight.position.set(0.5, 5.5, -4.5);
    scene.add(rimLight);

    // Subtle Warm Bounce from Studio Floor
    const bounceLight = new THREE.PointLight(0xff8c3a, 1.4, 14);
    bounceLight.position.set(0, -3.4, 2.8);
    scene.add(bounceLight);

    // Dedicated Grazing Macro Studio Rim Lights for Chamfered Lens Bezel & Micro-Grooves (tight falloff so body stays obsidian!)
    const lensRimTopLeft = new THREE.PointLight(0xffb864, 0.95, 4.2);
    lensRimTopLeft.position.set(-1.35, 1.15, 1.75);
    scene.add(lensRimTopLeft);

    const lensRimBottomRight = new THREE.PointLight(0xff9438, 0.85, 4.2);
    lensRimBottomRight.position.set(1.40, -0.95, 1.65);
    scene.add(lensRimBottomRight);

    const lensRimTopRight = new THREE.PointLight(0xd4eeff, 0.65, 4.0);
    lensRimTopRight.position.set(1.15, 1.25, 1.85);
    scene.add(lensRimTopRight);

    const maxAniso = renderer.capabilities && renderer.capabilities.getMaxAnisotropy
      ? Math.min(renderer.capabilities.getMaxAnisotropy(), 16)
      : 8;

    // Procedural PBR Materials
    const leatherTex = createLeatherBumpTexture();
    const matBody = new THREE.MeshStandardMaterial({
      color: 0x0d0e11,
      roughness: 0.48,
      metalness: 0.48,
      bumpMap: leatherTex,
      bumpScale: 0.009
    });
    const matGrip = new THREE.MeshStandardMaterial({
      color: 0x0a0b0e,
      roughness: 0.72,
      metalness: 0.18,
      bumpMap: leatherTex,
      bumpScale: 0.022
    });
    const matMetalDark = new THREE.MeshStandardMaterial({
      color: 0x1c1e24,
      roughness: 0.34,
      metalness: 0.78
    });
    const matMetalBrushed = new THREE.MeshStandardMaterial({
      color: 0x2c3038,
      roughness: 0.28,
      metalness: 0.86
    });
    const matRedRing = new THREE.MeshStandardMaterial({
      color: 0xd93018,
      roughness: 0.30,
      metalness: 0.65
    });
    const matOrangeAccent = new THREE.MeshStandardMaterial({
      color: 0xff6600,
      roughness: 0.28,
      metalness: 0.55
    });
    const matChrome = new THREE.MeshStandardMaterial({
      color: 0xd6d9e0,
      roughness: 0.18,
      metalness: 0.95
    });

    const rigGroup = new THREE.Group();
    scene.add(rigGroup);

    // =========================================================================
    // 1. CAMERA BODY (Positioned so Lens Optical Axis is at EXACT world (0, 0, 0)!)
    // =========================================================================
    const cameraGroup = new THREE.Group();
    cameraGroup.position.set(0, 0.02, 0);
    rigGroup.add(cameraGroup);

    // Main Magnesium Chassis
    const bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(2.72, 1.62, 1.04), matBody);
    bodyMesh.position.set(0, 0, -0.32);
    cameraGroup.add(bodyMesh);

    // Top Deck Plate
    const topDeck = new THREE.Mesh(new THREE.BoxGeometry(2.68, 0.14, 1.0), matMetalDark);
    topDeck.position.set(0, 0.85, -0.32);
    cameraGroup.add(topDeck);

    // Ergonomic Right-Hand Leatherette Grip (viewer's left side of camera, matching reference!)
    const gripMain = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.38, 1.58, 24), matGrip);
    gripMain.position.set(-1.14, -0.02, 0.06);
    gripMain.scale.set(0.95, 1, 1.15);
    cameraGroup.add(gripMain);

    const gripJoin = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1.56, 0.72), matGrip);
    gripJoin.position.set(-0.96, -0.02, -0.14);
    cameraGroup.add(gripJoin);

    // Front Command Dial & Shutter Release on Grip
    const frontDial = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.07, 24), matMetalBrushed);
    frontDial.rotation.x = Math.PI / 2;
    frontDial.position.set(-1.12, 0.56, 0.42);
    cameraGroup.add(frontDial);

    const shutterCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.08, 20), matMetalDark);
    shutterCollar.position.set(-1.12, 0.94, 0.20);
    cameraGroup.add(shutterCollar);

    const shutterBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.07, 20), matChrome);
    shutterBtn.position.set(-1.12, 0.99, 0.20);
    cameraGroup.add(shutterBtn);

    // Mode Dial (Left of EVF from front view)
    const modeDial = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.18, 32), matMetalDark);
    modeDial.position.set(-0.62, 1.00, -0.22);
    cameraGroup.add(modeDial);

    // Pentaprism EVF Housing (Top Center)
    const evfBase = new THREE.Mesh(new THREE.BoxGeometry(0.94, 0.46, 0.92), matMetalDark);
    evfBase.position.set(0.0, 1.08, -0.26);
    cameraGroup.add(evfBase);

    const evfTop = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.52, 0.22, 4), matMetalDark);
    evfTop.rotation.y = Math.PI / 4;
    evfTop.scale.set(1.25, 1, 1.08);
    evfTop.position.set(0.0, 1.38, -0.26);
    cameraGroup.add(evfTop);

    // Hot-Shoe Metallic Rails on Top of EVF
    const hotShoe = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.05, 0.40), matChrome);
    hotShoe.position.set(0.0, 1.49, -0.26);
    cameraGroup.add(hotShoe);

    // Front Brand Wordmark on EVF Prism
    const brandTex = createBadgeTexture('TECHUILLA', '#F2F2F2', 52);
    const brandPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(0.68, 0.17),
      new THREE.MeshBasicMaterial({ map: brandTex, transparent: true, opacity: 0.92 })
    );
    brandPlane.position.set(0.0, 1.14, 0.215);
    cameraGroup.add(brandPlane);

    // Right-Side Alpha / Mark Badge
    const markTex = createBadgeTexture('α 7R', '#FF6600', 64);
    const markPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(0.38, 0.11),
      new THREE.MeshBasicMaterial({ map: markTex, transparent: true, opacity: 0.95 })
    );
    markPlane.position.set(1.02, 0.54, 0.215);
    cameraGroup.add(markPlane);

    // Chrome Strap Lugs on Left & Right Sides
    [-1.40, 1.40].forEach(sx => {
      const lug = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.02, 10, 20), matChrome);
      lug.position.set(sx, 0.62, -0.20);
      lug.rotation.y = Math.PI / 2;
      cameraGroup.add(lug);
    });

    // =========================================================================
    // 2. PRECISION CINEMA PRIME LENS (Centered at (0, 0, 0) in cameraGroup)
    //    Includes CLOCKWISE-ROTATING Knurled Focal-Length Ring on Scroll!
    // =========================================================================
    const lensGroup = new THREE.Group();
    lensGroup.position.set(0, -0.02, 0.22);
    cameraGroup.add(lensGroup);

    // Lens Mount Base Ring (Orange Signature Collar)
    const mountCollar = new THREE.Mesh(new THREE.TorusGeometry(0.79, 0.045, 16, 48), matOrangeAccent);
    mountCollar.position.set(0, 0, 0.02);
    lensGroup.add(mountCollar);

    // Outer Static Lens Barrel Housing (Hollow Ring so center bore stays open!)
    const outerBarrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.84, 0.81, 0.85, 48, 1, true),
      matMetalDark
    );
    outerBarrel.rotation.x = Math.PI / 2;
    outerBarrel.position.set(0, 0, 0.44);
    lensGroup.add(outerBarrel);

    // Front Faceplate Ring (Hollow Annulus with Engraved Lens Markings)
    const markingsTex = createLensMarkingsTexture();
    const frontRingGeo = new THREE.RingGeometry(0.56, 0.84, 64);
    const frontRingMat = new THREE.MeshStandardMaterial({
      map: markingsTex,
      roughness: 0.35,
      metalness: 0.65,
      side: THREE.DoubleSide
    });
    const frontFaceRing = new THREE.Mesh(frontRingGeo, frontRingMat);
    frontFaceRing.position.set(0, 0, 0.865);
    lensGroup.add(frontFaceRing);

    // Beveled Front Rim Lip
    const frontRim = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.036, 16, 64), matMetalBrushed);
    frontRim.position.set(0, 0, 0.87);
    lensGroup.add(frontRim);

    // ROTATING FOCAL-LENGTH / FOCUS RING (Rotates CLOCKWISE as user scrolls!)
    const focusRingGroup = new THREE.Group();
    focusRingGroup.position.set(0, 0, 0.56);
    lensGroup.add(focusRingGroup);

    const focusBand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.875, 0.875, 0.36, 64, 1, true),
      matMetalBrushed
    );
    focusBand.rotation.x = Math.PI / 2;
    focusRingGroup.add(focusBand);

    // 48 Tactile Knurled Focus Ribs around the Rotating Ring (makes clockwise rotation unmistakable!)
    const ribGeo = new THREE.BoxGeometry(0.026, 0.048, 0.34);
    for (let i = 0; i < 48; i++) {
      const ang = (i / 48) * Math.PI * 2;
      const isIndexMark = (i % 6 === 0);
      const rib = new THREE.Mesh(ribGeo, isIndexMark ? matOrangeAccent : matMetalDark);
      rib.position.set(Math.cos(ang) * 0.878, Math.sin(ang) * 0.878, 0);
      rib.rotation.z = ang + Math.PI / 2;
      focusRingGroup.add(rib);
    }

    // Inner Front Rotating Index Ring (visible directly from front-on view so clockwise spin is super crisp!)
    const innerSpinRing = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.022, 12, 48), matMetalBrushed);
    innerSpinRing.position.set(0, 0, 0.31);
    focusRingGroup.add(innerSpinRing);

    for (let i = 0; i < 12; i++) {
      const ang = (i / 12) * Math.PI * 2;
      const tick = new THREE.Mesh(
        new THREE.BoxGeometry(0.018, 0.065, 0.015),
        i % 3 === 0 ? matOrangeAccent : matChrome
      );
      tick.position.set(Math.cos(ang) * 0.68, Math.sin(ang) * 0.68, 0.325);
      tick.rotation.z = ang + Math.PI / 2;
      focusRingGroup.add(tick);
    }

    // Helper: Curved Optical Glass Dome Geometry with Exact Planar Circular UVs (Zero UV Distortion + Real 3D Depth!)
    function createCurvedOpticalDomeGeo(innerR, outerR, bulgeZ, radialSegs, ringSegs) {
      const geo = new THREE.RingGeometry(innerR, outerR, radialSegs, ringSegs);
      const pos = geo.attributes.position;
      const uv = geo.attributes.uv;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const r = Math.sqrt(x * x + y * y);
        const rn = Math.min(1, r / outerR);
        // Parabolic / spherical meniscus curvature
        const z = bulgeZ * (1 - rn * rn);
        pos.setZ(i, z);
        uv.setXY(i, (x / outerR) * 0.5 + 0.5, (y / outerR) * 0.5 + 0.5);
      }
      geo.computeVertexNormals();
      return geo;
    }

    // Ultra-Detailed Stepped Micro-Grooved Inner Lens Barrel & Multi-Element Optical Assembly
    const baffleTexBundle = createMicroBaffleTextures(maxAniso);

    // 1) Precision Chamfered Outer Bezel Rim catching warm gold studio highlights
    const matChamferWarm = new THREE.MeshStandardMaterial({
      color: 0x3b3532,
      roughness: 0.22,
      metalness: 0.92
    });
    const outerChamferBezel = new THREE.Mesh(new THREE.TorusGeometry(0.76, 0.028, 24, 96), matChamferWarm);
    outerChamferBezel.position.set(0, 0, 0.875);
    lensGroup.add(outerChamferBezel);

    // 2) 5-Tiered Stepped Concentric Inner Barrel Funnel (LatheGeometry with Micro-Grooved Bump Map!)
    const lathePoints = [
      new THREE.Vector2(0.585, 0.865),
      new THREE.Vector2(0.565, 0.835),
      new THREE.Vector2(0.540, 0.805),
      new THREE.Vector2(0.540, 0.755),
      new THREE.Vector2(0.495, 0.725),
      new THREE.Vector2(0.495, 0.675),
      new THREE.Vector2(0.445, 0.640),
      new THREE.Vector2(0.445, 0.585),
      new THREE.Vector2(0.390, 0.545),
      new THREE.Vector2(0.390, 0.485),
      new THREE.Vector2(0.335, 0.445),
      new THREE.Vector2(0.335, 0.375),
      new THREE.Vector2(0.275, 0.335)
    ];
    const steppedBarrelGeo = new THREE.LatheGeometry(lathePoints, 96);
    steppedBarrelGeo.rotateX(Math.PI / 2);
    const steppedBarrelMat = new THREE.MeshStandardMaterial({
      color: 0x0a0b0e,
      roughness: 0.42,
      metalness: 0.78,
      bumpMap: baffleTexBundle.bumpTex,
      bumpScale: 0.011,
      side: THREE.DoubleSide
    });
    const steppedBarrelMesh = new THREE.Mesh(steppedBarrelGeo, steppedBarrelMat);
    lensGroup.add(steppedBarrelMesh);

    // Pitch-Black Deep Optical Chamber Back-Plate (completely blocks camera body leatherette from ever peeking through lens bore!)
    const opticalBackPlate = new THREE.Mesh(
      new THREE.CircleGeometry(0.56, 64),
      new THREE.MeshBasicMaterial({ color: 0x020204 })
    );
    opticalBackPlate.position.set(0, 0, 0.24);
    lensGroup.add(opticalBackPlate);

    // 3) Front Micro-Grooved Light-Trap Baffle Collar Annulus (2048px Concentric Lathe Grooves + Subtle Warm Grazing Sheen)
    const microBaffleFaceMat = new THREE.MeshStandardMaterial({
      color: 0x625e5c,
      map: baffleTexBundle.mapTex,
      roughness: 0.50,
      metalness: 0.72,
      side: THREE.DoubleSide
    });
    const microBaffleFace = new THREE.Mesh(createCurvedOpticalDomeGeo(0.41, 0.615, -0.045, 96, 8), microBaffleFaceMat);
    microBaffleFace.position.set(0, 0, 0.855);
    lensGroup.add(microBaffleFace);

    // 4) 6 Razor-Sharp Precision Metallic Spacer Rings Stepping Deep into the Optical Tunnel
    const spacerRingConfigs = [
      { r: 0.585, tube: 0.014, z: 0.860, mat: matChamferWarm },
      { r: 0.542, tube: 0.011, z: 0.798, mat: matMetalBrushed },
      { r: 0.495, tube: 0.010, z: 0.720, mat: matChamferWarm },
      { r: 0.445, tube: 0.009, z: 0.635, mat: matMetalBrushed },
      { r: 0.390, tube: 0.008, z: 0.542, mat: matChamferWarm },
      { r: 0.335, tube: 0.007, z: 0.442, mat: matMetalBrushed }
    ];
    spacerRingConfigs.forEach(cfg => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(cfg.r, cfg.tube, 18, 96), cfg.mat);
      ring.position.set(0, 0, cfg.z);
      lensGroup.add(ring);
    });

    // 5) Layer 1 — Outer Curved Multi-Coated Meniscus Glass Element (Emerald-Cyan AR Coating + Fine Concentric Rings)
    const outerOpticalTex = createOuterOpticalCoatingTexture(maxAniso);
    const outerOpticalMat = new THREE.MeshBasicMaterial({
      map: outerOpticalTex,
      transparent: true,
      opacity: 0.96,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const outerMeniscusDome = new THREE.Mesh(createCurvedOpticalDomeGeo(0.08, 0.565, 0.095, 96, 16), outerOpticalMat);
    outerMeniscusDome.position.set(0, 0, 0.735);
    lensGroup.add(outerMeniscusDome);

    // 6) Layer 2 — Mid-Depth Chromatic Prism Curved Element (Amber-Gold + Royal Blue + Magenta-Violet Left Prism Arc!)
    const midPrismTex = createMidPrismCoatingTexture(maxAniso);
    const midPrismMat = new THREE.MeshBasicMaterial({
      map: midPrismTex,
      transparent: true,
      opacity: 0.94,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const midPrismDome = new THREE.Mesh(createCurvedOpticalDomeGeo(0.06, 0.495, -0.075, 96, 14), midPrismMat);
    midPrismDome.position.set(0, 0, 0.615);
    lensGroup.add(midPrismDome);

    // 7) Layer 3 — Deep Inner Optical Core & Jewel-Like Central Specular Glint
    const deepCoreTex = createDeepCoreOpticalTexture(maxAniso);
    const deepCoreMat = new THREE.MeshBasicMaterial({
      map: deepCoreTex,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const deepCoreDome = new THREE.Mesh(createCurvedOpticalDomeGeo(0.001, 0.385, 0.045, 72, 10), deepCoreMat);
    deepCoreDome.position.set(0, 0, 0.465);
    lensGroup.add(deepCoreDome);

    // 9-Blade Mechanical Organic Camera Iris Diaphragm (Opens smoothly from exact center on scroll!)
    const irisGroup = new THREE.Group();
    irisGroup.position.set(0, 0, 0.52);
    lensGroup.add(irisGroup);

    const irisBladeMat = new THREE.MeshStandardMaterial({
      color: 0x0b0c0f,
      roughness: 0.38,
      metalness: 0.78,
      side: THREE.DoubleSide
    });
    const irisBlades = [];
    const BLADE_COUNT = 9;
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, 0);
    bladeShape.lineTo(0.42, -0.06);
    bladeShape.quadraticCurveTo(0.54, 0.16, 0.24, 0.42);
    bladeShape.lineTo(0, 0.14);
    bladeShape.closePath();
    const bladeGeo = new THREE.ShapeGeometry(bladeShape);

    for (let i = 0; i < BLADE_COUNT; i++) {
      const ang = (i / BLADE_COUNT) * Math.PI * 2;
      const pivot = new THREE.Group();
      pivot.position.set(Math.cos(ang) * 0.50, Math.sin(ang) * 0.50, i * 0.002);
      pivot.rotation.z = ang + Math.PI * 0.68;
      const blade = new THREE.Mesh(bladeGeo, irisBladeMat);
      blade.position.set(-0.08, -0.04, 0);
      pivot.add(blade);
      irisGroup.add(pivot);
      irisBlades.push({ pivot, baseRot: ang + Math.PI * 0.68 });
    }

    // =========================================================================
    // 3. HEAVY-DUTY FLUID-HEAD TRIPOD (Directly below Camera Body)
    // =========================================================================
    const tripodGroup = new THREE.Group();
    tripodGroup.position.set(0, -0.86, -0.24);
    rigGroup.add(tripodGroup);

    // Quick-Release Base Plate
    const qrPlate = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.18, 0.86), matMetalDark);
    qrPlate.position.set(0, 0, 0);
    tripodGroup.add(qrPlate);

    // Fluid Head Block
    const fluidHead = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.72, 0.82), matMetalDark);
    fluidHead.position.set(0, -0.45, 0);
    tripodGroup.add(fluidHead);

    // Side Tension Knob (Right)
    const tensionKnob = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.26, 24), matMetalBrushed);
    tensionKnob.rotation.z = Math.PI / 2;
    tensionKnob.position.set(0.60, -0.46, 0.04);
    tripodGroup.add(tensionKnob);

    // Angled Pan-Bar Handle extending Down-Left (matches reference!)
    const panArm = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.075, 1.35, 16), matGrip);
    panArm.position.set(-1.05, -0.78, 0.12);
    panArm.rotation.z = -1.06;
    tripodGroup.add(panArm);

    const panJoint = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.24, 20), matMetalBrushed);
    panJoint.rotation.z = Math.PI / 2;
    panJoint.position.set(-0.56, -0.46, 0.08);
    tripodGroup.add(panJoint);

    // Red Anodized Fluid Base Collar Ring (Signature Cinema Tripod Detail)
    const redCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.56, 0.10, 32), matRedRing);
    redCollar.position.set(0, -0.90, 0);
    tripodGroup.add(redCollar);

    // Tripod Apex Spider Hub
    const spiderHub = new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.74, 0.34, 24), matMetalDark);
    spiderHub.position.set(0, -1.12, 0);
    tripodGroup.add(spiderHub);

    // 3 Angled Carbon-Fiber Tripod Legs
    const legConfigs = [
      { x: -0.62, z: 0.22, rz: -0.26, rx: 0.08 },
      { x:  0.62, z: 0.22, rz:  0.26, rx: 0.08 },
      { x:  0.00, z: -0.58, rz: 0.00, rx: -0.26 }
    ];
    legConfigs.forEach(lc => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.11, 2.2, 16), matMetalBrushed);
      leg.position.set(lc.x, -2.18, lc.z);
      leg.rotation.z = lc.rz;
      leg.rotation.x = lc.rx;
      tripodGroup.add(leg);
    });

    // Resize Handler
    function resize() {
      const w = canvasEl.clientWidth || window.innerWidth;
      const h = canvasEl.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Scroll-Driven Update Function (0 = Hero Camera on Tripod, 1 = Zoomed Straight Through Exact (50%,50%) Lens Center!)
    function renderAtProgress(zoomP) {
      const p = Math.max(0, Math.min(1, zoomP));
      const easeZ = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

      // Keep camera locked dead-on world y = 0.0 so lens bore is ALWAYS at exact (50%, 50%) viewport center!
      const camZ = 7.1 + (1.05 - 7.1) * easeZ;
      camera.position.set(0, 0, camZ);
      camera.lookAt(0, 0, 0);

      // CLOCKWISE rotation of the focal-length / focus ring on scroll!
      focusRingGroup.rotation.z = -p * Math.PI * 1.5;

      // 9-Blade Organic Iris Diaphragm smoothly retracts behind the bezel (zero abrupt visibility pop!)
      const irisOpen = Math.max(0, Math.min(1, p * 1.35));
      const irisEase = 1 - Math.pow(1 - irisOpen, 3);
      irisBlades.forEach(b => {
        b.pivot.rotation.z = b.baseRot - irisEase * 1.18;
      });
      irisBladeMat.transparent = true;
      irisBladeMat.opacity = Math.max(0, 1 - Math.max(0, (irisOpen - 0.72) / 0.28));

      // Fade multi-layered optical glass coatings cleanly as camera passes through the open iris into OUR CRAFTS
      const outerGlassFade = Math.max(0, 1 - Math.max(0, (p - 0.36) / 0.38));
      const coreGlassFade = Math.max(0, 1 - Math.max(0, (p - 0.24) / 0.32));
      outerOpticalMat.opacity = 0.96 * outerGlassFade;
      midPrismMat.opacity = 0.94 * outerGlassFade;
      deepCoreMat.opacity = 0.92 * coreGlassFade;
      // Subtle optical refraction shimmer as focal ring turns
      midPrismDome.rotation.z = p * 0.14;
      deepCoreDome.rotation.z = -p * 0.22;

      renderer.render(scene, camera);
    }

    renderAtProgress(0);

    return {
      renderAtProgress,
      resize
    };
  };
})();
