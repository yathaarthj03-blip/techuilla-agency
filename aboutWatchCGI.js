/* ============================================================================
   TECHUILLA AGENCY — PHOTOREALISTIC HIGH-POLY 3D CGI LUXURY WATCH ENGINE
   Cool-Neutral Horology Studio HDRI Reflections (Authentic 316L Brushed Steel),
   Pure Velvet Matte-Black Obsidian Dial (Zero Vinyl Rings), Soft Contact Shadows,
   Sleek Integrated Curved Lugs & Organic Domed Matte-Black Calfskin Leather Strap,
   Black-Beveled Luminous Orange Hour Hand ("25+ HAPPY CLIENTS" in Bryson/Archivo Bold),
   9 o'clock Recessed Mechanical Drum Stepper ("150 + / clients"),
   Curved Engraved "Since May 2026" Across 5:00 - 7:00, and Full-Watch Outro Zoom-Out.
   Strictly Non-Interactive (Zero Mouse / Orbit Reaction).
   ============================================================================ */
(function () {
  'use strict';

  function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  // 1. Cool-Neutral Horology Studio HDRI Environment Map (Authentic 316L Stainless Steel Reflections!)
  function createHorologyStudioEnvMap(renderer) {
    const W = 1024, H = 512;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const ctx = c.getContext('2d');

    // Deep dark studio cyclorama
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0.00, '#101216');
    bg.addColorStop(0.45, '#040507');
    bg.addColorStop(0.55, '#020203');
    bg.addColorStop(1.00, '#090a0d');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    const drawSoftbox = (x, y, w, h, color, blurPx) => {
      ctx.save();
      ctx.filter = `blur(${blurPx}px)`;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
      ctx.restore();
    };

    // High-contrast crisp silver-white horology overhead & side strip softboxes (sculpts real 316L steel!)
    drawSoftbox(60, 38, 360, 74, 'rgba(255, 255, 255, 0.96)', 14);
    drawSoftbox(560, 52, 380, 62, 'rgba(236, 244, 255, 0.92)', 16);
    drawSoftbox(220, 152, 260, 24, 'rgba(245, 248, 255, 0.78)', 7);
    drawSoftbox(680, 178, 240, 22, 'rgba(220, 232, 248, 0.68)', 8);

    // Subtle specular metallic edge strips around horizon
    drawSoftbox(80, 230, 860, 10, 'rgba(255, 255, 255, 0.82)', 4);
    drawSoftbox(140, 295, 240, 48, 'rgba(180, 194, 212, 0.42)', 18);
    drawSoftbox(640, 305, 260, 44, 'rgba(195, 208, 224, 0.38)', 18);

    // Very restrained subtle warm accent low on one side (never tints steel bronze!)
    drawSoftbox(40, 390, 180, 36, 'rgba(255, 132, 52, 0.38)', 22);

    const eqTex = new THREE.CanvasTexture(c);
    eqTex.mapping = THREE.EquirectangularReflectionMapping;

    if (typeof THREE.PMREMGenerator === 'function') {
      const pmrem = new THREE.PMREMGenerator(renderer);
      pmrem.compileEquirectangularShader();
      const envRT = pmrem.fromEquirectangular(eqTex);
      eqTex.dispose();
      pmrem.dispose();
      return envRT.texture;
    }
    return eqTex;
  }

  // 2. Fine Organic Micro-Pebble Matte Texture Bump Map (for Pure Matte-Black Dial & Calfskin Leather)
  function createOrganicPebbleBump(size, repeatCount, strength) {
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, size, size);

    for (let i = 0; i < 7200; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = 0.7 + Math.random() * 1.9;
      const v = clamp(Math.round(128 + (Math.random() - 0.5) * strength), 60, 196);
      ctx.fillStyle = `rgba(${v},${v},${v},0.42)`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatCount, repeatCount);
    return tex;
  }

  // 3. Realistic Matte-Black Calfskin Leather Strap Albedo (Subtle Edge Crease + Dark Fade Into Obsidian)
  function createCalfskinStrapTexture(maxAniso) {
    const W = 512, H = 1024;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const ctx = c.getContext('2d');

    // Deep velvety matte-black calfskin with subtle cylindrical pillow shading across width
    const gradX = ctx.createLinearGradient(0, 0, W, 0);
    gradX.addColorStop(0.00, '#040405');
    gradX.addColorStop(0.14, '#0c0d10');
    gradX.addColorStop(0.50, '#121317');
    gradX.addColorStop(0.86, '#0c0d10');
    gradX.addColorStop(1.00, '#040405');
    ctx.fillStyle = gradX;
    ctx.fillRect(0, 0, W, H);

    // Subtle embossed leather edge crease lines (refined luxury watch strap detail — no cartoon dashes!)
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(42, 0); ctx.lineTo(42, H);
    ctx.moveTo(W - 42, 0); ctx.lineTo(W - 42, H);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.045)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(46, 0); ctx.lineTo(46, H);
    ctx.moveTo(W - 46, 0); ctx.lineTo(W - 46, H);
    ctx.stroke();

    // Smooth vignette fading strap gracefully into the pitch-black obsidian background at far ends
    const fadeY = ctx.createLinearGradient(0, 0, 0, H);
    fadeY.addColorStop(0.00, 'rgba(2, 2, 3, 0.0)');
    fadeY.addColorStop(0.45, 'rgba(2, 2, 3, 0.15)');
    fadeY.addColorStop(0.78, 'rgba(2, 2, 3, 0.72)');
    fadeY.addColorStop(1.00, 'rgba(2, 2, 3, 0.98)');
    ctx.fillStyle = fadeY;
    ctx.fillRect(0, 0, W, H);

    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = maxAniso || 8;
    return tex;
  }

  // 4. Fine Brushed Stainless Steel Bump Map
  function createBrushedMetalBump(maxAniso) {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 512, 512);
    for (let y = 0; y < 512; y++) {
      const v = clamp(Math.round(128 + (Math.random() - 0.5) * 26), 92, 164);
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.fillRect(0, y, 512, 1);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 6);
    tex.anisotropy = maxAniso || 8;
    return tex;
  }

  // 5. 2048x2048 Pure Matte-Black Obsidian Dial Texture (NO Concentric Lines — Pure Velvety Matte Black!)
  function createWatchDialTexture(maxAniso) {
    const S = 2048;
    const cx = S / 2;
    const cy = S / 2;
    const c = document.createElement('canvas');
    c.width = S;
    c.height = S;
    const ctx = c.getContext('2d');

    // Pure deep matte-black obsidian dial (zero vinyl rings, zero grey wash!)
    const bg = ctx.createRadialGradient(cx, cy, 40, cx, cy, S * 0.5);
    bg.addColorStop(0.00, '#070708');
    bg.addColorStop(0.68, '#050506');
    bg.addColorStop(0.92, '#030304');
    bg.addColorStop(1.00, '#010102');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, S, S);

    // Outer 60 Crisp Brushed Silver Minute Ticks
    const tickOuterR = 972;
    for (let i = 0; i < 60; i++) {
      const ang = (i / 60) * Math.PI * 2 - Math.PI / 2;
      const isHour = (i % 5 === 0);
      const len = isHour ? 38 : 26;
      const w = isHour ? 7.5 : 3.2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ang);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      ctx.fillRect(tickOuterR - len + 2, -w / 2 + 2, len, w);
      const tg = ctx.createLinearGradient(tickOuterR - len, -w / 2, tickOuterR, w / 2);
      tg.addColorStop(0, isHour ? '#E4E9F0' : '#AEB5C0');
      tg.addColorStop(0.5, isHour ? '#FFFFFF' : '#CBD1DA');
      tg.addColorStop(1, isHour ? '#8A92A0' : '#707782');
      ctx.fillStyle = tg;
      ctx.fillRect(tickOuterR - len, -w / 2, len, w);
      ctx.restore();
    }

    // 12 Rich Embossed Burnt-Orange Serif Roman Numerals (XII..XI)
    const numerals = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
    const numR = 820;
    ctx.save();
    ctx.font = '700 122px "Playfair Display", Georgia, "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < 12; i++) {
      const ang = (i / 12) * Math.PI * 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ang);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.90)';
      ctx.fillText(numerals[i], 4, -numR + 5);
      const ng = ctx.createLinearGradient(-40, -numR - 50, 40, -numR + 50);
      ng.addColorStop(0.0, '#FF761E');
      ng.addColorStop(0.45, '#EC5208');
      ng.addColorStop(1.0, '#BE3602');
      ctx.fillStyle = ng;
      ctx.fillText(numerals[i], 0, -numR);
      ctx.restore();
    }
    ctx.restore();

    // Curved Metallic Silver Engraving "Since May 2026" Spanning 5:00 to 7:00 Above VI (Preserved Exactly!)
    const arcText = 'Since May 2026';
    const arcR = 676;
    const totalArcSpan = 0.92;
    const startA = Math.PI / 2 + totalArcSpan / 2;
    ctx.save();
    ctx.font = '500 74px "Playfair Display", Georgia, "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const stepA = totalArcSpan / (arcText.length - 1);
    for (let i = 0; i < arcText.length; i++) {
      const a = startA - i * stepA;
      const x = cx + Math.cos(a) * arcR;
      const y = cy + Math.sin(a) * arcR;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(a - Math.PI / 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      ctx.fillText(arcText[i], 2.5, 3.5);
      const sg = ctx.createLinearGradient(0, -30, 0, 30);
      sg.addColorStop(0.0, '#E4E9F0');
      sg.addColorStop(0.55, '#B8C0CA');
      sg.addColorStop(1.0, '#858E9A');
      ctx.fillStyle = sg;
      ctx.fillText(arcText[i], 0, 0);
      ctx.restore();
    }
    ctx.restore();

    // Deep Recessed Aperture Pocket at 9 o'clock (IX)
    const winX = cx - 530;
    const winY = cy;
    const winW = 264;
    const winH = 148;
    ctx.fillStyle = '#010102';
    ctx.fillRect(winX - winW / 2 - 10, winY - winH / 2 - 10, winW + 20, winH + 20);

    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = maxAniso || 8;
    return tex;
  }

  // 6. Luminous Orange Hour Hand Inlay Texture ("25+ HAPPY CLIENTS" in BRYSON-Style Bold Geometric Display Font!)
  function createHourHandInlayTexture(maxAniso) {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 256;
    const ctx = c.getContext('2d');

    const g = ctx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0.00, '#FF6D1A');
    g.addColorStop(0.48, '#F25006');
    g.addColorStop(1.00, '#C83A00');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 1024, 256);

    // Bold, Clean, Heavy Display Typography (Matching BRYSON / MONIGUE Reference Image 1 — Zero Shadows!)
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 58px "Archivo Black", "Inter", Impact, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('25+ HAPPY CLIENTS', 625, 130);
    ctx.restore();

    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = maxAniso || 8;
    return tex;
  }

  // 7. Dynamic Mechanical Roller Stepper Controller for 9 o'clock Window ("150 +" & "clients")
  function createStepperWindowController(maxAniso) {
    const W = 512;
    const H = 288;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const ctx = c.getContext('2d');
    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = maxAniso || 8;

    const TARGET_WORD = 'clients';
    const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
    let lastKey = '';

    function drawDrumChar(cx, cy, charH, currentChar, nextChar, frac, color, font) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(cx - 32, cy - charH * 0.56, 64, charH * 1.12);
      ctx.clip();
      ctx.font = font;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = color;

      const dy = -frac * charH;
      ctx.globalAlpha = 1 - frac * 0.55;
      ctx.fillText(currentChar, cx, cy + dy);
      if (frac > 0.001) {
        ctx.globalAlpha = 0.45 + frac * 0.55;
        ctx.fillText(nextChar, cx, cy + charH + dy);
      }
      ctx.restore();
    }

    function update(stepP) {
      const p = clamp(stepP, 0, 1);
      const q = Math.round(p * 400);
      if (String(q) === lastKey) return;
      lastKey = String(q);

      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0.00, '#020203');
      bg.addColorStop(0.18, '#0e0f13');
      bg.addColorStop(0.50, '#13151a');
      bg.addColorStop(0.82, '#0e0f13');
      bg.addColorStop(1.00, '#020203');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.fillRect(22, H * 0.53, W - 44, 2.5);

      const numP = easeOutCubic(clamp(p / 0.72, 0, 1));
      const floatVal = numP * 150;
      const tens = floatVal / 10;
      const ones = floatVal;

      const topFont = '800 96px "Big Shoulders Display", "Space Grotesk", sans-serif';
      const topY = H * 0.30;
      const topCharH = 98;

      const d0CurStr = floatVal >= 100 ? '1' : ' ';
      const d0NextStr = floatVal >= 99 ? '1' : ' ';
      const d0ShowFrac = floatVal >= 99 && floatVal < 100 ? (floatVal - 99) : 0;

      const d1 = Math.floor(tens) % 10;
      const d1Next = (d1 + 1) % 10;
      const d1Frac = (ones % 10) > 9 ? (ones % 10) - 9 : 0;

      const d2 = Math.floor(ones) % 10;
      const d2Next = (d2 + 1) % 10;
      const d2Frac = ones - Math.floor(ones);

      drawDrumChar(132, topY, topCharH, d0CurStr, d0NextStr, d0ShowFrac, '#E6EAF0', topFont);
      drawDrumChar(186, topY, topCharH, floatVal >= 10 ? String(d1) : ' ', String(d1Next), d1Frac, '#E6EAF0', topFont);
      drawDrumChar(240, topY, topCharH, String(d2), String(d2Next), d2Frac, '#E6EAF0', topFont);

      ctx.save();
      ctx.font = '700 78px "Big Shoulders Display", "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = `rgba(230, 234, 240, ${clamp(p * 3.5, 0.25, 0.96).toFixed(2)})`;
      ctx.fillText('+', 316, topY + 2);
      ctx.restore();

      const botFont = '500 54px "Space Grotesk", "Inter", monospace';
      const botY = H * 0.77;
      const botCharH = 62;
      const startX = 76;
      const spacing = 59;

      for (let i = 0; i < TARGET_WORD.length; i++) {
        const targetChar = TARGET_WORD[i];
        const targetIdx = ALPHABET.indexOf(targetChar);
        const lockStart = 0.06 + i * 0.085;
        const lockEnd = lockStart + 0.32;
        const lp = clamp((p - lockStart) / (lockEnd - lockStart), 0, 1);

        const cx = startX + i * spacing;
        if (lp <= 0.001) {
          const idleChar = ALPHABET[(targetIdx + 9 + i * 3) % 26];
          drawDrumChar(cx, botY, botCharH, idleChar, idleChar, 0, 'rgba(185, 192, 202, 0.32)', botFont);
        } else if (lp >= 0.999) {
          drawDrumChar(cx, botY, botCharH, targetChar, targetChar, 0, '#DCE0E6', botFont);
        } else {
          const totalSteps = 6;
          const pos = easeOutCubic(lp) * totalSteps;
          const stepIdx = Math.floor(pos);
          const frac = pos - stepIdx;
          const stepsRemaining = totalSteps - stepIdx;
          const curIdx = (targetIdx - stepsRemaining + 26 * 4) % 26;
          const nxtIdx = (curIdx + 1) % 26;
          drawDrumChar(cx, botY, botCharH, ALPHABET[curIdx], ALPHABET[nxtIdx], frac, '#DCE0E6', botFont);
        }
      }

      const vigTop = ctx.createLinearGradient(0, 0, 0, 52);
      vigTop.addColorStop(0, 'rgba(0,0,0,0.92)');
      vigTop.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = vigTop;
      ctx.fillRect(0, 0, W, 52);

      const vigBot = ctx.createLinearGradient(0, H - 52, 0, H);
      vigBot.addColorStop(0, 'rgba(0,0,0,0)');
      vigBot.addColorStop(1, 'rgba(0,0,0,0.92)');
      ctx.fillStyle = vigBot;
      ctx.fillRect(0, H - 52, W, 52);

      tex.needsUpdate = true;
    }

    update(0);
    return { tex, update };
  }

  // Helper: Sleek Integrated Swept Stainless Steel Watch Lug (Tucked Seamlessly Behind Bezel!)
  function createSculptedLugMesh(mat, sideX, sideY) {
    const shape = new THREE.Shape();
    shape.moveTo(-0.20, 0.0);
    shape.quadraticCurveTo(-0.19, 0.48, -0.07, 1.02);
    shape.quadraticCurveTo(0.01, 1.08, 0.09, 1.00);
    shape.quadraticCurveTo(0.18, 0.46, 0.22, 0.0);
    shape.closePath();

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.20,
      bevelEnabled: true,
      bevelThickness: 0.036,
      bevelSize: 0.026,
      bevelSegments: 8,
      curveSegments: 28
    });
    geo.translate(0, 0, -0.10);

    const mesh = new THREE.Mesh(geo, mat);
    // Positioned cleanly behind the circular bezel rim so there is ZERO awkward lip overhang!
    mesh.position.set(sideX * 1.02, sideY * 1.56, -0.22);
    mesh.scale.set(sideX, sideY, 1);
    mesh.rotation.z = sideX * sideY * -0.09;
    mesh.rotation.x = sideY * 0.16;
    return mesh;
  }

  // Helper: Photorealistic Curved Domed Matte-Black Calfskin Leather Strap (Smooth Organic Profile, Zero Cartoon Dashes!)
  function createLuxuryLeatherStrap(matLeather, sideY) {
    const segW = 24;
    const segH = 36;
    const geo = new THREE.PlaneGeometry(1.88, 3.4, segW, segH);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i); // -0.94 .. +0.94
      const y = pos.getY(i); // -1.70 .. +1.70
      const yn = clamp((y + 1.70) / 3.4, 0, 1); // 0 (at lugs) -> 1 (far end)
      const xn = clamp(x / 0.94, -1, 1);         // -1 .. +1

      // Slight luxury strap taper from lug width toward buckle
      const taper = lerp(1.0, 0.88, yn);
      const finalX = x * taper;

      // Cushioned padded pillow dome across strap width + smooth ergonomic wrist curve receding in Z!
      const pillowZ = Math.cos(xn * Math.PI * 0.5) * 0.11;
      const wristCurveZ = -Math.pow(yn, 1.65) * 0.68;
      pos.setXYZ(i, finalX, y, pillowZ + wristCurveZ);
    }
    geo.computeVertexNormals();

    const mesh = new THREE.Mesh(geo, matLeather);
    mesh.position.set(0, sideY * 3.46, -0.20);
    if (sideY < 0) {
      mesh.rotation.z = Math.PI;
    }
    return mesh;
  }

  window.initAboutWatchCGI = function (canvasEl) {
    if (!canvasEl || typeof THREE === 'undefined') return null;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasEl,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.06;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x020203, 1);

    const maxAniso = renderer.capabilities && renderer.capabilities.getMaxAnisotropy
      ? Math.min(renderer.capabilities.getMaxAnisotropy(), 16)
      : 8;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020203);

    // Cool-Neutral Horology Studio HDRI Environment Map (Authentic 316L Brushed Stainless Steel!)
    const studioEnv = createHorologyStudioEnvMap(renderer);
    scene.environment = studioEnv;

    const camera = new THREE.PerspectiveCamera(31, window.innerWidth / window.innerHeight, 0.04, 50);
    camera.position.set(0, 0, 9.6);
    camera.lookAt(0, 0, 0);

    // Crisp Studio Horology Lighting
    const ambient = new THREE.AmbientLight(0x14161c, 0.36);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xf8fbff, 1.85);
    keyLight.position.set(-2.8, 3.8, 5.4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 14;
    keyLight.shadow.camera.left = -2.6;
    keyLight.shadow.camera.right = 2.6;
    keyLight.shadow.camera.top = 2.6;
    keyLight.shadow.camera.bottom = -2.6;
    keyLight.shadow.bias = -0.0004;
    keyLight.shadow.radius = 3.5;
    scene.add(keyLight);

    const rimRight = new THREE.DirectionalLight(0xe4eeff, 1.55);
    rimRight.position.set(5.4, 2.4, 2.8);
    scene.add(rimRight);

    const rimLeft = new THREE.DirectionalLight(0xdce6f5, 0.95);
    rimLeft.position.set(-5.2, -1.8, 2.2);
    scene.add(rimLeft);

    // Subtle warm macro accent only at bottom-left grazing angle (doesn't turn steel bronze!)
    const warmSubtleRim = new THREE.PointLight(0xff6a14, 1.05, 7.5);
    warmSubtleRim.position.set(-2.5, -2.6, 1.15);
    scene.add(warmSubtleRim);

    // Photorealistic PBR Materials
    const dialPebbleBump = createOrganicPebbleBump(512, 6.0, 52);
    const leatherPebbleBump = createOrganicPebbleBump(512, 4.5, 68);
    const brushedBump = createBrushedMetalBump(maxAniso);
    const calfskinTex = createCalfskinStrapTexture(maxAniso);

    const matSteelBrushed = new THREE.MeshStandardMaterial({
      color: 0xc8ced6,
      roughness: 0.25,
      metalness: 0.96,
      bumpMap: brushedBump,
      bumpScale: 0.0038,
      envMapIntensity: 1.55
    });

    const matSteelPolished = new THREE.MeshStandardMaterial({
      color: 0xe6ecf4,
      roughness: 0.07,
      metalness: 1.0,
      envMapIntensity: 1.85
    });

    const matBlackGlossMetal = new THREE.MeshStandardMaterial({
      color: 0x090a0d,
      roughness: 0.14,
      metalness: 0.92,
      envMapIntensity: 1.55
    });

    const matLeather = new THREE.MeshStandardMaterial({
      map: calfskinTex,
      bumpMap: leatherPebbleBump,
      bumpScale: 0.009,
      roughness: 0.86,
      metalness: 0.04,
      envMapIntensity: 0.35
    });

    const matOrangeLuminous = new THREE.MeshStandardMaterial({
      color: 0xff5208,
      emissive: 0x380c00,
      emissiveIntensity: 0.35,
      roughness: 0.26,
      metalness: 0.18,
      envMapIntensity: 1.05
    });

    const watchGroup = new THREE.Group();
    scene.add(watchGroup);

    // =========================================================================
    // 1. HIGH-POLY 316L STAINLESS STEEL CASE, MULTI-STEP BEZEL & INTEGRATED LUGS
    // =========================================================================
    const caseBody = new THREE.Mesh(new THREE.CylinderGeometry(2.04, 1.92, 0.42, 128), matSteelBrushed);
    caseBody.rotation.x = Math.PI / 2;
    caseBody.position.z = -0.26;
    watchGroup.add(caseBody);

    // 12-Point 160-Segment Multi-Chamfered Luxury Bezel
    const bezelPts = [
      new THREE.Vector2(1.855, 0.000),
      new THREE.Vector2(1.858, 0.105),
      new THREE.Vector2(1.872, 0.145),
      new THREE.Vector2(1.895, 0.175),
      new THREE.Vector2(1.930, 0.192),
      new THREE.Vector2(1.968, 0.192),
      new THREE.Vector2(2.005, 0.174),
      new THREE.Vector2(2.036, 0.135),
      new THREE.Vector2(2.058, 0.075),
      new THREE.Vector2(2.065, 0.000),
      new THREE.Vector2(2.055, -0.085),
      new THREE.Vector2(2.035, -0.165)
    ];
    const bezelGeo = new THREE.LatheGeometry(bezelPts, 160);
    bezelGeo.rotateX(Math.PI / 2);
    const bezelMesh = new THREE.Mesh(bezelGeo, matSteelPolished);
    watchGroup.add(bezelMesh);

    const brushedSlopePts = [
      new THREE.Vector2(1.915, 0.186),
      new THREE.Vector2(1.985, 0.186),
      new THREE.Vector2(2.032, 0.140)
    ];
    const brushedSlopeGeo = new THREE.LatheGeometry(brushedSlopePts, 160);
    brushedSlopeGeo.rotateX(Math.PI / 2);
    const brushedSlopeMesh = new THREE.Mesh(brushedSlopeGeo, matSteelBrushed);
    watchGroup.add(brushedSlopeMesh);

    const rehautPts = [
      new THREE.Vector2(1.856, 0.005),
      new THREE.Vector2(1.862, 0.075),
      new THREE.Vector2(1.870, 0.145)
    ];
    const rehautGeo = new THREE.LatheGeometry(rehautPts, 144);
    rehautGeo.rotateX(Math.PI / 2);
    const rehautMesh = new THREE.Mesh(rehautGeo, matBlackGlossMetal);
    watchGroup.add(rehautMesh);

    // 4 Sleek Integrated Curved Stainless Steel Lugs
    watchGroup.add(createSculptedLugMesh(matSteelBrushed, -1,  1));
    watchGroup.add(createSculptedLugMesh(matSteelBrushed,  1,  1));
    watchGroup.add(createSculptedLugMesh(matSteelBrushed, -1, -1));
    watchGroup.add(createSculptedLugMesh(matSteelBrushed,  1, -1));

    // Organic Curved Cushioned Matte-Black Calfskin Leather Straps
    watchGroup.add(createLuxuryLeatherStrap(matLeather,  1));
    watchGroup.add(createLuxuryLeatherStrap(matLeather, -1));

    // High-Poly 36-Flute Knurled Winding Crown at 3 o'clock
    const crownGroup = new THREE.Group();
    crownGroup.position.set(2.14, 0, -0.07);
    watchGroup.add(crownGroup);

    const crownTube = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.115, 0.22, 32), matSteelPolished);
    crownTube.rotation.z = Math.PI / 2;
    crownTube.position.x = -0.08;
    crownGroup.add(crownTube);

    const crownPts = [
      new THREE.Vector2(0.00, 0.22),
      new THREE.Vector2(0.21, 0.22),
      new THREE.Vector2(0.245, 0.19),
      new THREE.Vector2(0.245, -0.04),
      new THREE.Vector2(0.21, -0.07),
      new THREE.Vector2(0.11, -0.07)
    ];
    const crownBarrelGeo = new THREE.LatheGeometry(crownPts, 72);
    crownBarrelGeo.rotateZ(-Math.PI / 2);
    const crownBarrel = new THREE.Mesh(crownBarrelGeo, matSteelPolished);
    crownGroup.add(crownBarrel);

    const fluteGeo = new THREE.BoxGeometry(0.21, 0.018, 0.032);
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2;
      const flute = new THREE.Mesh(fluteGeo, matBlackGlossMetal);
      flute.position.set(0.075, Math.cos(a) * 0.246, Math.sin(a) * 0.246);
      flute.rotation.x = -a;
      crownGroup.add(flute);
    }

    // =========================================================================
    // 2. PURE MATTE-BLACK OBSIDIAN DIAL + 9 O'CLOCK STEPPER APERTURE
    // =========================================================================
    const dialTex = createWatchDialTexture(maxAniso);
    const dialMat = new THREE.MeshStandardMaterial({
      map: dialTex,
      bumpMap: dialPebbleBump,
      bumpScale: 0.0042,
      roughness: 0.88,
      metalness: 0.04,
      envMapIntensity: 0.22
    });
    const dialMesh = new THREE.Mesh(new THREE.CircleGeometry(1.86, 128), dialMat);
    dialMesh.position.z = 0.005;
    dialMesh.receiveShadow = true;
    watchGroup.add(dialMesh);

    const stepperCtrl = createStepperWindowController(maxAniso);
    const stepperPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(0.478, 0.268),
      new THREE.MeshBasicMaterial({ map: stepperCtrl.tex })
    );
    stepperPlane.position.set(-0.962, 0.0, 0.010);
    watchGroup.add(stepperPlane);

    const apOuter = new THREE.Shape();
    apOuter.moveTo(-0.262, -0.156);
    apOuter.lineTo(0.262, -0.156);
    apOuter.lineTo(0.262, 0.156);
    apOuter.lineTo(-0.262, 0.156);
    apOuter.closePath();
    const apHole = new THREE.Path();
    apHole.moveTo(-0.236, -0.132);
    apHole.lineTo(0.236, -0.132);
    apHole.lineTo(0.236, 0.132);
    apHole.lineTo(-0.236, 0.132);
    apHole.closePath();
    apOuter.holes.push(apHole);

    const apFrameGeo = new THREE.ExtrudeGeometry(apOuter, {
      depth: 0.016,
      bevelEnabled: true,
      bevelThickness: 0.006,
      bevelSize: 0.006,
      bevelSegments: 4
    });
    const apFrameMesh = new THREE.Mesh(apFrameGeo, matSteelBrushed);
    apFrameMesh.position.set(-0.962, 0.0, 0.006);
    watchGroup.add(apFrameMesh);

    // =========================================================================
    // 3. HIGH-POLY SCULPTED LUXURY HANDS + SOLID OBSIDIAN PINION HUB
    // =========================================================================
    const hourHandPivot = new THREE.Group();
    hourHandPivot.position.set(0, 0, 0.062);
    watchGroup.add(hourHandPivot);

    const hFrameShape = new THREE.Shape();
    hFrameShape.moveTo(0.0, -0.070);
    hFrameShape.lineTo(1.16, -0.066);
    hFrameShape.quadraticCurveTo(1.27, -0.044, 1.32, 0.0);
    hFrameShape.quadraticCurveTo(1.27, 0.044, 1.16, 0.066);
    hFrameShape.lineTo(0.0, 0.070);
    hFrameShape.closePath();

    const hFrameGeo = new THREE.ExtrudeGeometry(hFrameShape, {
      depth: 0.018,
      bevelEnabled: true,
      bevelThickness: 0.007,
      bevelSize: 0.007,
      bevelSegments: 5,
      curveSegments: 20
    });
    hFrameGeo.translate(0, 0, -0.009);
    const hFrameMesh = new THREE.Mesh(hFrameGeo, matBlackGlossMetal);
    hFrameMesh.castShadow = true;
    hourHandPivot.add(hFrameMesh);

    // Rebuild hour hand texture once webfont Archivo Black finishes loading so canvas always gets exact Bryson bold font!
    const hourInlayMat = new THREE.MeshStandardMaterial({
      map: createHourHandInlayTexture(maxAniso),
      emissive: 0x2e0b00,
      emissiveIntensity: 0.30,
      roughness: 0.28,
      metalness: 0.14,
      envMapIntensity: 0.95
    });
    const hourInlayGeo = new THREE.PlaneGeometry(1.16, 0.106);
    hourInlayGeo.translate(0.58, 0, 0.0175);
    const hourInlayMesh = new THREE.Mesh(hourInlayGeo, hourInlayMat);
    hourHandPivot.add(hourInlayMesh);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        const freshTex = createHourHandInlayTexture(maxAniso);
        if (hourInlayMat.map) hourInlayMat.map.dispose();
        hourInlayMat.map = freshTex;
        hourInlayMat.needsUpdate = true;
        stepperCtrl.update(clamp((currentWatchP - 0.16) / 0.18, 0, 1) + 0.0001);
        updateScene(currentWatchP, 0);
      }).catch(() => {});
    }

    const hTipShape = new THREE.Shape();
    hTipShape.moveTo(1.15, -0.053);
    hTipShape.quadraticCurveTo(1.24, -0.032, 1.28, 0.0);
    hTipShape.quadraticCurveTo(1.24, 0.032, 1.15, 0.053);
    hTipShape.closePath();
    const hTipMesh = new THREE.Mesh(new THREE.ShapeGeometry(hTipShape, 16), matOrangeLuminous);
    hTipMesh.position.z = 0.0176;
    hourHandPivot.add(hTipMesh);

    // Minute Hand (High-Poly Beveled Gloss-Black Baton)
    const minuteHandPivot = new THREE.Group();
    minuteHandPivot.position.set(0, 0, 0.098);
    watchGroup.add(minuteHandPivot);

    const mShape = new THREE.Shape();
    mShape.moveTo(-0.14, -0.030);
    mShape.lineTo(1.48, -0.024);
    mShape.lineTo(1.56, 0.0);
    mShape.lineTo(1.48, 0.024);
    mShape.lineTo(-0.14, 0.030);
    mShape.closePath();
    const mGeo = new THREE.ExtrudeGeometry(mShape, {
      depth: 0.014,
      bevelEnabled: true,
      bevelThickness: 0.005,
      bevelSize: 0.005,
      bevelSegments: 4
    });
    mGeo.translate(0, 0, -0.007);
    const minMesh = new THREE.Mesh(mGeo, matBlackGlossMetal);
    minMesh.castShadow = true;
    minuteHandPivot.add(minMesh);

    // Second Hand (Ultra-Sleek Orange Sweep Needle)
    const secondHandPivot = new THREE.Group();
    secondHandPivot.position.set(0, 0, 0.128);
    watchGroup.add(secondHandPivot);

    const secGeo = new THREE.BoxGeometry(1.88, 0.020, 0.010);
    secGeo.translate(0.72, 0, 0);
    const secMesh = new THREE.Mesh(secGeo, matOrangeLuminous);
    secMesh.castShadow = true;
    secondHandPivot.add(secMesh);

    // Solid Multi-Tiered Obsidian Pinion Hub (Outward Normals + Domed Orange Center Cabochon)
    const pinionPts = [
      new THREE.Vector2(0.192, -0.040),
      new THREE.Vector2(0.192, 0.000),
      new THREE.Vector2(0.185, 0.030),
      new THREE.Vector2(0.160, 0.048),
      new THREE.Vector2(0.110, 0.055),
      new THREE.Vector2(0.000, 0.055)
    ];
    const pinionGeo = new THREE.LatheGeometry(pinionPts, 64);
    pinionGeo.rotateX(Math.PI / 2);
    const pinionMesh = new THREE.Mesh(pinionGeo, matBlackGlossMetal);
    pinionMesh.position.z = 0.118;
    pinionMesh.castShadow = true;
    watchGroup.add(pinionMesh);

    const jewelDot = new THREE.Mesh(
      new THREE.SphereGeometry(0.072, 36, 20, 0, Math.PI * 2, 0, Math.PI * 0.5),
      matOrangeLuminous
    );
    jewelDot.rotation.x = Math.PI / 2;
    jewelDot.scale.set(1, 0.42, 1);
    jewelDot.position.z = 0.168;
    watchGroup.add(jewelDot);

    // =========================================================================
    // 4. SCROLL-DRIVEN CINEMATIC CAMERA & LIVE TICKING ENGINE
    // =========================================================================
    let currentWatchP = 0;
    let isSectionActive = false;
    let ambientTimeSec = 0;
    let lastNow = performance.now();

    function setHandClockRad(pivot, clockRad) {
      pivot.rotation.z = Math.PI / 2 - clockRad;
    }

    function dialXY(clockRad, radius) {
      return {
        x: Math.sin(clockRad) * radius,
        y: Math.cos(clockRad) * radius
      };
    }

    function updateScene(P, dtSec) {
      currentWatchP = clamp(P, 0, 1);
      ambientTimeSec += dtSec;

      const idleSecRad = (ambientTimeSec / 60) * Math.PI * 2;
      const idleMinRad = idleSecRad / 60;
      const idleHourRad = idleMinRad / 12;

      const baseHourRad = (1.5 / 12) * Math.PI * 2;
      const baseMinRad  = (2.1 / 12) * Math.PI * 2;
      const baseSecRad  = (7.5 / 12) * Math.PI * 2;

      const sweepP = easeInOutCubic(clamp((currentWatchP - 0.50) / 0.34, 0, 1));
      const hourSweepRad = sweepP * (10.5 / 12) * Math.PI * 2;
      const minSweepRad  = hourSweepRad * 5.0;
      const secSweepRad  = hourSweepRad * 20.0;

      const curHourRad = baseHourRad + hourSweepRad + idleHourRad;
      const curMinRad  = baseMinRad + minSweepRad + idleMinRad;
      const curSecRad  = baseSecRad + secSweepRad + idleSecRad;

      setHandClockRad(hourHandPivot, curHourRad);
      setHandClockRad(minuteHandPivot, curMinRad);
      setHandClockRad(secondHandPivot, curSecRad);

      const stepP = clamp((currentWatchP - 0.16) / 0.18, 0, 1);
      stepperCtrl.update(stepP);

      let camX = 0, camY = 0, camZ = 9.6;
      let lookX = 0, lookY = 0, lookZ = 0;
      let camRoll = 0;

      if (currentWatchP <= 0.12) {
        camX = 0; camY = 0; camZ = 9.6;
        lookX = 0; lookY = 0; lookZ = 0;
      } else if (currentWatchP <= 0.34) {
        // Zoom into 9 o'clock Stepper ("150 + / clients")
        const t = easeInOutCubic(clamp((currentWatchP - 0.12) / 0.16, 0, 1));
        camX = lerp(0, -1.06, t);
        camY = lerp(0, -0.02, t);
        camZ = lerp(9.6, 2.18, t);
        lookX = lerp(0, -0.94, t);
        lookY = lerp(0, 0.0, t);
        lookZ = lerp(0, 0.02, t);
      } else if (currentWatchP <= 0.50) {
        // Dramatic Low-Angle Diagonal Glide from 9:00 -> 1:30 Hour Hand ("25+ HAPPY CLIENTS")
        const t = easeInOutCubic(clamp((currentWatchP - 0.34) / 0.15, 0, 1));
        camX = lerp(-1.06, 0.42, t);
        camY = lerp(-0.02, -1.38, t);
        camZ = lerp(2.18, 1.38, t);
        lookX = lerp(-0.94, 0.48, t);
        lookY = lerp(0.0, 0.48, t);
        lookZ = lerp(0.02, 0.06, t);
        camRoll = lerp(0, -0.09, t);
      } else if (currentWatchP <= 0.70) {
        // Elevate smoothly to angled overhead macro tracking sweeping hour hand across 5:00 -> 7:00 ("Since May 2026")
        const t = easeInOutCubic(clamp((currentWatchP - 0.50) / 0.20, 0, 1));
        const tip = dialXY(curHourRad, 0.98);
        const trackCamX = tip.x * 0.72;
        const trackCamY = tip.y * 0.72 - 0.52;
        const trackCamZ = 2.48;
        camX = lerp(0.42, trackCamX, t);
        camY = lerp(-1.38, trackCamY, t);
        camZ = lerp(1.38, trackCamZ, t);
        lookX = lerp(0.48, tip.x * 0.88, t);
        lookY = lerp(0.48, tip.y * 0.88, t);
        lookZ = 0.04;
        camRoll = lerp(-0.09, 0.06, t);
      } else if (currentWatchP <= 0.84) {
        // Rotating Bottom-to-Top Ascent Following Needle from 7:00 -> 12:00
        const t = easeInOutCubic(clamp((currentWatchP - 0.70) / 0.14, 0, 1));
        const tip = dialXY(curHourRad, 0.96);
        const rotAngle = t * 0.45;
        const baseTrackX = tip.x * 0.72 * (1 - t * 0.82);
        const baseTrackY = (tip.y * 0.72 - 0.52) * (1 - t * 0.78) + t * 0.22;
        camX = baseTrackX + Math.sin(rotAngle) * 0.45 * (1 - t * 0.55);
        camY = baseTrackY;
        camZ = lerp(2.48, 6.2, t);
        lookX = lerp(tip.x * 0.88, 0.0, t);
        lookY = lerp(tip.y * 0.88, 0.08, t);
        lookZ = 0.02;
        camRoll = lerp(0.06, -0.05 * (1 - t), t);
      } else {
        // Past 12:00 (0.84 -> 0.94): Zoom ALL THE WAY OUT until the FULL BODY of the watch is visible again before next page pulls up!
        const t = easeInOutCubic(clamp((currentWatchP - 0.84) / 0.10, 0, 1));
        camX = lerp(0.16, 0, t);
        camY = lerp(0.22, 0.0, t);
        camZ = lerp(6.2, 9.6, t);
        lookX = 0;
        lookY = lerp(0.08, 0.0, t);
        lookZ = 0;
        camRoll = 0;
      }

      camera.position.set(camX, camY, camZ);
      camera.lookAt(lookX, lookY, lookZ);
      if (Math.abs(camRoll) > 0.0001) {
        camera.rotateZ(camRoll);
      }

      renderer.render(scene, camera);
    }

    function resize() {
      const w = canvasEl.clientWidth || window.innerWidth;
      const h = canvasEl.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      updateScene(currentWatchP, 0);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    function tickAmbient() {
      const now = performance.now();
      const dt = Math.min(0.05, (now - lastNow) / 1000);
      lastNow = now;
      if (isSectionActive) {
        updateScene(currentWatchP, dt);
      }
      requestAnimationFrame(tickAmbient);
    }
    requestAnimationFrame(tickAmbient);

    return {
      renderAtProgress: function (p, active) {
        isSectionActive = !!active;
        updateScene(p, 0);
      },
      resize
    };
  };
})();
