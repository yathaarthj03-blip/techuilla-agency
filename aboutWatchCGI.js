/* ============================================================================
   TECHUILLA AGENCY — HIGH-POLY PHOTOREALISTIC 3D CGI LUXURY WATCH ENGINE
   Studio HDRI Environment Reflections (PMREMGenerator), Soft Contact Shadows,
   High-Poly Chamfered Steel Case & Swept Beveled Lugs, Velvet Micro-Pebble Dial,
   Black-Beveled Luminous Orange Hour Hand ("25 + happy clients"),
   9 o'clock Recessed Mechanical Drum Stepper ("150 + / clients"),
   Curved Engraved "Since May 2026" Across 5:00 - 7:00, and Scroll Choreography.
   Strictly Non-Interactive (Zero Mouse / Orbit Reaction).
   ============================================================================ */
(function () {
  'use strict';

  function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  // 1. Procedural High-Contrast Luxury Horology Studio HDRI Environment Map
  //    (Dark Obsidian Studio + Crisp Overhead Softboxes + Warm Amber/Orange Rim Bounce Cards!)
  function createHorologyStudioEnvMap(renderer) {
    const W = 1024, H = 512;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const ctx = c.getContext('2d');

    // Deep pitch-black studio enclosure
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0.00, '#0a0b0e');
    bg.addColorStop(0.45, '#040406');
    bg.addColorStop(0.55, '#030304');
    bg.addColorStop(1.00, '#080605');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Crisp overhead white studio softbox strip (creates liquid-chrome highlight arcs on steel bezel!)
    const drawSoftbox = (x, y, w, h, color, blurPx) => {
      ctx.save();
      ctx.filter = `blur(${blurPx}px)`;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
      ctx.restore();
    };

    // Main cool-white top-left & top-right horology softboxes
    drawSoftbox(80, 42, 340, 72, 'rgba(255, 255, 255, 0.96)', 14);
    drawSoftbox(560, 56, 360, 58, 'rgba(232, 242, 255, 0.92)', 16);
    drawSoftbox(260, 148, 220, 26, 'rgba(255, 248, 240, 0.72)', 8);

    // Signature Warm Burnt-Orange / Amber Grazing Rim Cards (matches the glowing orange bezel reflections in reference!)
    drawSoftbox(24, 245, 290, 96, 'rgba(255, 118, 28, 0.95)', 24);
    drawSoftbox(690, 260, 280, 88, 'rgba(255, 134, 48, 0.85)', 24);
    drawSoftbox(380, 380, 260, 56, 'rgba(255, 168, 92, 0.55)', 18);

    // Razor-sharp specular accent filaments for brushed steel gleam
    drawSoftbox(140, 195, 740, 8, 'rgba(255, 255, 255, 0.88)', 3);
    drawSoftbox(110, 320, 220, 10, 'rgba(255, 145, 55, 0.92)', 4);

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

  // 2. Smooth Organic Micro-Pebble Matte Dial Bump Map (Zero White Dust Dots — Pure Fine Leather/Enamel Grain!)
  function createOrganicPebbleBump(size, repeatCount) {
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, size, size);

    // Layered soft organic micro-dimples for realistic macro dial light scattering
    for (let i = 0; i < 6500; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = 0.8 + Math.random() * 2.2;
      const v = 96 + Math.floor(Math.random() * 68);
      ctx.fillStyle = `rgba(${v},${v},${v},0.45)`;
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

  // 3. Ultra-Fine Brushed Stainless Steel Grain Bump Map
  function createBrushedMetalBump(maxAniso) {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 512, 512);
    for (let y = 0; y < 512; y++) {
      const v = clamp(Math.round(128 + (Math.random() - 0.5) * 32), 84, 172);
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

  // 4. 2048x2048 Velvet-Obsidian Luxury Dial Texture:
  //    - Deep Pitch-Black Matte Enamel (Zero White Noise Speckles!)
  //    - 60 Brushed Silver Outer Minute Indices
  //    - 12 Rich Embossed Burnt-Orange Serif Roman Numerals (XII..XI)
  //    - Curved Brushed-Silver Engraving "Since May 2026" Spanning 5:00 to 7:00 Above VI
  //    - Recessed Aperture Housing at 9 o'clock (IX)
  function createWatchDialTexture(maxAniso) {
    const S = 2048;
    const cx = S / 2;
    const cy = S / 2;
    const c = document.createElement('canvas');
    c.width = S;
    c.height = S;
    const ctx = c.getContext('2d');

    // Deep pitch-black velvet dial radial finish (matches reference macro obsidian!)
    const bg = ctx.createRadialGradient(cx, cy, 40, cx, cy, S * 0.5);
    bg.addColorStop(0.00, '#0a0a0c');
    bg.addColorStop(0.62, '#070709');
    bg.addColorStop(0.90, '#040406');
    bg.addColorStop(1.00, '#020203');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, S, S);

    // Subtle dark tonal concentric satin sheen (no white speckles!)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
    ctx.lineWidth = 1.5;
    for (let r = 120; r < 950; r += 9) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Outer 60 Crisp Metallic Silver Minute Ticks
    const tickOuterR = 972;
    for (let i = 0; i < 60; i++) {
      const ang = (i / 60) * Math.PI * 2 - Math.PI / 2;
      const isHour = (i % 5 === 0);
      const len = isHour ? 38 : 26;
      const w = isHour ? 8 : 3.4;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ang);
      // Drop shadow for 3D applied baton look
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(tickOuterR - len + 2, -w / 2 + 2, len, w);
      const tg = ctx.createLinearGradient(tickOuterR - len, -w / 2, tickOuterR, w / 2);
      tg.addColorStop(0, isHour ? '#E6EBF2' : '#B4BAC4');
      tg.addColorStop(0.5, isHour ? '#FFFFFF' : '#D2D8E0');
      tg.addColorStop(1, isHour ? '#8D95A2' : '#7A818D');
      ctx.fillStyle = tg;
      ctx.fillRect(tickOuterR - len, -w / 2, len, w);
      ctx.restore();
    }

    // 12 Applied 3D-Look Rich Burnt-Orange Roman Numerals (XII..XI)
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
      // Deep shadow under applied metallic numeral
      ctx.fillStyle = 'rgba(0, 0, 0, 0.88)';
      ctx.fillText(numerals[i], 4, -numR + 5);
      // Rich horology burnt-orange lacquer gradient
      const ng = ctx.createLinearGradient(-40, -numR - 50, 40, -numR + 50);
      ng.addColorStop(0.0, '#FF7B24');
      ng.addColorStop(0.45, '#F0560A');
      ng.addColorStop(1.0, '#C43A02');
      ctx.fillStyle = ng;
      ctx.fillText(numerals[i], 0, -numR);
      // Subtle top specular bevel catch
      ctx.strokeStyle = 'rgba(255, 196, 140, 0.35)';
      ctx.lineWidth = 1.4;
      ctx.strokeText(numerals[i], -0.5, -numR - 0.5);
      ctx.restore();
    }
    ctx.restore();

    // Curved Metallic Silver Engraving "Since May 2026" Spanning 5:00 to 7:00 Above VI (Exact Match to Reference!)
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
      ctx.fillStyle = 'rgba(0, 0, 0, 0.88)';
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

    // Deep Recessed Aperture Pocket Shadow at 9 o'clock (IX)
    const winX = cx - 530;
    const winY = cy;
    const winW = 264;
    const winH = 148;
    ctx.save();
    ctx.fillStyle = '#020203';
    ctx.fillRect(winX - winW / 2 - 10, winY - winH / 2 - 10, winW + 20, winH + 20);
    ctx.restore();

    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = maxAniso || 8;
    return tex;
  }

  // 5. High-Res Luminous Orange Inlay Texture for Hour Hand ("25 + happy clients" in crisp white serif!)
  function createHourHandInlayTexture(maxAniso) {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 256;
    const ctx = c.getContext('2d');

    // Deep saturated horology luminous orange lacquer
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0.00, '#FF6F1C');
    g.addColorStop(0.45, '#F25006');
    g.addColorStop(1.00, '#C83B00');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 1024, 256);

    // Crisp White Serif Engraving: "25 + happy clients"
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 68px "Playfair Display", Georgia, "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.36)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;
    ctx.fillText('25 + happy clients', 620, 130);
    ctx.restore();

    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = maxAniso || 8;
    return tex;
  }

  // 6. Dynamic Mechanical Roller Stepper Controller for 9 o'clock Window ("150 +" & "clients")
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

      // Deep brushed obsidian mechanical drum chamber
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0.00, '#020203');
      bg.addColorStop(0.18, '#0f1014');
      bg.addColorStop(0.50, '#14161b');
      bg.addColorStop(0.82, '#0f1014');
      bg.addColorStop(1.00, '#020203');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Crisp horizontal metallic divider
      ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.fillRect(22, H * 0.53, W - 44, 2.5);

      // TOP ROW: Mechanical rotating odometer rolling 0 -> 150 +
      const numP = easeOutCubic(clamp(p / 0.72, 0, 1));
      const floatVal = numP * 150;
      const tens = floatVal / 10;
      const ones = floatVal;

      const topFont = '600 84px "Space Grotesk", "Inter", monospace';
      const topY = H * 0.29;
      const topCharH = 92;

      const d0CurStr = floatVal >= 100 ? '1' : ' ';
      const d0NextStr = floatVal >= 99 ? '1' : ' ';
      const d0ShowFrac = floatVal >= 99 && floatVal < 100 ? (floatVal - 99) : 0;

      const d1 = Math.floor(tens) % 10;
      const d1Next = (d1 + 1) % 10;
      const d1Frac = (ones % 10) > 9 ? (ones % 10) - 9 : 0;

      const d2 = Math.floor(ones) % 10;
      const d2Next = (d2 + 1) % 10;
      const d2Frac = ones - Math.floor(ones);

      drawDrumChar(118, topY, topCharH, d0CurStr, d0NextStr, d0ShowFrac, '#E6EAF0', topFont);
      drawDrumChar(182, topY, topCharH, floatVal >= 10 ? String(d1) : ' ', String(d1Next), d1Frac, '#E6EAF0', topFont);
      drawDrumChar(246, topY, topCharH, String(d2), String(d2Next), d2Frac, '#E6EAF0', topFont);

      ctx.save();
      ctx.font = '500 76px "Space Grotesk", "Inter", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = `rgba(230, 234, 240, ${clamp(p * 3.5, 0.25, 0.96).toFixed(2)})`;
      ctx.fillText('+', 342, topY + 2);
      ctx.restore();

      // BOTTOM ROW: Mechanical letter drums rolling sequentially c -> l -> i -> e -> n -> t -> s
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

      // Cylindrical mechanical roller top & bottom shadow vignette
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

  // Helper: Sculpted Tapered Curved Watch Lug (High-Poly Beveled ExtrudeGeometry!)
  function createSculptedLugMesh(mat, sideX, sideY) {
    const shape = new THREE.Shape();
    shape.moveTo(-0.22, 0.0);
    shape.quadraticCurveTo(-0.20, 0.56, -0.10, 1.06);
    shape.quadraticCurveTo(0.0, 1.14, 0.11, 1.05);
    shape.quadraticCurveTo(0.20, 0.52, 0.24, 0.0);
    shape.closePath();

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.24,
      bevelEnabled: true,
      bevelThickness: 0.042,
      bevelSize: 0.032,
      bevelSegments: 7,
      curveSegments: 24
    });
    geo.translate(0, 0, -0.12);

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(sideX * 1.05, sideY * 1.56, -0.16);
    mesh.scale.set(sideX, sideY, 1);
    mesh.rotation.z = sideX * sideY * -0.10;
    mesh.rotation.x = sideY * 0.14; // Ergonomic downward wrist curve!
    return mesh;
  }

  // Helper: Cushioned Padded Luxury Matte-Black Leather Strap with Stitched Bevel
  function createLuxuryLeatherStrap(matLeather, matStitch, sideY) {
    const group = new THREE.Group();
    const shape = new THREE.Shape();
    shape.moveTo(-0.92, 0);
    shape.lineTo(-0.84, 3.2);
    shape.lineTo(0.84, 3.2);
    shape.lineTo(0.92, 0);
    shape.closePath();

    const strapGeo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.16,
      bevelEnabled: true,
      bevelThickness: 0.055,
      bevelSize: 0.045,
      bevelSegments: 8,
      curveSegments: 16
    });
    strapGeo.translate(0, 0, -0.08);
    const strapMesh = new THREE.Mesh(strapGeo, matLeather);
    group.add(strapMesh);

    // Subtle matte black side stitching accents
    const stitchGeo = new THREE.BoxGeometry(0.022, 0.09, 0.015);
    for (let i = 0; i < 16; i++) {
      const y = 0.24 + i * 0.18;
      const xOff = lerp(0.81, 0.74, i / 16);
      [-1, 1].forEach(sx => {
        const st = new THREE.Mesh(stitchGeo, matStitch);
        st.position.set(sx * xOff, y, 0.132);
        group.add(st);
      });
    }

    group.position.set(0, sideY * 1.88, -0.22);
    group.scale.set(1, sideY, 1);
    group.rotation.x = sideY * 0.12;
    return group;
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
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x020203, 1);

    const maxAniso = renderer.capabilities && renderer.capabilities.getMaxAnisotropy
      ? Math.min(renderer.capabilities.getMaxAnisotropy(), 16)
      : 8;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020203);

    // Photorealistic Horology Studio HDRI Environment Map (gives real liquid-chrome & amber metal reflections!)
    const studioEnv = createHorologyStudioEnvMap(renderer);
    scene.environment = studioEnv;

    const camera = new THREE.PerspectiveCamera(31, window.innerWidth / window.innerHeight, 0.04, 50);
    camera.position.set(0, 0, 9.4);
    camera.lookAt(0, 0, 0);

    // Dramatic Shadow-Casting Horology Studio Lighting
    const ambient = new THREE.AmbientLight(0x161820, 0.42);
    scene.add(ambient);

    // Main Overhead Shadow-Casting Key Light (casts crisp soft contact shadows of watch hands onto matte dial!)
    const keyLight = new THREE.DirectionalLight(0xfffaf2, 1.85);
    keyLight.position.set(-2.6, 3.8, 5.2);
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

    // Cool Rim Light Sculpting Right Bezel & Knurled Crown
    const rimRight = new THREE.DirectionalLight(0xd4e6ff, 1.35);
    rimRight.position.set(5.4, 2.2, 2.8);
    scene.add(rimRight);

    // Warm Burnt-Orange Grazing Rim Light (Reproduces the gorgeous glowing orange reflection along bottom-left bezel in reference!)
    const warmOrangeRim = new THREE.PointLight(0xff5e00, 3.2, 10);
    warmOrangeRim.position.set(-2.65, -2.55, 1.35);
    scene.add(warmOrangeRim);

    const warmRightBounce = new THREE.PointLight(0xff9848, 1.65, 9);
    warmRightBounce.position.set(2.95, -1.75, 1.45);
    scene.add(warmRightBounce);

    // High-Res Procedural PBR Materials
    const dialPebbleBump = createOrganicPebbleBump(512, 5.5);
    const leatherPebbleBump = createOrganicPebbleBump(256, 3.0);
    const brushedBump = createBrushedMetalBump(maxAniso);

    const matSteelBrushed = new THREE.MeshStandardMaterial({
      color: 0xb8bec8,
      roughness: 0.24,
      metalness: 0.96,
      bumpMap: brushedBump,
      bumpScale: 0.004,
      envMapIntensity: 1.55
    });

    const matSteelPolished = new THREE.MeshStandardMaterial({
      color: 0xdce2eb,
      roughness: 0.08,
      metalness: 1.0,
      envMapIntensity: 1.85
    });

    const matBlackGlossMetal = new THREE.MeshStandardMaterial({
      color: 0x0b0c0f,
      roughness: 0.14,
      metalness: 0.92,
      envMapIntensity: 1.65
    });

    const matLeather = new THREE.MeshStandardMaterial({
      color: 0x0b0c0e,
      roughness: 0.82,
      metalness: 0.06,
      bumpMap: leatherPebbleBump,
      bumpScale: 0.010,
      envMapIntensity: 0.45
    });

    const matStitch = new THREE.MeshStandardMaterial({
      color: 0x1c1e22,
      roughness: 0.65,
      metalness: 0.12
    });

    const matOrangeLuminous = new THREE.MeshStandardMaterial({
      color: 0xff5208,
      emissive: 0x3a0e00,
      emissiveIntensity: 0.35,
      roughness: 0.26,
      metalness: 0.22,
      envMapIntensity: 1.15
    });

    const watchGroup = new THREE.Group();
    scene.add(watchGroup);

    // =========================================================================
    // 1. HIGH-POLY SCULPTED STAINLESS STEEL CASE, MULTI-STEP BEZEL & SWEPT LUGS
    // =========================================================================
    // Recessed Caseback Body (Cleanly behind dial at z = +0.005!)
    const caseBody = new THREE.Mesh(new THREE.CylinderGeometry(2.04, 1.94, 0.42, 128), matSteelBrushed);
    caseBody.rotation.x = Math.PI / 2;
    caseBody.position.z = -0.26;
    watchGroup.add(caseBody);

    // 14-Point High-Poly Multi-Chamfered Luxury Bezel (160 Radial Segments — Mirror Polished Lip + Brushed Slope!)
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

    // Brushed Metallic Mid-Bezel Accent Collar (Creates dual polished/brushed horology contrast!)
    const brushedSlopePts = [
      new THREE.Vector2(1.915, 0.186),
      new THREE.Vector2(1.985, 0.186),
      new THREE.Vector2(2.032, 0.140)
    ];
    const brushedSlopeGeo = new THREE.LatheGeometry(brushedSlopePts, 160);
    brushedSlopeGeo.rotateX(Math.PI / 2);
    const brushedSlopeMesh = new THREE.Mesh(brushedSlopeGeo, matSteelBrushed);
    watchGroup.add(brushedSlopeMesh);

    // Inner Polished Mirror Rehaut (Reflects the orange Roman numerals & hands cleanly around the dial rim!)
    const rehautPts = [
      new THREE.Vector2(1.856, 0.005),
      new THREE.Vector2(1.862, 0.075),
      new THREE.Vector2(1.870, 0.145)
    ];
    const rehautGeo = new THREE.LatheGeometry(rehautPts, 144);
    rehautGeo.rotateX(Math.PI / 2);
    const rehautMesh = new THREE.Mesh(rehautGeo, matBlackGlossMetal);
    watchGroup.add(rehautMesh);

    // 4 High-Poly Sculpted Curved Tapered Lugs
    watchGroup.add(createSculptedLugMesh(matSteelBrushed, -1,  1));
    watchGroup.add(createSculptedLugMesh(matSteelBrushed,  1,  1));
    watchGroup.add(createSculptedLugMesh(matSteelBrushed, -1, -1));
    watchGroup.add(createSculptedLugMesh(matSteelBrushed,  1, -1));

    // Curved Cushioned Matte-Black Luxury Leather Straps (Top & Bottom)
    watchGroup.add(createLuxuryLeatherStrap(matLeather, matStitch,  1));
    watchGroup.add(createLuxuryLeatherStrap(matLeather, matStitch, -1));

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

    // 36 Crisp Beveled Crown Flutes
    const fluteGeo = new THREE.BoxGeometry(0.21, 0.018, 0.032);
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2;
      const flute = new THREE.Mesh(fluteGeo, matBlackGlossMetal);
      flute.position.set(0.075, Math.cos(a) * 0.246, Math.sin(a) * 0.246);
      flute.rotation.x = -a;
      crownGroup.add(flute);
    }

    // =========================================================================
    // 2. VELVET MICRO-PEBBLE MATTE-BLACK DIAL + 9 O'CLOCK STEPPER APERTURE
    // =========================================================================
    const dialTex = createWatchDialTexture(maxAniso);
    const dialMat = new THREE.MeshStandardMaterial({
      map: dialTex,
      bumpMap: dialPebbleBump,
      bumpScale: 0.0055,
      roughness: 0.72,
      metalness: 0.08,
      envMapIntensity: 0.55
    });
    const dialMesh = new THREE.Mesh(new THREE.CircleGeometry(1.86, 128), dialMat);
    dialMesh.position.z = 0.005;
    dialMesh.receiveShadow = true;
    watchGroup.add(dialMesh);

    // Live Mechanical Stepper Window at 9 o'clock (IX) — "150 +" / "clients"
    const stepperCtrl = createStepperWindowController(maxAniso);
    const stepperPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(0.478, 0.268),
      new THREE.MeshBasicMaterial({ map: stepperCtrl.tex })
    );
    stepperPlane.position.set(-0.962, 0.0, 0.010);
    watchGroup.add(stepperPlane);

    // Sculpted Chamfered Metallic Frame Around the 9 o'clock Aperture
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
    // 3. HIGH-POLY SCULPTED LUXURY HANDS (WITH BLACK-BEVELED FRAME & SHADOWS!)
    // =========================================================================
    // A. HOUR HAND (Glossy Black-Anodized Beveled Outer Housing + Luminous Orange Inlay with "25 + happy clients"!)
    const hourHandPivot = new THREE.Group();
    hourHandPivot.position.set(0, 0, 0.062);
    watchGroup.add(hourHandPivot);

    // Outer Glossy Black-Beveled Sword Frame (matches the black rim around the orange hand in reference!)
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

    // Recessed Luminous Burnt-Orange Blade Inlay ("25 + happy clients" in crisp white serif!)
    const hourTopTex = createHourHandInlayTexture(maxAniso);
    const hourInlayMat = new THREE.MeshStandardMaterial({
      map: hourTopTex,
      emissive: 0x2e0b00,
      emissiveIntensity: 0.30,
      roughness: 0.28,
      metalness: 0.16,
      envMapIntensity: 1.0
    });
    const hourInlayGeo = new THREE.PlaneGeometry(1.16, 0.106);
    hourInlayGeo.translate(0.58, 0, 0.0175);
    const hourInlayMesh = new THREE.Mesh(hourInlayGeo, hourInlayMat);
    hourHandPivot.add(hourInlayMesh);

    // Matching Orange Tapered Tip Cap inside Black Bevel
    const hTipShape = new THREE.Shape();
    hTipShape.moveTo(1.15, -0.053);
    hTipShape.quadraticCurveTo(1.24, -0.032, 1.28, 0.0);
    hTipShape.quadraticCurveTo(1.24, 0.032, 1.15, 0.053);
    hTipShape.closePath();
    const hTipMesh = new THREE.Mesh(new THREE.ShapeGeometry(hTipShape, 16), matOrangeLuminous);
    hTipMesh.position.z = 0.0176;
    hourHandPivot.add(hTipMesh);

    // B. MINUTE HAND (High-Poly Beveled Gloss-Black Baton Hand)
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

    // C. SECOND HAND (Ultra-Sleek Vibrant Orange Sweep Needle with Sculpted Counterbalance)
    const secondHandPivot = new THREE.Group();
    secondHandPivot.position.set(0, 0, 0.128);
    watchGroup.add(secondHandPivot);

    const secGeo = new THREE.BoxGeometry(1.88, 0.020, 0.010);
    secGeo.translate(0.72, 0, 0);
    const secMesh = new THREE.Mesh(secGeo, matOrangeLuminous);
    secMesh.castShadow = true;
    secondHandPivot.add(secMesh);

    // D. HIGH-POLY MULTI-TIERED CENTRAL PINION HUB (Outward Normals: Bottom-to-Top Profile + Domed Orange Cabochon!)
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

    // Domed Luminous Orange Center Jewel Dot
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

      // Ambient continuous live ticking (never stops even at 12:00!)
      const idleSecRad = (ambientTimeSec / 60) * Math.PI * 2;
      const idleMinRad = idleSecRad / 60;
      const idleHourRad = idleMinRad / 12;

      // Initial Pose: Hour at 1:30, Minute at ~2:05, Second sweeping from 7:30
      const baseHourRad = (1.5 / 12) * Math.PI * 2;
      const baseMinRad  = (2.1 / 12) * Math.PI * 2;
      const baseSecRad  = (7.5 / 12) * Math.PI * 2;

      // Scroll-Driven Sweep Phase (0.50 -> 0.86): Hour sweeps 1:30 -> 5:00 -> 7:00 -> 12:00
      // Logical gear ratios: Minute moves faster than Hour, Second moves faster than Minute!
      const sweepP = easeInOutCubic(clamp((currentWatchP - 0.50) / 0.36, 0, 1));
      const hourSweepRad = sweepP * (10.5 / 12) * Math.PI * 2;
      const minSweepRad  = hourSweepRad * 5.0;
      const secSweepRad  = hourSweepRad * 20.0;

      const curHourRad = baseHourRad + hourSweepRad + idleHourRad;
      const curMinRad  = baseMinRad + minSweepRad + idleMinRad;
      const curSecRad  = baseSecRad + secSweepRad + idleSecRad;

      setHandClockRad(hourHandPivot, curHourRad);
      setHandClockRad(minuteHandPivot, curMinRad);
      setHandClockRad(secondHandPivot, curSecRad);

      // Update 9 o'clock Mechanical Stepper Window ("150 +" & "clients")
      const stepP = clamp((currentWatchP - 0.16) / 0.18, 0, 1);
      stepperCtrl.update(stepP);

      // Scroll-Driven Cinematic Camera Choreography
      let camX = 0, camY = 0, camZ = 9.4;
      let lookX = 0, lookY = 0, lookZ = 0;
      let camRoll = 0;

      if (currentWatchP <= 0.12) {
        camX = 0; camY = 0; camZ = 9.4;
        lookX = 0; lookY = 0; lookZ = 0;
      } else if (currentWatchP <= 0.34) {
        // Zoom directly into 9 o'clock Stepper Aperture ("150 + / clients")
        const t = easeInOutCubic(clamp((currentWatchP - 0.12) / 0.16, 0, 1));
        camX = lerp(0, -1.06, t);
        camY = lerp(0, -0.02, t);
        camZ = lerp(9.4, 2.18, t);
        lookX = lerp(0, -0.94, t);
        lookY = lerp(0, 0.0, t);
        lookZ = lerp(0, 0.02, t);
      } else if (currentWatchP <= 0.52) {
        // Dramatic Low-Angle Diagonal Glide from 9:00 -> 1:30 Hour Hand ("25 + happy clients")
        const t = easeInOutCubic(clamp((currentWatchP - 0.34) / 0.16, 0, 1));
        camX = lerp(-1.06, 0.42, t);
        camY = lerp(-0.02, -1.38, t);
        camZ = lerp(2.18, 1.38, t);
        lookX = lerp(-0.94, 0.48, t);
        lookY = lerp(0.0, 0.48, t);
        lookZ = lerp(0.02, 0.06, t);
        camRoll = lerp(0, -0.09, t);
      } else if (currentWatchP <= 0.72) {
        // Elevate smoothly to angled overhead macro tracking sweeping hour hand across 5:00 -> 7:00 ("Since May 2026")
        const t = easeInOutCubic(clamp((currentWatchP - 0.52) / 0.20, 0, 1));
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
      } else if (currentWatchP <= 0.88) {
        // Rotating Bottom-to-Top Ascent Following Needle from 7:00 -> 12:00
        const t = easeInOutCubic(clamp((currentWatchP - 0.72) / 0.16, 0, 1));
        const tip = dialXY(curHourRad, 0.96);
        const rotAngle = t * 0.48;
        const baseTrackX = tip.x * 0.72 * (1 - t * 0.75);
        const baseTrackY = (tip.y * 0.72 - 0.52) * (1 - t * 0.65) + t * 0.65;
        camX = baseTrackX + Math.sin(rotAngle) * 0.55 * (1 - t * 0.4);
        camY = baseTrackY;
        camZ = lerp(2.48, 6.25, t);
        lookX = lerp(tip.x * 0.88, 0.0, t);
        lookY = lerp(tip.y * 0.88, 0.28, t);
        lookZ = 0.02;
        camRoll = lerp(0.06, -0.08 * (1 - t), t);
      } else {
        // Past 12:00: Stop following needle (hands keep running!), gently lift camera upward
        const t = easeInOutCubic(clamp((currentWatchP - 0.88) / 0.12, 0, 1));
        camX = lerp(0.18, 0, t);
        camY = lerp(0.58, 1.45, t);
        camZ = lerp(6.25, 7.6, t);
        lookX = 0;
        lookY = lerp(0.28, 0.95, t);
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
