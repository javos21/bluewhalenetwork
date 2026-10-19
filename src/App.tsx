import { AnimationLabPage } from "./pages/AnimationLabPage";
import { HomePlaceholder } from "./pages/HomePlaceholder";
import { HeroStudyPage } from "./pages/HeroStudyPage";

export default function App() {
  if (window.location.pathname.replace(/\/$/, "") === "/hero-study") return <HeroStudyPage />;
  return window.location.pathname.replace(/\/$/, "") === "/animation-lab" ? (
    <AnimationLabPage />
  ) : (
    <HomePlaceholder />
  );
}
