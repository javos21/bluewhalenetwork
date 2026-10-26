// The whale's wake: a tapered ribbon through its recent tail positions,
// plus bubbles that drift up and fade. Drawn in the same positioned parent
// as the travelling whale (the pinned ocean world during the dive, the page
// itself afterwards), so on phones it scrolls natively with the water
// instead of being redrawn by script. whale-journey.ts drives it.
//
// The SVG is a 1px box with overflow visible: coordinates are plain pixels
// in the parent, and nothing outside the drawn shapes is painted.

const SVG_NS = 'http://www.w3.org/2000/svg';
const WAKE_LIFE = 700; // ms a wake point lasts
const MIN_STEP = 2.5; // px between recorded points
const MAX_POINTS = 64;
const BUBBLES = 18;

type Point = { x: number; y: number; t: number; w: number };
type Bubble = {
  el: SVGCircleElement;
  alive: boolean;
  x: number;
  y: number;
  r: number;
  rise: number;
  drift: number;
  seed: number;
  born: number;
  life: number;
};

export type WhaleWake = ReturnType<typeof createWhaleWake>;

export function createWhaleWake() {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'whale-wake');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const ribbon = document.createElementNS(SVG_NS, 'path');
  ribbon.setAttribute('class', 'whale-wake-ribbon');
  svg.append(ribbon);

  const bubbles: Bubble[] = Array.from({ length: BUBBLES }, () => {
    const el = document.createElementNS(SVG_NS, 'circle');
    el.setAttribute('class', 'whale-wake-bubble');
    el.setAttribute('r', '0');
    svg.append(el);
    return { el, alive: false, x: 0, y: 0, r: 0, rise: 0, drift: 0, seed: 0, born: 0, life: 0 };
  });

  let points: Point[] = [];
  let ribbonDrawn = false;

  const clear = () => {
    points = [];
    if (ribbonDrawn) ribbon.setAttribute('d', '');
    ribbonDrawn = false;
    bubbles.forEach((b) => {
      if (!b.alive) return;
      b.alive = false;
      b.el.setAttribute('r', '0');
    });
  };

  return {
    /** Place the wake just under the whale in its current parent. Clears it. */
    host(traveler: HTMLElement) {
      clear();
      traveler.parentElement?.insertBefore(svg, traveler);
    },

    /** Light wake on dark water, deep wake on light water. */
    tone(tone: 'light' | 'dark') {
      if (svg.dataset.tone !== tone) svg.dataset.tone = tone;
    },

    /** True while anything is still visible (so the caller can skip work). */
    get busy() {
      return points.length > 0 || bubbles.some((b) => b.alive);
    },

    /**
     * Add the tail's current position. `width` is the ribbon's width there.
     * A jump bigger than `maxJump` (a hard flick moving a sticky whale
     * through the page) starts a fresh wake instead of drawing a streak, and
     * the wake never grows longer than `maxLength`. All in px.
     */
    record(now: number, x: number, y: number, width: number, maxJump: number, maxLength: number) {
      const last = points[points.length - 1];
      if (last) {
        const step = Math.hypot(x - last.x, y - last.y);
        if (step < MIN_STEP) return;
        if (step > maxJump) points = [];
      }
      points.push({ x, y, t: now, w: width });
      let length = 0;
      for (let i = points.length - 1; i > 0; i--) {
        length += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
        if (length > maxLength) {
          points = points.slice(i);
          break;
        }
      }
      if (points.length > MAX_POINTS) points.shift();
    },

    bubble(now: number, x: number, y: number, size: number) {
      const b = bubbles.find((bb) => !bb.alive);
      if (!b) return;
      b.alive = true;
      b.x = x + (Math.random() - 0.5) * size * 4;
      b.y = y + (Math.random() - 0.5) * size * 3;
      b.r = size * (0.6 + Math.random() * 0.9);
      b.rise = size * (14 + Math.random() * 16);
      b.drift = (Math.random() - 0.5) * size * 8;
      b.seed = Math.random() * Math.PI * 2;
      b.born = now;
      b.life = 1100 + Math.random() * 600;
    },

    /** Age everything and redraw. Call once per frame. */
    draw(now: number) {
      while (points.length && now - points[0].t > WAKE_LIFE) points.shift();

      if (points.length < 3) {
        if (ribbonDrawn) ribbon.setAttribute('d', '');
        ribbonDrawn = false;
      } else {
        // Offset each point either side of the path. The newest end
        // narrows into the fluke so it reads as water pushed off the tail,
        // not a band stuck to the whale.
        const n = points.length;
        const left: [number, number][] = [];
        const right: [number, number][] = [];
        for (let i = 0; i < n; i++) {
          const p = points[i];
          const a = points[Math.max(0, i - 1)];
          const c = points[Math.min(n - 1, i + 1)];
          let dx = c.x - a.x;
          let dy = c.y - a.y;
          const len = Math.hypot(dx, dy) || 1;
          dx /= len;
          dy /= len;
          // Like a real wake: narrow off the fluke, spreading as it ages,
          // then thinning to nothing at the old end.
          const age = (now - p.t) / WAKE_LIFE; // 0 = just recorded
          const half = (p.w / 2) * (0.25 + 0.75 * Math.min(1, age * 2.2)) * (1 - age) ** 0.9;
          left.push([p.x - dy * half, p.y + dx * half]);
          right.push([p.x + dy * half, p.y - dx * half]);
        }
        ribbon.setAttribute('d', `${smoothLine(left, 'M')}${smoothLine(right.reverse(), 'L')}Z`);
        ribbonDrawn = true;
      }

      for (const b of bubbles) {
        if (!b.alive) continue;
        const age = (now - b.born) / b.life;
        if (age >= 1) {
          b.alive = false;
          b.el.setAttribute('r', '0');
          continue;
        }
        const rise = 1 - (1 - age) ** 2; // fast at first, then slowing
        const fade = Math.min(1, age * 8) * (1 - age) ** 1.3;
        b.el.setAttribute('cx', (b.x + b.drift * age + Math.sin(b.seed + age * 7) * b.r * 0.8).toFixed(1));
        b.el.setAttribute('cy', (b.y - b.rise * rise).toFixed(1));
        b.el.setAttribute('r', (b.r * (1 + age * 0.35)).toFixed(2));
        b.el.setAttribute('opacity', fade.toFixed(3));
      }
    },

    clear,

    destroy() {
      clear();
      svg.remove();
    },
  };
}

/** A line through the points, rounded with quadratic curves through the midpoints. */
function smoothLine(pts: [number, number][], start: 'M' | 'L') {
  const f = (v: number) => v.toFixed(1);
  let d = `${start}${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [x, y] = pts[i];
    const [nx, ny] = pts[i + 1];
    d += `Q${f(x)} ${f(y)} ${f((x + nx) / 2)} ${f((y + ny) / 2)}`;
  }
  const [lx, ly] = pts[pts.length - 1];
  return `${d}L${f(lx)} ${f(ly)}`;
}
