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

/* ---------- Sticky nav scroll state + scroll progress + mobile auto-hide ---------- */
function initNav() {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  const progress = document.querySelector<HTMLElement>('[data-progress]');
  const mobileNav = window.matchMedia('(max-width: 900px)');
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    if (nav) {
      nav.classList.toggle('is-scrolled', y > 64);
      // "Invisible butler": on mobile the bar steps away going down, returns on
      // the first upward gesture. Never while the menu is open.
      if (mobileNav.matches && !document.body.classList.contains('menu-open')) {
        if (y > lastY + 8 && y > 220) nav.classList.add('is-hidden');
        else if (y < lastY - 8 || y <= 220) nav.classList.remove('is-hidden');
      } else {
        nav.classList.remove('is-hidden');
      }
      lastY = y;
    }
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

/* ---------- Gold cursor: dot + trailing ring + soft spotlight (fine pointers) ---------- */
function initCursor() {
  if (reduced || !window.matchMedia('(pointer: fine)').matches) return;
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  const spot = document.createElement('div');
  spot.className = 'cursor-spot';
  document.body.append(spot, dot, ring);
  document.body.classList.add('has-cursor');
  // start offscreen so nothing flashes at the corner before first mousemove
  let rx = -200, ry = -200, sx = -200, sy = -200, x = -200, y = -200;
  dot.style.transform = `translate(${x}px, ${y}px)`;
  ring.style.transform = `translate(${rx}px, ${ry}px)`;
  spot.style.transform = `translate(${sx}px, ${sy}px)`;
  document.addEventListener('mousemove', (e) => {
    x = e.clientX; y = e.clientY;
    dot.style.transform = `translate(${x}px, ${y}px)`;
  }, { passive: true });
  const loop = () => {
    rx += (x - rx) * 0.16; ry += (y - ry) * 0.16;
    sx += (x - sx) * 0.09; sy += (y - sy) * 0.09; // spotlight lags further for depth
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    spot.style.transform = `translate(${sx}px, ${sy}px)`;
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

/* ---------- Magnetic buttons: primary CTAs lean toward the cursor ---------- */
function initMagnetic() {
  if (reduced || !window.matchMedia('(pointer: fine)').matches) return;
  const targets = document.querySelectorAll<HTMLElement>('[data-magnetic], .btn');
  targets.forEach((el) => {
    const strength = Number(el.getAttribute('data-magnetic')) || 0.3;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      if (raf) return;
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${(mx * strength).toFixed(2)}px, ${(my * strength).toFixed(2)}px)`;
        raf = 0;
      });
    };
    const reset = () => {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      el.style.transform = '';
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', reset);
  });
}

/* ---------- Ambient sound: elegant opt-in toggle (never autoplays with sound) ---------- */
function initAudio() {
  const toggle = document.querySelector<HTMLButtonElement>('[data-audio-toggle]');
  const audio = document.querySelector<HTMLAudioElement>('[data-audio]');
  if (!toggle || !audio) return;
  const KEY = 'sca-sound';
  const TARGET = 0.55; // comfortable ambient level
  let fadeId = 0;

  // iPhone Safari ignores writes to HTMLMediaElement.volume (always reads 1).
  // Detect that once: set, read back, restore. When not settable, skip fades.
  const canSetVolume = (() => {
    try {
      const prev = audio.volume;
      audio.volume = prev === 1 ? 0.9 : 1;
      const settable = audio.volume !== prev;
      audio.volume = prev;
      return settable;
    } catch { return false; }
  })();

  const fade = (to: number, after?: () => void) => {
    if (!canSetVolume) { after?.(); return; }
    if (fadeId) cancelAnimationFrame(fadeId);
    let frames = 0;
    const step = () => {
      const diff = to - audio.volume;
      // Hard frame cap: never trust volume convergence alone (some platforms
      // quantise or clamp writes) — snap and finish rather than loop forever.
      if (Math.abs(diff) < 0.02 || ++frames > 240) { audio.volume = to; fadeId = 0; after?.(); return; }
      audio.volume = Math.max(0, Math.min(1, audio.volume + diff * 0.08));
      fadeId = requestAnimationFrame(step);
    };
    fadeId = requestAnimationFrame(step);
  };

  const play = () => {
    if (canSetVolume) audio.volume = 0;
    audio.play().then(() => {
      toggle.classList.add('is-playing');
      toggle.setAttribute('aria-pressed', 'true');
      fade(TARGET);
      try { localStorage.setItem(KEY, 'on'); } catch { /* ignore */ }
    }).catch(() => {
      // No file yet or blocked — leave it off silently.
      toggle.classList.remove('is-playing');
      toggle.setAttribute('aria-pressed', 'false');
    });
  };
  const stop = () => {
    if (fadeId) { cancelAnimationFrame(fadeId); fadeId = 0; }
    fade(0, () => audio.pause());
    toggle.classList.remove('is-playing');
    toggle.setAttribute('aria-pressed', 'false');
    try { localStorage.setItem(KEY, 'off'); } catch { /* ignore */ }
  };

  toggle.addEventListener('click', () => {
    if (toggle.classList.contains('is-playing')) stop(); else play();
  });

  // Remember preference: if the user had it on, resume after their first gesture.
  // Must be an activation-triggering event — on iOS touch, pointerdown is NOT
  // (WebKit only unlocks media on pointerup/click/keydown), so play() would
  // reject and the once-listener would be burned for the whole visit.
  let pref = 'off';
  try { pref = localStorage.getItem(KEY) || 'off'; } catch { /* ignore */ }
  if (pref === 'on') {
    const resume = () => { play(); window.removeEventListener('pointerup', resume); window.removeEventListener('keydown', resume); };
    window.addEventListener('pointerup', resume, { once: true });
    window.addEventListener('keydown', resume, { once: true });
  }

  // Be a good citizen: pause when the tab is hidden, resume if it was playing.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { if (!audio.paused) audio.pause(); }
    else if (toggle.classList.contains('is-playing') && audio.paused) audio.play().catch(() => {});
  });
}

/* ---------- Sound invite: the concierge's suggestion, not a pop-up ---------- */
function initSoundInvite() {
  const pill = document.querySelector<HTMLElement>('[data-sound-invite]');
  const toggle = document.querySelector<HTMLButtonElement>('[data-audio-toggle]');
  if (!pill || !toggle || reduced) return;

  // Returning visitors with a stated preference are never re-asked.
  let pref: string | null = null;
  try { pref = localStorage.getItem('sca-sound'); } catch { /* ignore */ }
  if (pref !== null) return;

  let hideTimer = 0;
  const hide = () => {
    pill.classList.remove('is-visible');
    window.clearTimeout(hideTimer);
    window.setTimeout(() => { pill.hidden = true; }, 700);
  };
  const show = () => {
    pill.hidden = false;
    requestAnimationFrame(() => pill.classList.add('is-visible'));
    hideTimer = window.setTimeout(hide, 7000); // fades away on its own; may return next visit
  };

  pill.querySelector('[data-sound-accept]')?.addEventListener('click', () => { toggle.click(); hide(); });
  pill.querySelector('[data-sound-dismiss]')?.addEventListener('click', () => {
    try { localStorage.setItem('sca-sound', 'off'); } catch { /* ignore */ }
    hide();
  });

  if ((window as unknown as { __scaPreloaded?: boolean }).__scaPreloaded) window.setTimeout(show, 900);
  else window.addEventListener('sca:preloaded', () => window.setTimeout(show, 900), { once: true });
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
    initMagnetic();
    initAudio();
    initSoundInvite();
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}
