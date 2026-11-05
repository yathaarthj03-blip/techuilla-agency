/**
 * TECHUILLA AGENCY — 3D PHYSICAL PORTFOLIO BOOK
 * Features:
 * 1. Closed 3D Hardbound Cover resting on Hero with uploaded transparent artwork
 * 2. Centered Spotlight Modal with dimmed blurred backdrop & cross close button
 * 3. Authentic 3D Open Physical Book Spread (Left page + Right page + center spine seam + stitches)
 * 4. Realistic 3D Leaf Page Flip animation turning across the central binding axis
 * 5. 3 Comprehensive Editorial Spreads covering all 5 core brand manifesto pages
 */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     SVG ASSETS & EMBLEMS
     -------------------------------------------------------------------------- */
  const ICONS = {
    techuillaT: `
      <svg viewBox="0 0 40 40" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 6 8 L 34 8 L 34 16 L 24 16 L 24 34 L 16 34 L 16 16 L 6 16 Z" fill="#F26A0F" />
      </svg>
    `,
    halftoneMegaphone: `
      <svg viewBox="0 0 160 160" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Orange Geometric Background Block -->
        <rect x="25" y="20" width="110" height="120" rx="4" fill="#F26A0F" />
        <!-- Megaphone Silhouette -->
        <path d="M 40 85 L 65 65 L 115 50 L 115 110 L 65 95 L 40 75 Z" fill="#111111" />
        <path d="M 65 95 L 65 125 L 50 120 L 50 88 Z" fill="#111111" />
        <!-- Halftone Sound Waves -->
        <circle cx="128" cy="80" r="3" fill="#FFFFFF" />
        <circle cx="136" cy="74" r="2.5" fill="#FFFFFF" />
        <circle cx="136" cy="86" r="2.5" fill="#FFFFFF" />
        <circle cx="144" cy="68" r="2" fill="#FFFFFF" />
        <circle cx="144" cy="92" r="2" fill="#FFFFFF" />
      </svg>
    `,
    scriptUnderline: `
      <svg viewBox="0 0 160 16" width="140" height="14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 4 8 Q 80 15 156 5" stroke="#F26A0F" stroke-width="2.5" stroke-linecap="round" fill="none" />
      </svg>
    `
  };

  /* --------------------------------------------------------------------------
     PORTFOLIO BOOK CONTROLLER
     -------------------------------------------------------------------------- */
  class PortfolioBookController {
    constructor() {
      this.container = document.getElementById('portfolioBookContainer');
      this.isOpen = false;
      this.isTurning = false;
      this.currentSpread = 0;
      this.totalSpreads = 3;

      this.init();
    }

    init() {
      if (!this.container) return;

      this.initSpreadsData();
      this.renderHeroBook();
      this.createSpotlightModal();
      this.bindEvents();
    }

    /* ------------------------------------------------------------------------
       1. HERO RESTING BOOK (Using Uploaded No-Background Artwork)
       ------------------------------------------------------------------------ */
    renderHeroBook() {
      if (!this.container) return;

      this.container.innerHTML = `
        <div class="hero-book-wrap" id="heroBookWrap" title="Click to open Techuilla portfolio book">
          <!-- Ambient Ground Contact Shadow -->
          <div class="hero-book-ground-shadow"></div>

          <!-- Physical Hardcover Book with Uploaded Cover Artwork -->
          <div class="hero-book-cover" id="heroBookCover" role="button" tabindex="0" aria-label="Open Techuilla Portfolio Book">
            <img src="assets/book_cover_clean.png" alt="Techuilla Selected Works Vol. 01 Hardcover Book" class="hero-book-cover-img" />
          </div>

          <!-- Callout Pointer Annotation Beside Book -->
          <div class="book-callout-badge" id="heroBookCallout">
            <div class="callout-pulse-dot"></div>
            <div class="callout-pointer-line"></div>
            <span class="callout-text">CLICK TO EXPLORE →</span>
          </div>
        </div>
      `;
    }

    /* ------------------------------------------------------------------------
       2. SPREADS DATA ARCHITECTURE (3 SPREADS = 6 PHYSICAL PAGES)
       ------------------------------------------------------------------------ */
    initSpreadsData() {
      // 24 social post cells
      let cells = '';
      for (let i = 0; i < 24; i++) {
        const isHighlight = (i === 10);
        cells += `
          <div class="p1-post-cell ${isHighlight ? 'is-highlight' : ''}">
            <div class="cell-avatar"></div>
            <div class="cell-line"></div>
            <div class="cell-line short"></div>
          </div>
        `;
      }

      this.spreads = [
        /* ====================================================================
           SPREAD 0: CHAPTER 01 — THE ATTENTION PROBLEM (Pages 01 & 02)
           ==================================================================== */
        {
          chapter: 'CHAPTER 01 · THE ATTENTION PROBLEM',
          leftNum: '01',
          rightNum: '02',
          left: `
            <div class="page-top-hairline">
              <span class="top-chapter-tag">CHAPTER 01 · MANIFESTO</span>
              <span class="top-dashes">— — —</span>
            </div>

            <div class="spread-page-body">
              <h1 class="book-editorial-title">
                MOST BRANDS DON’T FAIL.<br>
                <span class="page-accent-orange">THEY GET SCROLLED PAST.</span>
              </h1>

              <div class="editorial-artwork-row">
                <div class="halftone-cutout-box">
                  ${ICONS.halftoneMegaphone}
                </div>
                <div class="editorial-aside-copy">
                  <p class="book-typewriter-text">
                    The modern internet does not suffer from a lack of content. It suffers from a surplus of silence disguised as volume.
                  </p>
                  <div class="handwritten-note-wrap">
                    <span class="page-script-note">Ideas. Strategy. Impact.</span>
                    ${ICONS.scriptUnderline}
                  </div>
                </div>
              </div>

              <div class="editorial-bottom-stat-bar">
                <div class="mini-stat-unit">
                  <span class="stat-big">0.4s</span>
                  <span class="stat-small">Thumb-Stop Threshold</span>
                </div>
                <div class="mini-stat-unit">
                  <span class="stat-big">94%</span>
                  <span class="stat-small">Feed Saturation</span>
                </div>
              </div>
            </div>

            <div class="page-bottom-hairline">
              <span class="page-footer-title">SELECTED WORKS · VOL. 01</span>
              <span class="page-footer-num">01</span>
            </div>
          `,
          right: `
            <div class="page-top-hairline">
              <span class="top-chapter-tag">ATTENTION VELOCITY & SATURATION</span>
              <span class="top-dashes">— — —</span>
            </div>

            <div class="spread-page-body">
              <div class="attention-grid-header">
                <span class="meta-sub">FIG 1.1 · ALGORITHMIC FEED VELOCITY</span>
                <span class="meta-tag-pill">24 IMPRESSIONS / SEC</span>
              </div>

              <!-- 24-Post Feed Grid with Highlight Cell -->
              <div class="social-grid-viewport">
                ${cells}
              </div>

              <div class="callout-statement-box">
                <span class="callout-highlight-label">THE REALITY</span>
                <p class="callout-statement-text">
                  “When everyone optimizes for the exact same algorithm guidelines, sameness becomes invisible. We build brands that break the scroll.”
                </p>
              </div>

              <div class="footer-stat-line">
                <span>TECHUILLA LABS</span>
                <span>AUDITED 2026</span>
              </div>
            </div>

            <div class="page-bottom-hairline">
              <span class="page-footer-title">TECHUILLA STUDIO</span>
              <span class="page-footer-num">02</span>
            </div>
          `
        },

        /* ====================================================================
           SPREAD 1: CHAPTERS 02 & 03 — TABLE OF CONTENTS & SPRINT (Pages 03 & 04)
           ==================================================================== */
        {
          chapter: 'CHAPTER 02 & 03 · CAPABILITIES & SPRINT',
          leftNum: '03',
          rightNum: '04',
          left: `
            <div class="page-top-hairline">
              <span class="top-chapter-tag">CHAPTER 02 · TABLE OF CONTENTS</span>
              <span class="top-dashes">— — —</span>
            </div>

            <div class="spread-page-body">
              <div class="toc-header-wrap">
                <div class="toc-emblem">${ICONS.techuillaT}</div>
                <h2 class="book-editorial-title small">WHAT WE BUILD.</h2>
              </div>

              <div class="toc-chapters-flow">
                <div class="toc-item" data-goto="0">
                  <div class="toc-item-header">
                    <span class="toc-num">01.</span>
                    <span class="toc-title">THE ATTENTION PROBLEM</span>
                    <span class="toc-dots"></span>
                    <span class="toc-page">P. 01</span>
                  </div>
                  <p class="toc-desc">Why algorithmic indifference kills conventional brands.</p>
                </div>

                <div class="toc-item" data-goto="1">
                  <div class="toc-item-header">
                    <span class="toc-num">02.</span>
                    <span class="toc-title">THREE DISCIPLINED PILLARS</span>
                    <span class="toc-dots"></span>
                    <span class="toc-page">P. 03</span>
                  </div>
                  <p class="toc-desc">Tech & Web Apps · Cinematic Media · Growth Marketing.</p>
                </div>

                <div class="toc-item" data-goto="2">
                  <div class="toc-item-header">
                    <span class="toc-num">03.</span>
                    <span class="toc-title">RECEIPTS & MANIFESTO</span>
                    <span class="toc-dots"></span>
                    <span class="toc-page">P. 05</span>
                  </div>
                  <p class="toc-desc">Audited performance metrics and our closing pledge.</p>
                </div>
              </div>

              <!-- Verified Client Stamps -->
              <div class="client-stamps-grid">
                <div class="stamp-chip">APEX SYSTEMS · 2026</div>
                <div class="stamp-chip">AETHER SPATIAL · 2025</div>
                <div class="stamp-chip">VANGUARD GLOBAL · 2026</div>
                <div class="stamp-chip">LUMEN ARCHITECTURE · 2025</div>
              </div>
            </div>

            <div class="page-bottom-hairline">
              <span class="page-footer-title">SELECTED WORKS · VOL. 01</span>
              <span class="page-footer-num">03</span>
            </div>
          `,
          right: `
            <div class="page-top-hairline">
              <span class="top-chapter-tag">CHAPTER 03 · THE UNIGNORABLE SPRINT</span>
              <span class="top-dashes">— — —</span>
            </div>

            <div class="spread-page-body">
              <h2 class="book-editorial-title small">FOUR WEEKS TO IMPACT.</h2>
              <p class="book-typewriter-text" style="margin-bottom: 16px;">
                Sprint-based execution eliminates circular agency meetings. We build in high-fidelity prototypes and deploy with speed.
              </p>

              <!-- 4-Stage Sprint Roadmap Grid -->
              <div class="sprint-phases-grid">
                <div class="sprint-phase-card">
                  <div class="phase-meta">
                    <span class="phase-badge">W1–2</span>
                    <span class="phase-idx">01</span>
                  </div>
                  <h4 class="phase-title">DISCOVER & AUDIT</h4>
                  <p class="phase-desc">Deep audience immersion, friction identification & KPI alignment.</p>
                </div>

                <div class="sprint-phase-card">
                  <div class="phase-meta">
                    <span class="phase-badge">W3–4</span>
                    <span class="phase-idx">02</span>
                  </div>
                  <h4 class="phase-title">ENGINEER & PRODUCE</h4>
                  <p class="phase-desc">Rapid web development, CGI/3D asset creation, cinematic storytelling.</p>
                </div>

                <div class="sprint-phase-card">
                  <div class="phase-meta">
                    <span class="phase-badge">W5</span>
                    <span class="phase-idx">03</span>
                  </div>
                  <h4 class="phase-title">LAUNCH PORTAL</h4>
                  <p class="phase-desc">Production deployment, automated pipeline sync, multi-platform debut.</p>
                </div>

                <div class="sprint-phase-card">
                  <div class="phase-meta">
                    <span class="phase-badge">W6+</span>
                    <span class="phase-idx">04</span>
                  </div>
                  <h4 class="phase-title">OPTIMIZE & SCALE</h4>
                  <p class="phase-desc">Telemetry tracking, conversion experiments, compounding growth.</p>
                </div>
              </div>
            </div>

            <div class="page-bottom-hairline">
              <span class="page-footer-title">TECHUILLA STUDIO</span>
              <span class="page-footer-num">04</span>
            </div>
          `
        },

        /* ====================================================================
           SPREAD 2: CHAPTERS 04 & 05 — RECEIPTS & CLOSING MANIFESTO (Pages 05 & 06)
           ==================================================================== */
        {
          chapter: 'CHAPTER 04 & 05 · RECEIPTS & CLOSING MANIFESTO',
          leftNum: '05',
          rightNum: '06',
          left: `
            <div class="page-top-hairline">
              <span class="top-chapter-tag">CHAPTER 04 · RECEIPTS, NOT PROMISES</span>
              <span class="top-dashes">— — —</span>
            </div>

            <div class="spread-page-body">
              <h2 class="book-editorial-title small">PROVEN VELOCITY.</h2>
              <p class="book-typewriter-text" style="margin-bottom: 18px;">
                We measure triumph not in agency design awards, but in commercial revenue, user retention, and unfair market attention.
              </p>

              <!-- Verified Metrics Ledger -->
              <div class="metrics-ledger-grid">
                <div class="ledger-metric-box">
                  <span class="ledger-num">14.8M</span>
                  <span class="ledger-label">ORGANIC VIDEO REACH</span>
                  <span class="ledger-sub">Across TikTok, Reels & Shorts</span>
                </div>

                <div class="ledger-metric-box">
                  <span class="ledger-num">+340%</span>
                  <span class="ledger-label">AVERAGE ROAS LIFT</span>
                  <span class="ledger-sub">Performance marketing campaigns</span>
                </div>

                <div class="ledger-metric-box">
                  <span class="ledger-num">99.98%</span>
                  <span class="ledger-label">SYSTEM AVAILABILITY</span>
                  <span class="ledger-sub">Automated AI workflows</span>
                </div>

                <div class="ledger-metric-box">
                  <span class="ledger-num">3.4x</span>
                  <span class="ledger-label">CONVERSION MULTIPLIER</span>
                  <span class="ledger-sub">Spatial WebGL flagships</span>
                </div>
              </div>

              <!-- Audited Seal -->
              <div class="ledger-audit-seal">
                <span class="seal-text">VERIFIED AUDIT · SELECTED WORKS 2026</span>
              </div>
            </div>

            <div class="page-bottom-hairline">
              <span class="page-footer-title">SELECTED WORKS · VOL. 01</span>
              <span class="page-footer-num">05</span>
            </div>
          `,
          right: `
            <div class="page-top-hairline">
              <span class="top-chapter-tag">CHAPTER 05 · CLOSING MANIFESTO</span>
              <span class="top-dashes">— — —</span>
            </div>

            <div class="spread-page-body">
              <h2 class="book-editorial-title">
                “GOOD IDEAS DESERVE<br>
                <span class="page-accent-orange">TO BECOME REALITY.”</span>
              </h2>

              <!-- Vivid Orange Manifesto Callout Block -->
              <div class="manifesto-bold-block">
                <span class="manifesto-eyebrow">THE TECHUILLA PLEDGE</span>
                <p class="manifesto-quote">
                  WE DON’T DO ORDINARY.<br>
                  WE BUILD WITHOUT LIMITS.
                </p>
              </div>

              <div class="manifesto-closing-row">
                <div class="handwritten-closing">
                  <span class="page-script-note">Let’s make something impossible to ignore.</span>
                </div>

                <!-- Interactive CTA Button -->
                <button class="spread-cta-btn" id="startChapterBtn" type="button">
                  START YOUR CHAPTER →
                </button>
              </div>
            </div>

            <div class="page-bottom-hairline">
              <span class="page-footer-title">TECHUILLA STUDIO</span>
              <span class="page-footer-num">06</span>
            </div>
          `
        }
      ];
    }

    /* ------------------------------------------------------------------------
       3. SPOTLIGHT MODAL (3D OPEN PHYSICAL BOOK CHASSIS)
       ------------------------------------------------------------------------ */
    createSpotlightModal() {
      // 1. Backdrop
      let backdrop = document.getElementById('bookSpotlightBackdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'bookSpotlightBackdrop';
        backdrop.className = 'book-spotlight-backdrop';
        document.body.appendChild(backdrop);
      }
      this.backdrop = backdrop;

      // 2. Modal
      let modal = document.getElementById('bookSpotlightModal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'bookSpotlightModal';
        modal.className = 'book-spotlight-modal';
        document.body.appendChild(modal);
      }
      this.modal = modal;

      this.modal.innerHTML = `
        <!-- Floating Top Bar -->
        <div class="spotlight-top-bar">
          <div class="spotlight-meta-left">TECHUILLA ARCHIVE · SELECTED WORKS VOL. 01</div>
          <div class="spotlight-counter" id="spotlightCounter">SPREAD <span class="active-num" id="spotlightSpreadNum">01</span> / 03</div>
          <button class="spotlight-close-btn" id="spotlightCloseBtn" type="button" aria-label="Close Portfolio Book">
            <span>CLOSE</span>
            <span class="close-cross-icon">✕</span>
          </button>
        </div>

        <!-- 3D Physical Open Book Spread Container -->
        <div class="spotlight-open-book-spread" id="spotlightBookSpread">
          <!-- Hardcover Leather Shell Backing Behind Pages -->
          <div class="book-shell-backing"></div>

          <!-- Static Left Page Bed -->
          <div class="book-spread-left" id="bookLeftPage">
            <div class="paper-grain-overlay"></div>
            <div class="book-page-inner" id="bookLeftContent"></div>
          </div>

          <!-- Center Spine Gutter Crease & Stitching -->
          <div class="book-spine-crease" aria-hidden="true">
            <div class="spine-stitch-line"></div>
          </div>

          <!-- Static Right Page Bed -->
          <div class="book-spread-right" id="bookRightPage">
            <div class="paper-grain-overlay"></div>
            <div class="book-page-inner" id="bookRightContent"></div>
          </div>

          <!-- 3D Physical Flipping Leaf Across Spine -->
          <div class="book-turning-leaf" id="bookTurningLeaf" style="display: none;">
            <div class="paper-grain-overlay"></div>
            <div class="leaf-face leaf-face-front" id="leafFaceFront"></div>
            <div class="leaf-face leaf-face-back" id="leafFaceBack"></div>
          </div>
        </div>

        <!-- Bottom Controls -->
        <div class="spotlight-bottom-controls">
          <button class="control-nav-btn" id="spotlightPrevBtn" type="button" disabled>← PREV</button>
          <div class="page-indicator-pills">
            <button class="pill-dot active" data-spread="0">01–02</button>
            <button class="pill-dot" data-spread="1">03–04</button>
            <button class="pill-dot" data-spread="2">05–06</button>
          </div>
          <button class="control-nav-btn" id="spotlightNextBtn" type="button">NEXT →</button>
        </div>
      `;

      this.renderCurrentSpread();
    }

    /* ------------------------------------------------------------------------
       4. RENDER CURRENT SPREAD CONTENT
       ------------------------------------------------------------------------ */
    renderCurrentSpread() {
      const current = this.spreads[this.currentSpread];
      if (!current) return;

      const leftContent = document.getElementById('bookLeftContent');
      const rightContent = document.getElementById('bookRightContent');

      if (leftContent) leftContent.innerHTML = current.left;
      if (rightContent) rightContent.innerHTML = current.right;

      this.updateControls();
      this.bindSpreadInteractiveLinks();
    }

    bindSpreadInteractiveLinks() {
      // TOC Jump Links
      const tocItems = this.modal.querySelectorAll('.toc-item');
      tocItems.forEach(item => {
        item.addEventListener('click', () => {
          const target = parseInt(item.getAttribute('data-goto'), 10);
          if (!isNaN(target)) this.turnToSpread(target);
        });
      });

      // Start Chapter CTA on final page
      const startChapterBtn = document.getElementById('startChapterBtn');
      if (startChapterBtn) {
        startChapterBtn.addEventListener('click', () => {
          this.closeSpotlight();
        });
      }
    }

    /* ------------------------------------------------------------------------
       5. AUTHENTIC 3D PAGE FLIP ANIMATION ACROSS SPINE
       ------------------------------------------------------------------------ */
    turnToSpread(targetSpreadIdx) {
      if (this.isTurning || targetSpreadIdx === this.currentSpread || targetSpreadIdx < 0 || targetSpreadIdx >= this.totalSpreads) {
        return;
      }
      this.isTurning = true;

      const isForward = targetSpreadIdx > this.currentSpread;
      const leaf = document.getElementById('bookTurningLeaf');
      const leafFront = document.getElementById('leafFaceFront');
      const leafBack = document.getElementById('leafFaceBack');
      const leftContent = document.getElementById('bookLeftContent');
      const rightContent = document.getElementById('bookRightContent');

      if (isForward) {
        // Forward turn: Right page flips over spine to Left
        // 1. Leaf front shows current right page
        leafFront.innerHTML = this.spreads[this.currentSpread].right;
        // 2. Leaf back shows target left page
        leafBack.innerHTML = this.spreads[targetSpreadIdx].left;
        // 3. Underlying right page updates immediately to target right page
        rightContent.innerHTML = this.spreads[targetSpreadIdx].right;

        // 4. Initialize leaf on right side
        leaf.style.display = 'block';
        leaf.style.transition = 'none';
        leaf.style.transformOrigin = 'left center';
        leaf.style.left = '50%';
        leaf.style.transform = 'rotateY(0deg)';
        leaf.offsetHeight; // Force reflow

        // 5. Flip 180 degrees over to left side
        leaf.style.transition = 'transform 0.72s cubic-bezier(0.25, 1, 0.5, 1)';
        leaf.style.transform = 'rotateY(-180deg)';

        setTimeout(() => {
          // 6. Complete flip: update underlying left page & hide leaf
          leftContent.innerHTML = this.spreads[targetSpreadIdx].left;
          leaf.style.display = 'none';
          leaf.style.transform = 'rotateY(0deg)';
          this.currentSpread = targetSpreadIdx;
          this.isTurning = false;
          this.updateControls();
          this.bindSpreadInteractiveLinks();
        }, 730);
      } else {
        // Backward turn: Left page flips over spine to Right
        // 1. Leaf back shows current left page
        leafBack.innerHTML = this.spreads[this.currentSpread].left;
        // 2. Leaf front shows target right page
        leafFront.innerHTML = this.spreads[targetSpreadIdx].right;
        // 3. Underlying left page updates immediately to target left page
        leftContent.innerHTML = this.spreads[targetSpreadIdx].left;

        // 4. Initialize leaf on left side at -180deg
        leaf.style.display = 'block';
        leaf.style.transition = 'none';
        leaf.style.transformOrigin = 'left center';
        leaf.style.left = '50%';
        leaf.style.transform = 'rotateY(-180deg)';
        leaf.offsetHeight; // Force reflow

        // 5. Flip back to 0deg
        leaf.style.transition = 'transform 0.72s cubic-bezier(0.25, 1, 0.5, 1)';
        leaf.style.transform = 'rotateY(0deg)';

        setTimeout(() => {
          // 6. Complete flip: update underlying right page & hide leaf
          rightContent.innerHTML = this.spreads[targetSpreadIdx].right;
          leaf.style.display = 'none';
          this.currentSpread = targetSpreadIdx;
          this.isTurning = false;
          this.updateControls();
          this.bindSpreadInteractiveLinks();
        }, 730);
      }
    }

    nextSpread() {
      if (this.currentSpread < this.totalSpreads - 1) {
        this.turnToSpread(this.currentSpread + 1);
      }
    }

    prevSpread() {
      if (this.currentSpread > 0) {
        this.turnToSpread(this.currentSpread - 1);
      }
    }

    updateControls() {
      const spreadNumEl = document.getElementById('spotlightSpreadNum');
      if (spreadNumEl) spreadNumEl.textContent = `0${this.currentSpread + 1}`;

      const prevBtn = document.getElementById('spotlightPrevBtn');
      const nextBtn = document.getElementById('spotlightNextBtn');
      if (prevBtn) prevBtn.disabled = (this.currentSpread === 0);
      if (nextBtn) nextBtn.disabled = (this.currentSpread === this.totalSpreads - 1);

      const pills = this.modal.querySelectorAll('.pill-dot');
      pills.forEach(pill => {
        const s = parseInt(pill.getAttribute('data-spread'), 10);
        if (s === this.currentSpread) {
          pill.classList.add('active');
        } else {
          pill.classList.remove('active');
        }
      });
    }

    /* ------------------------------------------------------------------------
       6. OPEN & CLOSE MODAL SPOTLIGHT
       ------------------------------------------------------------------------ */
    openSpotlight() {
      if (this.isOpen) return;
      this.isOpen = true;

      // Reset to first spread on fresh opening
      this.currentSpread = 0;
      this.renderCurrentSpread();

      const heroWrap = document.getElementById('heroBookWrap');
      if (heroWrap) {
        heroWrap.style.opacity = '0';
        heroWrap.style.pointerEvents = 'none';
      }

      this.backdrop.classList.add('is-active');
      this.modal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }

    closeSpotlight() {
      if (!this.isOpen) return;

      this.backdrop.classList.remove('is-active');
      this.modal.classList.remove('is-active');
      document.body.style.overflow = '';

      const heroWrap = document.getElementById('heroBookWrap');
      if (heroWrap) {
        heroWrap.style.opacity = '1';
        heroWrap.style.pointerEvents = 'auto';
      }

      this.isOpen = false;
    }

    /* ------------------------------------------------------------------------
       7. EVENT LISTENERS
       ------------------------------------------------------------------------ */
    bindEvents() {
      // 1. Open on Hero Book Cover Click
      const heroWrap = document.getElementById('heroBookWrap');
      if (heroWrap) {
        heroWrap.addEventListener('click', () => this.openSpotlight());
      }

      // 2. Close on Cross Button
      const closeBtn = document.getElementById('spotlightCloseBtn');
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.closeSpotlight();
        });
      }

      // 3. Close on Backdrop Click
      if (this.backdrop) {
        this.backdrop.addEventListener('click', () => this.closeSpotlight());
      }

      // 4. Prev & Next Buttons
      const prevBtn = document.getElementById('spotlightPrevBtn');
      const nextBtn = document.getElementById('spotlightNextBtn');
      if (prevBtn) prevBtn.addEventListener('click', () => this.prevSpread());
      if (nextBtn) nextBtn.addEventListener('click', () => this.nextSpread());

      // 5. Pill dots click
      const pills = this.modal.querySelectorAll('.pill-dot');
      pills.forEach(pill => {
        pill.addEventListener('click', () => {
          const target = parseInt(pill.getAttribute('data-spread'), 10);
          if (!isNaN(target)) this.turnToSpread(target);
        });
      });

      // 6. Keyboard navigation
      window.addEventListener('keydown', (e) => {
        if (!this.isOpen) return;

        if (e.key === 'Escape') {
          this.closeSpotlight();
        } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
          this.nextSpread();
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          this.prevSpread();
        }
      });
    }
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.techuillaPortfolioBook = new PortfolioBookController();
    });
  } else {
    window.techuillaPortfolioBook = new PortfolioBookController();
  }
})();
