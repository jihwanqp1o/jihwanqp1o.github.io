/* ============================================================
   TYPED ROLE ANIMATION
============================================================ */
const roles = ['Game Developer', 'App Developer', 'Web Developer'];
let roleIdx = 0, charIdx = 0, deleting = false;
const roleEl = document.getElementById('roleText');

function typeRole() {
  const word = roles[roleIdx];
  if (!deleting) {
    roleEl.textContent = word.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === word.length) {
      deleting = true;
      setTimeout(typeRole, 1800);
      return;
    }
  } else {
    roleEl.textContent = word.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }
  setTimeout(typeRole, deleting ? 55 : 100);
}

typeRole();

/* ============================================================
   NAV SCROLL SHADOW
============================================================ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 16);
}, { passive: true });

/* ============================================================
   MOBILE NAV TOGGLE
============================================================ */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
  });
});

/* ============================================================
   HERO CANVAS — interactive dot grid (aesthetic risk)
   Dots scatter on hover and spring back — references game grids
   and circuit boards without being literal about either.
============================================================ */
const canvas = document.getElementById('heroCanvas');
const ctx    = canvas.getContext('2d');

const SPACING = 30;
const R       = 2.2;
const PUSH_R  = 90;
const SPRING  = 0.11;
const DAMP    = 0.76;

let dots = [];
let mouseX = -9999, mouseY = -9999;

function resize() {
  const parent = canvas.parentElement;
  const size   = Math.min(parent.getBoundingClientRect().width, 400);
  canvas.width  = size;
  canvas.height = size;
  buildDots();
}

function buildDots() {
  dots = [];
  const cols = Math.floor((canvas.width  - SPACING) / SPACING) + 1;
  const rows = Math.floor((canvas.height - SPACING) / SPACING) + 1;
  const ox   = (canvas.width  - (cols - 1) * SPACING) / 2;
  const oy   = (canvas.height - (rows - 1) * SPACING) / 2;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const bx = ox + c * SPACING;
      const by = oy + r * SPACING;
      dots.push({ x: bx, y: by, bx, by, vx: 0, vy: 0 });
    }
  }
}

canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width  / rect.width;
  const scaleY = canvas.height / rect.height;
  mouseX = (e.clientX - rect.left)  * scaleX;
  mouseY = (e.clientY - rect.top)   * scaleY;
});

canvas.addEventListener('mouseleave', () => { mouseX = -9999; mouseY = -9999; });

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const d of dots) {
    const dx   = d.x - mouseX;
    const dy   = d.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < PUSH_R && dist > 0) {
      const force = (1 - dist / PUSH_R) * 10;
      d.vx += (dx / dist) * force;
      d.vy += (dy / dist) * force;
    }

    d.vx += (d.bx - d.x) * SPRING;
    d.vy += (d.by - d.y) * SPRING;
    d.vx *= DAMP;
    d.vy *= DAMP;
    d.x  += d.vx;
    d.y  += d.vy;

    const alpha = dist < PUSH_R
      ? 0.12 + (1 - dist / PUSH_R) * 0.65
      : 0.13;

    ctx.beginPath();
    ctx.arc(d.x, d.y, R, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(37, 99, 235, ${alpha})`;
    ctx.fill();
  }

  requestAnimationFrame(draw);
}

resize();
draw();

window.addEventListener('resize', resize);

/* ============================================================
   SCROLL REVEAL
============================================================ */
const revealTargets = [
  '.section-header',
  '.about-grid',
  '.skills-grid',
  '.projects-grid',
  '.contact-grid',
];

const revealEls = document.querySelectorAll(revealTargets.join(', '));
revealEls.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

revealEls.forEach(el => io.observe(el));
