import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../lib/gsap";
import { whaleChoreography } from "../lib/whaleChoreography";
import { BlueWhaleLogo } from "../components/blue-whale/BlueWhaleLogo";
import { Ocean } from "../components/blue-whale/Ocean";
import { LandingSections } from "../components/blue-whale/LandingSections";
import "./hero-study.css";

export function HeroStudyPage() {
  const scope = useRef<HTMLElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add({ desktop: "(min-width: 768px)", mobile: "(max-width: 767px)", motion: "(prefers-reduced-motion: no-preference)" }, (context) => {
      if (!context.conditions?.motion) return;
      const mobile = context.conditions.mobile;
      const entrance = gsap.timeline({ defaults: { ease: "power3.out" } })
        .from(".whale-entrance", { opacity: 0, y: 38, scale: 0.94, duration: 1.4 })
        .from(".hero-whale [data-bw-id^='wave-']", { opacity: 0, x: -20, stagger: 0.12, duration: 0.8 }, 0.35)
        .from(".hero-text-enter", { opacity: 0, x: 32, y: 12, stagger: 0.14, duration: 1 }, 0.55);
      // Independent cycles avoid holding shorter layers at the shared timeline's end.
      const currents = [
        gsap.fromTo(".ocean-layer--back", { x: -100, y: 8 }, { x: 100, y: -12, duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut" }),
        gsap.fromTo(".ocean-layer--middle", { x: 85, y: -8 }, { x: -85, y: 12, duration: 7.5, repeat: -1, yoyo: true, ease: "sine.inOut" }),
        gsap.fromTo(".ocean-layer--front", { x: -65, y: 6 }, { x: 65, y: -8, duration: 9, repeat: -1, yoyo: true, ease: "sine.inOut" }),
      ];
      let heroInView = true;
      let diveStarted = false;
      const syncCurrents = () => currents.forEach((current) => {
        if (heroInView && !diveStarted && !document.hidden) current.resume(); else current.pause();
      });
      const hero = scope.current!.querySelector<HTMLElement>(".ocean-hero")!;
      const destination = scope.current!.querySelector<HTMLElement>(".partner-whale-anchor")!;
      const traveler = scope.current!.querySelector<HTMLElement>(".diving-whale")!;
      const world = scope.current!.querySelector<HTMLElement>(".ocean-world")!;
      world.classList.add("is-scroll-scene");
      const sizeScene = () => world.style.setProperty("--scene-height", `${hero.offsetHeight}px`);
      sizeScene();
      // One whale travels between both sections; refresh measurements on resize.
      const landing = () => ({
        x: destination.offsetLeft + destination.offsetWidth / 2 - window.innerWidth * (mobile ? 0.125 : 0.05) - traveler.offsetWidth / 2,
        y: destination.offsetTop + destination.offsetHeight / 2 - startTop() - traveler.offsetHeight / 2,
      });
      const message = hero.querySelector<HTMLElement>(".ocean-message")!;
      const horizonLine = message.querySelector<HTMLElement>("h1 > em")!;
      // Align the whale's body with Greater horizons; mobile retains its stacked composition.
      const startTop = () => mobile ? Math.max(
        hero.offsetHeight - traveler.offsetHeight - 305,
        message.offsetTop + message.offsetHeight + 24 - traveler.offsetHeight * 0.28,
      ) : message.offsetTop + horizonLine.offsetTop + horizonLine.offsetHeight / 2 - traveler.offsetHeight * 0.65;
      gsap.set(traveler, { top: startTop });
      let contactTime: number | null = null;
      const journey = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: {
        trigger: world, pin: true, refreshPriority: 10, start: "top top", end: () => `+=${window.innerHeight * (mobile ? 1.7 : 2.6)}`, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true,
        onRefreshInit: () => {
          sizeScene(); gsap.set(traveler, { top: startTop() });
          contactTime = null;
        },
        onUpdate: (self) => {
          if (self.progress > 0 && entrance.progress() < 1) entrance.progress(1);
          diveStarted = self.progress > 0.15;
          syncCurrents();
        },
      } })
        .to(".ocean-message", { x: mobile ? 35 : 100, y: -25, opacity: 0, duration: 0.24 }, 0)
        .to(traveler, { motionPath: { path: () => {
          const end = landing();
          const diveY = hero.offsetHeight * 0.72 - startTop() - traveler.offsetHeight / 2;
          const bend = mobile ? 12 : 45;
          return `M0,0 C${end.x * 0.5},0 ${end.x + bend},${diveY * 0.35} ${end.x + bend},${diveY} C${end.x + bend},${diveY + 25} ${end.x},${end.y + 35} ${end.x},${end.y}`;
        } }, scale: mobile ? 0.72 : 0.85, duration: 0.92, ease: "sine.inOut" }, 0.28)
        // Desktop crosses the cleared copy area before pitching at the waterline.
        // Mobile's shorter, mostly vertical approach keeps its existing timing.
        .to(".whale-pitch", { rotation: 84, duration: mobile ? 0.30 : 0.22, ease: "sine.inOut" }, mobile ? 0.34 : 0.54)
        .to(".whale-pitch", { rotation: 0, duration: 0.26, ease: "sine.inOut" }, 0.96)
        .to(".ocean-scenery", { y: () => -hero.offsetHeight, duration: 0.56, ease: "sine.inOut" }, mobile ? 0.64 : 0.78)
        .to(".whale-facing", { rotationY: 180, duration: 0.22, ease: "sine.inOut" }, 0.94)
        .to(".hero-whale [data-bw-id='whale-primary-mark']", { fill: "#d4edf1", duration: 0.16 }, 0.70)
        .to(".hero-whale [data-bw-id^='wave-']", { fill: "#7ac8e3", duration: 0.16 }, 0.70)
        .to(".whale-trails", { opacity: 0.65, duration: 0.15, ease: "sine.inOut" }, 0.68)
        .to(".whale-trails", { opacity: 0, duration: 0.15, ease: "sine.inOut" }, 1.08);

      const splash = hero.querySelector<SVGSVGElement>(".dive-splash")!;
      const waveLayers = hero.querySelectorAll<SVGPathElement>(".ocean-layer");
      const splashMotion = gsap.timeline({ paused: true })
        .fromTo(splash, { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0)
        .fromTo(".splash-rings", { scale: 0.55, transformOrigin: "50% 50%" }, { scale: 1.6, duration: 0.75, ease: "power1.out" }, 0)
        .fromTo(".splash-droplets", { y: 12, scale: 0.6, transformOrigin: "50% 100%" }, { y: -18, scale: 1, duration: 0.45, ease: "power2.out" }, 0)
        .to(splash, { opacity: 0, duration: 0.35 }, 0.65);

      const whaleOutline = scope.current!.querySelector<SVGPathElement>(".hero-whale [data-bw-id='whale-primary-mark']")!;
      const restingOutline = whaleOutline.getAttribute("d")!;
      const trailPaths = scope.current!.querySelectorAll<SVGPathElement>(".whale-trails path");
      // Flex the rear silhouette, tapering to zero at the shoulder so the body
      // remains connected. Preserve command topology for smooth SVG interpolation.
      const tailStroke = (amplitude: number) => restingOutline.replace(
        /(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g,
        (_, rawX: string, rawY: string) => {
          const x = Number(rawX);
          const influence = Math.max(0, Math.min(1, (190 - x) / 100));
          return `${x} ${Number(rawY) + amplitude * influence * influence}`;
        },
      );
      // Real-time strokes remain readable even during small scroll increments.
      // Use the scrubbed timeline (not raw scroll) to soften entry and arrival.
      let swimClock = 0;
      let tailIsResting = true;
      let following = false;
      let previousScroll = window.scrollY;
      let swimStrength = 0;
      let followScroll = window.scrollY;
      const routeAnchors = [destination, ...scope.current!.querySelectorAll<HTMLElement>(".deep-whale-anchor")];
      const facing = traveler.querySelector<HTMLElement>(".whale-facing")!;
      const pitch = traveler.querySelector<HTMLElement>(".whale-pitch")!;
      const trails = traveler.querySelector<SVGSVGElement>(".whale-trails")!;
      const restoreHeroWhale = () => {
        if (!following) return;
        world.prepend(traveler);
        following = false;
        gsap.set(traveler, { position: "absolute", left: mobile ? "12.5vw" : "5vw", top: startTop(), ...landing(), scale: mobile ? 0.72 : 0.85 });
        gsap.set(facing, { rotationY: 180 });
        gsap.set(pitch, { rotation: 0 });
        gsap.set(trails, { opacity: 0 });
      };
      const followSections = (deltaMs: number) => {
        const trigger = journey.scrollTrigger!;
        if (window.scrollY < trigger.end) { restoreHeroWhale(); return false; }
        if (!following) {
          // Move the very same SVG out of the clipped/pinned scene, never clone it.
          scope.current!.append(traveler);
          following = true;
          trigger.getTween()?.progress(1);
          followScroll = window.scrollY;
          gsap.set(traveler, { position: "fixed", top: 0, left: 0, scale: mobile ? 0.72 : 0.85 });
        }
        followScroll += (window.scrollY - followScroll) * (1 - Math.exp(-Math.min(deltaMs, 64) / 160));
        const scrollLag = window.scrollY - followScroll;
        const points = routeAnchors.map(anchor => {
          const rect = anchor.getBoundingClientRect();
          return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 + scrollLag, top: anchor.parentElement!.getBoundingClientRect().top + scrollLag, dark: anchor === destination || anchor.parentElement!.classList.contains("depth-dark") };
        });
        let index = 0;
        while (index < points.length - 1 && points[index + 1].top <= 0) index++;
        const from = points[index];
        const to = points[Math.min(index + 1, points.length - 1)];
        const progress = from === to ? 0 : gsap.utils.clamp(0, 1, -from.top / (to.top - from.top));
        const initialFacing = index % 2 === 0 ? 180 : 0;
        const pose = whaleChoreography(progress, initialFacing, Boolean(mobile));
        gsap.set(traveler, {
          x: from.x + (to.x - from.x) * pose.horizontal - traveler.offsetWidth / 2,
          y: from.y + (to.y - from.y) * progress + pose.dip - traveler.offsetHeight / 2,
        });
        gsap.set(facing, { rotationY: from === to ? initialFacing : pose.facing });
        gsap.set(pitch, { rotation: from === to ? 0 : pose.pitch });
        whaleOutline.style.fill = (progress > 0.65 ? to.dark : from.dark) ? "#d4edf1" : "#012333";
        const scrollDelta = Math.abs(window.scrollY - previousScroll);
        const propulsion = Math.min(1, (scrollDelta + Math.abs(scrollLag) * 0.1) / 8) * pose.propulsion;
        swimStrength += (propulsion - swimStrength) * 0.12;
        gsap.set(trails, { opacity: swimStrength * 0.5 });
        return true;
      };
      const syncSplash = () => {
        const time = journey.time();
        if (contactTime !== null && time < contactTime) contactTime = null;
        if (contactTime === null) {
          splashMotion.time(0);
          if (time <= 0.28 || time >= 1.2) return;
          const whaleMatrix = whaleOutline.getScreenCTM();
          if (!whaleMatrix) return;
          // The head tip belongs to the original SVG coordinates; its screen
          // matrix includes responsive scale, pitch, facing, and scene movement.
          const head = new DOMPoint(415, 179).matrixTransform(whaleMatrix);
          let surfaceY = Infinity;
          waveLayers.forEach((wave) => {
            const matrix = wave.getScreenCTM();
            if (!matrix) return;
            const localHead = head.matrixTransform(matrix.inverse());
            let above = -100;
            let below = 399;
            if (!wave.isPointInFill(new DOMPoint(localHead.x, below))) return;
            for (let i = 0; i < 14; i++) {
              const middle = (above + below) / 2;
              if (wave.isPointInFill(new DOMPoint(localHead.x, middle))) below = middle;
              else above = middle;
            }
            surfaceY = Math.min(surfaceY, new DOMPoint(localHead.x, below).matrixTransform(matrix).y);
          });
          if (head.y < surfaceY || !Number.isFinite(surfaceY)) return;
          contactTime = time;
          const heroBounds = hero.getBoundingClientRect();
          gsap.set(splash, { left: head.x - heroBounds.left, top: surfaceY - heroBounds.top });
        }
        // Continue to scrub and reverse, but relative to measured water contact.
        splashMotion.time(Math.max(0, (time - contactTime) * 3));
      };
      const swim = (_time: number, deltaMs: number) => {
        if (document.hidden) return;
        const inSections = followSections(deltaMs);
        previousScroll = window.scrollY;
        if (!inSections) syncSplash();
        const travelProgress = (journey.time() - 0.28) / 0.92;
        if (!inSections && (travelProgress <= 0 || travelProgress >= 1)) {
          if (!tailIsResting) whaleOutline.setAttribute("d", restingOutline);
          tailIsResting = true;
          swimClock = 0;
          return;
        }
        swimClock += Math.min(deltaMs, 64) / 1000;
        const envelope = inSections ? swimStrength : Math.min(1, travelProgress / 0.12, (1 - travelProgress) / 0.15);
        const softenedEnvelope = envelope * envelope * (3 - 2 * envelope);
        whaleOutline.setAttribute("d", tailStroke(Math.sin(swimClock * Math.PI * 2 / 1.8) * 24 * softenedEnvelope));
        trailPaths.forEach((path, index) => path.setAttribute("stroke-dashoffset", `${swimClock * 65 + index * 34}`));
        tailIsResting = false;
      };
      gsap.ticker.add(swim);

      gsap.utils.toArray<HTMLElement>(".partner-fish").forEach((fish, index) => {
        journey.fromTo(fish, { x: mobile ? -35 : -90, y: 12, opacity: 0 }, {
          x: 0, y: 0, opacity: 1, ease: "sine.inOut", duration: 0.18,
        }, 1.02 + Math.floor(index / 2) * 0.055);
      });
      const observer = new IntersectionObserver(([entry]) => {
        heroInView = entry.isIntersecting;
        syncCurrents();
      });
      if (hero) observer.observe(hero);
      document.addEventListener("visibilitychange", syncCurrents);
      return () => { gsap.ticker.remove(swim); restoreHeroWhale(); whaleOutline.setAttribute("d", restingOutline); observer.disconnect(); document.removeEventListener("visibilitychange", syncCurrents); world.classList.remove("is-scroll-scene"); world.style.removeProperty("--scene-height"); };
    });
    return () => mm.revert();
  }, { scope });

  return (
    <main ref={scope} id="main-content" className="hero-study">
      <div className="ocean-world">
      <div className="diving-whale" aria-hidden="true"><div className="whale-entrance"><div className="whale-facing"><div className="whale-pitch"><svg className="whale-trails" viewBox="25 20 450 270" aria-hidden="true"><g fill="none" stroke="#d4edf1" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="35 110"><path d="M-65 74Q12 58 108 105" /><path d="M-80 123Q5 100 107 133" /><path d="M-50 166Q20 145 104 164" /></g></svg><BlueWhaleLogo className="hero-whale" artwork="refined" variant="mark" instanceId="hero-whale" /></div></div></div></div>
      <div className="ocean-scenery">
      <section className="ocean-hero">
        <header className="ocean-nav">
          <a className="ocean-brand" href="/hero-study" aria-label="Blue Whale Consulting home">Blue Whale <span>Consulting</span></a>
          <nav aria-label="Main navigation"><a href="#expertise">Expertise</a><a href="#contact">Let’s talk <span aria-hidden="true">↗</span></a></nav>
        </header>
        <div className="ocean-message">
          <h1><span className="hero-text-enter">Good decisions.</span><em className="hero-text-enter">Greater horizons.</em></h1>
          <div className="ocean-message-bottom"><p className="hero-text-enter">We help businesses find commercial opportunities—and build the strategy, partnerships and operations to pursue them.</p><a className="ocean-cta hero-text-enter" href="#assessment">Assess your business <span aria-hidden="true">↗</span></a><a className="hero-services-link hero-text-enter" href="#expertise">Explore our services ↓</a></div>
        </div>
        <Ocean />
        <svg className="dive-splash" viewBox="0 0 320 160" aria-hidden="true"><g className="splash-rings" fill="none" stroke="#f5fbff" strokeWidth="3"><ellipse cx="160" cy="112" rx="78" ry="10" /><ellipse cx="160" cy="112" rx="108" ry="15" opacity=".8" /></g><g className="splash-droplets" fill="none" stroke="#03466e" strokeWidth="3.5" strokeLinecap="round"><path d="M133 100Q118 72 103 70M155 96Q149 63 139 50M176 99Q193 73 210 69" /><path d="M94 57l-2-4M130 34l-1-5M217 52l3-5M185 49l2-5" /></g></svg>
      </section>
      <section id="partners" className="ocean-partners" aria-labelledby="partners-title">
        <div className="partners-copy"><h2 id="partners-title">Progress moves<br /><em>through partnership.</em></h2></div>
        <div className="partner-whale-anchor" aria-hidden="true" />
        <ul className="partner-school" aria-label="Partner logo placeholders">
          {Array.from({ length: 8 }, (_, index) => <li className="partner-fish" key={index}><svg className="partner-fish-mark" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{index % 4 === 0 ? <path d="M16 3 29 16 16 29 3 16ZM16 8 24 16 16 24 8 16Z" /> : index % 4 === 1 ? <path d="M16 3V29M3 16H29M7 7 25 25M7 25 25 7" /> : index % 4 === 2 ? <path d="M3 20C8 4 12 4 16 16S24 28 29 12" /> : <><circle cx="16" cy="16" r="12" /><path d="M16 9V23M9 16H23" /></>}</svg><span>Partner {String(index + 1).padStart(2, "0")}</span></li>)}
        </ul>
        <BlueWhaleLogo className="static-partner-whale" artwork="refined" variant="mark" instanceId="static-partner-whale" />
        <svg className="partner-depth-edge" viewBox="0 0 1600 140" preserveAspectRatio="none" aria-hidden="true"><path fill="#a5c9d2" d="M0 70C240 15 400 105 690 65S1210 15 1600 70V140H0Z" /><path fill="#6197ad" d="M0 95C270 35 450 125 790 90S1300 45 1600 88V140H0Z" /></svg>
      </section>
      </div>
      </div>
      <LandingSections />
    </main>
  );
}
