import { useRef } from "react";
import { BlueWhaleLogo } from "../BlueWhaleLogo";
import { useIdleAnimation } from "../animations/useIdleAnimation";

export function IdleExperiment() {
  const scope = useRef<HTMLElement>(null);
  useIdleAnimation(scope);

  return (
    <section ref={scope} className="experiment experiment--compact" aria-labelledby="idle-title">
      <div className="experiment__heading">
        <span className="experiment__number">01</span>
        <div>
          <h2 id="idle-title">Logo Idle</h2>
        </div>
      </div>
      <div className="experiment__canvas experiment__canvas--light">
        <BlueWhaleLogo className="logo logo--full" instanceId="idle" />
        <p className="experiment__note">A 5–8 second breath, almost below perception.</p>
      </div>
    </section>
  );
}
