import Image from "next/image";
import FocusPresentation from "@/components/focus-presentation";
import EditorialMotion from "@/components/editorial-motion";
import PortfolioDesktop, { PlayfulShape } from "@/components/portfolio-desktop";
import { profile } from "@/data/portfolio";
import s from "./editorial.module.css";

const steps = [
  { name: "Understand", accent: "& discover", text: "Start with the person, the problem, and the questions worth asking. Give the idea a clear direction." },
  { name: "Explore", accent: "& experiment", text: "Sketch the possibilities. Try an interaction. Find the detail that makes something feel right." },
  { name: "Build", accent: "& connect", text: "Bring the pieces together with thoughtful components, responsive layouts, and maintainable code." },
  { name: "Refine", accent: "& care", text: "Use it. Check the edges. Listen, learn, and keep making the experience a little better." },
];

function Wordmark({ compact = false }: { compact?: boolean }) {
  return <svg className={compact ? s.miniWordmark : s.wordmark} viewBox="0 0 1000 164" role="img" aria-label="Yainezu"><text x="0" y="150" textLength="990" lengthAdjust="spacingAndGlyphs">YAINEZU</text><path d="M165 12l-15 131M640 14l14 130" stroke="var(--paper)" strokeWidth="5"/></svg>;
}
function Star({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 200 200" aria-hidden="true"><path fill="currentColor" d="m100 0 18 58 53-29-29 53 58 18-58 18 29 53-53-29-18 58-18-58-53 29 29-53L0 100l58-18-29-53 53 29Z"/></svg>;
}
function StudyInterface({ small = false }: { small?: boolean }) {
  return <div className={`${s.studyInterface} ${small ? s.smallInterface : ""}`}><div className={s.studyNav}><b>little things</b><span>Today &nbsp; / &nbsp; My space</span><span>✳</span></div><div className={s.studyBody}><span className={s.micro}>MAKE SPACE FOR WHAT MATTERS.</span><h3>A gentler way<br/>to get <em>things done.</em></h3><div className={s.studyWidgets}><div><span>THIS WEEK</span><b>Make something<br/>you care about.</b><div className={s.bars}>{[35,60,45,80,65,95,75].map((h,i)=><i key={i} style={{height:`${h}%`}}/>)}</div></div><div><span>YOUR DAILY PAUSE</span><Star/><p>One thing at a time.</p></div></div></div></div>;
}

export default function Home() {
  return <EditorialMotion className={s.page}>
    <a href="#about" className={s.skip}>Skip to content</a>
    <header className={s.fixedNav}>
      <a href="#top" className={s.navBrand} aria-label="Yainezu home"><Wordmark compact/></a>
      <nav aria-label="Main navigation"><a href="#process">Process</a><a href="#work">Portfolio</a><a href="#desktop">Toolkit</a><a href="#contact">Say hello</a></nav>
      <button data-motion-toggle aria-pressed="false" className={s.motionToggle}>Pause motion</button>
    </header>
    <section className={s.hero} data-scene="hero">
      <div className={s.bigBrand}><Wordmark/></div>
      <div className={s.heroByline}><span>Software Engineer & Creative Mind</span><nav aria-label="Intro navigation"><a href="#process">Process</a><a href="#work">Portfolio</a><a href="#desktop">Toolkit</a><a href="#contact">Say hello</a></nav><span><em>A little corner of the internet.</em></span></div>
      <h1>I build things for<br/>people who care<br/><em>about the little things.</em></h1>
      <div className={s.heroMeta}><span>BASED IN CURIOSITY<br/>BUILT WITH CARE</span><a href="#reel">SCROLL TO EXPLORE ↓</a><span>▪ ALWAYS BECOMING</span></div>
    </section>

    <section className={s.reelTrack} id="reel" data-scene="reel" aria-label="A moving collection of interfaces and studio artwork">
      <div className={s.reelSticky}>
        <div className={s.reelFrame}>
          <div className={s.reelWorld}>
            <div className={s.reelPhoto}><Image src="/images/editorial/studio-editorial.png" alt="A generated studio study of a woman working with her laptop" fill sizes="(max-width: 750px) 90vw, 70vw" priority/></div>
            <div className={s.reelUI}><StudyInterface small/></div>
            <div className={s.reelType}><span>THOUGHTFULLY MADE.</span><p>A little<br/><em>human.</em></p><Star/></div>
            <div className={s.reelCode}><span>hello.tsx</span><pre>{'const curiosity = Infinity;\n\nfunction create(idea) {\n  return care + code;\n}'}</pre><span>IDEAS → INTERFACES</span></div>
            <div className={s.reelWallpaper}><Image src="/images/editorial/meadow-wallpaper.png" alt="" fill sizes="35vw"/><span>A LITTLE ROOM TO THINK.</span></div>
            <div className={s.reelStamp}><Star/><span>CRAFTED WITH CURIOSITY</span></div>
          </div>
          <div className={s.reelCaption}><span>YAINEZU / SELECTED EXPLORATIONS</span><span>CODE. CRAFT. CURIOSITY.</span></div>
        </div>
      </div>
    </section>
    <div className={s.equation}><span>DESIGN</span><span>+</span><span>ENGINEERING</span><span>+</span><span>CURIOSITY</span><span>=</span><span>FULL CIRCLE</span></div>

    <section className={s.about} id="about" data-scene="reveal">
      <h2>Good software is more<br/>than what’s on a screen.<br/><em>It’s the small things<br/>that make it feel human.</em></h2>
      <div className={s.aboutPhoto}><Image src="/images/editorial/studio-editorial.png" alt="A warm studio, imagined in our cozy palette" width={900} height={506}/><span className={s.micro}>AN IMAGINED STUDIO / GENERATED ARTWORK</span></div>
      <p className={s.aboutCopy}>{profile.introduction}<br/><em>A curious mind → a thoughtful interface.</em></p>
      <h2 className={s.aboutSecond}>First, a little curiosity.<br/>Then, a little code.<br/><em>And a lot of care<br/>along the way.</em></h2>
    </section>

    <section className={s.processTrack} id="process" data-scene="process" aria-label="My process">
      <div className={s.processStage}>
        <div className={s.sceneTopline}><span className={s.ab}>A <span>→</span> B</span><p>The path is rarely a straight line.<br/>That’s where <em>the good things happen.</em></p><span className={s.oval}>My process</span></div>
        <div className={s.processCards}>{steps.map((step,i)=><article className={s.processCard} key={step.name} data-process-card style={{"--card-index":i} as React.CSSProperties}>
          <span className={s.processNumber}>0{i+1}</span><svg className={s.processDrawing} viewBox="0 0 320 240" fill="none" aria-hidden="true"><path d="M-20 170Q40 80 110 170Q160 220 210 130Q270 20 340 125" stroke="currentColor"/><path d="M0 75H320" stroke="currentColor" strokeDasharray="4 6"/><rect x="102" y="40" width="95" height="95" stroke="currentColor" transform={`rotate(${i*18+15} 150 88)`}/></svg>
          <div><h3>{step.name}<br/><em>{step.accent}</em></h3><p>{step.text}</p></div>
        </article>)}</div>
      </div>
    </section>

    <section className={s.workTrack} id="work" data-scene="work" aria-label="Selected work and personal explorations">
      <div className={s.workStage}>
        <div className={s.workHeading}><h2>Selected<br/><em>work.</em></h2><p>Little worlds, thoughtful interfaces,<br/>and a few ideas in the making.<br/><em>Always a little room for curiosity.</em></p></div>
        <div className={s.workBody}><div className={s.workIndex} aria-label="Choose a project">
          {[['A little world','Next.js, React, Three.js'],['Little things','Interface concept'],['Somewhere quiet','Visual exploration']].map(([name,type],i)=><button key={name} data-work-jump={i} aria-current={i===0?"true":undefined}><span>0{i+1}.</span><span>{name}<small>{type}</small></span><span>↗</span></button>)}
          <span className={s.workHint}>SCROLL TO TURN THE PAGE ↓</span>
        </div><div className={s.workPanels}>
          <article className={`${s.workPanel} ${s.studioProject}`} data-work-panel><Image src="/images/editorial/studio-editorial.png" alt="Warm studio artwork for the interactive workspace portfolio" fill sizes="(max-width: 750px) 95vw, 70vw"/><div className={s.projectOverlay}><span className={s.micro}>01 / PERSONAL PORTFOLIO</span><h3>A little world<br/><em>of my own.</em></h3><a href="/studio" className={s.circleLink}>EXPLORE<br/>THE STUDIO<br/><b>↗</b></a></div></article>
          <article className={`${s.workPanel} ${s.interfaceProject}`} data-work-panel><StudyInterface/><span className={s.conceptLabel}>02 / INTERFACE STUDY — A PERSONAL DESIGN EXPLORATION</span></article>
          <article className={`${s.workPanel} ${s.landscapeProject}`} data-work-panel><Image src="/images/editorial/meadow-wallpaper.png" alt="A generated landscape study of sage green hills" fill sizes="(max-width: 750px) 95vw, 70vw"/><div className={s.landscapeTitle}><span className={s.micro}>03 / VISUAL EXPLORATION</span><h3>Somewhere<br/><em>quiet.</em></h3><span>A LITTLE SPACE TO THINK.</span></div></article>
        </div></div>
      </div>
    </section>

    <section className={s.computerTrack} id="desktop" data-scene="computer" aria-label="Explore my interactive desktop">
      <div className={s.computerStage}>
        <div className={s.focusScene} data-focus-scene><FocusPresentation/></div>
        <div className={s.computerIntro} data-computer-intro><span className={s.micro}>A FEW THINGS BEHIND THE SCREEN</span><h2>Come a little<br/><em>closer.</em></h2><span>KEEP SCROLLING ↓</span><button className={s.desktopShortcut} data-desktop-jump>Or open my desktop ↗</button></div>
        <div className={s.monitorWrap}><Image src="/images/editorial/crt-sage.png" alt="Sage green retro computer displaying a peaceful landscape" width={1280} height={1280}/></div>
        <div className={s.desktopReveal}><PortfolioDesktop/></div>
        <div className={s.computerProgress} aria-hidden="true"><span/></div>
      </div>
    </section>

    <footer className={s.footer} id="contact" data-scene="reveal">
      <span className={s.micro}>THE NEXT CHAPTER</span><div className={s.contactGrid}><div><h2>Good things start<br/><em>with a little hello.</em></h2><p>That’s a little glimpse into my world.<br/>Thanks for taking the time to look around.<br/><em>This story is still being written.</em></p>{profile.email ? <a className={s.contactLink} href={`mailto:${profile.email}`}>[ LET’S TALK ↗ ]</a> : <a className={s.contactLink} href="/studio">[ STEP INSIDE MY STUDIO ↗ ]</a>}</div><PlayfulShape/></div>
      <div className={s.footerLinks}><span>{profile.name} / Software engineer</span><nav aria-label="Footer navigation"><a href="#about">About</a><a href="#process">Process</a><a href="#work">Portfolio</a><a href="#desktop">Toolkit</a><a href="#top">Back to top ↑</a></nav></div><Wordmark/>
    </footer>
  </EditorialMotion>;
}
