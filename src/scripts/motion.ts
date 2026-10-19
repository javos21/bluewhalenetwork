// Scroll-reveal for [data-reveal] elements: headlines, copy and flow
// dividers get `.is-in` once, when they first enter the viewport.
//
// `.js-motion` on <html> is what arms the hidden starting states in CSS,
// so without JS, or with reduced motion, everything is simply visible.

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let observer: IntersectionObserver | undefined;

function armReveals() {
  const root = document.documentElement;
  observer?.disconnect();

  if (reduceMotion()) {
    root.classList.remove('js-motion');
    return;
  }
  root.classList.add('js-motion');

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        observer?.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.15 },
  );

  document.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => {
    // Hero elements are revealed by the intro sequence, not by scroll.
    if (el.closest('[data-hero]')) return;
    observer!.observe(el);
  });
}

// ClientRouter replaces <html> attributes on navigation, so re-apply the
// class before the new page paints to avoid a flash of revealed content.
document.addEventListener('astro:after-swap', () => {
  if (reduceMotion()) return;
  const root = document.documentElement;
  root.classList.add('js-motion');
  try {
    if (sessionStorage.getItem('bw-intro-played') !== '1') root.classList.add('intro-pending');
  } catch {
    /* ignore */
  }
});
document.addEventListener('astro:page-load', armReveals);
