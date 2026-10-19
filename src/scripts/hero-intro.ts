// Home intro.
//
// First visit in a browser session: a short logo moment. The mark's flow
// bands draw in on a midnight overlay, then the mark flies into its place
// in the header as the overlay lifts, and the hero builds piece by piece.
// About 1.6s in total.
//
// Later visits skip the overlay and the hero builds straight away.
// Reduced motion shows the finished page immediately.
//
// Uses the Web Animations API only, with no animation library.

const SESSION_KEY = 'bw-intro-played';
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

function markPlayed() {
  try {
    sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    /* private mode — replaying is harmless */
  }
}

function buildHero(hero: HTMLElement) {
  hero.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => el.classList.add('is-in'));
}

async function playOverlay(overlay: HTMLElement): Promise<void> {
  const mark = overlay.querySelector<SVGSVGElement>('svg');
  const target = document.querySelector<SVGSVGElement>('[data-header-mark]');
  if (!mark || !target) return;

  const bands = mark.querySelectorAll<SVGElement>('[data-mark-band]');
  const whale = mark.querySelector<SVGElement>('[data-mark-whale]');

  // 1. Bands draw left to right, the whale settles.
  const drawn = [...bands].map((band, i) =>
    band.animate([{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }], {
      duration: 750,
      delay: i * 70,
      easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
      fill: 'both',
    }).finished,
  );
  const whaleIn = whale?.animate(
    [
      { opacity: 0, transform: 'translate(-24px, 6px)' },
      { opacity: 1, transform: 'translate(0, 0)' },
    ],
    { duration: 700, delay: 250, easing: EASE, fill: 'both' },
  ).finished;
  await Promise.all([...drawn, whaleIn]);

  // 2. Fly the mark into the header logo's position while the overlay lifts.
  const from = mark.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  const scale = to.width / from.width;

  const fly = mark.animate(
    [{ transform: 'none' }, { transform: `translate(${dx}px, ${dy}px) scale(${scale})` }],
    { duration: 650, delay: 120, easing: EASE, fill: 'forwards' },
  ).finished;
  const lift = overlay.animate([{ backgroundColor: '#00151b' }, { backgroundColor: 'rgb(0 21 27 / 0)' }], {
    duration: 600,
    delay: 160,
    easing: EASE,
    fill: 'forwards',
  }).finished;
  await Promise.all([fly, lift]);
}

export async function initHeroIntro() {
  const root = document.documentElement;
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const overlay = document.querySelector<HTMLElement>('[data-intro-overlay]');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const finish = () => {
    root.classList.remove('intro-pending');
    if (hero) buildHero(hero);
  };

  if (!hero) return finish();
  if (reduce || !overlay || !root.classList.contains('intro-pending')) {
    root.classList.remove('intro-pending');
    requestAnimationFrame(() => buildHero(hero));
    return;
  }

  try {
    await playOverlay(overlay);
  } finally {
    markPlayed();
    finish();
  }
}
