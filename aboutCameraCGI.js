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

    // Camera starts framed cleanly on the cinema camera + tripod head, then zooms straight into the lens center on scroll
    const camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.05, 60);
    camera.position.set(0, -0.08, 7.1);
    camera.lookAt(0, -0.08, 0);

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
    // 1. CAMERA BODY (Centered around lens axis y = 0.25)
    // =========================================================================
    const cameraGroup = new THREE.Group();
    cameraGroup.position.set(0, 0.28, 0);
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

    // Inner Stepped Optical Baffles (Deep dark tunnel inside lens)
    const baffle1 = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.04, 16, 48), matMetalDark);
    baffle1.position.set(0, 0, 0.72);
    lensGroup.add(baffle1);

    const baffle2 = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.035, 16, 48), matBody);
    baffle2.position.set(0, 0, 0.50);
    lensGroup.add(baffle2);

    // Multi-Coated Optical Glass Front Element (Semi-transparent teal/amber coating that clears as we zoom through!)
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0b1f26,
      emissive: 0x06222c,
      emissiveIntensity: 0.45,
      roughness: 0.06,
      metalness: 0.15,
      transparent: true,
      opacity: 0.58
    });
    const frontGlass = new THREE.Mesh(new THREE.CircleGeometry(0.55, 48), glassMat);
    frontGlass.position.set(0, 0, 0.68);
    lensGroup.add(frontGlass);

    // =========================================================================
    // 3. HEAVY-DUTY FLUID-HEAD TRIPOD (Directly below Camera Body)
    // =========================================================================
    const tripodGroup = new THREE.Group();
    tripodGroup.position.set(0, -0.60, -0.24);
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

    // Scroll-Driven Update Function (0 = Hero Camera on Tripod, 1 = Zoomed Straight Through Center Lens!)
    function renderAtProgress(zoomP) {
      const p = Math.max(0, Math.min(1, zoomP));
      // Smooth cubic ease for cinematic dolly-in toward the exact lens optical center (0, 0.26, 0.88)
      const easeZ = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

      // Dolly Z from 7.1 -> 1.05 (tight into the lens bore), Y converges cleanly from -0.08 -> 0.26 (exact lens center!)
      const camZ = 7.1 + (1.05 - 7.1) * easeZ;
      const camY = -0.08 + (0.26 - (-0.08)) * easeZ;
      camera.position.set(0, camY, camZ);
      camera.lookAt(0, camY, 0);

      // CLOCKWISE rotation of the focal-length / focus ring on scroll!
      // In Three.js facing +Z, negative rotation.z is CLOCKWISE from the viewer's perspective
      focusRingGroup.rotation.z = -p * Math.PI * 1.5;

      // Clear optical glass opacity as camera enters lens so the next section shines cleanly through the circular bore
      glassMat.opacity = Math.max(0, 0.58 * (1 - Math.max(0, (p - 0.35) / 0.45)));

      renderer.render(scene, camera);
    }

    renderAtProgress(0);

    return {
      renderAtProgress,
      resize
    };
  };
})();
