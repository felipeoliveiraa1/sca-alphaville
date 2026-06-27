/* SCA — client motion engine. Vanilla, dependency-free, reduced-motion aware. */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Smooth inertia scrolling (desktop / fine-pointer only) ---------- */
function initSmoothScroll() {
  if (reduced) return;
  // Touch devices keep their native momentum; only hijack for mouse/trackpad.
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (document.documentElement.scrollHeight <= window.innerHeight) return;

  // Our rAF lerp provides the smoothing — disable CSS smooth so per-frame scrollTo is instant.
  document.documentElement.style.scrollBehavior = 'auto';

  const ease = 0.12; // lower = heavier/floatier, higher = snappier
  let target = window.scrollY;
  let current = target;
  let running = false;

  const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;
  const clamp = (v: number) => Math.max(0, Math.min(v, maxScroll()));

  const loop = () => {
    current += (target - current) * ease;
    if (Math.abs(target - current) < 0.4) { current = target; running = false; }
    window.scrollTo(0, current);
    if (running) requestAnimationFrame(loop);
  };
  const start = () => { if (!running) { running = true; requestAnimationFrame(loop); } };

  window.addEventListener('wheel', (e) => {
    if (e.ctrlKey) return;        // let pinch-zoom pass through
    e.preventDefault();
    target = clamp(target + e.deltaY);
    start();
  }, { passive: false });

  // Resync when scroll changes by other means (scrollbar drag, keyboard) while idle.
  window.addEventListener('scroll', () => {
    if (!running) { target = current = window.scrollY; }
  }, { passive: true });
  window.addEventListener('resize', () => { target = clamp(target); }, { passive: true });

  // In-page anchors glide through the same engine.
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      target = clamp(window.scrollY + (el as HTMLElement).getBoundingClientRect().top);
      start();
      history.pushState(null, '', id);
    });
  });
}

/* ---------- Sticky nav scroll state + scroll progress ---------- */
function initNav() {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  const progress = document.querySelector<HTMLElement>('[data-progress]');
  const onScroll = () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('is-scrolled', y > 64);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- Mobile menu (focus-trapped, Escape-closable) ---------- */
function initMenu() {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  if (!toggle || !menu) return;
  let lastFocused: HTMLElement | null = null;
  const focusables = (): HTMLElement[] => [toggle, ...Array.from(menu.querySelectorAll<HTMLElement>('a[href], button'))];

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { close(); return; }
    if (e.key !== 'Tab') return;
    const f = focusables();
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  const open = () => {
    lastFocused = document.activeElement as HTMLElement;
    document.body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    const links = menu.querySelectorAll<HTMLElement>('a[href]');
    if (links[0]) links[0].focus();
    document.addEventListener('keydown', onKey);
  };
  function close() {
    document.body.classList.remove('menu-open');
    toggle!.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', onKey);
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  toggle.addEventListener('click', () => {
    if (document.body.classList.contains('menu-open')) close(); else open();
  });
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
}

/* ---------- Preloader curtain ---------- */
function initPreloader() {
  const pre = document.querySelector<HTMLElement>('[data-preloader]');
  if (!pre) return;
  const done = () => {
    pre.classList.add('is-done');
    document.body.classList.remove('is-loading');
    // Tell the GSAP layer the curtain is lifting so the hero intro can fire.
    (window as unknown as { __scaPreloaded?: boolean }).__scaPreloaded = true;
    window.dispatchEvent(new Event('sca:preloaded'));
    window.setTimeout(() => pre.remove(), 1500);
  };
  if (reduced) { done(); return; }
  // cinematic film-intro: black → logo materialises → hold → slow curtain lift (every load)
  window.requestAnimationFrame(() => pre.classList.add('is-active'));
  window.setTimeout(done, 2700);
}

/* ---------- Subtle gold cursor (fine pointers only) ---------- */
function initCursor() {
  if (reduced || !window.matchMedia('(pointer: fine)').matches) return;
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);
  document.body.classList.add('has-cursor');
  // start offscreen so the ring never flashes at the corner before first mousemove
  let rx = -100, ry = -100, x = -100, y = -100;
  dot.style.transform = `translate(${x}px, ${y}px)`;
  ring.style.transform = `translate(${rx}px, ${ry}px)`;
  document.addEventListener('mousemove', (e) => {
    x = e.clientX; y = e.clientY;
    dot.style.transform = `translate(${x}px, ${y}px)`;
  }, { passive: true });
  const loop = () => {
    rx += (x - rx) * 0.16; ry += (y - ry) * 0.16;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  const grow = () => ring.classList.add('is-grown');
  const shrink = () => ring.classList.remove('is-grown');
  document.querySelectorAll('a, button, [data-hover]').forEach((el) => {
    el.addEventListener('mouseenter', grow);
    el.addEventListener('mouseleave', shrink);
  });
}

export function initMotion() {
  (window as unknown as { __scaMotion?: boolean }).__scaMotion = true;
  const boot = () => {
    initPreloader();
    // reveals, counters and parallax are now driven by the GSAP layer (motion-gsap.ts)
    initSmoothScroll();
    initNav();
    initMenu();
    initCursor();
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}
