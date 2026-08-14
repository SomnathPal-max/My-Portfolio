/*
  Portfolio interactions — no framework or build step required.
  Content that is specific to your career is intentionally easy to find in index.html.
*/

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

// Set the footer year.
$('#year').textContent = new Date().getFullYear();

// Split trusted, author-written headings into individual animated lines.
// Nodes are moved directly instead of reconstructing markup from HTML strings.
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

// Entry sequence.
window.addEventListener('load', () => {
  const loader = $('.preloader');
  const counter = $('.preloader__count');
  const line = $('.preloader__line span');
  let count = 0;
  const loaderTimer = window.setInterval(() => {
    count = Math.min(count + Math.ceil(Math.random() * 18), 100);
    counter.textContent = String(count).padStart(2, '0');
    line.style.width = `${count}%`;
    if (count === 100) {
      window.clearInterval(loaderTimer);
      window.setTimeout(() => {
        loader.classList.add('is-loaded');
        $$('.title-line > span').forEach((item, index) => {
          item.style.transition = `transform 1.05s ${index * 110}ms cubic-bezier(.22,1,.36,1)`;
          item.style.transform = 'translateY(0)';
        });
        $$('.hero .reveal-up').forEach((item, index) => {
          window.setTimeout(() => item.classList.add('is-visible'), 520 + index * 90);
        });
      }, 320);
    }
  }, 45);
});

// Reveal content as it enters the viewport.
const revealObserver = new IntersectionObserver(
  (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
  { threshold: 0.14, rootMargin: '0px 0px -45px' }
);
$$('.reveal-up, .reveal-project, .split-lines').forEach((item) => revealObserver.observe(item));

// Tiny custom cursor for fine pointers.
if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
  const dot = $('.cursor--dot');
  const ring = $('.cursor--ring');
  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  window.addEventListener('pointermove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  const easeCursor = () => {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(easeCursor);
  };
  easeCursor();
  $$('a, button').forEach((item) => {
    item.addEventListener('pointerenter', () => ring.classList.add('is-hovering'));
    item.addEventListener('pointerleave', () => ring.classList.remove('is-hovering'));
  });
}

// Scroll progress and gentle parallax.
const progress = $('.scroll-indicator span');
const orb = $('.hero__orbit');
window.addEventListener('scroll', () => {
  const top = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.height = `${max ? (top / max) * 100 : 0}%`;
  if (!prefersReducedMotion) orb.style.transform = `rotate(${top * 0.08}deg)`;
}, { passive: true });

// Mobile navigation.
const menuButton = $('.menu-button');
const mobileNav = $('.mobile-nav');
if (menuButton) {
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

// Ambient canvas: a restrained field of drifting points behind the page.
if (!prefersReducedMotion) {
  const canvas = $('.ambient-canvas');
  const context = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let dots = [];

  const resizeCanvas = () => {
    width = canvas.width = window.innerWidth * Math.min(window.devicePixelRatio, 2);
    height = canvas.height = window.innerHeight * Math.min(window.devicePixelRatio, 2);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(Math.min(window.devicePixelRatio, 2), 0, 0, Math.min(window.devicePixelRatio, 2), 0, 0);
    dots = Array.from({ length: Math.min(40, Math.floor(window.innerWidth / 30)) }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 1.2 + 0.2,
      speed: Math.random() * 0.16 + 0.04,
      sway: Math.random() * Math.PI * 2
    }));
  };
  const drawDots = (time = 0) => {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.fillStyle = 'rgba(29, 30, 28, .25)';
    dots.forEach((dot) => {
      dot.y -= dot.speed;
      if (dot.y < -10) dot.y = window.innerHeight + 10;
      const x = dot.x + Math.sin(time * 0.0003 + dot.sway) * 12;
      context.beginPath();
      context.arc(x, dot.y, dot.radius, 0, Math.PI * 2);
      context.fill();
    });
    requestAnimationFrame(drawDots);
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  requestAnimationFrame(drawDots);
}
