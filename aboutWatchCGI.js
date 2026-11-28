/* ============================================================================
   TECHUILLA AGENCY — HIGH-DETAIL 3D CGI LUXURY WATCH ENGINE (OUR TRACK RECORD)
   Built with Three.js PBR Materials, Micro-Grain Matte Dial, Orange Roman Numerals,
   Live Mechanical Roller Stepper Window at 9 o'clock ("150 + / clients"),
   Engraved Orange Hour Hand at 1:30 ("25 + happy clients"),
   Curved Dial Engraving ("Since May 2026" across 5:00 - 7:00),
   Logical Gear-Ratio Sweeping Hands, and Scroll-Driven Cinematic Camera Choreography.
   Strictly Non-Interactive (Zero Mouse / Orbit Reaction).
   ============================================================================ */
(function () {
  'use strict';

  function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  // 1. Matte Sandblasted Micro-Grain Bump Map (for Dial & Leather Strap)
  function createMicroGrainBump(size, density, contrast) {
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, size, size);
    const img = ctx.getImageData(0, 0, size, size);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() - 0.5) * contrast;
      const v = clamp(Math.round(128 + n), 0, 255);
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(density, density);
    return tex;
  }

  // 2. Brushed Steel Radial / Linear Texture for Bezel & Lugs
  function createBrushedMetalBump() {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 512, 512);
    for (let y = 0; y < 512; y++) {
      const v = clamp(Math.round(128 + (Math.random() - 0.5) * 44), 60, 195);
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.fillRect(0, y, 512, 1);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 4);
    return tex;
  }

  // 3. 2048x2048 Ultra-Crisp Luxury Watch Dial Texture:
  //    - Deep Matte Obsidian Dial with Micro-Grain
  //    - 60 Silver-Grey Outer Minute Ticks (Heavier 5-Minute Ticks)
  //    - 12 Vibrant Orange Serif Roman Numerals (XII..XI) Radially Oriented
  //    - Recessed Aperture Frame at 9 o'clock (IX) for the Mechanical Stepper
  //    - Curved Metallic Silver Engraving "Since May 2026" Spanning 5:00 to 7:00 Above VI!
  function createWatchDialTexture(maxAniso) {
    const S = 2048;
    const cx = S / 2;
    const cy = S / 2;
    const c = document.createElement('canvas');
    c.width = S;
    c.height = S;
    const ctx = c.getContext('2d');

    // Deep matte-black obsidian dial radial finish
    const bg = ctx.createRadialGradient(cx, cy, 40, cx, cy, S * 0.5);
    bg.addColorStop(0.0, '#121214');
    bg.addColorStop(0.65, '#0d0d0f');
    bg.addColorStop(0.92, '#08080a');
    bg.addColorStop(1.0, '#040406');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, S, S);

    // Subtle micro-grain matte dial texture
    ctx.save();
    ctx.globalAlpha = 0.045;
    for (let i = 0; i < 18000; i++) {
      const gx = Math.random() * S;
      const gy = Math.random() * S;
      const v = Math.random() > 0.5 ? 255 : 0;
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.fillRect(gx, gy, 2, 2);
    }
    ctx.restore();

    // Outer 60 Minute Tick Ring (Crisp Metallic Silver-Grey)
    const tickOuterR = 968;
    for (let i = 0; i < 60; i++) {
      const ang = (i / 60) * Math.PI * 2 - Math.PI / 2;
      const isHour = (i % 5 === 0);
      const len = isHour ? 34 : 24;
      const w = isHour ? 7 : 3.2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ang);
      ctx.fillStyle = isHour ? 'rgba(218, 222, 228, 0.85)' : 'rgba(182, 188, 196, 0.56)';
      ctx.fillRect(tickOuterR - len, -w / 2, len, w);
      ctx.restore();
    }

    // 12 Orange Serif Roman Numerals (Radially Oriented around the Dial, matching Reference!)
    const numerals = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
    const numR = 824;
    ctx.save();
    ctx.font = '700 118px "Playfair Display", Georgia, "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < 12; i++) {
      const ang = (i / 12) * Math.PI * 2; // 0 = 12 o'clock (top)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ang);
      // Subtle engraved bevel drop shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.fillText(numerals[i], 3, -numR + 4);
      // Rich horology burnt-orange metallic fill
      ctx.fillStyle = '#E85A14';
      ctx.fillText(numerals[i], 0, -numR);
      ctx.restore();
    }
    ctx.restore();

    // Curved Engraved Text "Since May 2026" spanning 5:00 to 7:00 right above VI (Matching Reference Image 4!)
    const arcText = 'Since May 2026';
    const arcR = 678;
    const totalArcSpan = 0.94; // ~54 degrees centered cleanly at 6 o'clock (5:00 to 7:00!)
    const startA = Math.PI / 2 + totalArcSpan / 2; // Left of 6:00 (near 7:00) reading left-to-right toward 5:00!
    ctx.save();
    ctx.font = '500 72px "Playfair Display", Georgia, "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const stepA = totalArcSpan / (arcText.length - 1);
    for (let i = 0; i < arcText.length; i++) {
      const a = startA - i * stepA; // Sweeps counter-clockwise along bottom arc from 7:00 -> 6:00 -> 5:00 so it reads left-to-right!
      const x = cx + Math.cos(a) * arcR;
      const y = cy + Math.sin(a) * arcR;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(a - Math.PI / 2);
      // Subtle engraved shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.72)';
      ctx.fillText(arcText[i], 2, 3);
      // Brushed silver-metallic engraving
      ctx.fillStyle = 'rgba(214, 218, 224, 0.88)';
      ctx.fillText(arcText[i], 0, 0);
      ctx.restore();
    }
    ctx.restore();

    // Recessed Dark Aperture Housing Border at 9 o'clock (just inside IX!)
    const winX = cx - 530;
    const winY = cy;
    const winW = 264;
    const winH = 148;
    ctx.save();
    ctx.fillStyle = '#050507';
    ctx.fillRect(winX - winW / 2 - 8, winY - winH / 2 - 8, winW + 16, winH + 16);
    ctx.strokeStyle = 'rgba(210, 214, 220, 0.34)';
    ctx.lineWidth = 4;
    ctx.strokeRect(winX - winW / 2 - 6, winY - winH / 2 - 6, winW + 12, winH + 12);
    ctx.restore();

    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = maxAniso || 8;
    return tex;
  }

  // 4. High-Res Texture for Thick Orange Hour Hand ("25 + happy clients" in crisp white serif!)
  function createHourHandTexture(maxAniso) {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 256;
    const ctx = c.getContext('2d');

    // Rich satin anodized orange metal fill
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0.0, '#FF7626');
    g.addColorStop(0.5, '#F25B0C');
    g.addColorStop(1.0, '#D64804');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 1024, 256);

    // Crisp White Serif Engraving: "25 + happy clients" (Centered cleanly on unobstructed outer blade!)
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 66px "Playfair Display", Georgia, "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.34)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;
    ctx.fillText('25 + happy clients', 638, 130);
    ctx.restore();

    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = maxAniso || 8;
    return tex;
  }

  // 5. Dynamic Mechanical Drum Stepper Renderer for the 9 o'clock Window ("150 +" & "clients")
  //    - Top row: Odometer-style vertical rotating drums rolling 000 -> 150 +
  //    - Bottom row: Mechanical letter drums rolling through random letters -> c l i e n t s sequentially!
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

      // Deep recessed brushed mechanical chamber background
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0.00, '#040406');
      bg.addColorStop(0.18, '#131418');
      bg.addColorStop(0.50, '#18191e');
      bg.addColorStop(0.82, '#131418');
      bg.addColorStop(1.00, '#040406');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Horizontal metallic divider bar between "150 +" and "clients" (Matching Reference Image 2!)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.fillRect(22, H * 0.53, W - 44, 2.5);

      // TOP ROW: Mechanical rotating odometer rolling smoothly 0 -> 150
      const numP = easeOutCubic(clamp(p / 0.72, 0, 1));
      const floatVal = numP * 150;
      const hundreds = floatVal / 100;
      const tens = floatVal / 10;
      const ones = floatVal;

      const topFont = '600 84px "Space Grotesk", "Inter", monospace';
      const topY = H * 0.29;
      const topCharH = 92;

      const d0 = Math.floor(hundreds) % 10;
      const d0Next = (d0 + 1) % 10;
      const d0Frac = hundreds - Math.floor(hundreds);
      // Only show leading digit once >= 100 or during transition 99->100
      const d0CurStr = floatVal >= 100 ? String(d0) : (floatVal >= 99 ? ' ' : ' ');
      const d0NextStr = floatVal >= 99 ? '1' : ' ';
      const d0ShowFrac = floatVal >= 99 && floatVal < 100 ? (floatVal - 99) : 0;

      const d1 = Math.floor(tens) % 10;
      const d1Next = (d1 + 1) % 10;
      const d1Frac = (ones % 10) > 9 ? (ones % 10) - 9 : 0;

      const d2 = Math.floor(ones) % 10;
      const d2Next = (d2 + 1) % 10;
      const d2Frac = ones - Math.floor(ones);

      drawDrumChar(118, topY, topCharH, floatVal >= 100 ? '1' : d0CurStr, d0NextStr, d0ShowFrac, '#E2E6EC', topFont);
      drawDrumChar(182, topY, topCharH, floatVal >= 10 ? String(d1) : ' ', String(d1Next), d1Frac, '#E2E6EC', topFont);
      drawDrumChar(246, topY, topCharH, String(d2), String(d2Next), d2Frac, '#E2E6EC', topFont);

      // Plus symbol "+" fading/locking in cleanly
      ctx.save();
      ctx.font = '500 76px "Space Grotesk", "Inter", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = `rgba(226, 230, 236, ${clamp(p * 3.5, 0.25, 0.96).toFixed(2)})`;
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
        // Sequential stagger: first 'c' locks, then 'l', then 'i', ..., 's'
        const lockStart = 0.06 + i * 0.085;
        const lockEnd = lockStart + 0.32;
        const lp = clamp((p - lockStart) / (lockEnd - lockStart), 0, 1);

        const cx = startX + i * spacing;
        if (lp <= 0.001) {
          // Idle pre-roll dim character
          const idleChar = ALPHABET[(targetIdx + 9 + i * 3) % 26];
          drawDrumChar(cx, botY, botCharH, idleChar, idleChar, 0, 'rgba(185, 192, 202, 0.35)', botFont);
        } else if (lp >= 0.999) {
          drawDrumChar(cx, botY, botCharH, targetChar, targetChar, 0, '#D8DCE2', botFont);
        } else {
          // Roll through 6 mechanical letter steps and land cleanly on targetChar!
          const totalSteps = 6;
          const pos = easeOutCubic(lp) * totalSteps;
          const stepIdx = Math.floor(pos);
          const frac = pos - stepIdx;
          const stepsRemaining = totalSteps - stepIdx;
          const curIdx = (targetIdx - stepsRemaining + 26 * 4) % 26;
          const nxtIdx = (curIdx + 1) % 26;
          drawDrumChar(cx, botY, botCharH, ALPHABET[curIdx], ALPHABET[nxtIdx], frac, '#D8DCE2', botFont);
        }
      }

      // Top & bottom cylindrical drum shadow vignette (gives real 3D mechanical roller depth!)
      const vigTop = ctx.createLinearGradient(0, 0, 0, 48);
      vigTop.addColorStop(0, 'rgba(0,0,0,0.85)');
      vigTop.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = vigTop;
      ctx.fillRect(0, 0, W, 48);

      const vigBot = ctx.createLinearGradient(0, H - 48, 0, H);
      vigBot.addColorStop(0, 'rgba(0,0,0,0)');
      vigBot.addColorStop(1, 'rgba(0,0,0,0.85)');
      ctx.fillStyle = vigBot;
      ctx.fillRect(0, H - 48, W, 48);

      tex.needsUpdate = true;
    }

    update(0);
    return { tex, update };
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
    renderer.toneMappingExposure = 0.98;
    renderer.setClearColor(0x020203, 1);

    const maxAniso = renderer.capabilities && renderer.capabilities.getMaxAnisotropy
      ? Math.min(renderer.capabilities.getMaxAnisotropy(), 16)
      : 8;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020203);

    const camera = new THREE.PerspectiveCamera(32, window.innerWidth / window.innerHeight, 0.04, 50);
    camera.position.set(0, 0, 9.4);
    camera.lookAt(0, 0, 0);

    // Moody Luxury Horology Studio Lighting (Deep Obsidian Dial + Crisp Steel Rim Highlights + Rich Saturated Orange!)
    const ambient = new THREE.AmbientLight(0x1f222a, 0.58);
    scene.add(ambient);

    const keyTopLeft = new THREE.DirectionalLight(0xffffff, 1.35);
    keyTopLeft.position.set(-4.8, 5.2, 4.2);
    scene.add(keyTopLeft);

    const rimRight = new THREE.DirectionalLight(0xd8e6ff, 1.30);
    rimRight.position.set(5.6, 2.2, 3.0);
    scene.add(rimRight);

    const warmLowerRim = new THREE.PointLight(0xff6a14, 1.45, 11);
    warmLowerRim.position.set(-2.2, -3.2, 2.0);
    scene.add(warmLowerRim);

    const crownAccent = new THREE.PointLight(0xffe6cc, 1.15, 8);
    crownAccent.position.set(3.4, 0.6, 2.2);
    scene.add(crownAccent);

    const dialFill = new THREE.DirectionalLight(0xffffff, 0.42);
    dialFill.position.set(0.2, -0.8, 5.5);
    scene.add(dialFill);

    // Materials
    const grainBump = createMicroGrainBump(256, 3.5, 58);
    const leatherBump = createMicroGrainBump(256, 2.2, 76);
    const brushedBump = createBrushedMetalBump();

    const matSteelBrushed = new THREE.MeshStandardMaterial({
      color: 0xc2c7cf,
      roughness: 0.24,
      metalness: 0.94,
      bumpMap: brushedBump,
      bumpScale: 0.005
    });

    const matSteelPolished = new THREE.MeshStandardMaterial({
      color: 0xe6ebf2,
      roughness: 0.12,
      metalness: 0.98
    });

    const matSteelDark = new THREE.MeshStandardMaterial({
      color: 0x1a1c20,
      roughness: 0.36,
      metalness: 0.84
    });

    const matLeather = new THREE.MeshStandardMaterial({
      color: 0x0e0f12,
      roughness: 0.78,
      metalness: 0.08,
      bumpMap: leatherBump,
      bumpScale: 0.012
    });

    const matOrangeAccent = new THREE.MeshStandardMaterial({
      color: 0xf45d0e,
      roughness: 0.30,
      metalness: 0.35
    });

    const matMinuteBlack = new THREE.MeshStandardMaterial({
      color: 0x0d0e11,
      roughness: 0.26,
      metalness: 0.72
    });

    // Master Watch Group (Lying in X-Y plane, Dial facing +Z toward viewer!)
    const watchGroup = new THREE.Group();
    scene.add(watchGroup);

    // =========================================================================
    // 1. SCULPTED STAINLESS STEEL CASE & BEZEL (Radius ~ 2.02)
    // =========================================================================
    // Outer Case Mid-Body Cylinder (Positioned cleanly BEHIND dialMesh at z = +0.005!)
    const caseBody = new THREE.Mesh(new THREE.CylinderGeometry(2.04, 2.00, 0.44, 96), matSteelBrushed);
    caseBody.rotation.x = Math.PI / 2;
    caseBody.position.z = -0.26;
    watchGroup.add(caseBody);

    // Sculpted Chamfered Front Bezel Ring (Lathe Profile)
    const bezelPts = [
      new THREE.Vector2(1.86, 0.00),
      new THREE.Vector2(1.89, 0.14),
      new THREE.Vector2(1.96, 0.18),
      new THREE.Vector2(2.03, 0.12),
      new THREE.Vector2(2.06, 0.02)
    ];
    const bezelGeo = new THREE.LatheGeometry(bezelPts, 112);
    bezelGeo.rotateX(Math.PI / 2);
    const bezelMesh = new THREE.Mesh(bezelGeo, matSteelPolished);
    watchGroup.add(bezelMesh);

    // Inner Rehaut / Chapter Ring Wall (Dark Brushed Steel)
    const rehaut = new THREE.Mesh(
      new THREE.CylinderGeometry(1.865, 1.855, 0.14, 96, 1, true),
      matSteelDark
    );
    rehaut.rotation.x = Math.PI / 2;
    rehaut.position.z = 0.06;
    watchGroup.add(rehaut);

    // 4 Sculpted Curved Lugs (Top-Left, Top-Right, Bottom-Left, Bottom-Right)
    const lugPositions = [
      { x: -1.12, y:  2.02, rz:  0.14 },
      { x:  1.12, y:  2.02, rz: -0.14 },
      { x: -1.12, y: -2.02, rz: -0.14 },
      { x:  1.12, y: -2.02, rz:  0.14 }
    ];
    const lugGeo = new THREE.BoxGeometry(0.28, 0.92, 0.34);
    lugPositions.forEach(lp => {
      const lug = new THREE.Mesh(lugGeo, matSteelBrushed);
      lug.position.set(lp.x, lp.y, -0.16);
      lug.rotation.z = lp.rz;
      watchGroup.add(lug);
    });

    // Matte-Black Leather Straps (Top & Bottom)
    const strapGeo = new THREE.BoxGeometry(1.92, 2.95, 0.22);
    const topStrap = new THREE.Mesh(strapGeo, matLeather);
    topStrap.position.set(0, 3.25, -0.22);
    topStrap.rotation.x = 0.08;
    watchGroup.add(topStrap);

    const botStrap = new THREE.Mesh(strapGeo, matLeather);
    botStrap.position.set(0, -3.25, -0.22);
    botStrap.rotation.x = -0.08;
    watchGroup.add(botStrap);

    // Precision Knurled Winding Crown at 3 o'clock (Matching Reference Image 2!)
    const crownGroup = new THREE.Group();
    crownGroup.position.set(2.14, 0, -0.08);
    watchGroup.add(crownGroup);

    const crownStem = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.22, 24), matSteelBrushed);
    crownStem.rotation.z = Math.PI / 2;
    crownStem.position.x = -0.08;
    crownGroup.add(crownStem);

    const crownBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.26, 48), matSteelPolished);
    crownBarrel.rotation.z = Math.PI / 2;
    crownBarrel.position.x = 0.08;
    crownGroup.add(crownBarrel);

    // 26 Knurled Flutes Around Crown
    const fluteGeo = new THREE.BoxGeometry(0.24, 0.024, 0.036);
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI * 2;
      const flute = new THREE.Mesh(fluteGeo, matSteelDark);
      flute.position.set(0.08, Math.cos(a) * 0.242, Math.sin(a) * 0.242);
      flute.rotation.x = -a;
      crownGroup.add(flute);
    }

    // =========================================================================
    // 2. MATTE-BLACK DIAL + 9 O'CLOCK MECHANICAL STEPPER APERTURE
    // =========================================================================
    const dialTex = createWatchDialTexture(maxAniso);
    const dialMat = new THREE.MeshStandardMaterial({
      map: dialTex,
      bumpMap: grainBump,
      bumpScale: 0.004,
      roughness: 0.78,
      metalness: 0.14
    });
    const dialMesh = new THREE.Mesh(new THREE.CircleGeometry(1.86, 112), dialMat);
    dialMesh.position.z = 0.005;
    watchGroup.add(dialMesh);

    // Live Mechanical Stepper Window at 9 o'clock (IX) — "150 +" / "clients"
    const stepperCtrl = createStepperWindowController(maxAniso);
    const stepperPlaneMat = new THREE.MeshBasicMaterial({
      map: stepperCtrl.tex
    });
    // Dial radius = 1.86 maps to 1024px -> 530px left = -0.962 units; 264x148px = 0.48 x 0.27 units
    const stepperPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.478, 0.268), stepperPlaneMat);
    stepperPlane.position.set(-0.962, 0.0, 0.011);
    watchGroup.add(stepperPlane);

    // Subtle 3D Metallic Bezel Frame around the 9 o'clock Stepper Aperture
    const apFrameMat = matSteelBrushed;
    const apTop = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.014, 0.018), apFrameMat);
    apTop.position.set(-0.962, 0.141, 0.014);
    watchGroup.add(apTop);
    const apBot = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.014, 0.018), apFrameMat);
    apBot.position.set(-0.962, -0.141, 0.014);
    watchGroup.add(apBot);
    const apLeft = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.296, 0.018), apFrameMat);
    apLeft.position.set(-1.208, 0, 0.014);
    watchGroup.add(apLeft);
    const apRight = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.296, 0.018), apFrameMat);
    apRight.position.set(-0.716, 0, 0.014);
    watchGroup.add(apRight);

    // =========================================================================
    // 3. THREE PRECISION WATCH HANDS (HOUR AT 1:30 WITH "25 + happy clients"!)
    // =========================================================================
    // Helper: Clock angle in radians where 0 = 12 o'clock (+Y), clockwise is negative Z rotation!
    // In our local hand group, the hand extends along +X (length L) so rotation.z = Math.PI/2 - clockRad!

    // A. HOUR HAND (Thick Orange Tapered Sword Hand with "25 + happy clients" in crisp white!)
    const hourHandPivot = new THREE.Group();
    hourHandPivot.position.set(0, 0, 0.055);
    watchGroup.add(hourHandPivot);

    const hourLen = 1.18;
    const hourWidth = 0.125;
    const hourGeo = new THREE.BoxGeometry(hourLen, hourWidth, 0.024);
    hourGeo.translate(hourLen / 2, 0, 0);
    const hourTopTex = createHourHandTexture(maxAniso);
    const hourTopMat = new THREE.MeshStandardMaterial({
      map: hourTopTex,
      roughness: 0.34,
      metalness: 0.22
    });
    const hourHandMaterials = [
      matOrangeAccent, // +x tip
      matOrangeAccent, // -x base
      matOrangeAccent, // +y side
      matOrangeAccent, // -y side
      hourTopMat,      // +z FRONT FACE ("25 + happy clients"!)
      matOrangeAccent  // -z back
    ];
    const hourHandMesh = new THREE.Mesh(hourGeo, hourHandMaterials);
    hourHandPivot.add(hourHandMesh);

    // Tapered Sword Tip on Hour Hand
    const tipShape = new THREE.Shape();
    tipShape.moveTo(0, -hourWidth / 2);
    tipShape.lineTo(0.11, -hourWidth * 0.24);
    tipShape.lineTo(0.14, 0);
    tipShape.lineTo(0.11, hourWidth * 0.24);
    tipShape.lineTo(0, hourWidth / 2);
    tipShape.closePath();
    const tipGeo = new THREE.ExtrudeGeometry(tipShape, { depth: 0.024, bevelEnabled: false });
    tipGeo.translate(hourLen, 0, -0.012);
    const hourTip = new THREE.Mesh(tipGeo, matOrangeAccent);
    hourHandPivot.add(hourTip);

    // B. MINUTE HAND (Sleek Matte-Black Baton Hand)
    const minuteHandPivot = new THREE.Group();
    minuteHandPivot.position.set(0, 0, 0.088);
    watchGroup.add(minuteHandPivot);

    const minLen = 1.54;
    const minGeo = new THREE.BoxGeometry(minLen, 0.058, 0.020);
    minGeo.translate(minLen / 2 - 0.12, 0, 0);
    const minMesh = new THREE.Mesh(minGeo, matMinuteBlack);
    minuteHandPivot.add(minMesh);

    // C. SECOND HAND (Ultra-Thin Vibrant Orange Sweep Needle with Counterbalance)
    const secondHandPivot = new THREE.Group();
    secondHandPivot.position.set(0, 0, 0.118);
    watchGroup.add(secondHandPivot);

    const secGeo = new THREE.BoxGeometry(1.94, 0.022, 0.012);
    secGeo.translate(0.68, 0, 0);
    const secMesh = new THREE.Mesh(secGeo, matOrangeAccent);
    secondHandPivot.add(secMesh);

    // D. CENTRAL PINION HUB (Matte-Black Cap + Crisp Orange Center Dot, Matching Reference!)
    const pinionBlack = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.19, 0.06, 48), matSteelDark);
    pinionBlack.rotation.x = Math.PI / 2;
    pinionBlack.position.z = 0.125;
    watchGroup.add(pinionBlack);

    const pinionOrangeDot = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.072, 0.025, 32), matOrangeAccent);
    pinionOrangeDot.rotation.x = Math.PI / 2;
    pinionOrangeDot.position.z = 0.148;
    watchGroup.add(pinionOrangeDot);

    // Subtle Sapphire Crystal Specular Glint Rim (Ultra-clean AR coating)
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.055,
      roughness: 0.04,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      depthWrite: false
    });
    const crystalMesh = new THREE.Mesh(new THREE.CircleGeometry(1.85, 64), glassMat);
    crystalMesh.position.z = 0.165;
    watchGroup.add(crystalMesh);

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

    // Helper: Convert clock angle (0 = 12:00, PI/2 = 3:00, PI = 6:00, 1.5*PI = 9:00) to (x, y) on dial
    function dialXY(clockRad, radius) {
      return {
        x: Math.sin(clockRad) * radius,
        y: Math.cos(clockRad) * radius
      };
    }

    function updateScene(P, dtSec) {
      currentWatchP = clamp(P, 0, 1);
      ambientTimeSec += dtSec;

      // Base idle live ticking (gentle continuous horology life, never stops even at 12:00!)
      const idleSecRad = (ambientTimeSec / 60) * Math.PI * 2;
      const idleMinRad = idleSecRad / 60;
      const idleHourRad = idleMinRad / 12;

      // Initial Pose:
      //   Hour hand points at 1:30 (45° = 0.25 * PI)
      //   Minute hand points at 2:05 (~62.5° = 0.347 * PI)
      //   Second hand starts at ~7:30 sweeping continuously!
      const baseHourRad = (1.5 / 12) * Math.PI * 2;  // 1:30
      const baseMinRad  = (2.1 / 12) * Math.PI * 2;  // ~2:05 (sleek offset beside 1:30 hour hand)
      const baseSecRad  = (7.5 / 12) * Math.PI * 2;  // 7:30

      // Scroll-Driven Sweep Phase (P: 0.50 -> 0.86):
      //   Hour hand sweeps smoothly from 1:30 -> 5:00 -> 7:00 -> 12:00 (+10.5 hours = +315° = 1.75 * PI)!
      //   Minute hand sweeps logically FASTER (+4.5x hour sweep)!
      //   Second hand sweeps FASTEST (+18x hour sweep)!
      const sweepP = easeInOutCubic(clamp((currentWatchP - 0.50) / 0.36, 0, 1));
      const hourSweepRad = sweepP * (10.5 / 12) * Math.PI * 2; // Lands dead-on 12:00 at sweepP = 1.0!
      const minSweepRad  = hourSweepRad * 5.0;
      const secSweepRad  = hourSweepRad * 20.0;

      const curHourRad = baseHourRad + hourSweepRad + idleHourRad;
      const curMinRad  = baseMinRad + minSweepRad + idleMinRad;
      const curSecRad  = baseSecRad + secSweepRad + idleSecRad;

      setHandClockRad(hourHandPivot, curHourRad);
      setHandClockRad(minuteHandPivot, curMinRad);
      setHandClockRad(secondHandPivot, curSecRad);

      // Update 9 o'clock Mechanical Stepper Window ("150 +" & "clients") as user zooms in!
      const stepP = clamp((currentWatchP - 0.16) / 0.18, 0, 1);
      stepperCtrl.update(stepP);

      // =======================================================================
      // CINEMATIC CAMERA KEYFRAME CHOREOGRAPHY (Scroll-Scrubbed)
      // =======================================================================
      // Keyframe 0 (0.00 -> 0.12): Full Watch Hero Shot centered on obsidian
      // Keyframe 1 (0.12 -> 0.34): Push straight into 9 o'clock Stepper ("150 + / clients")
      // Keyframe 2 (0.34 -> 0.52): Dramatic Low-Angle Diagonal Glide from 9:00 -> 1:30 Hour Hand ("25 + happy clients")
      // Keyframe 3 (0.52 -> 0.72): Elevate to Overhead/Angled Macro Following the Sweeping Hour Hand across 5:00 -> 7:00 ("Since May 2026")
      // Keyframe 4 (0.72 -> 0.88): Rotating Bottom-to-Top Ascent Following Needle 7:00 -> 12:00, then Elegant Lift Upward!
      let camX = 0, camY = 0, camZ = 9.4;
      let lookX = 0, lookY = 0, lookZ = 0;
      let camRoll = 0;

      if (currentWatchP <= 0.12) {
        // Full watch hero (manifesto pulling up)
        camX = 0; camY = 0; camZ = 9.4;
        lookX = 0; lookY = 0; lookZ = 0;
      } else if (currentWatchP <= 0.34) {
        // Zoom directly into 9 o'clock Stepper Aperture (-0.96, 0, 0.01)
        const t = easeInOutCubic(clamp((currentWatchP - 0.12) / 0.16, 0, 1));
        camX = lerp(0, -1.06, t);
        camY = lerp(0, -0.02, t);
        camZ = lerp(9.4, 2.18, t);
        lookX = lerp(0, -0.94, t);
        lookY = lerp(0, 0.0, t);
        lookZ = lerp(0, 0.02, t);
      } else if (currentWatchP <= 0.52) {
        // Dramatic Low-Angle Diagonal Glide from 9:00 Stepper -> 1:30 Orange Hour Hand ("25 + happy clients", Reference Image 3!)
        const t = easeInOutCubic(clamp((currentWatchP - 0.34) / 0.16, 0, 1));
        camX = lerp(-1.06, 0.42, t);
        camY = lerp(-0.02, -1.38, t);
        camZ = lerp(2.18, 1.38, t);
        lookX = lerp(-0.94, 0.48, t);
        lookY = lerp(0.0, 0.48, t);
        lookZ = lerp(0.02, 0.06, t);
        camRoll = lerp(0, -0.09, t);
      } else if (currentWatchP <= 0.72) {
        // Elevate smoothly from low-angle into angled overhead macro while TRACKING the sweeping orange hour hand across 5:00 -> 7:00 ("Since May 2026")!
        const t = easeInOutCubic(clamp((currentWatchP - 0.52) / 0.20, 0, 1));
        const tip = dialXY(curHourRad, 0.98);
        // Smooth transition from 1:30 low-angle into overhead needle tracking
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
        // Rotating Bottom-to-Top Cinematic Ascent Following Needle from 7:00 -> 12:00!
        const t = easeInOutCubic(clamp((currentWatchP - 0.72) / 0.16, 0, 1));
        const tip = dialXY(curHourRad, 0.96);
        const rotAngle = t * 0.48; // Subtle cinematic orbit rotation while ascending
        const baseTrackX = tip.x * 0.72 * (1 - t * 0.75);
        const baseTrackY = (tip.y * 0.72 - 0.52) * (1 - t * 0.65) + t * 0.65;
        camX = baseTrackX + Math.sin(rotAngle) * 0.55 * (1 - t * 0.4);
        camY = baseTrackY;
        camZ = lerp(2.48, 5.95, t);
        lookX = lerp(tip.x * 0.88, 0.0, t);
        lookY = lerp(tip.y * 0.88, 0.28, t);
        lookZ = 0.02;
        camRoll = lerp(0.06, -0.08 * (1 - t), t);
      } else {
        // Past 12:00: Stop following the needle (all hands keep running!), gently lift camera upward as final page pulls up!
        const t = easeInOutCubic(clamp((currentWatchP - 0.88) / 0.12, 0, 1));
        camX = lerp(0.18, 0, t);
        camY = lerp(0.58, 1.45, t);
        camZ = lerp(5.95, 7.1, t);
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

    // Ambient continuous ticking loop ONLY when the watch section is visible in viewport!
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
