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
// After the dive the whale is positioned in document space inside
// [data-journey], so on phones it scrolls natively with the content.
//
// Fast scrolling: the whale chases the scroll position at a capped speed,
// so every crossing takes at least MIN_CROSSING_MS and a hard flick never
// makes it jump. It is never more than one crossing behind, and the dive
// always plays through before the journey takes over.
//
// Life in the water: a tapered wake and bubbles follow it while it
// swims (whaleWake.ts), the tail beats faster the harder it swims, and at
// rest it bobs gently with the odd tail flick and bubble.
//
// Reduced motion and no-JS visitors get still whales in every resting
// point instead (.whale-static). Everything is torn down before Astro
// swaps pages.

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { whaleChoreography } from '@/lib/whaleChoreography';
import { createWhaleWake } from '@/lib/whaleWake';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

// Shortest time a crossing between sections can take, however fast the
// page is scrolled. Slow scrolling still moves the whale almost directly.
const MIN_CROSSING_MS = { desktop: 850, mobile: 700 };
// Width of the whale artwork (Whale.astro viewBox), to size the wake and
// bubbles to the whale on screen.
const ARTWORK_W = 450;

type WhaleTone = 'light' | 'dark';
type Stop = {
  el: HTMLElement;
  section: HTMLElement;
  tone: WhaleTone;
  restFacing: number;
  swim: boolean;
  /** The Approach track: leaving it always swims off the end of the lane */
  track: boolean;
  spout: boolean;
};

const DARK_WATER = new Set(['deep', 'midnight']);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (v: number) => v * v * (3 - 2 * v);

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

type Spot = { x: number; y: number; scale: number; offscreen: boolean };

/**
 * Crossings onto and off the Approach track, routed round the copy.
 * Onto it (desktop): down the open right-hand side first, then left along
 * the gap between the heading and the line, shrinking as it comes, and a
 * turn to face along the track. Off it (desktop and phones): carry on off
 * the end of the lane, then swim into the next section from that side,
 * growing back to full size; on phones this keeps it out of the steps.
 */
function trackCrossing(t: number, from: Spot, to: Spot, dest: Stop, w: number, vw: number, mobile: boolean) {
  if (dest.swim) {
    const start = from.offscreen ? { ...from, x: vw + w * 0.6, y: to.y - w * 0.3 } : from;
    const down = smoothstep(clamp01(t / 0.45));
    const along = smoothstep(clamp01((t - 0.35) / 0.65));
    const turn = smoothstep(clamp01((t - 0.86) / 0.14));
    const heading = to.x < start.x ? 180 : 0;
    return {
      x: lerp(start.x, to.x, along),
      y: lerp(start.y, to.y, down),
      scale: lerp(start.scale, to.scale, smoothstep(clamp01(t / 0.6))),
      facingDeg: lerp(heading, dest.restFacing, turn),
      pitchDeg: Math.sin(clamp01(t / 0.45) * Math.PI) * 26,
      propulsion: 0.8,
    };
  }
  if (t < 0.5) {
    const u = t / 0.5;
    return {
      x: lerp(from.x, vw + w * 0.7, u * u),
      y: from.y,
      scale: from.scale,
      facingDeg: 0,
      pitchDeg: 0,
      propulsion: 0.85,
    };
  }
  const u = (t - 0.5) / 0.5;
  const fromRight = to.x > vw / 2;
  const enterX = fromRight ? vw + w * 0.6 : -w * 0.6;
  const pose = whaleChoreography(u, fromRight ? 180 : 0, mobile, dest.restFacing);
  return {
    x: lerp(enterX, to.x, pose.horizontal),
    y: lerp(to.y - 40, to.y, u) + pose.dip,
    scale: lerp(to.scale * 0.75, to.scale, smoothstep(u)),
    facingDeg: pose.facing,
    pitchDeg: pose.pitch,
    propulsion: pose.propulsion,
  };
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
  // After the dive the whale lives in the page itself (absolute, in
  // document space) rather than fixed to the screen. On phones the page
  // scrolls on the compositor, ahead of script; a fixed whale moved by
  // script lags and slides over the content. In document space it scrolls
  // natively with whatever it rests beside.
  const journeyEl = world.closest<HTMLElement>('[data-journey]') ?? document.body;
  const wakeMark = q<SVGCircleElement>('[data-whale-wake]', traveler);
  const tailMark = q<SVGCircleElement>('[data-whale-tail]', traveler);
  const blowhole = q<SVGCircleElement>('[data-whale-blowhole]', traveler);
  const tailRestY = Number(tailMark.getAttribute('cy'));
  const wake = createWhaleWake();
  wake.host(traveler);

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
      // A little more lag than a plain scrub, so a fast flick still shows the dive.
      scrub: 1.1,
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
      // The Approach track is only ridden on desktop; on phones it is a plain resting point.
      swim: 'swim' in el.dataset && !mobile,
      track: 'swim' in el.dataset,
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
  let tailIsResting = true;
  let swimStrength = 0;
  let previousScroll = window.scrollY;
  let travelDir = 1;
  let restFacingNow = 0;
  // Where the whale is along the stops (index + crossing progress), which
  // chases where the scroll says it should be. See MIN_CROSSING_MS.
  let shown = 0;
  let shownVel = 0; // stops per ms
  let motion: 'rest' | 'cross' | 'swim' = 'rest';
  let atSurface = false;
  const maxVel = 1 / MIN_CROSSING_MS[mobile ? 'mobile' : 'desktop'];

  const restoreHeroWhale = () => {
    if (!following) return;
    following = false;
    world.prepend(traveler);
    wake.host(traveler);
    traveler.classList.remove('is-following');
    const s = startPoint();
    const end = landing();
    gsap.set(traveler, { left: s.x - W() / 2, top: s.y - H() / 2, x: end.x, y: end.y, scale: end.scale });
    gsap.set(facing, { rotationY: 180 });
    gsap.set(pitch, { rotation: 0 });
    gsap.set(trails, { opacity: 0 });
    traveler.dataset.whaleTone = 'light';
    shown = 0;
    shownVel = 0;
    motion = 'rest';
  };

  const followSections = (deltaMs: number) => {
    const trigger = journey.scrollTrigger!;
    // Stay with the dive until its scrubbed timeline has caught up, so a
    // fast flick past the pinned scene still plays the dive through.
    if (window.scrollY < trigger.end || (!following && journey.progress() < 0.999)) {
      restoreHeroWhale();
      return false;
    }
    const w = W();
    const h = H();
    if (!following) {
      following = true;
      trigger.getTween()?.progress(1);
      journeyEl.append(traveler);
      wake.host(traveler);
      traveler.classList.add('is-following');
      gsap.set(traveler, { left: 0, top: 0 });
      // The section wake replaces the dive's speed lines.
      gsap.set(trails, { opacity: 0 });
      restFacingNow = 180;
      shown = 0;
      shownVel = 0;
    }

    const vh = window.innerHeight;
    const vw = document.documentElement.clientWidth;
    const scrollDelta = window.scrollY - previousScroll;
    if (Math.abs(scrollDelta) > 0.5) travelDir = Math.sign(scrollDelta);

    // Where the scroll says the whale should be: stop index + crossing progress.
    const arrive = (i: number) => clamp01((vh * 0.92 - stops[i].section.getBoundingClientRect().top) / (vh * 0.55));
    let target = 0;
    for (let i = 1; i < stops.length; i++) {
      const a = arrive(i);
      if (a >= 1) target = i;
      else {
        target += a;
        break;
      }
    }

    // Where it is: it chases that at a capped speed (ease in from rest,
    // ease out on arrival) and is never more than one crossing behind.
    shown = Math.max(target - 1, Math.min(target + 1, shown));
    const gap = target - shown;
    const wantVel = Math.max(-maxVel, Math.min(maxVel, gap / 140));
    shownVel += (wantVel - shownVel) * Math.min(1, deltaMs / 90);
    shown += shownVel * deltaMs;
    if (gap === 0 || Math.sign(target - shown) !== Math.sign(gap) || Math.abs(target - shown) < 1e-4) {
      shown = target;
      shownVel = 0;
    }

    const at = Math.min(stops.length - 1, Math.floor(shown + 1e-6));
    const next = at + 1 < stops.length ? at + 1 : -1;
    const t = next > -1 ? clamp01(shown - at) : 0;

    const point = (s: Stop) => {
      const r = s.el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, scale: r.width / w, offscreen: r.bottom < -h * 0.25 || r.top > vh + h * 0.25 };
    };

    let x: number, y: number, scale: number, facingDeg: number, pitchDeg: number, tone: WhaleTone, propulsion: number;
    const current = stops[at];
    const crossing = next > -1 && t > 0;

    if (crossing && (stops[next].swim || current.track)) {
      // On and off the Approach track, routed round the copy.
      const pose = trackCrossing(t, point(current), point(stops[next]), stops[next], w, vw, mobile);
      ({ x, y, scale, facingDeg, pitchDeg, propulsion } = pose);
      tone = t > (current.track ? 0.5 : 0.3) ? stops[next].tone : current.tone;
      restFacingNow = stops[next].restFacing;
      motion = 'cross';
    } else if (crossing) {
      const to = point(stops[next]);
      let from = point(current);
      if (from.offscreen) {
        // Its last resting place has scrolled away: swim in from the nearest
        // edge, on the destination's side, so it never crosses the copy.
        const fromRight = to.x > vw / 2;
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
      motion = 'cross';
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
        motion = 'swim';
      } else {
        restFacingNow += (current.restFacing - restFacingNow) * 0.2;
        propulsion = 0;
        motion = 'rest';
      }
      facingDeg = restFacingNow;
    }

    // Spout once on reaching the surface; reset when it leaves.
    atSurface = current.spout && !crossing;
    if (atSurface && !spouted) {
      spouted = true;
      spoutMotion.restart();
    } else if (!atSurface && spouted && !current.spout) {
      spouted = false;
      spoutMotion.pause(0);
      gsap.set(spout, { opacity: 0 });
    }

    // Viewport → journey coordinates, measured in the same frame as the
    // stops, so a resting whale's position does not change as you scroll.
    const jr = journeyEl.getBoundingClientRect();
    gsap.set(traveler, { x: x - jr.left - w / 2, y: y - jr.top - h / 2, scale });
    gsap.set(facing, { rotationY: facingDeg });
    gsap.set(pitch, { rotation: pitchDeg });
    traveler.dataset.whaleTone = tone;

    // Crossings swim with the whale's own speed (it keeps swimming after
    // the scroll stops); the Approach track swims with the scroll.
    const activity = crossing ? Math.max(0.35, Math.abs(shownVel) / maxVel) : Math.min(1, Math.abs(scrollDelta) / 8);
    swimStrength += (Math.min(1, activity) * propulsion - swimStrength) * Math.min(1, deltaMs / 120);
    return true;
  };

  // Tail beat, idle life and the wake.
  let phase = 0; // tail-beat phase, in beats
  let lastHalfBeat = 0;
  let rest = 1; // 0 swimming … 1 at rest
  let idleClock = 0;
  let nextFlick = 3 + Math.random() * 3;
  let flickAt = -10;
  // A tail flick as the whale passes each step on the track.
  let nudgeAt = -10;
  const onStep = (e: Event) => {
    if (motion === 'swim' && (e as CustomEvent<{ forward: boolean }>).detail.forward) nudgeAt = idleClock;
  };
  window.addEventListener('bw:step', onStep);
  let nextIdleBubble = 2 + Math.random() * 2;

  const swim = (_time: number, deltaMs: number) => {
    if (document.hidden) return;
    const dtMs = Math.min(deltaMs, 64);
    const dt = dtMs / 1000;
    const now = performance.now();
    const inSections = followSections(dtMs);
    previousScroll = window.scrollY;
    if (!inSections) syncSplash();

    const travel = (journey.time() - 0.28) / 0.92;
    const diving = !inSections && travel > 0 && travel < 1;
    const underwater = inSections ? !atSurface : travel >= 1 || (diving && contactTime !== null);

    // How hard it is swimming, 0–1.
    const strength = inSections
      ? Math.min(1, swimStrength * 1.6)
      : diving
        ? Math.min(1, travel / 0.12, (1 - travel) / 0.15)
        : 0;
    const soft = smoothstep(clamp01(strength));

    // Idle life: a slow bob while it rests (after the entrance has played).
    const resting = inSections ? motion === 'rest' || (motion === 'swim' && swimStrength < 0.05) : !diving;
    rest += ((resting ? 1 : 0) - rest) * Math.min(1, dt / 0.6);
    idleClock += dt;
    if (entrance.progress() === 1) {
      gsap.set(enter, {
        y: Math.sin((idleClock * Math.PI * 2) / 4.6) * 6 * rest,
        rotation: Math.sin((idleClock * Math.PI * 2) / 6.2 + 1) * 1.6 * rest,
      });
    }

    // Tail: beats faster the harder it swims, plus a lone flick now and then at rest.
    let amp = 0;
    if (soft > 0.01) {
      phase += dt / lerp(1.8, 0.95, soft);
      amp = Math.sin(phase * Math.PI * 2) * 24 * soft;
    }
    if (rest > 0.9 && idleClock > nextFlick) {
      flickAt = idleClock;
      nextFlick = idleClock + 4 + Math.random() * 4;
    } else if (rest < 0.5) {
      nextFlick = Math.max(nextFlick, idleClock + 2);
    }
    const sinceNudge = idleClock - nudgeAt;
    if (sinceNudge < 0.7) amp += Math.sin((sinceNudge / 0.7) * Math.PI * 2) * 16 * (1 - sinceNudge / 0.7);
    const sinceFlick = idleClock - flickAt;
    if (sinceFlick < 1.1) amp += Math.sin((sinceFlick / 1.1) * Math.PI * 2) * 11 * (1 - sinceFlick / 1.1) * rest;

    if (Math.abs(amp) < 0.2) {
      if (!tailIsResting) {
        body.setAttribute('d', restingOutline);
        tailMark.setAttribute('cy', String(tailRestY));
      }
      tailIsResting = true;
    } else {
      body.setAttribute('d', tailStroke(amp));
      tailMark.setAttribute('cy', String(tailRestY + amp));
      tailIsResting = false;
    }
    if (!inSections) trailPaths.forEach((path, i) => path.setAttribute('stroke-dashoffset', `${phase * 117 + i * 34}`));

    // Wake and bubbles, only in the water and only while something shows.
    const recording = underwater && (inSections ? motion !== 'rest' && soft > 0.12 : diving && travel < 0.97);
    const idleBubble = underwater && rest > 0.9 && idleClock > nextIdleBubble;
    if (!recording && !idleBubble && !wake.busy) return;

    const parent = traveler.parentElement!.getBoundingClientRect();
    const centre = (el: Element) => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2 - parent.left, y: r.top + r.height / 2 - parent.top };
    };
    const unit = (W() * Number(gsap.getProperty(traveler, 'scale'))) / ARTWORK_W; // px per artwork unit
    wake.tone(traveler.dataset.whaleTone === 'light' ? 'light' : 'dark');

    if (recording && motion !== 'swim') {
      const mid = centre(wakeMark);
      // The tail beat ripples the wake into a gentle S rather than a straight bar.
      wake.record(now, mid.x, mid.y + amp * unit * 0.35, 48 * unit * (0.55 + 0.45 * soft), 110 * unit, 650 * unit);
    }
    if (recording) {
      // A bubble off the fluke on each half beat, two when swimming hard.
      const halfBeat = Math.floor(phase * 2);
      if (halfBeat !== lastHalfBeat) {
        lastHalfBeat = halfBeat;
        if (soft > 0.25) {
          const tail = centre(tailMark);
          wake.bubble(now, tail.x, tail.y, 4 * unit);
          if (Math.random() < soft * 0.6) wake.bubble(now, tail.x, tail.y, 3 * unit);
        }
      }
    }
    if (idleBubble) {
      nextIdleBubble = idleClock + 3 + Math.random() * 4;
      const hole = centre(blowhole);
      wake.bubble(now, hole.x, hole.y, 3.2 * unit);
    }
    wake.draw(now);
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
    window.removeEventListener('bw:step', onStep);
    observer.disconnect();
    document.removeEventListener('visibilitychange', syncCurrents);
    if (following) world.prepend(traveler);
    traveler.classList.remove('is-following');
    body.setAttribute('d', restingOutline);
    tailMark.setAttribute('cy', String(tailRestY));
    wake.destroy();
    gsap.set([traveler, enter, facing, pitch, trails, spout, splash], { clearProps: 'all' });
    gsap.set(spout, { opacity: 0 });
    root.classList.remove('whale-live');
    world.classList.remove('is-scroll-scene');
    world.style.removeProperty('--scene-h');
    world.style.removeProperty('--whale-w');
    delete traveler.dataset.whaleTone;
  };
}
