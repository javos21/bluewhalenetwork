import { useGSAP } from "@gsap/react";
import type { RefObject } from "react";
import { gsap } from "../../../lib/gsap";
import { bw } from "./selectors";

export function useIdleAnimation(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(bw.whale, {
          y: -2.5,
          rotation: -0.25,
          transformOrigin: "50% 55%",
          duration: 6.8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });

        const waveMotion = [
          { x: 2.5, y: -1, duration: 5.6 },
          { x: 3.5, y: 1, duration: 7.2 },
          { x: -2, y: 1.5, duration: 6.3 },
          { x: 3, y: -1, duration: 7.7 },
        ];

        bw.waves.forEach((selector, index) => {
          gsap.to(selector, {
            ...waveMotion[index],
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: index * -0.8,
          });
        });
      });

      return () => mm.revert();
    },
    { scope },
  );
}
