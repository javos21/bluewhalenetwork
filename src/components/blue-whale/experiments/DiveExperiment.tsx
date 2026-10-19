import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { gsap } from "../../../lib/gsap";
import { BlueWhaleLogo } from "../BlueWhaleLogo";
import { bw } from "../animations/selectors";

export function DiveExperiment() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const stage = scope.current?.querySelector(".dive-stage");
      const marker = scope.current?.querySelector(".dive-progress");
      if (!stage || !marker) return;

      const buildDive = (travel: { early: number; mid: number; end: number; midY: number; endY: number }) => {
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        });

        timeline
          .to(marker, { scaleX: 1, duration: 1 }, 0)
          .to([bw.whale, ...bw.waves], { x: 24, y: 12, duration: 0.18 }, 0.04)
          .to([bw.whale, ...bw.waves], {
            x: travel.early,
            y: 38,
            rotation: 5,
            transformOrigin: "50% 50%",
            duration: 0.2,
          }, 0.2)
          .to(bw.waves[0], { x: travel.early - 26, y: 52, scaleX: 1.07, opacity: 0.78, duration: 0.3 }, 0.36)
          .to(bw.waves[1], { x: travel.early - 52, y: 60, scaleX: 1.12, opacity: 0.44, duration: 0.28 }, 0.39)
          .to(bw.waves[2], { x: travel.early - 42, y: 70, scaleX: 0.9, opacity: 0.28, duration: 0.27 }, 0.43)
          .to(bw.waves[3], { x: travel.early - 8, y: 76, scaleX: 0.84, opacity: 0.18, duration: 0.28 }, 0.45)
          .to(bw.whale, { x: travel.mid, y: travel.midY, rotation: 17, scale: 0.76, duration: 0.42 }, 0.43)
          .to(bw.waves, { opacity: 0, duration: 0.18 }, 0.7)
          .to(bw.whale, { x: travel.end, y: travel.endY, rotation: 27, scale: 0.6, duration: 0.28 }, 0.72);
      };

      mm.add("(min-width: 640px) and (prefers-reduced-motion: no-preference)", () =>
        buildDive({ early: 105, mid: 300, end: 680, midY: 125, endY: 520 }),
      );
      mm.add("(max-width: 639px) and (prefers-reduced-motion: no-preference)", () =>
        buildDive({ early: 54, mid: 155, end: 330, midY: 118, endY: 430 }),
      );

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(marker, { scaleX: 0 });
        gsap.set([bw.whale, ...bw.waves, ...bw.wordmarks], { clearProps: "all" });
      });

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section ref={scope} className="experiment experiment--wide" aria-labelledby="dive-title">
      <div className="experiment__heading experiment__heading--contained">
        <span className="experiment__number">03</span>
        <div>
          <h2 id="dive-title">Logo-to-Dive Transition</h2>
        </div>
        <p className="experiment__instruction">Scroll slowly to inspect the handoff.</p>
      </div>
      <div className="dive-stage">
        <div className="dive-sticky">
          <div className="dive-grid" aria-hidden="true" />
          <BlueWhaleLogo className="logo logo--dive" instanceId="dive" />
          <div className="dive-readout" aria-hidden="true">
            <span>Brand</span><span>Wake</span><span>Dive</span>
          </div>
          <div className="dive-progress" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
