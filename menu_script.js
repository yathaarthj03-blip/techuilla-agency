      const openMenuBtn = document.getElementById('open-menu-btn');
      const closeMenuBtn = document.getElementById('close-menu-btn');
      const fullscreenMenu = document.getElementById('fullscreen-menu');
      const menuLinks = document.querySelectorAll('.menu-nav-link');
      const menuStrokeTop = document.getElementById('menuStrokeTop');
      const menuStrokeBottom = document.getElementById('menuStrokeBottom');

      // Bezier control coordinates:
      // [M_x, M_y, C_cp1x, C_cp1y, C_cp2x, C_cp2y, C_x1, C_y1, C_cp3x, C_cp3y, C_cp4x, C_cp4y, C_x2, C_y2]
      const lineTop    = [4, 6,   9, 6,   19, 6,   24, 6,   24, 6,   24, 6,   24, 6];
      const lineBottom = [4, 14,  9, 14,  19, 14,  24, 14,  24, 14,  24, 14,  24, 14];

      const infTop    = [14, 10,  18, 5,   25.5, 6,  25.5, 10,  25.5, 14,  18, 15,  14, 10];
      const infBottom = [14, 10,  10, 15,  2.5, 14,  2.5, 10,   2.5, 6,   10, 5,   14, 10];

      const xTop    = [6, 4,   10, 7,   18, 13,  22, 16,  22, 16,  22, 16,  22, 16];
      const xBottom = [6, 16,  10, 13,  18, 7,   22, 4,   22, 4,   22, 4,   22, 4];

      function lerp(a, b, t) {
        return a + (b - a) * t;
      }

      function interpolateCoords(arrA, arrB, t) {
        return arrA.map((v, i) => lerp(v, arrB[i], t));
      }

      function toPathD(coords) {
        return `M ${coords[0].toFixed(2)},${coords[1].toFixed(2)} C ${coords[2].toFixed(2)},${coords[3].toFixed(2)} ${coords[4].toFixed(2)},${coords[5].toFixed(2)} ${coords[6].toFixed(2)},${coords[7].toFixed(2)} C ${coords[8].toFixed(2)},${coords[9].toFixed(2)} ${coords[10].toFixed(2)},${coords[11].toFixed(2)} ${coords[12].toFixed(2)},${coords[13].toFixed(2)}`;
      }

      function easeCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      }

      let menuMorphT = 0; // 0 = hamburger, 0.5 = infinity, 1.0 = clean X
      let menuMorphTargetT = 0;
      let menuMorphAnimId = null;
      let isMenuCurrentlyOpen = false;

      function renderMenuMorph(t) {
        if (!menuStrokeTop || !menuStrokeBottom || !openMenuBtn) return;

        let coordsTop, coordsBottom;
        if (t <= 0.5) {
          const localT = t / 0.5;
          coordsTop = interpolateCoords(lineTop, infTop, localT);
          coordsBottom = interpolateCoords(lineBottom, infBottom, localT);
        } else {
          const localT = (t - 0.5) / 0.5;
          coordsTop = interpolateCoords(infTop, xTop, localT);
          coordsBottom = interpolateCoords(infBottom, xBottom, localT);
        }

        menuStrokeTop.setAttribute('d', toPathD(coordsTop));
        menuStrokeBottom.setAttribute('d', toPathD(coordsBottom));

        // Background stays transparent (never turns solid orange on hover or click)
        openMenuBtn.style.backgroundColor = '';

        if (isMenuCurrentlyOpen) {
          openMenuBtn.style.borderColor = '#111111';
          menuStrokeTop.style.stroke = '#FF6B2C';
          menuStrokeBottom.style.stroke = '#FF6B2C';
        } else {
          openMenuBtn.style.borderColor = '';
          menuStrokeTop.style.stroke = '';
          menuStrokeBottom.style.stroke = '';
        }
      }

      const MORPH_DURATION = 600; // ms (0.5 to 0.7s per user spec)
      let morphStartTime = null;
      let morphStartT = 0;

      function animateMenuMorph(targetT, customDuration = MORPH_DURATION) {
        menuMorphTargetT = targetT;
        morphStartT = menuMorphT;
        morphStartTime = performance.now();
        if (menuMorphAnimId) cancelAnimationFrame(menuMorphAnimId);

        if (openMenuBtn) openMenuBtn.classList.add('is-morphing');

        function morphStep(now) {
          const elapsed = now - morphStartTime;
          const rawProgress = Math.min(1, elapsed / customDuration);
          const eased = easeCubic(rawProgress);
          menuMorphT = lerp(morphStartT, menuMorphTargetT, eased);
          renderMenuMorph(menuMorphT);

          if (rawProgress < 1) {
            menuMorphAnimId = requestAnimationFrame(morphStep);
          } else {
            menuMorphT = menuMorphTargetT;
            renderMenuMorph(menuMorphT);
            menuMorphAnimId = null;
            if (openMenuBtn) openMenuBtn.classList.remove('is-morphing');
          }
        }
        menuMorphAnimId = requestAnimationFrame(morphStep);
      }

      // Initial render at 0 (parallel lines)
      renderMenuMorph(0);

      // ----------------------------------------------------------------------
      // JACKPOT SCREEN LADDER HOVER ANIMATION FOR NAVBAR OPTIONS & SOCIALS
      // ----------------------------------------------------------------------
      const JACKPOT_SYMBOLS = ['7', 'X', '9', 'K', 'Q', 'J', '8', '3', 'Z', 'W', 'V'];
      const jackpotTargets = document.querySelectorAll('.menu-nav-link, .menu-channel-item, .menu-enquiries-btn');
      
      jackpotTargets.forEach(targetEl => {
        const textWrap = targetEl.querySelector('.nav-text-wrap');
        if (!textWrap) return;

        const strikethrough = textWrap.querySelector('.nav-strikethrough, .nav-creative-strikethrough');
        let rawText = '';
        textWrap.childNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            rawText += node.nodeValue;
          }
        });
        rawText = rawText.trim();
        if (!rawText) return;

        textWrap.innerHTML = '';

        const chars = rawText.split('');
        chars.forEach((char, idx) => {
          if (char === ' ') {
            const spaceSlot = document.createElement('span');
            spaceSlot.className = 'jackpot-char-slot jackpot-char-space';
            spaceSlot.innerHTML = '&nbsp;';
            spaceSlot.style.display = 'inline-block';
            spaceSlot.style.width = '0.38em';
            textWrap.appendChild(spaceSlot);
            return;
          }

          const slot = document.createElement('span');
          slot.className = 'jackpot-char-slot';
          slot.style.setProperty('--char-idx', idx);

          const isUpper = char === char.toUpperCase() && char !== char.toLowerCase();
          const syms = isUpper ? ['7', 'X', 'K', 'Q', 'Z'] : ['7', 'x', 'k', 's', 'z'];
          const r1 = syms[Math.floor(Math.random() * syms.length)];
          const r2 = syms[Math.floor(Math.random() * syms.length)];

          slot.innerHTML = `
            <span class="jackpot-char-sizer" aria-hidden="true">${char}</span>
            <span class="jackpot-reel-ladder">
              <span class="jackpot-rung original">${char}</span>
              <span class="jackpot-rung rung-rand-1">${r1}</span>
              <span class="jackpot-rung rung-rand-2">${r2}</span>
              <span class="jackpot-rung target">${char}</span>
            </span>
          `;
          textWrap.appendChild(slot);
        });

        if (strikethrough) {
          textWrap.appendChild(strikethrough);
        }

        targetEl.addEventListener('mouseenter', () => {
          const rand1Elements = textWrap.querySelectorAll('.rung-rand-1');
          const rand2Elements = textWrap.querySelectorAll('.rung-rand-2');
          let ticks = 0;
          const interval = setInterval(() => {
            ticks++;
            rand1Elements.forEach(el => {
              el.textContent = JACKPOT_SYMBOLS[Math.floor(Math.random() * JACKPOT_SYMBOLS.length)];
            });
            rand2Elements.forEach(el => {
              el.textContent = JACKPOT_SYMBOLS[Math.floor(Math.random() * JACKPOT_SYMBOLS.length)];
            });
            if (ticks > 8) clearInterval(interval);
          }, 50);
        });
      });

      function toggleMenu() {
        if (fullscreenMenu && fullscreenMenu.classList.contains('is-open')) {
          closeMenu();
        } else {
          openMenu();
        }
      }

      function openMenu() {
        if (fullscreenMenu) {
          isMenuCurrentlyOpen = true;
          fullscreenMenu.classList.remove('is-closing');
          fullscreenMenu.classList.add('is-open');
          fullscreenMenu.setAttribute('aria-hidden', 'false');
          if (openMenuBtn) {
            openMenuBtn.classList.add('is-open');
            openMenuBtn.setAttribute('aria-label', 'Close Navigation Menu');
          }
          // Click to open: 0.6s morph: horizontal lines merge into infinity, then curves dissolve into clean cross X
          animateMenuMorph(1.0, 600);

          document.body.classList.add('menu-open');
          document.body.style.overflow = 'hidden';
        }
      }

      function closeMenu() {
        if (fullscreenMenu) {
          isMenuCurrentlyOpen = false;
          if (openMenuBtn) {
            openMenuBtn.classList.remove('is-open');
            openMenuBtn.setAttribute('aria-label', 'Open Navigation Menu');
          }
          fullscreenMenu.classList.remove('is-open');
          fullscreenMenu.classList.add('is-closing');
          fullscreenMenu.setAttribute('aria-hidden', 'true');
          document.body.classList.remove('menu-open');
          document.body.style.overflow = '';

          // Click to close: 0.6s morph in reverse: cross X expands to infinity, then uncurls into parallel lines
          animateMenuMorph(0, 600);

          setTimeout(() => {
            fullscreenMenu.classList.remove('is-closing');
          }, 600);
        }
      }

      if (openMenuBtn) openMenuBtn.addEventListener('click', toggleMenu);

      function triggerEnquireTransition(e, targetUrl = 'contact.html') {
        if (e) e.preventDefault();
        const overlay = document.getElementById('enquireTransitionOverlay');
        if (!overlay) {
          window.location.href = targetUrl;
          return;
        }
        overlay.classList.add('is-active');
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 550);
      }

      const allEnquireButtons = document.querySelectorAll('.btn-enquire, .btn-cta-large');
      allEnquireButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          triggerEnquireTransition(e, 'contact.html');
        });
      });

      const enquiriesBtn = document.getElementById('menuEnquiriesBtn');
      if (enquiriesBtn) {
        enquiriesBtn.addEventListener('click', (e) => {
          closeMenu();
          triggerEnquireTransition(e, 'contact.html');
        });
      }

      const menuGmailLink = document.getElementById('menuGmailLink');
      if (menuGmailLink) {
        menuGmailLink.addEventListener('click', (e) => {
          const subject = "Service Enquiry - Techuilla Agency";
          const body = "Hello Techuilla Team,\n\nI came across your website and would like to enquire about your services.\n\n**My Details**\n- Name:\n- Company / Brand:\n- Contact Number:\n\n**Project Details**\n- Service Required:\n- Project Description:\n- Estimated Budget:\n- Expected Timeline:\n\nPlease get back to me with the relevant details and next steps.\n\nLooking forward to hearing from you.\n\nBest regards,\n[Your Name]";
          const webUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=techuilla.co@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          window.open(webUrl, '_blank', 'noopener,noreferrer');
          e.preventDefault();
        });
      }

      const btnBackToTop = document.getElementById('btnBackToTop');
      if (btnBackToTop) {
        btnBackToTop.addEventListener('click', () => {
          if (window.resetScrollToTop) {
            window.resetScrollToTop();
          } else {
            window.scrollTo(0, 0);
            if (window.updatePortalScrub) window.updatePortalScrub();
          }
        });
      }

      function triggerHomeTransition(e) {
        if (e) e.preventDefault();
        if (typeof closeMenu === 'function') closeMenu();

        const overlay = document.getElementById('enquireTransitionOverlay');
        if (!overlay) {
          if (window.resetScrollToTop) window.resetScrollToTop();
          else window.scrollTo(0, 0);
          return;
        }

        // Bloom orange circle from the logo position
        overlay.classList.remove('from-center');
        overlay.classList.add('from-logo', 'is-active');

        // Scroll to top while curtain is fully covering
        setTimeout(() => {
          if (window.resetScrollToTop) {
            window.resetScrollToTop();
          } else {
            window.scrollTo(0, 0);
            if (window.updatePortalScrub) window.updatePortalScrub(true);
          }
        }, 300);

        // Reverse curtain out smoothly to reveal the hero section!
        setTimeout(() => {
          overlay.classList.remove('is-active');
        }, 550);
      }

      menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          const section = link.getAttribute('data-section');
          menuLinks.forEach(l => l.classList.remove('is-active'));
          link.classList.add('is-active');
          if (section === 'home') {
            triggerHomeTransition(e);
          } else {
            closeMenu();
          }
        });
      });

      const navBrandLink = document.querySelector('.nav-brand');
      if (navBrandLink) {
        navBrandLink.addEventListener('click', (e) => {
          triggerHomeTransition(e);
        });
      }

      const reelLogo = document.querySelector('.nav-extreme-left-logo-wrap');
      if (reelLogo) {
        reelLogo.style.cursor = 'pointer';
        reelLogo.addEventListener('click', (e) => {
          triggerHomeTransition(e);
        });
      }

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && fullscreenMenu && fullscreenMenu.classList.contains('is-open')) {
          closeMenu();
        }
      });

      // ----------------------------------------------------------------------
      // 3. ARCHITECTURAL PORTAL SECTION-TRANSITION (Scroll-Scrubbed Central Expansion)
      // ----------------------------------------------------------------------
      const portalTrack = document.getElementById('portalScrollTrack');
