import { useGSAP } from "@gsap/react";
import { useCallback, useRef, type RefObject } from "react";
import { gsap } from "../../../lib/gsap";
import { bw } from "./selectors";

export function useSpoutAnimation(scope: RefObject<HTMLElement | null>) {
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const replayRef = useRef<() => void>(() => undefined);

  useGSAP(
    () => {
      if (!scope.current) return;
      const streams = Array.from(
        scope.current.querySelectorAll<SVGPathElement>(bw.spoutStreams.join(",")),
      );
      const spout = scope.current.querySelector<SVGGElement>(bw.spout);
      const drops = Array.from(
        scope.current.querySelectorAll<SVGCircleElement>(bw.drops.join(",")),
      );
      if (!spout) return;
      streams.forEach((stream) => {
        const length = stream.getTotalLength();
        gsap.set(stream, { strokeDasharray: length, strokeDashoffset: length });
      });
      gsap.set(spout, { opacity: 0 });
      gsap.set(drops, { opacity: 0, x: 0, y: 0 });
      replayRef.current = () => {
        timeline.current?.kill();
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (reduceMotion) {
          gsap.set(spout, { opacity: 0 });
          return;
        }

        timeline.current = gsap
          .timeline()
          .set(spout, { opacity: 1 })
          .to(streams[0], { strokeDashoffset: 0, duration: 0.48, ease: "power2.out" })
          .to(
            streams.slice(1),
            { strokeDashoffset: 0, duration: 0.42, stagger: 0.06, ease: "power2.out" },
            0.2,
          )
          .fromTo(
            drops,
            { opacity: 0, y: 4, scale: 0.65 },
            { opacity: 1, y: 0, scale: 1, duration: 0.28, stagger: 0.045, ease: "power2.out" },
            0.34,
          )
          .to(
            drops,
            { x: (index) => [-4, 5, 1, -3][index], y: 8, opacity: 0, duration: 0.7, stagger: 0.04, ease: "power1.in" },
            0.72,
          )
          .to(streams, { opacity: 0, duration: 0.46, stagger: 0.035, ease: "power1.in" }, 1.02)
          .set(streams, { opacity: 1 });
      };

      return () => timeline.current?.kill();
    },
    { scope },
  );

  return useCallback(() => replayRef.current(), []);
}
