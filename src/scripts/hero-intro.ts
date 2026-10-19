// Signature moment: the logo's flow bands draw in left to right, the whale
// settles into place, then the headline lines rise in.
//
// Plays in full once per browser session (~1.5s). Later visits in the same
// session skip the mark animation and use the quick CSS reveal only.
// Reduced-motion visitors see the finished state with no animation.
import { gsap } from 'gsap';

const SESSION_KEY = 'bw-intro-played';

function hasPlayed(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}
function markPlayed() {
  try {
    sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    /* private mode etc. — replaying is harmless */
  }
}

let timeline: gsap.core.Timeline | undefined;

export function initHeroIntro() {
  timeline?.kill();
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) return;

  const reveals = hero.querySelectorAll<HTMLElement>('[data-reveal]');
  const showText = () => reveals.forEach((el) => el.classList.add('is-in'));

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mark = hero.querySelector<SVGSVGElement>('[data-mark="hero"]');

  if (reduce || !mark) {
    document.documentElement.classList.remove('intro-pending');
    showText();
    return;
  }
  if (hasPlayed()) {
    document.documentElement.classList.remove('intro-pending');
    // Let the CSS reveal run on the next frame so the transition is visible.
    requestAnimationFrame(showText);
    return;
  }

  const bands = mark.querySelectorAll('[data-mark-band]');
  const whale = mark.querySelector('[data-mark-whale]');

  timeline = gsap.timeline({
    defaults: { ease: 'expo.out' },
    onComplete: markPlayed,
  });

  timeline
    .set(bands, { clipPath: 'inset(0 100% 0 0)' })
    .set(whale, { autoAlpha: 0 })
    .call(() => document.documentElement.classList.remove('intro-pending'))
    .fromTo(
      bands,
      { clipPath: 'inset(0 100% 0 0)' },
      { clipPath: 'inset(0 0% 0 0)', duration: 1.1, stagger: 0.09, ease: 'power3.inOut' },
      0,
    )
    .fromTo(
      whale,
      { autoAlpha: 0, x: -28, y: 6 },
      { autoAlpha: 1, x: 0, y: 0, duration: 1.0 },
      0.35,
    )
    .call(showText, undefined, 0.55);
}
