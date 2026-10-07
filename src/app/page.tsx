import { education, experience, profile, projects } from "@/data/portfolio";
import s from "./editorial.module.css";

const process = [
  ["Understand", "Start with the person.", "A useful interface begins with a clear problem, a little listening, and the right questions."],
  ["Explore", "Make room for curiosity.", "Sketch the possibilities. Try an interaction. Find the small detail that makes an idea feel right."],
  ["Build", "Give the idea a life.", "Connect the visual layer to thoughtful components, responsive layouts, and clear, maintainable code."],
  ["Refine", "Keep making it better.", "Use it. Check the edges. Slow down where it matters. There is always another detail worth caring about."],
];
function Flower({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 200 200" fill="currentColor" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx="100" cy="57" rx="27" ry="49" transform={`rotate(${i * 45} 100 100)`} />)}<circle cx="100" cy="100" r="21" fill="var(--paper)" /></svg>;
}
function Landscape() {
  return <svg viewBox="0 0 600 380" role="img" aria-label="An illustrated landscape of warm sunshine and green rolling hills"><rect width="600" height="380" fill="#e7d6bd"/><circle cx="420" cy="100" r="43" fill="#fcfbf6"/><path d="M0 255Q110 40 290 225T600 175V380H0Z" fill="#8d9c75"/><path d="M0 300Q190 150 360 285T600 260V380H0Z" fill="#687c58"/><path d="M0 340Q220 235 600 350V380H0Z" fill="#426653"/><path d="M290 380Q420 285 330 252Q285 225 326 204" fill="none" stroke="#e7d6bd" strokeWidth="13"/></svg>;
}
export default function Home() {
  return <main className={s.page} id="top">
    <a href="#about" className={s.skip}>Skip to content</a>
    <header className={s.header}>
      <a href="#top" className={s.wordmark} aria-label={`${profile.name} home`}>YAINEZU<span>✳</span></a>
      <div className={s.navline}><span>Software engineer & curious human</span><nav aria-label="Main navigation"><a href="#about">About</a><a href="#work">Work</a><a href="#notebook">Notebook</a><a href="#contact">Say hello ↗</a></nav></div>
    </header>
    <section className={s.hero} aria-labelledby="intro">
      <div className={s.heroNote}><span className={s.spark}>✳</span><p>A personal corner<br/>of the internet.</p></div>
      <h1 id="intro">A little code.<br/>A lot of care.<br/><em>A world of possibilities.</em></h1>
      <div className={s.meta}><span>PORTFOLIO / VOL. 02</span><a href="#work">SCROLL TO EXPLORE ↓</a><span>● ALWAYS CURIOUS</span></div>
    </section>
    <section className={s.collage} aria-label="A collection of code, landscapes, and creative experiments">
      <div className={s.gridLines} aria-hidden="true"/>
      <div className={s.landscape}><div className={s.windowBar}><span>somewhere-nice.png</span><span>− □ ×</span></div><Landscape/><span className={s.imageLabel}>A LITTLE SPACE TO THINK.</span></div>
      <div className={s.codeCard}><div className={s.windowBar}>hello.tsx <span>↗</span></div><pre><span>const</span>{' developer = {\n  name: "Yainezu",\n  loves: [\n    "thoughtful interfaces",\n    "small details",\n    "a good cup of coffee"\n  ],\n  curiosity: Infinity\n};'}</pre></div>
      <div className={s.note}>Made with<br/><em>intention.</em><span>AND A LITTLE TRIAL & ERROR.</span></div>
      <Flower className={s.flower}/><span className={s.collageLabel}>IDEAS IN PROGRESS ↗</span>
      <a href="/studio" className={s.studioLink}>Step inside my 3D workspace <span>↗</span></a>
    </section>
    <div className={s.equation}><span>CURIOSITY</span><i>+</i><span>CODE</span><i>+</i><span>CRAFT</span><i>=</i><em>Something meaningful.</em></div>
    <section id="about" className={s.about}>
      <div className={s.sectionLabel}>01 / THE PERSON BEHIND THE SCREEN</div>
      <h2>I like making things<br/>that work beautifully.<br/><em>And feel a little human.</em></h2>
      <div className={s.aboutBottom}><div className={s.signature}>Hello, I’m {profile.name}. <span>↗</span></div><div><p>{profile.introduction}</p><p>This is where I collect the things I build, the details I notice, and the ideas I’m still figuring out.</p></div></div>
    </section>
    <section id="process" className={s.process}>
      <div className={s.processIntro}><span className={s.sectionLabel}>02 / HOW I THINK</span><h2>From a<br/>small idea<br/><em>to a real thing.</em></h2><div className={s.path}>A <span>⤳</span> B</div><p>Good work takes a few turns.<br/>That’s part of the process.</p></div>
      <div>{process.map(([label, title, body], i) => <article className={s.processStep} key={label}><span className={s.sectionLabel}>0{i + 1} / {label.toUpperCase()}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
    </section>
    <section className={s.work} id="work"><div className={s.workHeading}><div><span className={s.sectionLabel}>03 / IDEAS INTO REALITY</span><h2>Selected<br/><em>work.</em></h2></div><p>A small collection of things<br/>I’m bringing to life.<br/>Built with curiosity. Refined with care.</p></div>
      {projects.map((project, i) => <article key={project.name} className={s.project}><a className={s.projectPreview} href={project.url || "/studio"} aria-label={`Explore ${project.name}`}><div className={s.miniBrowser}><div className={s.windowBar}><span>● ● ●</span><span>yainezu / studio</span><span>↗</span></div><div className={s.miniContent}><span>A PERSONAL WORKSPACE</span><h3>A little code.<br/><em>A world of<br/>possibilities.</em></h3><div className={s.deskIcon} aria-hidden="true"><div className={s.monitor}>{"</>"}</div><div className={s.desk}/><div className={s.cup}/></div></div></div><span className={s.roundLink}>EXPLORE<br/>↗</span></a><div className={s.projectInfo}><h3>0{i + 1}. {project.name}</h3><span>{project.stack.join(" / ")}</span></div><p>{project.summary}</p></article>)}
    </section>
    <section id="notebook" className={s.notebook}><div className={s.sectionLabel}>04 / NOTES FROM MY DESKTOP</div><h2>Still curious.<br/><em>Still becoming.</em></h2><div className={s.desktop}>
      <article className={s.readme}><div className={s.windowBar}><span>readme.md</span><span>− □ ×</span></div><div className={s.readmeBody}><span># A little about me</span><h3>Some things<br/>behind the code.</h3><details open><summary>01 — What I’m drawn to</summary><p>The place where engineering meets visual storytelling. Interfaces that are clear, useful, and have a little personality.</p></details><details><summary>02 — What’s in this portfolio?</summary><p>A Next.js and TypeScript website, an interactive Three.js workspace, and an ongoing exploration of motion and design.</p></details><details><summary>03 — Beyond the screen</summary><p>Pixel art, retro design, and the small things that spark a new idea.</p></details></div></article>
      <div className={s.desktopAside}><Flower className={s.desktopFlower}/><div className={s.fileIcon}>TS<span>TypeScript</span></div><div className={s.ticket}><span>PERSONAL FIELD NOTES</span><p>Stay curious.<br/>Make things.<br/><em>Care about them.</em></p><span>YAINEZU / ALWAYS IN PROGRESS</span></div></div>
    </div></section>
    {(experience.length > 0 || education.length > 0) && <section className={s.about} id="journey"><span className={s.sectionLabel}>THE JOURNEY SO FAR</span>{experience.map(item => <article key={`${item.company}-${item.period}`}><h3>{item.role} / {item.company}</h3><p>{item.period}</p><p>{item.summary}</p><ul>{item.highlights.map(h => <li key={h}>{h}</li>)}</ul></article>)}{education.map(item => <article key={`${item.institution}-${item.period}`}><h3>{item.title} / {item.institution}</h3><p>{item.period}</p><p>{item.summary}</p></article>)}</section>}
    <footer className={s.footer} id="contact"><span className={s.sectionLabel}>THE NEXT CHAPTER</span><h2>Good things start<br/><em>with a little hello.</em></h2><div className={s.footerLinks}>{profile.email && <a href={`mailto:${profile.email}`}>Say hello ↗</a>}{profile.github && <a href={profile.github}>GitHub ↗</a>}{profile.linkedin && <a href={profile.linkedin}>LinkedIn ↗</a>}<a href="/studio">Visit my workspace ↗</a><a href="#top">Back to top ↑</a></div><div className={s.footerMark}>YAINEZU<Flower/></div><div className={s.meta}><span>SOFTWARE ENGINEER & CURIOUS HUMAN</span><span>A LITTLE CORNER OF THE INTERNET.</span></div></footer>
  </main>;
}
