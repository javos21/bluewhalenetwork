// The whale journey (Home only).
//
// Ported from the motion-led concept on codex/landing-concept-review
// (HeroStudyPage.tsx), which Nic chose, and rebuilt without React:
//
// 1. Surface: the whale rests beside the headline while three wave layers
//    drift. One whale element travels the whole page; it is never cloned.
// 2. Dive (pinned): scrolling carries it along a curved path through the
//    waterline, with a splash measured where its head meets the water,
//    while the ocean rises to fill the screen. It lands beside the client
//    logos, which arrive like a school of fish, turned to face them.
// 3. Journey: after the pin, the whale follows resting points
//    ([data-whale-stop]) through each section. It crosses to the next
//    section's side as that section arrives, with the choreography from
//    whaleChoreography.ts (cross, then dip and turn to face the content).
//    It swims along the Approach track and spouts at the surface.
//
// Reduced motion and no-JS visitors get still whales in every resting
// point instead (.whale-static). Everything is torn down before Astro
// swaps pages.

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { whaleChoreography } from '@/lib/whaleChoreography';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

type WhaleTone = 'light' | 'dark';
type Stop = {
  el: HTMLElement;
  section: HTMLElement;
  tone: WhaleTone;
  restFacing: number;
  swim: boolean;
  spout: boolean;
};

const DARK_WATER = new Set(['deep', 'midnight']);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

let teardown: (() => void) | null = null;

export function initWhaleJourney() {
  document.addEventListener('astro:page-load', start);
  document.addEventListener('astro:before-swap', stop);
}

function stop() {
  teardown?.();
  teardown = null;
}

function start() {
  stop();
  const world = document.querySelector<HTMLElement>('[data-ocean-world]');
  if (!world) return;
  const mm = gsap.matchMedia();
  mm.add(
    {
      desktop: '(min-width: 64rem)',
      mobile: '(max-width: 63.99rem)',
      motion: '(prefers-reduced-motion: no-preference)',
    },
    (context) => {
      if (!context.conditions?.motion) return;
      return runJourney(world, Boolean(context.conditions.mobile));
    },
  );
  teardown = () => mm.revert();
}

function runJourney(world: HTMLElement, mobile: boolean) {
  const q = <T extends Element = HTMLElement>(sel: string, root: ParentNode = world) => root.querySelector<T>(sel)!;
  const root = document.documentElement;
  const header = document.querySelector<HTMLElement>('[data-site-header]');
  const traveler = q('[data-traveler]');
  const enter = q('[data-traveler-enter]', traveler);
  const facing = q('[data-traveler-facing]', traveler);
  const pitch = q('[data-traveler-pitch]', traveler);
  const trails = q<SVGSVGElement>('[data-whale-trails]', traveler);
  const trailPaths = trails.querySelectorAll<SVGPathElement>('path');
  const body = q<SVGPathElement>('[data-whale-body]', traveler);
  const spout = q<SVGGElement>('[data-whale-spout]', traveler);
  const hero = q('[data-hero-scene]');
  const panel = q('[data-dive-panel]');
  const scenery = q('[data-scenery]');
  const copy = q('[data-hero-copy]');
  const slot = q('[data-whale-start]');
  const diveAnchor = q('[data-dive-anchor]');
  const splash = q<SVGSVGElement>('[data-splash]');
  const waveLayers = hero.querySelectorAll<SVGPathElement>('.ocean-layer');
  const clientsEls = panel.querySelectorAll<HTMLElement>('[data-client]');

  root.classList.add('whale-live');
  world.classList.add('is-scroll-scene');
  traveler.dataset.whaleTone = 'dark';

  /* ---------- measurements ---------- */

  const headerH = () => header?.offsetHeight ?? 0;
  const W = () => traveler.offsetWidth;
  const H = () => traveler.offsetHeight;
  const centerIn = (el: Element, base: Element) => {
    const r = el.getBoundingClientRect();
    const b = base.getBoundingClientRect();
    return { x: r.left - b.left + r.width / 2, y: r.top - b.top + r.height / 2, w: r.width };
  };
  const startPoint = () => centerIn(slot, hero);
  const landing = () => {
    const s = startPoint();
    const a = centerIn(diveAnchor, panel);
    return { x: a.x - s.x, y: a.y - s.y, scale: a.w / W() };
  };

  const sizeScene = () => {
    world.style.setProperty('--whale-w', `${slot.offsetWidth}px`);
    const grid = panel.firstElementChild as HTMLElement;
    const cs = getComputedStyle(panel);
    const panelNeeds = grid.scrollHeight + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    const heroNeeds = (hero.firstElementChild as HTMLElement).offsetHeight + hero.querySelector<SVGElement>('.hero-ocean')!.getBoundingClientRect().height * 0.75;
    const sceneH = Math.max(window.innerHeight - headerH(), 560, panelNeeds, heroNeeds);
    world.style.setProperty('--scene-h', `${Math.ceil(sceneH)}px`);
  };
  const placeAtStart = () => {
    const s = startPoint();
    gsap.set(traveler, { left: s.x - W() / 2, top: s.y - H() / 2 });
  };
  sizeScene();
  placeAtStart();

  /* ---------- surface: entrance and drifting water ---------- */

  const entrance = gsap.from(enter, { opacity: 0, y: 38, scale: 0.94, duration: 1.4, ease: 'power3.out', delay: 0.15 });
  const currents = [
    gsap.fromTo(waveLayers[0], { x: -100, y: 8 }, { x: 100, y: -12, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut' }),
    gsap.fromTo(waveLayers[1], { x: 85, y: -8 }, { x: -85, y: 12, duration: 7.5, repeat: -1, yoyo: true, ease: 'sine.inOut' }),
    gsap.fromTo(waveLayers[2], { x: -65, y: 6 }, { x: 65, y: -8, duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut' }),
  ];
  let heroInView = true;
  let diveStarted = false;
  const syncCurrents = () =>
    currents.forEach((c) => (heroInView && !diveStarted && !document.hidden ? c.resume() : c.pause()));

  /* ---------- the dive (pinned) ---------- */

  let contactTime: number | null = null;
  const journey = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: world,
      pin: true,
      start: () => `top top+=${headerH()}`,
      end: () => `+=${window.innerHeight * (mobile ? 1.8 : 2.6)}`,
      scrub: 0.8,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      refreshPriority: 10,
      onRefreshInit: () => {
        sizeScene();
        if (!following) placeAtStart();
        contactTime = null;
      },
      onUpdate: (self) => {
        if (self.progress > 0 && entrance.progress() < 1) entrance.progress(1);
        diveStarted = self.progress > 0.15;
        syncCurrents();
        if (!following) traveler.dataset.whaleTone = journey.time() > 0.7 ? 'light' : 'dark';
      },
    },
  })
    .to(copy, { x: mobile ? 30 : 90, y: -25, opacity: 0, duration: 0.24 }, 0)
    .to(
      traveler,
      {
        motionPath: {
          path: () => {
            const end = landing();
            const s = startPoint();
            const diveY = hero.offsetHeight * 0.74 - s.y;
            const bend = mobile ? 12 : 45;
            return `M0,0 C${end.x * 0.5},0 ${end.x + bend},${diveY * 0.35} ${end.x + bend},${diveY} C${end.x + bend},${diveY + 25} ${end.x},${end.y + 35} ${end.x},${end.y}`;
          },
        },
        scale: () => landing().scale,
        duration: 0.92,
        ease: 'sine.inOut',
      },
      0.28,
    )
    .to(pitch, { rotation: 84, duration: mobile ? 0.3 : 0.22, ease: 'sine.inOut' }, mobile ? 0.34 : 0.54)
    .to(pitch, { rotation: 0, duration: 0.26, ease: 'sine.inOut' }, 0.96)
    .to(scenery, { y: () => -hero.offsetHeight, duration: 0.56, ease: 'sine.inOut' }, mobile ? 0.64 : 0.78)
    .to(facing, { rotationY: 180, duration: 0.22, ease: 'sine.inOut' }, 0.94)
    .to(trails, { opacity: 0.65, duration: 0.15, ease: 'sine.inOut' }, 0.68)
    .to(trails, { opacity: 0, duration: 0.15, ease: 'sine.inOut' }, 1.08);

  clientsEls.forEach((el, i) => {
    journey.fromTo(
      el,
      { x: mobile ? -30 : -70, y: 10, opacity: 0 },
      { x: 0, y: 0, opacity: 1, ease: 'sine.inOut', duration: 0.18 },
      1.0 + Math.floor(i / (mobile ? 3 : 4)) * 0.06 + (i % 4) * 0.012,
    );
  });

  // Splash where the whale's head first meets the water, measured against
  // the real wave shapes (they are moving) rather than a fixed line.
  const splashMotion = gsap
    .timeline({ paused: true })
    .fromTo(splash, { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0)
    .fromTo(splash.querySelector('.splash-rings'), { scale: 0.55, transformOrigin: '50% 50%' }, { scale: 1.6, duration: 0.75, ease: 'power1.out' }, 0)
    .fromTo(splash.querySelector('.splash-droplets'), { y: 12, scale: 0.6, transformOrigin: '50% 100%' }, { y: -18, scale: 1, duration: 0.45, ease: 'power2.out' }, 0)
    .to(splash, { opacity: 0, duration: 0.35 }, 0.65);

  const syncSplash = () => {
    const time = journey.time();
    if (contactTime !== null && time < contactTime) contactTime = null;
    if (contactTime === null) {
      splashMotion.time(0);
      if (time <= 0.28 || time >= 1.2) return;
      const m = body.getScreenCTM();
      if (!m) return;
      const head = new DOMPoint(415, 179).matrixTransform(m);
      let surfaceY = Infinity;
      waveLayers.forEach((wave) => {
        const wm = wave.getScreenCTM();
        if (!wm) return;
        const local = head.matrixTransform(wm.inverse());
        let above = -100;
        let below = 399;
        if (!wave.isPointInFill(new DOMPoint(local.x, below))) return;
        for (let i = 0; i < 14; i++) {
          const mid = (above + below) / 2;
          if (wave.isPointInFill(new DOMPoint(local.x, mid))) below = mid;
          else above = mid;
        }
        surfaceY = Math.min(surfaceY, new DOMPoint(local.x, below).matrixTransform(wm).y);
      });
      if (!Number.isFinite(surfaceY) || head.y < surfaceY) return;
      contactTime = time;
      const hb = hero.getBoundingClientRect();
      gsap.set(splash, { left: head.x - hb.left, top: surfaceY - hb.top });
    }
    splashMotion.time(Math.max(0, (time - contactTime) * 3));
  };

  /* ---------- tail stroke ---------- */

  const restingOutline = body.getAttribute('d')!;
  // Flex the rear of the silhouette, tapering to nothing at the shoulder so
  // the body stays connected. Command structure is preserved.
  const tailStroke = (amp: number) =>
    restingOutline.replace(/(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g, (_, rx: string, ry: string) => {
      const x = Number(rx);
      const influence = Math.max(0, Math.min(1, (190 - x) / 100));
      return `${x} ${Number(ry) + amp * influence * influence}`;
    });

  /* ---------- the journey through the sections ---------- */

  const stops: Stop[] = [...document.querySelectorAll<HTMLElement>('[data-whale-stop]')].map((el) => {
    const section = el.closest<HTMLElement>('[data-depth]')!;
    const side = el.dataset.side;
    const face = el.dataset.face;
    return {
      el,
      section,
      tone: DARK_WATER.has(section.dataset.tone ?? '') ? 'light' : 'dark',
      restFacing: face === 'right' ? 0 : face === 'left' ? 180 : side === 'right' ? 180 : 0,
      swim: 'swim' in el.dataset,
      spout: 'spout' in el.dataset,
    };
  });

  const spoutParts = spout.querySelectorAll<SVGPathElement>('path');
  const spoutDrops = spout.querySelectorAll<SVGCircleElement>('circle');
  const spoutMotion = gsap
    .timeline({ paused: true })
    .set(spout, { opacity: 1 })
    .fromTo(spoutParts, { strokeDasharray: 70, strokeDashoffset: 70 }, { strokeDashoffset: 0, duration: 0.55, stagger: 0.07, ease: 'power2.out' })
    .fromTo(spoutDrops, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.35, stagger: 0.06, ease: 'back.out(2)' }, 0.3)
    .to(spout, { opacity: 0, duration: 0.8, ease: 'sine.in' }, 1.9);
  let spouted = false;

  let following = false;
  let swimClock = 0;
  let tailIsResting = true;
  let swimStrength = 0;
  let previousScroll = window.scrollY;
  let travelDir = 1;
  let restFacingNow = 0;

  const restoreHeroWhale = () => {
    if (!following) return;
    following = false;
    world.prepend(traveler);
    traveler.classList.remove('is-following');
    const s = startPoint();
    const end = landing();
    gsap.set(traveler, { left: s.x - W() / 2, top: s.y - H() / 2, x: end.x, y: end.y, scale: end.scale });
    gsap.set(facing, { rotationY: 180 });
    gsap.set(pitch, { rotation: 0 });
    gsap.set(trails, { opacity: 0 });
    traveler.dataset.whaleTone = 'light';
  };

  const followSections = (deltaMs: number) => {
    const trigger = journey.scrollTrigger!;
    if (window.scrollY < trigger.end) {
      restoreHeroWhale();
      return false;
    }
    const w = W();
    const h = H();
    if (!following) {
      following = true;
      trigger.getTween()?.progress(1);
      document.body.append(traveler);
      traveler.classList.add('is-following');
      gsap.set(traveler, { left: 0, top: 0 });
      restFacingNow = 180;
    }

    const vh = window.innerHeight;
    const vw = document.documentElement.clientWidth;
    const scrollDelta = window.scrollY - previousScroll;
    if (Math.abs(scrollDelta) > 0.5) travelDir = Math.sign(scrollDelta);

    // Which stop are we at, and are we crossing to the next one?
    const arrive = (i: number) => clamp01((vh * 0.92 - stops[i].section.getBoundingClientRect().top) / (vh * 0.55));
    let at = 0;
    for (let i = 1; i < stops.length; i++) {
      if (arrive(i) >= 1) at = i;
      else break;
    }
    const next = at + 1 < stops.length ? at + 1 : -1;
    const t = next > -1 ? arrive(next) : 0;

    const point = (s: Stop) => {
      const r = s.el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, scale: r.width / w, offscreen: r.bottom < -h * 0.25 || r.top > vh + h * 0.25 };
    };

    let x: number, y: number, scale: number, facingDeg: number, pitchDeg: number, tone: WhaleTone, propulsion: number;
    const current = stops[at];

    if (next > -1 && t > 0) {
      const to = point(stops[next]);
      let from = point(current);
      if (from.offscreen) {
        // Its last resting place has scrolled away: swim in from the far side.
        const fromRight = to.x < vw / 2;
        from = { x: fromRight ? vw + w * 0.6 : -w * 0.6, y: to.y - 40, scale: to.scale, offscreen: false };
      }
      const initial = to.x >= from.x ? 0 : 180;
      const pose = whaleChoreography(t, initial, mobile, stops[next].restFacing);
      x = from.x + (to.x - from.x) * pose.horizontal;
      y = lerp(from.y, to.y, t) + pose.dip;
      scale = lerp(from.scale, to.scale, t);
      facingDeg = pose.facing;
      pitchDeg = pose.pitch;
      tone = t > 0.65 ? stops[next].tone : current.tone;
      propulsion = pose.propulsion;
      restFacingNow = stops[next].restFacing;
    } else {
      const p = point(current);
      x = p.x;
      y = p.y;
      scale = p.scale;
      pitchDeg = 0;
      tone = current.tone;
      if (current.swim) {
        // Along the Approach track it faces the way it is swimming.
        const target = travelDir < 0 ? 180 : 0;
        restFacingNow += (target - restFacingNow) * 0.12;
        propulsion = 0.75;
      } else {
        restFacingNow += (current.restFacing - restFacingNow) * 0.2;
        propulsion = 0;
      }
      facingDeg = restFacingNow;
    }

    // Spout once on reaching the surface; reset when it leaves.
    const atSpout = current.spout && !(next > -1 && t > 0);
    if (atSpout && !spouted) {
      spouted = true;
      spoutMotion.restart();
    } else if (!atSpout && spouted && !current.spout) {
      spouted = false;
      spoutMotion.pause(0);
      gsap.set(spout, { opacity: 0 });
    }

    gsap.set(traveler, { x: x - w / 2, y: y - h / 2, scale });
    gsap.set(facing, { rotationY: facingDeg });
    gsap.set(pitch, { rotation: pitchDeg });
    traveler.dataset.whaleTone = tone;

    const activity = Math.min(1, Math.abs(scrollDelta) / 8);
    swimStrength += (activity * propulsion - swimStrength) * Math.min(1, deltaMs / 120);
    gsap.set(trails, { opacity: swimStrength * 0.5 });
    return true;
  };

  const swim = (_time: number, deltaMs: number) => {
    if (document.hidden) return;
    const inSections = followSections(deltaMs);
    previousScroll = window.scrollY;
    if (!inSections) syncSplash();
    const travel = (journey.time() - 0.28) / 0.92;
    if (!inSections && (travel <= 0 || travel >= 1)) {
      if (!tailIsResting) body.setAttribute('d', restingOutline);
      tailIsResting = true;
      swimClock = 0;
      return;
    }
    if (inSections && swimStrength < 0.01) {
      if (!tailIsResting) body.setAttribute('d', restingOutline);
      tailIsResting = true;
      return;
    }
    swimClock += Math.min(deltaMs, 64) / 1000;
    const envelope = inSections ? Math.min(1, swimStrength * 1.6) : Math.min(1, travel / 0.12, (1 - travel) / 0.15);
    const soft = envelope * envelope * (3 - 2 * envelope);
    body.setAttribute('d', tailStroke(Math.sin((swimClock * Math.PI * 2) / 1.8) * 24 * soft));
    trailPaths.forEach((path, i) => path.setAttribute('stroke-dashoffset', `${swimClock * 65 + i * 34}`));
    tailIsResting = false;
  };
  gsap.ticker.add(swim);

  const observer = new IntersectionObserver(([entry]) => {
    heroInView = entry.isIntersecting;
    syncCurrents();
  });
  observer.observe(hero);
  document.addEventListener('visibilitychange', syncCurrents);
  // Late font and image loads change heights; measure again once settled.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());

  return () => {
    gsap.ticker.remove(swim);
    observer.disconnect();
    document.removeEventListener('visibilitychange', syncCurrents);
    if (following) world.prepend(traveler);
    traveler.classList.remove('is-following');
    body.setAttribute('d', restingOutline);
    gsap.set([traveler, facing, pitch, trails, spout, splash], { clearProps: 'all' });
    gsap.set(spout, { opacity: 0 });
    root.classList.remove('whale-live');
    world.classList.remove('is-scroll-scene');
    world.style.removeProperty('--scene-h');
    world.style.removeProperty('--whale-w');
    delete traveler.dataset.whaleTone;
  };
}
