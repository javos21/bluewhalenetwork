// Site-wide motion, all progressive.
//
// - [data-reveal]        gets .is-in once, when it first enters the viewport
// - [data-count-to]      counts up from 0 when revealed
// - [data-scroll-fill]   words fill in as the paragraph scrolls through view
// - [data-parallax="n"]  drifts at n × scroll speed relative to its section
// - [data-progress]      exposes --progress (0–1) as its section passes the
//                        middle of the viewport, and marks steps as passed
//
// `.js-motion` on <html> arms the hidden start states in CSS. Reduced-motion
// visitors get the final state immediately.

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let observer: IntersectionObserver | undefined;
let scrollController: AbortController | undefined;

function countUp(el: HTMLElement) {
  const target = Number(el.dataset.countTo);
  const decimals = (el.dataset.countTo!.split('.')[1] || '').length;
  if (reduceMotion() || !Number.isFinite(target)) {
    el.textContent = target.toFixed(decimals);
    return;
  }
  const duration = 1400;
  const start = performance.now();
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 4);
    el.textContent = (target * eased).toFixed(decimals);
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function revealed(el: Element) {
  el.classList.add('is-in');
  el.querySelectorAll<HTMLElement>('[data-count-to]').forEach(countUp);
  if (el instanceof HTMLElement && el.dataset.countTo) countUp(el);
}

function armReveals() {
  observer?.disconnect();
  const root = document.documentElement;

  if (reduceMotion()) {
    root.classList.remove('js-motion');
    document.querySelectorAll('[data-reveal]').forEach(revealed);
    return;
  }
  root.classList.add('js-motion');

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        revealed(entry.target);
        observer?.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.15 },
  );

  document.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => {
    // The hero is choreographed by hero-intro.ts.
    if (el.closest('[data-hero]')) return;
    observer!.observe(el);
  });
}

/* ---------- scroll-linked effects (one rAF-throttled listener) ---------- */

type Fill = { el: HTMLElement; words: HTMLElement[] };

function armScrollEffects() {
  scrollController?.abort();
  scrollController = new AbortController();
  if (reduceMotion()) return;

  const fills: Fill[] = [...document.querySelectorAll<HTMLElement>('[data-scroll-fill]')].map((el) => ({
    el,
    words: [...el.querySelectorAll<HTMLElement>('.w')],
  }));
  const layers = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
  const tracks = [...document.querySelectorAll<HTMLElement>('[data-progress]')];
  if (!fills.length && !layers.length && !tracks.length) return;

  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = window.innerHeight;

    for (const { el, words } of fills) {
      const r = el.getBoundingClientRect();
      // Starts filling when the top reaches 85% of the viewport, finished
      // when the bottom reaches 45%.
      const start = vh * 0.85;
      const end = vh * 0.45;
      const p = Math.min(1, Math.max(0, (start - r.top) / (start - end + r.height)));
      const n = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle('on', i < n));
    }

    for (const el of layers) {
      const speed = Number(el.dataset.parallax) || 0.15;
      const host = el.parentElement!.getBoundingClientRect();
      const offset = host.top + host.height / 2 - vh / 2;
      el.style.setProperty('--py', `${(-offset * speed).toFixed(1)}px`);
    }

    for (const el of tracks) {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh * 0.65 - r.top) / (r.height || 1)));
      el.style.setProperty('--progress', p.toFixed(3));
      el.querySelectorAll<HTMLElement>('[data-step]').forEach((step) => {
        step.classList.toggle('is-passed', p >= Number(step.dataset.step));
      });
    }
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };
  update();
  window.addEventListener('scroll', onScroll, { passive: true, signal: scrollController.signal });
  window.addEventListener('resize', onScroll, { passive: true, signal: scrollController.signal });
}

// ClientRouter swaps <html> attributes on navigation; re-arm before paint.
document.addEventListener('astro:after-swap', () => {
  if (!reduceMotion()) document.documentElement.classList.add('js-motion');
});
document.addEventListener('astro:page-load', () => {
  armReveals();
  armScrollEffects();
});
