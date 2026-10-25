/* ==========================================================================
   SOMNATH PAL — PORTFOLIO INTERACTIONS & ADVANCED MOTION ENGINE
   Zero external dependencies. Pure vanilla ES6+ with strict security compliance.
   Theme: Cherry & Alabaster Design System
   ========================================================================== */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  // 1. Dynamic Footer Year
  const yearEl = $('#year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Global Toast Notification System
  const toast = $('#toast');
  const toastMessage = $('#toast-message');
  let toastTimer = null;

  function showToast(message = 'Copied to clipboard!') {
    if (!toast) return;
    if (toastMessage) toastMessage.textContent = message;
    toast.classList.add('is-visible');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2800);
  }

  // Copy to clipboard helper
  function copyTextToClipboard(text, successMessage) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMessage || `Copied ${text}`);
      }).catch(() => {
        fallbackCopyText(text, successMessage);
      });
    } else {
      fallbackCopyText(text, successMessage);
    }
  }

  function fallbackCopyText(text, successMessage) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    tempInput.setAttribute('readonly', '');
    tempInput.style.position = 'absolute';
    tempInput.style.left = '-9999px';
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast(successMessage || `Copied ${text}`);
    } catch (e) {
      showToast('Could not copy automatically');
    }
    document.body.removeChild(tempInput);
  }

  // Bind copy email buttons
  const heroCopyBtn = $('#hero-copy-email');
  if (heroCopyBtn) {
    heroCopyBtn.addEventListener('click', () => {
      copyTextToClipboard('somnathpalstudy@gmail.com', 'Copied somnathpalstudy@gmail.com! 🍒');
    });
  }

  const contactCopyBtn = $('#copy-email-button');
  if (contactCopyBtn) {
    contactCopyBtn.addEventListener('click', () => {
      copyTextToClipboard('somnathpalstudy@gmail.com', 'Email copied to clipboard! 🍒');
    });
  }

  // 3. Theme Toggle (Dark / Light) with Persistence: Cherry & Alabaster
  const themeToggle = $('#theme-toggle');
  const htmlRoot = document.documentElement;

  function getSavedTheme() {
    return localStorage.getItem('sp_theme') || 'dark';
  }

  function setTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('sp_theme', theme);
    const metaThemeColor = $('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0e070b' : '#faf6f0');
    }
  }

  // Initialize theme
  setTheme(getSavedTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = htmlRoot.getAttribute('data-theme') || 'dark';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
      showToast(`Switched to ${nextTheme} mode`);
    });
  }

  // 4. Live IST Clock (Kolkata, WB)
  const clockEl = $('#live-clock');
  function updateClock() {
    if (!clockEl) return;
    try {
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      const timeStr = new Intl.DateTimeFormat('en-IN', options).format(new Date());
      clockEl.textContent = `Kolkata · ${timeStr} IST`;
    } catch (e) {
      clockEl.textContent = 'Kolkata, WB · Active';
    }
  }
  updateClock();
  setInterval(updateClock, 30000);

  // 5. Typographic Split Lines Animation
  function prepareLineReveal(element) {
    const nodes = [...element.childNodes];
    const lines = [[]];

    nodes.forEach((node) => {
      if (node.nodeName === 'BR') {
        lines.push([]);
      } else {
        lines[lines.length - 1].push(node);
      }
    });

    const fragment = document.createDocumentFragment();
    lines.forEach((lineNodes) => {
      const wrap = document.createElement('span');
      const line = document.createElement('span');
      wrap.className = 'line-wrap';
      line.className = 'line';
      lineNodes.forEach((node) => line.append(node));
      wrap.append(line);
      fragment.append(wrap);
    });
    element.replaceChildren(fragment);
  }
  $$('.split-lines').forEach(prepareLineReveal);

  // 6. Preloader Sequence & Hero Typographic Entrance
  window.addEventListener('load', () => {
    const loader = $('.preloader');
    const counter = $('.preloader__count');
    const line = $('.preloader__line span');
    const statusText = $('#preloader-status');
    let count = 0;

    const statusSteps = [
      { at: 20, text: 'Loading core modules...' },
      { at: 55, text: 'Initializing cherry aesthetic...' },
      { at: 85, text: 'Mounting alabaster interface...' },
      { at: 100, text: 'Ready.' }
    ];

    const loaderTimer = window.setInterval(() => {
      count = Math.min(count + Math.ceil(Math.random() * 16), 100);
      if (counter) counter.textContent = String(count).padStart(2, '0');
      if (line) line.style.width = `${count}%`;

      const currentStatus = statusSteps.find((s) => count >= s.at);
      if (currentStatus && statusText) {
        statusText.textContent = currentStatus.text;
      }

      if (count === 100) {
        window.clearInterval(loaderTimer);
        window.setTimeout(() => {
          if (loader) loader.classList.add('is-loaded');

          // Trigger Hero Entrance
          $$('.title-line > span').forEach((item, index) => {
            item.style.transition = `transform 1.05s ${index * 110}ms cubic-bezier(.16,1,.3,1)`;
            item.style.transform = 'translateY(0)';
          });

          $$('.hero .reveal-up').forEach((item, index) => {
            window.setTimeout(() => item.classList.add('is-visible'), 480 + index * 80);
          });
        }, 280);
      }
    }, 38);
  });

  // 7. Viewport Intersection Observer for Scroll Reveals
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px' }
  );
  $$('.reveal-up, .reveal-project, .split-lines').forEach((item) => revealObserver.observe(item));

  // 8. Dynamic Typewriter Role Cycler
  const typewriterText = $('#typewriter-text');
  if (typewriterText && !prefersReducedMotion) {
    const roles = [
      'Full-Stack Developer',
      'Java & DSA Builder',
      'AI Systems Creator',
      'Hackathon Finalist (6+)',
      'B.Tech CSE @ JISCE'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function tick() {
      const currentRole = roles[roleIndex];
      if (isDeleting) {
        charIndex--;
        typingSpeed = 50;
      } else {
        charIndex++;
        typingSpeed = 110;
      }

      typewriterText.textContent = currentRole.substring(0, charIndex);

      if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 1900;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 400;
      }

      setTimeout(tick, typingSpeed);
    }
    setTimeout(tick, 1000);
  }

  // 9. Custom Magnetic Cursor
  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    const dot = $('.cursor--dot');
    const ring = $('.cursor--ring');
    const ringText = $('.cursor__text');
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    window.addEventListener('pointermove', (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      if (dot) {
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      }
    });

    const easeCursor = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ring) {
        ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      }
      requestAnimationFrame(easeCursor);
    };
    easeCursor();

    $$('a, button, .project__visual, input').forEach((item) => {
      item.addEventListener('pointerenter', () => {
        if (ring) ring.classList.add('is-hovering');
        if (item.classList.contains('project__visual')) {
          if (ring) ring.classList.add('has-text');
          if (ringText) ringText.textContent = 'View';
        }
      });
      item.addEventListener('pointerleave', () => {
        if (ring) {
          ring.classList.remove('is-hovering');
          ring.classList.remove('has-text');
        }
        if (ringText) ringText.textContent = '';
      });
    });
  }

  // 10. True Magnetic Physics for Buttons & Elements
  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    const magneticItems = $$('.magnetic');
    magneticItems.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
        el.style.transition = 'transform 0.1s ease-out';
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0px, 0px)';
        el.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
      });
    });
  }

  // 11. 3D Tilt & Specular Effect for Cards
  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    const tiltCards = $$('.project__visual, .hero__side');
    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
        card.style.transition = 'transform 0.12s ease-out';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      });
    });
  }

  // 12. Scroll Progress & Orbit Rotation & Active Nav Spy
  const progress = $('.scroll-indicator span');
  const orb = $('.hero__orbit');
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');

  window.addEventListener(
    'scroll',
    () => {
      const top = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;

      if (progress && max) {
        progress.style.height = `${(top / max) * 100}%`;
      }

      if (!prefersReducedMotion && orb) {
        orb.style.transform = `rotate(${top * 0.08}deg)`;
      }

      // Active Nav Spy
      let currentSection = '';
      sections.forEach((sec) => {
        const secTop = sec.offsetTop - 120;
        const secHeight = sec.offsetHeight;
        if (top >= secTop && top < secTop + secHeight) {
          currentSection = sec.getAttribute('id');
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove('is-active');
        if (link.getAttribute('data-nav') === currentSection) {
          link.classList.add('is-active');
        }
      });
    },
    { passive: true }
  );

  // 13. Mobile Navigation Drawer
  const menuButton = $('.menu-button');
  const mobileNav = $('.mobile-nav');
  if (menuButton && mobileNav) {
    const toggleMenu = (force) => {
      const isOpen = typeof force === 'boolean' ? force : !document.body.classList.contains('menu-open');
      document.body.classList.toggle('menu-open', isOpen);
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
      mobileNav.setAttribute('aria-hidden', String(!isOpen));
    };
    menuButton.addEventListener('click', () => toggleMenu());
    $$('a', mobileNav).forEach((link) => link.addEventListener('click', () => toggleMenu(false)));
  }

  // 14. Projects Category Filter
  const filterBtns = $$('.filter-btn');
  const projectCards = $$('.project');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('is-hidden');
          setTimeout(() => card.classList.add('is-visible'), 50);
        } else {
          card.classList.add('is-hidden');
          card.classList.remove('is-visible');
        }
      });
    });
  });

  // 15. Interactive Developer Terminal: Cherry & Alabaster Theme
  const termInput = $('#terminal-input');
  const termHistory = $('#terminal-history');
  const termClearBtn = $('#terminal-clear-btn');
  const termChips = $$('.term-chip');

  const commands = {
    help: () => `
      <span style="color:#fb7185;">Available commands:</span><br/>
      • <b style="color:#fecdd3;">skills</b>    : Inspect programming languages, frameworks, tools<br/>
      • <b style="color:#fecdd3;">projects</b>  : View selected full-stack & AI projects<br/>
      • <b style="color:#fecdd3;">education</b> : Academic credentials & coursework at JISCE<br/>
      • <b style="color:#fecdd3;">contact</b>   : Direct email and social handles<br/>
      • <b style="color:#fecdd3;">sudo hire</b> : Instant evaluation mode for recruiters<br/>
      • <b style="color:#fecdd3;">clear</b>     : Clear console screen
    `,
    skills: () => `
      <b style="color:#fb7185;">Technical Skills &amp; Stack:</b><br/>
      • Languages: Java (OOP, Multithreading), TypeScript, JavaScript, Python, C/C++, SQL<br/>
      • Web &amp; Backend: React.js, Next.js, Node.js, Express, Tailwind CSS, REST APIs<br/>
      • AI &amp; Systems: LLM Integration, Voice Biometrics, Zero-Trust Offline AI, RAG<br/>
      • Core CS: Data Structures &amp; Algorithms, System Design, Operating Systems, DBMS
    `,
    projects: () => `
      <b style="color:#fb7185;">Featured Software Projects:</b><br/>
      1. <b>LawShield</b>: Women's safety platform with AI legal assistant &amp; SOS (TypeScript/Next.js)<br/>
      2. <b>NeuroSort AI</b>: Intelligent workspace analysis &amp; file sorting system (Next.js/Algorithms)<br/>
      3. <b>VoiceShield</b>: Real-time AI voice-cloning fraud detection engine (Cybersecurity/AI)<br/>
      4. <b>RozgarSetu AI</b>: Trust-verified employment navigator for govt vacancies &amp; MSMEs<br/>
      5. <b>VaultSign AI</b>: Local, zero-trust offline contract reviewer (Runs with Wi-Fi off)<br/>
      6. <b>SomSphere</b>: Real-time collaborative workspace with canvases &amp; encrypted PDF compiler
    `,
    education: () => `
      <b style="color:#fb7185;">Education &amp; Background:</b><br/>
      • Degree: B.Tech in Computer Science &amp; Engineering (2025 — 2029)<br/>
      • Institution: JIS College of Engineering, Kolkata, West Bengal<br/>
      • Focus Areas: Data Structures, Algorithms, Software Engineering, Machine Learning
    `,
    contact: () => `
      <b style="color:#fb7185;">Contact Information:</b><br/>
      • Email: <a href="mailto:somnathpalstudy@gmail.com" style="color:#f43f5e; text-decoration:underline;">somnathpalstudy@gmail.com</a><br/>
      • GitHub: <a href="https://github.com/SomnathPal-max" target="_blank" style="color:#fecdd3;">github.com/SomnathPal-max</a><br/>
      • LinkedIn: <a href="https://www.linkedin.com/in/somnath-pal-7a21a1373/" target="_blank" style="color:#fecdd3;">linkedin.com/in/somnath-pal-7a21a1373</a>
    `,
    'sudo hire': () => `
      <span style="color:#f43f5e;">[ACCESS GRANTED]</span> 🍒<br/>
      Somnath Pal is actively seeking Software Development Engineer (SDE) internships.<br/>
      Ready to build reliable, high-performance systems with your team.<br/>
      👉 Let's connect: <a href="mailto:somnathpalstudy@gmail.com" style="color:#fb7185; text-decoration:underline;">somnathpalstudy@gmail.com</a>
    `,
    clear: () => {
      if (termHistory) termHistory.innerHTML = '';
      return '';
    }
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'clear') {
      commands.clear();
      return;
    }

    const commandRow = document.createElement('div');
    commandRow.className = 'terminal-row';
    commandRow.innerHTML = `<span class="terminal-prompt">somnath@dev:~$</span> <span>${rawCmd}</span>`;
    termHistory.appendChild(commandRow);

    const outputBlock = document.createElement('div');
    outputBlock.className = 'terminal-output-block';

    if (commands[cmd]) {
      outputBlock.innerHTML = commands[cmd]();
    } else {
      outputBlock.innerHTML = `<span style="color:#fb7185;">command not found: ${cmd}</span>. Type <b style="color:#fecdd3;">help</b> for a list of commands.`;
    }

    termHistory.appendChild(outputBlock);
    const terminalBody = $('#terminal-output');
    if (terminalBody) terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  if (termInput) {
    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = termInput.value;
        termInput.value = '';
        executeCommand(val);
      }
    });
  }

  if (termClearBtn) {
    termClearBtn.addEventListener('click', () => {
      commands.clear();
    });
  }

  termChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        if (termInput) termInput.value = '';
        executeCommand(cmd);
      }
    });
  });

  // 16. Enhanced Ambient Particle & Constellation Canvas: Cherry & Alabaster
  if (!prefersReducedMotion) {
    const canvas = $('.ambient-canvas');
    if (canvas) {
      const context = canvas.getContext('2d');
      let width = 0;
      let height = 0;
      let dots = [];
      let mousePos = { x: -1000, y: -1000 };

      window.addEventListener('pointermove', (e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
      });

      const resizeCanvas = () => {
        width = canvas.width = window.innerWidth * Math.min(window.devicePixelRatio, 2);
        height = canvas.height = window.innerHeight * Math.min(window.devicePixelRatio, 2);
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        context.setTransform(Math.min(window.devicePixelRatio, 2), 0, 0, Math.min(window.devicePixelRatio, 2), 0, 0);

        const particleCount = Math.min(55, Math.floor(window.innerWidth / 26));
        dots = Array.from({ length: particleCount }, () => ({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          radius: Math.random() * 1.5 + 0.4,
          speed: Math.random() * 0.22 + 0.05,
          sway: Math.random() * Math.PI * 2,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -Math.random() * 0.3 - 0.1
        }));
      };

      const drawDots = (time = 0) => {
        const isDark = (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark';
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);

        // Cherry & Alabaster particles
        const particleColor = isDark ? 'rgba(251, 113, 133, ' : 'rgba(190, 18, 60, ';
        const lineColor = isDark ? 'rgba(225, 29, 72, ' : 'rgba(190, 18, 60, ';

        for (let i = 0; i < dots.length; i++) {
          const dot = dots[i];
          dot.y += dot.vy;
          dot.x += dot.vx + Math.sin(time * 0.0004 + dot.sway) * 0.2;

          if (dot.y < -10) dot.y = window.innerHeight + 10;
          if (dot.x < -10) dot.x = window.innerWidth + 10;
          if (dot.x > window.innerWidth + 10) dot.x = -10;

          // Mouse proximity reaction
          const dxMouse = mousePos.x - dot.x;
          const dyMouse = mousePos.y - dot.y;
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
          if (distMouse < 110) {
            dot.x -= (dxMouse / distMouse) * 1.2;
            dot.y -= (dyMouse / distMouse) * 1.2;
          }

          context.fillStyle = `${particleColor}0.5)`;
          context.beginPath();
          context.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
          context.fill();

          // Connect nearby particles with subtle cherry constellation lines
          for (let j = i + 1; j < dots.length; j++) {
            const dot2 = dots[j];
            const dx = dot.x - dot2.x;
            const dy = dot.y - dot2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 85) {
              const alpha = (1 - dist / 85) * (isDark ? 0.2 : 0.11);
              context.strokeStyle = `${lineColor}${alpha})`;
              context.lineWidth = 0.8;
              context.beginPath();
              context.moveTo(dot.x, dot.y);
              context.lineTo(dot2.x, dot2.y);
              context.stroke();
            }
          }
        }
        requestAnimationFrame(drawDots);
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      requestAnimationFrame(drawDots);
    }
  }
})();
