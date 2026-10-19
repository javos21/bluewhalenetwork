import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { gsap } from "../../../lib/gsap";
import { BlueWhaleLogo } from "../BlueWhaleLogo";

const sections = ["Hero", "Services", "About", "Solutions", "Case Studies", "Contact"];

export function JourneyExperiment() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const trigger = scope.current?.querySelector(".journey");
      const whale = scope.current?.querySelector(".journey-whale");
      if (!trigger || !whale) return;

      const createJourney = (pathSelector: string, scale: number) => {
        const path = scope.current?.querySelector<SVGPathElement>(pathSelector);
        if (!path) return;
        gsap.set(whale, { scale, transformOrigin: "50% 50%" });
        gsap.to(whale, {
          ease: "none",
          motionPath: {
            path,
            align: path,
            alignOrigin: [0.5, 0.5],
            autoRotate: 6,
          },
          scrollTrigger: {
            trigger,
            start: "top 70%",
            end: "bottom 35%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      };

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () =>
        createJourney("[data-journey-path='desktop']", 1),
      );
      mm.add("(min-width: 640px) and (max-width: 1023px) and (prefers-reduced-motion: no-preference)", () =>
        createJourney("[data-journey-path='tablet']", 0.82),
      );
      mm.add("(max-width: 639px) and (prefers-reduced-motion: no-preference)", () =>
        createJourney("[data-journey-path='mobile']", 0.58),
      );
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(whale, { x: 0, y: 0, rotation: 0, scale: 0.7 });
      });

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section ref={scope} className="experiment experiment--journey" aria-labelledby="journey-title">
      <div className="experiment__heading experiment__heading--contained">
        <span className="experiment__number">04</span>
        <div>
          <h2 id="journey-title">Scroll Journey</h2>
        </div>
        <p className="experiment__instruction">The path changes at desktop, tablet, and mobile widths.</p>
      </div>
      <div className="journey">
        <svg className="journey-path" viewBox="0 0 1000 6000" preserveAspectRatio="none" aria-hidden="true">
          <path data-journey-path="desktop" d="M180 300 C280 680 850 600 790 1250 S120 1750 220 2400 S900 2850 760 3600 S180 4200 330 4850 S820 5300 710 5740" />
          <path data-journey-path="tablet" d="M190 300 C280 720 790 660 720 1300 S160 1850 240 2450 S800 3000 700 3650 S180 4250 300 4900 S760 5350 680 5740" />
          <path data-journey-path="mobile" d="M190 300 C230 760 760 680 700 1320 S220 1850 270 2460 S740 3020 680 3660 S230 4250 300 4920 S720 5400 650 5740" />
        </svg>
        <BlueWhaleLogo className="journey-whale" instanceId="journey-whale" variant="mark" />
        {sections.map((label, index) => (
          <article className={`journey-panel journey-panel--${index + 1}`} key={label}>
            <span>0{index + 1}</span>
            <h3>{label}</h3>
            <p>Placeholder section for evaluating scale, overlap, pace, and direction.</p>
          </article>
        ))}
      </div>
    </section>
  );
}
