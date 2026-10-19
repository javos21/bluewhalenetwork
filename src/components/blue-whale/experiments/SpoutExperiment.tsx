import { useEffect, useRef } from "react";
import { BlueWhaleLogo } from "../BlueWhaleLogo";
import { useSpoutAnimation } from "../animations/useSpoutAnimation";

export function SpoutExperiment() {
  const scope = useRef<HTMLElement>(null);
  const replay = useSpoutAnimation(scope);

  useEffect(() => {
    const timer = window.setTimeout(replay, 250);
    return () => window.clearTimeout(timer);
  }, [replay]);

  return (
    <section ref={scope} className="experiment experiment--compact" aria-labelledby="spout-title">
      <div className="experiment__heading">
        <span className="experiment__number">02</span>
        <div>
          <h2 id="spout-title">Whale Spout</h2>
        </div>
        <button className="replay-button" type="button" onClick={replay}>
          Replay
          <span aria-hidden="true">↗</span>
        </button>
      </div>
      <div className="experiment__canvas experiment__canvas--deep">
        <BlueWhaleLogo className="logo logo--full logo--on-deep" instanceId="spout-demo" />
      </div>
    </section>
  );
}
