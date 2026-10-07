"use client";

import { useEffect, useRef, useState } from "react";
import WorkspaceWorld, { type WorldController } from "@/components/workspace-world";
import { chapters, education, experience, profile, projects } from "@/data/portfolio";

const clamp = (n: number) => Math.max(0, Math.min(1, n));
function smooth(a: number, b: number, p: number) {
  if (a === b) return p >= b ? 1 : 0;
  const t = clamp((p - a) / (b - a));
  return t * t * (3 - 2 * t);
}
type DetailView = "index" | "resume" | "project";

export default function Home() {
  const journey = useRef<HTMLElement>(null);
  const worldRef = useRef<WorldController | null>(null);
  const captionsRef = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [quiet, setQuiet] = useState(false);
  const [detail, setDetail] = useState<DetailView>("index");
  const modalRef = useRef<HTMLDialogElement>(null);
  const quietRef = useRef(false);
  const navigationFrameRef = useRef(0);

  useEffect(() => {
    const root = journey.current;
    if (!root) return;
    let frame = 0, current = 0, target = 0, previous = 0, activeIndex = 0;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    function render(now: number) {
      const reduced = preference.matches || quietRef.current;
      const delta = Math.min(64, now - (previous || now)); previous = now;
      current = reduced ? target : current + (target - current) * (1 - Math.exp(-delta / 140));
      if (Math.abs(target - current) < .00008) current = target;
      root!.style.setProperty("--progress", String(current));
      worldRef.current?.setProgress(current, reduced);
      let next = 0;
      chapters.forEach((chapter, i) => { if (current >= chapter.range[0]) next = i; });
      if (activeIndex !== next) { activeIndex = next; setActive(next); }
      captionsRef.current.forEach((element, index) => {
        if (!element) return;
        const [enter, full, leave, gone] = chapters[index].range;
        const opacity = reduced ? Number(index === next) : smooth(enter, full, current) * (index === chapters.length - 1 ? 1 : 1 - smooth(leave, gone, current));
        element.style.opacity = String(opacity);
        element.style.visibility = opacity < .01 ? "hidden" : "visible";
        const distance = (1 - smooth(enter, full, current)) * 30 - smooth(leave, gone, current) * 24;
        element.style.transform = reduced ? "none" : `translate3d(0,${distance}px,0)`;
        element.inert = opacity < .6;
        element.setAttribute("aria-hidden", String(opacity < .6));
      });
      frame = current !== target ? requestAnimationFrame(render) : 0;
    }
    function update() {
      target = clamp(-root!.getBoundingClientRect().top / Math.max(1, root!.offsetHeight - window.innerHeight));
      if (!frame) { previous = 0; frame = requestAnimationFrame(render); }
    }
    // Manual input always takes control of a chapter-button transition.
    function cancelNavigation() {
      cancelAnimationFrame(navigationFrameRef.current);
      navigationFrameRef.current = 0;
    }
    update();
    window.addEventListener("wheel", cancelNavigation, { passive: true });
    window.addEventListener("touchstart", cancelNavigation, { passive: true });
    window.addEventListener("pointerdown", cancelNavigation, { passive: true });
    window.addEventListener("keydown", cancelNavigation);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("portfolio-motion-change", update);
    preference.addEventListener("change", update);
    return () => {
      cancelAnimationFrame(frame);
      cancelNavigation();
      window.removeEventListener("wheel", cancelNavigation);
      window.removeEventListener("touchstart", cancelNavigation);
      window.removeEventListener("pointerdown", cancelNavigation);
      window.removeEventListener("keydown", cancelNavigation);
      window.removeEventListener("scroll", update); window.removeEventListener("resize", update);
      window.removeEventListener("portfolio-motion-change", update); preference.removeEventListener("change", update);
    };
  }, []);

  function goTo(index: number) {
    if (!journey.current) return;
    modalRef.current?.close();
    const root = journey.current;
    const top = window.scrollY + root.getBoundingClientRect().top + chapters[index].at * (root.offsetHeight - window.innerHeight);
    cancelAnimationFrame(navigationFrameRef.current);
    if (quiet || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo({ top, behavior: "instant" });
      navigationFrameRef.current = 0;
      return;
    }
    // Native smooth scrolling rushes a long journey into a few hundred ms.
    // Give button navigation an explicit, gentle duration; wheel/touch stay native.
    const start = window.scrollY;
    const distance = top - start;
    const duration = Math.min(3200, 2000 + Math.abs(distance) / window.innerHeight * 45);
    const started = performance.now();
    function step(now: number) {
      const t = clamp((now - started) / duration);
      const eased = t * t * (3 - 2 * t);
      window.scrollTo({ top: start + distance * eased, behavior: "instant" });
      navigationFrameRef.current = t < 1 ? requestAnimationFrame(step) : 0;
    }
    navigationFrameRef.current = requestAnimationFrame(step);
  }
  function toggleMotion() {
    quietRef.current = !quiet; setQuiet(!quiet);
    window.dispatchEvent(new Event("portfolio-motion-change"));
  }
  function open(view: DetailView) { setDetail(view); modalRef.current?.showModal(); }

  return (
    <main className="journey" ref={journey} data-scene={active}>
      <div className="stage">
        <WorkspaceWorld controllerRef={worldRef} />
        <header className="site-header">
          <button className="wordmark" onClick={() => goTo(0)} aria-label="Yainezu, back to the studio">yainezu<span>✳</span></button>
          <span className="header-descriptor">A CURIOUS MIND.<br />A WORK IN PROGRESS.</span>
          <nav aria-label="Portfolio navigation">
            <button onClick={() => goTo(1)} aria-current={active === 1 ? "page" : undefined}>About</button>
            <button onClick={() => goTo(3)} aria-current={active === 3 ? "page" : undefined}>Experience</button>
            <button onClick={() => goTo(4)} aria-current={active === 4 ? "page" : undefined}>Work</button>
            <button onClick={() => open("index")} className="index-button">Chapter index <span>☷</span></button>
          </nav>
        </header>

        <div className="scene-caption-label" aria-hidden="true"><span className="live-dot" /> A LITTLE WINDOW INTO MY WORLD</div>
        <button className="resume-button" onClick={() => open("resume")}>Read résumé <span>↗</span></button>
        {chapters.map((chapter, i) => (
          <section key={chapter.id} ref={element => { captionsRef.current[i] = element; }} className={`caption caption-${chapter.side} ${i === 0 ? "intro-caption" : ""}`} style={{ opacity: i === 0 ? 1 : 0, visibility: i === 0 ? "visible" : "hidden" }} aria-hidden={i !== 0} inert={i !== 0}>
            <p className="eyebrow">{chapter.eyebrow}</p>
            {i === 0 ? <h1>{chapter.title}<br /><em>{chapter.accent}</em></h1> : <h2>{chapter.title}<br /><em>{chapter.accent}</em></h2>}
            <p className="caption-body">{chapter.body}</p>
            {i === 0 && <button className="text-link" onClick={() => goTo(1)}>Come a little closer <span>↘</span></button>}
            {i === 1 && <div className="interest-tags"><span>Frontend development</span><span>Pixel art</span><span>Retro design</span></div>}
            {i === 2 && <><p className="mini-label">TOOLS BEHIND THIS PORTFOLIO</p><div className="interest-tags"><span>React</span><span>TypeScript</span><span>Next.js</span><span>Three.js</span></div></>}
            {i === 3 && (experience.length ? <div className="career-preview">{experience.slice(0, 2).map(job => <div key={job.company + job.period}><small>{job.period}</small><strong>{job.role}</strong><span>{job.company}</span></div>)}<button className="text-link" onClick={() => open("resume")}>Read the full journey <span>↗</span></button></div> : <p className="chapter-placeholder"><span>✎</span> Career details coming soon.</p>)}
            {i === 4 && <button className="project-preview" onClick={() => open("project")}><span className="project-mark">↗</span><span><small>{projects[0].category}</small><strong>{projects[0].name}</strong></span><span>↗</span></button>}
            {i === 5 && <ol className="process-list"><li><span>01</span> Understand the idea</li><li><span>02</span> Build with intention</li><li><span>03</span> Refine the details</li></ol>}
            {i === 6 && (education.length ? <div className="career-preview">{education.slice(0, 2).map(item => <div key={item.title}><small>{item.period}</small><strong>{item.title}</strong><span>{item.institution}</span></div>)}</div> : <p className="chapter-placeholder"><span>↳</span> Education & learning notes coming soon.</p>)}
            {i === 7 && <><div className="closing-links">{profile.email && <a className="text-link" href={`mailto:${profile.email}`}>Say hello <span>↗</span></a>}<button className="text-link" onClick={() => goTo(0)}>Another look around <span>↺</span></button></div><p className="signature">With curiosity, Yainezu.</p></>}
          </section>
        ))}

        <div className="camera-caption" aria-hidden="true"><span>{String(active + 1).padStart(2, "0")}</span><div>{chapters[active].object}<small>{chapters[active].note}</small></div></div>
        <footer className="scene-footer">
          <span className="scroll-instruction"><span>↓</span><span>TAKE YOUR TIME<small>Scroll to turn the page</small></span></span>
          <nav className="chapter-nav" aria-label="Story chapters">{chapters.map((chapter, i) => <button key={chapter.id} onClick={() => goTo(i)} aria-label={`Chapter ${i + 1}: ${chapter.label}`} title={chapter.label} aria-current={active === i ? "step" : undefined}><span>{String(i + 1).padStart(2, "0")}</span><i /></button>)}</nav>
          <button className="motion-toggle" onClick={toggleMotion} aria-pressed={quiet}>{quiet ? "◯" : "◌"}<span>Motion {quiet ? "off" : "on"}</span></button>
        </footer>
        <div className="reading-progress" />
      </div>

      <dialog ref={modalRef} className={`details-dialog ${detail === "resume" ? "resume-dialog" : ""}`} aria-labelledby="dialog-title" onClick={e => { if (e.target === e.currentTarget) modalRef.current?.close(); }}>
        <button className="dialog-close" aria-label="Close details" onClick={() => modalRef.current?.close()}>×</button>
        {detail === "index" && <><p className="eyebrow">A STORY IN EIGHT CHAPTERS</p><h2 id="dialog-title">Find your<br /><em>own way around.</em></h2><div className="chapter-index">{chapters.map((chapter, i) => <button key={chapter.id} onClick={() => goTo(i)}><span>{String(i + 1).padStart(2, "0")}</span><strong>{chapter.label}</strong><span>↗</span></button>)}</div></>}
        {detail === "project" && <><p className="eyebrow">PERSONAL PROJECT / IN PROGRESS</p><h2 id="dialog-title">A little world<br /><em>of my own.</em></h2><p className="dialog-lead">{projects[0].summary}</p><div className="interest-tags">{projects[0].stack.map(tool => <span key={tool}>{tool}</span>)}</div><div className="project-notes"><h3>The idea</h3><p>Present a portfolio as a place to explore. The camera moves around one continuous workspace while the content follows the objects in the room.</p><h3>The details</h3><p>A scroll-controlled camera, layered interface animations, a responsive layout, and an optional quiet view with less motion.</p></div><button className="text-link" onClick={() => modalRef.current?.close()}>Back to the workspace <span>↗</span></button></>}
        {detail === "resume" && <><p className="eyebrow">THE STORY, AT YOUR OWN PACE</p><h2 id="dialog-title">{profile.name}<br /><em>{profile.role}</em></h2><p className="dialog-lead">{profile.introduction}</p><div className="resume-sections"><section><h3>01 / About</h3><p>Frontend development, pixel art, and retro design. Curious about how thoughtful interfaces and creative technology come together.</p></section><section><h3>02 / Experience</h3>{experience.length ? experience.map(job => <article key={job.company + job.period}><small>{job.period}</small><h4>{job.role} · {job.company}</h4><p>{job.summary}</p><ul>{job.highlights.map(item => <li key={item}>{item}</li>)}</ul></article>) : <p className="muted">Career details haven’t been added yet.</p>}</section><section><h3>03 / Selected work</h3>{projects.map(project => <article key={project.name}><small>{project.category}</small><h4>{project.name}</h4><p>{project.summary}</p><div className="interest-tags">{project.stack.map(tool => <span key={tool}>{tool}</span>)}</div>{project.url && <a href={project.url}>Visit project ↗</a>}</article>)}</section><section><h3>04 / Education & learning</h3>{education.length ? education.map(item => <article key={item.title}><small>{item.period}</small><h4>{item.title} · {item.institution}</h4><p>{item.summary}</p></article>) : <p className="muted">Education and course details haven’t been added yet.</p>}</section><section><h3>05 / Elsewhere</h3>{profile.email || profile.github || profile.linkedin ? <div className="closing-links">{profile.email && <a href={`mailto:${profile.email}`}>Email ↗</a>}{profile.github && <a href={profile.github}>GitHub ↗</a>}{profile.linkedin && <a href={profile.linkedin}>LinkedIn ↗</a>}</div> : <p className="muted">Contact links coming soon.</p>}</section></div><button className="text-link" onClick={() => modalRef.current?.close()}>Back to the story <span>↗</span></button></>}
      </dialog>
    </main>
  );
}
