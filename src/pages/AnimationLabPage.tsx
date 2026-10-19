import { DiveExperiment } from "../components/blue-whale/experiments/DiveExperiment";
import { IdleExperiment } from "../components/blue-whale/experiments/IdleExperiment";
import { JourneyExperiment } from "../components/blue-whale/experiments/JourneyExperiment";
import { SpoutExperiment } from "../components/blue-whale/experiments/SpoutExperiment";

export function AnimationLabPage() {
  return (
    <main id="main-content" className="lab">
      <header className="lab-header">
        <div className="lab-header__brand" aria-label="Blue Whale Motion Lab">
          <span>Blue Whale</span>
          <span>Motion Lab</span>
        </div>
        <p className="lab-header__meta">Development environment · SVG + GSAP</p>
      </header>

      <div className="lab-intro">
        <h1>From identity<br />to living form.</h1>
        <p>
          Four isolated studies for a motion language with weight, continuity, and restraint.
          Scroll slowly; the third experiment is the primary review target.
        </p>
      </div>

      <div className="experiment-grid">
        <IdleExperiment />
        <SpoutExperiment />
      </div>
      <DiveExperiment />
      <JourneyExperiment />

      <footer className="lab-footer">
        <span>Blue Whale Consulting</span>
        <span>Motion system / first study</span>
      </footer>
    </main>
  );
}
