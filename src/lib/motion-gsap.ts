/* SCA — GSAP scroll-motion layer v2: "Um desfile noturno em três atos".
 *
 * Arquitetura mobile-first via gsap.matchMedia():
 *  - reduce  → revela tudo, zero animação
 *  - mobile  (≤900px) → cinema de scroll touch: pins do Cinema e da Galeria,
 *    contadores scrubados, agulha de progresso, fita de brasões, foco-de-centro.
 *    Regra dura: SÓ transform/opacity (nenhum filter/box-shadow animado).
 *  - desktop (≥901px) → pipeline completo (blur de requinte, pointer depth,
 *    ken-burns, coverflow) — tudo que já existia, sem regressão.
 *
 * O vanilla engine (motion.ts) segue dono de preloader/menu/cursor/som/nav.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

type Caps = {
  blur: boolean;        // pode animar filter?
  splitWords: boolean;  // headings por palavra (desktop) vs por linha mascarada (mobile)
  parallaxAmt: number;  // multiplicador da amplitude de parallax
  scrubCounters: boolean; // contadores amarrados ao scroll (mobile) vs count-up once
  mobile: boolean;
};

const DESKTOP_CAPS: Caps = { blur: true, splitWords: true, parallaxAmt: 1, scrubCounters: false, mobile: false };
const MOBILE_CAPS: Caps = { blur: false, splitWords: false, parallaxAmt: 0.6, scrubCounters: true, mobile: true };

const ptBR = (n: number) => n.toLocaleString('pt-BR');
const splitDone = new WeakSet<HTMLElement>();

/** Last-resort: make everything visible (reduced-motion or hard failure). */
function revealEverything() {
  document.documentElement.classList.add('reveal-all');
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    el.textContent = ptBR(Number(el.getAttribute('data-count')) || 0);
  });
}

/* ---------- Generic reveals: reuse the polished CSS .is-in transitions ---------- */
function initReveals() {
  const els = gsap.utils
    .toArray<HTMLElement>('[data-reveal]:not([data-split])')
    .filter((el) => !el.closest('.hero') && !el.closest('.cinema'));
  ScrollTrigger.batch(els, {
    start: 'top 88%',
    onEnter: (batch) => batch.forEach((el) => (el as HTMLElement).classList.add('is-in')),
  });
  // Cinema's reveals only participate outside the mobile pin; handled there.
  gsap.utils.toArray<HTMLElement>('.cinema [data-reveal]').forEach((el) => {
    ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => el.classList.add('is-in') });
  });
}

/* ---------- Staggered groups ---------- */
function initStaggers(caps: Caps) {
  gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((parent) => {
    const kids = Array.from(parent.children) as HTMLElement[];
    if (!kids.length) return;
    const step = (Number(parent.getAttribute('data-stagger')) || 90) / 1000;
    gsap.from(kids, {
      y: caps.mobile ? 24 : 30,
      autoAlpha: 0,
      ...(caps.blur ? { filter: 'blur(6px)' } : {}),
      duration: 0.9,
      ease: 'expo.out',
      stagger: step,
      scrollTrigger: { trigger: parent, start: 'top 84%', once: true },
    });
  });
}

/* ---------- Buttery scrub parallax ---------- */
function initParallax(caps: Caps) {
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    // In the mobile pinned Cinema the pin owns all interior motion.
    if (caps.mobile && el.closest('.cinema')) return;
    const speed = Number(el.getAttribute('data-parallax')) || 0.12;
    const amt = Math.min(8, speed * 50) * caps.parallaxAmt;
    const inHero = !!el.closest('.hero');
    const trigger = el.closest('section, footer') || el;
    gsap.fromTo(
      el,
      { yPercent: inHero ? 0 : amt },
      {
        yPercent: -amt,
        ease: 'none',
        scrollTrigger: {
          trigger,
          start: inHero ? 'top top' : 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
        },
      },
    );
  });
}

/* ---------- Counters: scrubbed on mobile ("você puxa os números"), once on desktop ---------- */
function initCounters(caps: Caps) {
  gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
    const target = Number(el.getAttribute('data-count')) || 0;
    const obj = { v: 0 };
    const render = () => (el.textContent = ptBR(Math.round(obj.v)));
    if (caps.scrubCounters) {
      const stat = el.closest<HTMLElement>('.reach__stat') || el;
      gsap.fromTo(obj, { v: 0 }, {
        v: target,
        ease: 'none',
        onUpdate: render,
        scrollTrigger: { trigger: stat, start: 'top 90%', end: 'top 38%', scrub: 0.5 },
      });
      // numeral settles in as its window plays
      gsap.fromTo(stat.querySelector('.reach__numline') || el,
        { yPercent: 24, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, ease: 'none',
          scrollTrigger: { trigger: stat, start: 'top 92%', end: 'top 60%', scrub: 0.5 } });
    } else {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => gsap.to(obj, { v: target, duration: 1.9, ease: 'power2.out', onUpdate: render }),
      });
    }
  });
}

/* ---------- Cinema desktop: ken-burns scrub ---------- */
function initKenBurns() {
  gsap.utils.toArray<HTMLElement>('[data-kenburns]').forEach((img) => {
    gsap.fromTo(img, { scale: 1.05 }, {
      scale: 1.2,
      ease: 'none',
      scrollTrigger: { trigger: img.closest('section') || img, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

/* ---------- Headings: per-word (desktop, blur) or masked lines (mobile, transform-only) ---------- */
function initSplitHeadings(caps: Caps) {
  const hasSplit = typeof (SplitText as unknown as { create?: unknown })?.create === 'function';
  gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
    if (!hasSplit || splitDone.has(el)) { el.classList.add('is-in'); return; }
    try {
      el.style.transition = 'none';
      // filter:'none' INLINE — the CSS reveal rule blurs [data-reveal] 7px on
      // desktop and .is-in never lands on split headings (words animate inside).
      gsap.set(el, { autoAlpha: 1, y: 0, filter: 'none' });
      splitDone.add(el);
      if (caps.splitWords) {
        SplitText.create(el, {
          type: 'lines,words',
          autoSplit: true,
          onSplit: (self: { words: HTMLElement[] }) =>
            gsap.from(self.words, {
              yPercent: 100, autoAlpha: 0, filter: 'blur(6px)',
              duration: 1, ease: 'expo.out', stagger: 0.04,
              scrollTrigger: { trigger: el, start: 'top 82%' },
            }),
        } as object);
      } else {
        SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self: { lines: HTMLElement[] }) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 0.95, ease: 'expo.out', stagger: 0.09,
              scrollTrigger: { trigger: el, start: 'top 84%' },
            }),
        } as object);
      }
    } catch {
      gsap.set(el, { autoAlpha: 1, y: 0 });
      el.classList.add('is-in');
    }
  });
}

/* ---------- Hero intro + exit ("a cortina desce") ---------- */
function initHero(caps: Caps, ctx: gsap.Context) {
  const hero = document.querySelector<HTMLElement>('.hero');
  if (!hero) return;

  const titleSpans = gsap.utils.toArray<HTMLElement>('.hero__title .line-mask > span');
  const media = hero.querySelector<HTMLElement>('.hero__media');
  const eyebrow = hero.querySelector<HTMLElement>('.hero__eyebrow');
  const lead = hero.querySelector<HTMLElement>('.hero__lead');
  const actions = hero.querySelector<HTMLElement>('.hero__actions');
  const scroll = hero.querySelector<HTMLElement>('.hero__scroll');
  const corner = hero.querySelector<HTMLElement>('.hero__corner');
  const exitScrim = hero.querySelector<HTMLElement>('.hero__exit-scrim');
  const items = [eyebrow, lead, actions, scroll, corner].filter(Boolean) as HTMLElement[];

  [...titleSpans, ...items].forEach((el) => (el.style.transition = 'none'));
  gsap.set(items, { autoAlpha: 0, y: 26, ...(caps.blur ? { filter: 'blur(8px)' } : {}) });
  gsap.set(titleSpans, { y: 0, yPercent: 120 });

  const un = caps.blur ? { filter: 'blur(0px)' } : {};

  const buildExit = () => {
    // Scroll pulls the lines back into their masks at slightly different speeds.
    const tl = gsap.timeline({
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom 20%', scrub: 0.4 },
      defaults: { ease: 'none' },
    });
    titleSpans.forEach((s, i) => tl.to(s, { yPercent: -(115 + i * 18) }, 0));
    if (media) tl.to(media, { scale: 1.08 }, 0);
    if (exitScrim) tl.to(exitScrim, { opacity: 0.68 }, 0);
    if (scroll) tl.to(scroll, { autoAlpha: 0, duration: 0.12 }, 0);
    if (eyebrow) tl.to(eyebrow, { autoAlpha: 0, y: -20 }, 0);
  };

  const build = () => {
    const tl = gsap.timeline({
      defaults: { ease: 'expo.out' },
      onComplete: () => ctx.add(buildExit),
    });
    if (media) tl.from(media, { scale: 1.14, duration: 1.9, ease: 'power2.out' }, 0);
    tl.to(eyebrow, { autoAlpha: 1, y: 0, ...un, duration: 0.9 }, 0.15)
      .fromTo(titleSpans, { yPercent: 120 }, { yPercent: 0, duration: 1.15, stagger: 0.12, immediateRender: true }, 0.28)
      .to(lead, { autoAlpha: 1, y: 0, ...un, duration: 0.9 }, 0.7)
      .to(actions, { autoAlpha: 1, y: 0, ...un, duration: 0.9 }, 0.85)
      .to([scroll, corner], { autoAlpha: 1, y: 0, ...un, duration: 0.8, stagger: 0.08 }, 1.05);
  };

  if ((window as unknown as { __scaPreloaded?: boolean }).__scaPreloaded) build();
  else window.addEventListener('sca:preloaded', () => ctx.add(build), { once: true });
}

/* ---------- Hero depth (fine pointers) ---------- */
function initHeroPointer() {
  if (!matchMedia('(pointer: fine)').matches) return;
  const hero = document.querySelector<HTMLElement>('.hero');
  const glow = hero?.querySelector<HTMLElement>('.hero__glow');
  const content = hero?.querySelector<HTMLElement>('.hero__content');
  if (!hero || !glow || !content) return;
  const gx = gsap.quickTo(glow, 'x', { duration: 0.9, ease: 'power3' });
  const gy = gsap.quickTo(glow, 'y', { duration: 0.9, ease: 'power3' });
  const cx = gsap.quickTo(content, 'x', { duration: 1.1, ease: 'power3' });
  const cy = gsap.quickTo(content, 'y', { duration: 1.1, ease: 'power3' });
  const move = (e: MouseEvent) => {
    const r = hero.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    gx(nx * 70); gy(ny * 70);
    cx(nx * -14); cy(ny * -14);
  };
  const leave = () => { gx(0); gy(0); cx(0); cy(0); };
  hero.addEventListener('mousemove', move);
  hero.addEventListener('mouseleave', leave);
  return () => { hero.removeEventListener('mousemove', move); hero.removeEventListener('mouseleave', leave); };
}

/* ---------- Desktop media clip reveals ---------- */
function initClipReveals() {
  gsap.utils.toArray<HTMLElement>('[data-clip]').forEach((el) => {
    gsap.fromTo(el, { clipPath: 'inset(0% 0% 100% 0%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)',
      ease: 'power3.out', duration: 1.2,
      scrollTrigger: { trigger: el, start: 'top 80%' },
    });
  });
}

/* ---------- Mobile media wipes (stand-in for clip reveals; scrubbed, reversible) ---------- */
function initMediaWipes() {
  gsap.utils.toArray<HTMLElement>('.eco__media, .fnd__media, .exp__media').forEach((el) => {
    gsap.fromTo(el, { y: 44, autoAlpha: 0.45 }, {
      y: 0, autoAlpha: 1, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 96%', end: 'top 52%', scrub: 0.6 },
    });
  });
}

/* ---------- Mobile "center focus": scroll-driven stand-in for hover ---------- */
function initCenterFocus() {
  gsap.utils.toArray<HTMLElement>('.ess__row').forEach((row) => {
    ScrollTrigger.create({
      trigger: row, start: 'top 64%', end: 'bottom 42%',
      toggleClass: { targets: row, className: 'is-focus' },
    });
  });
  gsap.utils.toArray<HTMLElement>('.exp__media').forEach((m) => {
    ScrollTrigger.create({
      trigger: m, start: 'top 62%', end: 'bottom 40%',
      toggleClass: { targets: m, className: 'is-focus' },
    });
  });
}

/* ---------- Mobile ghost numbers in Experiencias: their own drift layer ---------- */
function initGhostNumbers() {
  gsap.utils.toArray<HTMLElement>('.exp__num').forEach((num) => {
    const panel = num.closest('.exp__panel') || num;
    gsap.fromTo(num, { yPercent: 70, autoAlpha: 0 }, {
      yPercent: -30, autoAlpha: 1, ease: 'none',
      scrollTrigger: { trigger: panel, start: 'top 90%', end: 'bottom 30%', scrub: 0.6 },
    });
  });
}

/* ---------- PIN #1 · Cinema — "A Aparição" (mobile) ---------- */
function initCinemaPin() {
  const section = document.querySelector<HTMLElement>('.cinema');
  const img = section?.querySelector<HTMLElement>('.cinema__img');
  const veil = section?.querySelector<HTMLElement>('.cinema__veil');
  const l1 = section?.querySelector<HTMLElement>('.cinema__l1');
  const l2 = section?.querySelector<HTMLElement>('.cinema__l2');
  const line = section?.querySelector<HTMLElement>('.cinema__line');
  const eyebrow = section?.querySelector<HTMLElement>('.cinema__inner .eyebrow');
  const cap = section?.querySelector<HTMLElement>('.cinema__cap');
  if (!section || !img || !veil || !l1 || !l2) return;

  section.classList.add('is-pinned');
  // The pin owns this scene: neutralise the CSS reveal so nothing double-fires.
  if (line) { line.style.transition = 'none'; gsap.set(line, { autoAlpha: 1, y: 0 }); line.classList.add('is-in'); }
  if (eyebrow) { eyebrow.style.transition = 'none'; }

  // Split the plain sentence into word masks (safe: no styled spans inside l1).
  let words: HTMLElement[] = [];
  try {
    const split = SplitText.create(l1, { type: 'words', mask: 'words' } as object) as unknown as { words: HTMLElement[] };
    words = split.words || [];
  } catch { /* fall back to animating the whole span */ }
  const wordTargets = words.length ? words : [l1];

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=180%',
      pin: true,
      scrub: 0.8,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  // 0 → 40%: headlights in the dark — veil dissolves, dolly-out.
  tl.fromTo(veil, { opacity: 0.88 }, { opacity: 0, duration: 0.4 }, 0)
    .fromTo(img, { scale: 1.35 }, { scale: 1.12, duration: 0.42 }, 0)
    .fromTo(eyebrow, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.12 }, 0.16);

  // 30 → 72%: the manifesto assembles word by word, tied to the thumb.
  tl.fromTo(wordTargets,
    { yPercent: 120 },
    { yPercent: 0, duration: 0.42, stagger: 0.42 / Math.max(wordTargets.length, 1) },
    0.3);

  // 70 → 96%: the gold serif jewel line lands; final settle; a beat of stillness.
  tl.fromTo(l2, { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: 0.18 }, 0.7)
    .to(img, { scale: 1.06, duration: 0.26 }, 0.7);
  if (cap) tl.fromTo(cap, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, 0.82);

  return () => section.classList.remove('is-pinned');
}

/* ---------- PIN #2 · Galeria — "O Desfile" (both contexts; veil instead of brightness) ---------- */
function initGalleryPin(caps: Caps) {
  const section = document.querySelector<HTMLElement>('[data-gallery]');
  const viewport = section?.querySelector<HTMLElement>('[data-gal-viewport]');
  const track = section?.querySelector<HTMLElement>('[data-gal-track]');
  const counter = section?.querySelector<HTMLElement>('[data-gal-count]');
  const cards = gsap.utils.toArray<HTMLElement>('[data-gal-card]');
  if (!section || !viewport || !track || !cards.length) return;

  section.classList.add('is-pinned');
  const n = cards.length;
  const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

  const horizontal = gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => '+=' + distance(),
      pin: true,
      scrub: caps.mobile ? 0.8 : 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      snap: caps.mobile ? { snapTo: 1 / (n - 1), duration: 0.35, ease: 'power1.inOut' } : undefined,
      onUpdate: (self) => {
        if (!counter) return;
        const idx = Math.min(n, Math.max(1, Math.round(self.progress * (n - 1)) + 1));
        const text = `${String(idx).padStart(2, '0')} / ${String(n).padStart(2, '0')}`;
        if (counter.textContent !== text) counter.textContent = text;
      },
    },
  });

  // Cards breathe via an opacity veil + scale — composited, no filters anywhere.
  cards.forEach((card) => {
    const dim = card.querySelector<HTMLElement>('.gal__dim');
    gsap.fromTo(card, { scale: 0.93 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: card, containerAnimation: horizontal, start: 'left 82%', end: 'center 52%', scrub: true },
    });
    if (dim) {
      gsap.fromTo(dim, { opacity: 0.55 }, {
        opacity: 0, ease: 'none',
        scrollTrigger: { trigger: card, containerAnimation: horizontal, start: 'left 82%', end: 'center 52%', scrub: true },
      });
    }
  });

  return () => section.classList.remove('is-pinned');
}

/* ---------- Parcerias mobile: "Fita de Brasões" — counter-rotating rows ---------- */
function initRibbon() {
  const wrap = document.querySelector<HTMLElement>('[data-ribbon]');
  if (!wrap) return;
  const rowA = wrap.querySelector<HTMLElement>('[data-ribbon-row="a"]');
  const rowB = wrap.querySelector<HTMLElement>('[data-ribbon-row="b"]');
  const trigger = wrap.closest('section') || wrap;
  const opts = { trigger, start: 'top bottom', end: 'bottom top', scrub: 0.6 } as const;
  if (rowA) gsap.fromTo(rowA, { xPercent: 0 }, { xPercent: -16, ease: 'none', scrollTrigger: { ...opts } });
  if (rowB) gsap.fromTo(rowB, { xPercent: -16 }, { xPercent: 0, ease: 'none', scrollTrigger: { ...opts } });
}

/* ---------- Footer: the monument rises with your last gesture ---------- */
function initMonument() {
  const footer = document.querySelector<HTMLElement>('.footer');
  const monument = footer?.querySelector<HTMLElement>('.footer__monument');
  if (!footer || !monument) return;
  gsap.fromTo(monument, { yPercent: 26, scale: 0.97, autoAlpha: 0.6 }, {
    yPercent: 0, scale: 1, autoAlpha: 1, ease: 'none',
    scrollTrigger: {
      trigger: footer, start: 'top 80%', end: 'bottom bottom', scrub: 0.5,
      onUpdate: (self) => monument.classList.toggle('is-lit', self.progress > 0.92),
    },
  });
}

/* ---------- A Agulha: jewelled progress needle (mobile signature) ---------- */
function initNeedle() {
  const needle = document.querySelector<HTMLElement>('[data-needle]');
  const facet = needle?.querySelector<HTMLElement>('.facet');
  if (!needle || !facet) return;
  needle.classList.add('is-on');

  // Full-page rotation, like a rev counter winding through the visit.
  gsap.fromTo(facet, { rotation: 45 }, {
    rotation: 45 + 720, ease: 'none',
    scrollTrigger: { start: 0, end: 'max', scrub: 0.6, invalidateOnRefresh: true },
  });

  // A "gear click" pulse each time a chapter crosses in.
  let pulseTimer = 0;
  const pulse = () => {
    needle.classList.add('is-pulse');
    clearTimeout(pulseTimer);
    pulseTimer = window.setTimeout(() => needle.classList.remove('is-pulse'), 320);
  };
  gsap.utils.toArray<HTMLElement>('main > section').forEach((sec) => {
    ScrollTrigger.create({ trigger: sec, start: 'top 55%', onEnter: pulse, onEnterBack: pulse });
  });

  // The jewel retires as the monument lights up.
  const footer = document.querySelector<HTMLElement>('.footer');
  if (footer) {
    ScrollTrigger.create({
      trigger: footer, start: 'top 60%',
      onEnter: () => gsap.to(needle, { autoAlpha: 0, duration: 0.5 }),
      onLeaveBack: () => gsap.to(needle, { autoAlpha: 1, duration: 0.4 }),
    });
  }

  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  needle.addEventListener('click', toTop);
  return () => { needle.removeEventListener('click', toTop); needle.classList.remove('is-on', 'is-pulse'); };
}

/* ---------- Velocity-reactive marquee: the ribbon accelerates with your scroll ---------- */
function initMarqueeVelocity() {
  const marquees = gsap.utils.toArray<HTMLElement>('.marquee');
  if (!marquees.length) return;
  const tweens: gsap.core.Tween[] = [];
  marquees.forEach((mq) => {
    mq.classList.add('is-gsap');
    mq.querySelectorAll<HTMLElement>('.marquee__track').forEach((track) => {
      tweens.push(gsap.to(track, { xPercent: -100, ease: 'none', duration: 42, repeat: -1 }));
    });
  });
  let boost = 1;
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (self) => { boost = Math.min(4, 1 + Math.abs(self.getVelocity()) / 1400); },
  });
  const tick = () => {
    tweens.forEach((t) => t.timeScale(gsap.utils.interpolate(t.timeScale(), boost, 0.08)));
    boost = Math.max(1, boost * 0.985); // relax back to cruise speed over ~1s
  };
  gsap.ticker.add(tick);
  return () => {
    gsap.ticker.remove(tick);
    marquees.forEach((mq) => mq.classList.remove('is-gsap'));
  };
}

/* =============================== BOOT =============================== */
export function initGsap() {
  const w = window as unknown as { __scaGsap?: boolean };
  try {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    // iOS URL bar collapse fires resize; refreshing mid-pin causes jumps.
    ScrollTrigger.config({ ignoreMobileResize: true });

    const mm = gsap.matchMedia();
    let booted = false;
    mm.add(
      {
        reduce: '(prefers-reduced-motion: reduce)',
        mobile: '(max-width: 900px)',
        // exact complement of `mobile` — a plain (min-width: 901px) leaves
        // fractional widths (900, 901) matching NOTHING (browser zoom / 125%
        // OS scaling), and the page would sit invisible with reveals at opacity 0.
        desktop: 'not all and (max-width: 900px)',
      },
      (ctx) => {
        booted = true;
        const c = ctx.conditions as { reduce: boolean; mobile: boolean };
        if (c.reduce) { revealEverything(); return; }

        const caps = c.mobile ? MOBILE_CAPS : DESKTOP_CAPS;
        const cleanups: Array<(() => void) | void> = [];

        initReveals();
        initStaggers(caps);
        initParallax(caps);
        initCounters(caps);
        initHero(caps, ctx);
        // Pins MUST be created in document order (Cinema before Galeria):
        // out-of-order pins compute stale start/end for everything below them.
        if (c.mobile) cleanups.push(initCinemaPin());
        cleanups.push(initGalleryPin(caps));
        cleanups.push(initMarqueeVelocity());
        initMonument();

        if (c.mobile) {
          initMediaWipes();
          initCenterFocus();
          initGhostNumbers();
          initRibbon();
          cleanups.push(initNeedle());
        } else {
          initKenBurns();
          initClipReveals();
          cleanups.push(initHeroPointer());
        }

        // Non-pin triggers above were still created before the pins; re-sort into
        // document order and recompute every start/end with the pin spacers in place.
        ScrollTrigger.sort();
        ScrollTrigger.refresh();

        const fonts = (document as unknown as { fonts?: { ready?: Promise<unknown> } }).fonts;
        if (fonts?.ready) {
          fonts.ready.then(() => {
            // The breakpoint may have flipped while fonts loaded: this closure's
            // caps would then split headings with the WRONG profile and block the
            // fresh context (splitDone) from ever correcting it. Let the current
            // context's own callback handle it instead.
            if (matchMedia('(max-width: 900px)').matches !== caps.mobile) return;
            ctx.add(() => initSplitHeadings(caps));
            ScrollTrigger.sort();
            ScrollTrigger.refresh();
          });
        } else {
          initSplitHeadings(caps);
        }

        return () => cleanups.forEach((fn) => fn && fn());
      },
    );

    // Paranoid net: if no media context matched at all, never leave content hidden.
    if (!booted) { revealEverything(); }

    if (document.readyState === 'complete') ScrollTrigger.refresh();
    else window.addEventListener('load', () => { ScrollTrigger.sort(); ScrollTrigger.refresh(); });
    w.__scaGsap = true;
  } catch (err) {
    console.error('[sca] gsap motion failed, revealing content', err);
    revealEverything();
    w.__scaGsap = true;
  }
}
