/* SCA — GSAP scroll-motion layer.
 * Sits on top of the vanilla engine (motion.ts keeps preloader/menu/cursor/
 * smooth-scroll/nav). This module owns the cinematic reveals: ScrollTrigger
 * scrub parallax, count-ups, per-word SplitText heading reveals, the hero
 * intro timeline, and the Cinema ken-burns zoom. Fully reduced-motion aware
 * and self-healing: on any failure it reveals all content so nothing is lost.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const ptBR = (n: number) => n.toLocaleString('pt-BR');

/** Last-resort: make everything visible (used under reduced-motion or on error). */
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
    .filter((el) => !el.closest('.hero')); // hero is driven by its own timeline
  ScrollTrigger.batch(els, {
    start: 'top 88%',
    onEnter: (batch) => batch.forEach((el) => (el as HTMLElement).classList.add('is-in')),
  });
}

/* ---------- Staggered groups: children rise + de-blur in sequence ---------- */
function initStaggers() {
  gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((parent) => {
    const kids = Array.from(parent.children) as HTMLElement[];
    if (!kids.length) return;
    const step = (Number(parent.getAttribute('data-stagger')) || 90) / 1000;
    gsap.from(kids, {
      y: 30,
      autoAlpha: 0,
      filter: 'blur(6px)',
      duration: 0.9,
      ease: 'expo.out',
      stagger: step,
      scrollTrigger: { trigger: parent, start: 'top 84%' },
    });
  });
}

/* ---------- Buttery scrub parallax (replaces the rAF version) ---------- */
function initParallax() {
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const speed = Number(el.getAttribute('data-parallax')) || 0.12;
    const amt = Math.min(8, speed * 50); // % of element height; insets give the slack
    const inHero = !!el.closest('.hero');
    const trigger = el.closest('section') || el;
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

/* ---------- Count-up odometers ---------- */
function initCounters() {
  gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
    const target = Number(el.getAttribute('data-count')) || 0;
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () =>
        gsap.to(obj, {
          v: target,
          duration: 1.9,
          ease: 'power2.out',
          onUpdate: () => (el.textContent = ptBR(Math.round(obj.v))),
        }),
    });
  });
}

/* ---------- Cinema: car pushes into frame as you scroll through ---------- */
function initKenBurns() {
  gsap.utils.toArray<HTMLElement>('[data-kenburns]').forEach((img) => {
    gsap.fromTo(
      img,
      { scale: 1.05 },
      {
        scale: 1.2,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('section') || img,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    );
  });
}

/* ---------- Signature: per-word masked reveal on section headings ---------- */
function initSplitHeadings() {
  const hasSplit = typeof (SplitText as unknown as { create?: unknown })?.create === 'function';
  gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
    if (!hasSplit) {
      el.classList.add('is-in');
      return;
    }
    try {
      el.style.transition = 'none';
      gsap.set(el, { autoAlpha: 1, y: 0, filter: 'none' });
      SplitText.create(el, {
        type: 'lines,words',
        autoSplit: true,
        onSplit: (self: { words: HTMLElement[] }) =>
          gsap.from(self.words, {
            yPercent: 100,
            autoAlpha: 0,
            filter: 'blur(6px)',
            duration: 1,
            ease: 'expo.out',
            stagger: 0.04,
            scrollTrigger: { trigger: el, start: 'top 82%' },
          }),
      } as object);
    } catch {
      gsap.set(el, { autoAlpha: 1, y: 0, filter: 'none' });
      el.classList.add('is-in');
    }
  });
}

/* ---------- Hero intro: cinematic cascade as the curtain lifts ---------- */
function initHeroIntro() {
  const hero = document.querySelector<HTMLElement>('.hero');
  if (!hero) return;

  const titleSpans = gsap.utils.toArray<HTMLElement>('.hero__title .line-mask > span');
  const media = hero.querySelector<HTMLElement>('.hero__media');
  const eyebrow = hero.querySelector<HTMLElement>('.hero__eyebrow');
  const lead = hero.querySelector<HTMLElement>('.hero__lead');
  const actions = hero.querySelector<HTMLElement>('.hero__actions');
  const scroll = hero.querySelector<HTMLElement>('.hero__scroll');
  const corner = hero.querySelector<HTMLElement>('.hero__corner');
  const items = [eyebrow, lead, actions, scroll, corner].filter(Boolean) as HTMLElement[];

  // Wrest control from the CSS reveal transitions, then prime the start state.
  // (y:0 clears the line-mask's CSS translateY(108%) base so gsap doesn't stack
  //  its yPercent on top of it — otherwise the lines never reach the viewport.)
  [...titleSpans, ...items].forEach((el) => (el.style.transition = 'none'));
  gsap.set(items, { autoAlpha: 0, y: 26, filter: 'blur(8px)' });
  gsap.set(titleSpans, { y: 0, yPercent: 120 });

  const build = () => {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    if (media) tl.from(media, { scale: 1.14, duration: 1.9, ease: 'power2.out' }, 0);
    tl.to(eyebrow, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.9 }, 0.15)
      // fromTo (immediateRender) so the masked lines own both endpoints cleanly.
      .fromTo(
        titleSpans,
        { yPercent: 120 },
        { yPercent: 0, duration: 1.15, stagger: 0.12, immediateRender: true },
        0.28,
      )
      .to(lead, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.9 }, 0.7)
      .to(actions, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.9 }, 0.85)
      .to([scroll, corner], { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.08 }, 1.05);
  };

  if ((window as unknown as { __scaPreloaded?: boolean }).__scaPreloaded) build();
  else window.addEventListener('sca:preloaded', build, { once: true });
}

export function initGsap() {
  const w = window as unknown as { __scaGsap?: boolean };
  try {
    if (reduce) {
      revealEverything();
      w.__scaGsap = true;
      return;
    }
    gsap.registerPlugin(ScrollTrigger, SplitText);

    initReveals();
    initStaggers();
    initParallax();
    initCounters();
    initKenBurns();
    initHeroIntro();

    const fonts = (document as unknown as { fonts?: { ready?: Promise<unknown> } }).fonts;
    if (fonts?.ready) {
      fonts.ready.then(() => {
        initSplitHeadings();
        ScrollTrigger.refresh();
      });
    } else {
      initSplitHeadings();
    }

    window.addEventListener('load', () => ScrollTrigger.refresh());
    w.__scaGsap = true;
  } catch (err) {
    console.error('[sca] gsap motion failed, revealing content', err);
    revealEverything();
    w.__scaGsap = true;
  }
}
