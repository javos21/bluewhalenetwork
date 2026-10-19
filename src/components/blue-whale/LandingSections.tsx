import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { BlueWhaleLogo } from "./BlueWhaleLogo";

const services = [
  ["Business strategy", "A clear plan for your next move."],
  ["Partnerships", "The right connections. New possibilities."],
  ["Operations", "Less friction. A stronger foundation."],
];
const questions = ["How clear is your business strategy?", "How well do your operations support growth?", "How developed is your partnership pipeline?"];

function Assessment() {
  const [step, setStep] = useState(0);
  const [business, setBusiness] = useState("");
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState(["", "", ""]);
  const heading = useRef<HTMLHeadingElement>(null);
  const move = (next: number) => { setStep(next); requestAnimationFrame(() => { heading.current?.focus(); ScrollTrigger.refresh(); }); };
  const score = Math.round(answers.reduce((sum, answer) => sum + Number(answer), 0) / 9 * 100);
  return <div className="assessment-panel">
    <p className="assessment-progress">{step < 3 ? `Step ${step + 1} of 3` : "Your illustrative result"}</p>
    <h3 ref={heading} tabIndex={-1}>{["Tell us about your business.", "Where are you today?", "Where should your score go?", `${business || "Your business"}, here’s a starting point.`][step]}</h3>
    {step < 3 ? <form onSubmit={event => { event.preventDefault(); move(step + 1); }}>
      {step === 0 && <><label>Business name<input required value={business} onChange={event => setBusiness(event.target.value)} autoComplete="organization" maxLength={100} /></label><label>Business sector<select required defaultValue=""><option value="" disabled>Select a sector</option>{["Professional services", "Retail & hospitality", "Manufacturing", "Technology", "Other"].map(value => <option key={value}>{value}</option>)}</select></label><label>Team size<select required defaultValue=""><option value="" disabled>Select a range</option>{["Just me", "2–10", "11–50", "51+"].map(value => <option key={value}>{value}</option>)}</select></label></>}
      {step === 1 && questions.map((question, index) => <label key={question}>{question}<select required value={answers[index]} onChange={event => setAnswers(answers.map((answer, i) => i === index ? event.target.value : answer))}><option value="" disabled>Choose the closest answer</option><option value="1">We’re still finding our direction</option><option value="2">We have a foundation to build on</option><option value="3">We have a clear, active approach</option></select></label>)}
      {step === 2 && <><p>Your email is required to complete this demo. In the live experience, Blue Whale would use it to deliver your score and follow up about your business.</p><label>Email address<input type="email" required value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" /></label><p className="demo-notice">Prototype only: this does not subscribe you, store your email or request real contact.</p></>}
      <div className="form-actions">{step > 0 && <button type="button" className="text-action" onClick={() => move(step - 1)}>Back</button>}<button className="landing-button" type="submit">{step === 2 ? "View demo score" : "Continue"}<span aria-hidden="true">↗</span></button></div>
    </form> : <div aria-live="polite"><div className="score-number">{score}<span>/100</span></div><p>This example score reflects only your three readiness answers. It is not a validated business assessment.</p><ul>{questions.map((question, index) => <li key={question}>{["Strategy", "Operations", "Partnerships"][index]}: {Number(answers[index]) < 3 ? "an area to explore" : "a foundation to build on"}</li>)}</ul><a className="landing-button" href="#contact">Discuss your next move <span aria-hidden="true">↗</span></a><button className="text-action" onClick={() => { setBusiness(""); setEmail(""); setAnswers(["", "", ""]); move(0); }}>Start again</button></div>}
  </div>;
}

function ContactDemo() {
  const [sent, setSent] = useState(false);
  return sent ? <p role="status">Demo complete—nothing was sent or saved. Live contact details will be added before launch.</p> : <form className="contact-demo" onSubmit={event => { event.preventDefault(); setSent(true); }}><label>Your email<input required type="email" autoComplete="email" /></label><label>What would you like help with?<textarea required rows={3} /></label><button className="landing-button">Preview enquiry <span aria-hidden="true">↗</span></button><p className="demo-notice">Demo form only. No details are sent or stored.</p></form>;
}

export function LandingSections() {
  const scope = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const root = scope.current!;
      const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
      root.querySelectorAll<HTMLElement>(".deep-copy").forEach(copy => {
        gsap.from(copy.querySelectorAll("h2, .section-intro, .service-list article, .project-gallery li"), {
          y: 22, opacity: 0, duration: 0.8, stagger: 0.12, ease: "power2.out",
          scrollTrigger: { trigger: copy, start: "top 85%", once: true },
        });
      });
      return () => cancelAnimationFrame(refreshFrame);
    });
    return () => mm.revert();
  }, { scope });
  const boundaryColors: Record<string, string> = { services: "#03466e", work: "#a5c9d2", assessment: "#03466e", questions: "#6197ad", contact: "var(--footer-ocean-color)" };
  const visual = (id: string) => <><div className="deep-whale-anchor" aria-hidden="true"><BlueWhaleLogo className="deep-static" artwork="refined" variant="mark" instanceId={`static-${id}`} /></div><div className="section-wave" aria-hidden="true"><svg viewBox="0 0 2400 100" preserveAspectRatio="none" focusable="false" style={{ fill: boundaryColors[id] }}><path d="M0 40 C200 0 400 0 600 40 S1000 80 1200 40 C1400 0 1600 0 1800 40 S2200 80 2400 40 V100 H0 Z" /></svg></div></>;
  return <div className="landing-depths" ref={scope}>
    <section id="expertise" className="deep-section copy-right depth-medium">{visual("services")}<div className="deep-copy"><h2>Ambition, with<br /><em>a way forward.</em></h2><p className="section-intro">Three ways to move your business forward.</p><div className="service-list">{services.map(([title, promise]) => <article key={title}><div className="service-icon-slot" aria-label={`${title} icon placeholder`}>Icon</div><div><h3>{title}</h3><p>{promise}</p></div></article>)}</div></div></section>
    <section id="work" className="deep-section copy-left depth-dark">{visual("work")}<div className="deep-copy"><h2>Possibility.<br /><em>Put into practice.</em></h2><p className="section-intro">A new market. A clearer route forward.</p><ol className="project-gallery">{["Explore", "Connect", "Move forward"].map((step, index) => <li key={step}><div className="project-photo" role="img" aria-label={`${step} photo placeholder`}>Photo space</div><div className="project-step-label"><span aria-hidden="true">0{index + 1}</span><h3>{step}</h3></div></li>)}</ol></div></section>
    <section id="assessment" className="deep-section copy-right depth-light">{visual("assessment")}<div className="deep-copy"><h2>Find your<br /><em>starting point.</em></h2><p className="section-intro">A few questions. A clearer direction.</p><p className="demo-notice">Email required to unlock your demo score. Assessment is optional.</p><Assessment /></div></section>
    <section id="questions" className="deep-section copy-left depth-dark">{visual("questions")}<div className="deep-copy"><h2>A little clarity<br /><em>before you begin.</em></h2><div className="faq-list">{[
      ["Do I need to take the assessment?", "No. Explore our services or contact us directly."],
      ["What does the score measure?", "Strategy, operations and partnerships. This demo score is illustrative."],
      ["Why do you ask for my email?", "For proposed score delivery and follow-up. This demo sends and saves nothing."],
      ["What happens after an enquiry?", "A conversation about your priorities. The live process is still to be confirmed."],
    ].map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></div></section>
    <section id="contact" className="deep-section copy-right depth-medium">{visual("contact")}<div className="deep-copy"><h2>Let’s find<br /><em>your next move.</em></h2><p className="section-intro">Tell us what’s on your horizon.</p><ContactDemo /></div></section>
    <footer className="concept-footer"><span>Blue Whale Consulting</span><p>Concept preview · Service copy, partner marks and assessment are illustrative.</p><a href="#main-content">Back to the surface ↑</a></footer>
  </div>;
}
