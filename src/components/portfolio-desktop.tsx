"use client";

import Image from "next/image";
import { useRef, useState, type PointerEvent } from "react";
import { profile } from "@/data/portfolio";
import s from "@/app/editorial.module.css";

type WindowName = "toolkit" | "about" | "notes" | "wallpaper";
const files: { id: WindowName; label: string; icon: string }[] = [
  { id: "about", label: "About.txt", icon: "↗" },
  { id: "toolkit", label: "Toolkit.html", icon: "⌘" },
  { id: "notes", label: "Notes.md", icon: "≡" },
  { id: "wallpaper", label: "Somewhere.jpg", icon: "▧" },
];

export default function PortfolioDesktop() {
  const [open, setOpen] = useState<WindowName | null>("toolkit");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null);
  const fileRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function show(id: WindowName) { setPosition({ x: 0, y: 0 }); setOpen(id); }
  function close() {
    const index = files.findIndex(file => file.id === open);
    setOpen(null);
    fileRefs.current[index]?.focus({ preventScroll: true });
  }
  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button") || window.innerWidth < 750) return;
    drag.current = { x: event.clientX, y: event.clientY, startX: position.x, startY: position.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function move(event: PointerEvent<HTMLDivElement>) {
    const current = drag.current;
    if (!current) return;
    setPosition({
      x: Math.max(-120, Math.min(120, current.startX + event.clientX - current.x)),
      y: Math.max(-50, Math.min(50, current.startY + event.clientY - current.y)),
    });
  }

  return <div className={s.desktopOS} data-desktop-content>
    <Image className={s.wallpaper} src="/images/editorial/meadow-wallpaper.png" alt="" fill sizes="100vw" />
    <div className={s.desktopMessage}>A curious mind.<br/><em>A few open windows.</em></div>
    <div className={s.desktopFiles} aria-label="Desktop files">
      {files.map((file, index) => <button key={file.id} ref={node => { fileRefs.current[index] = node; }} onClick={() => show(file.id)} aria-pressed={open === file.id}><span className={s.fileIcon}>{file.icon}</span>{file.label}</button>)}
      <a href="/studio"><span className={s.fileIcon}>✳</span>Studio.url</a>
    </div>
    <div className={s.windowEntrance}>
      {open && <section className={s.osWindow} style={{ translate: `${position.x}px ${position.y}px` }} aria-label={files.find(file => file.id === open)?.label} onKeyDown={event => { if (event.key === "Escape") close(); }}>
        <div className={s.titlebar} onPointerDown={startDrag} onPointerMove={move} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}>
          <span>◈</span><span>{files.find(file => file.id === open)?.label}</span>
          <button aria-label="Reset window position" onClick={() => setPosition({ x: 0, y: 0 })}>□</button><button aria-label="Close window" onClick={close}>×</button>
        </div>
        <div className={s.windowBody}>
          {open === "toolkit" && <><div className={s.windowHeading}><span>WHAT I BUILD WITH</span><h3>A small toolkit.<br/><em>Endless possibilities.</em></h3></div><div className={s.skillTickets}>
            {[
              ["01", "Interfaces", "Thoughtful foundations for the things you see and use.", ["React & Next.js", "TypeScript", "Responsive CSS"], "UI"],
              ["02", "Interactions", "A little motion that makes an interface feel alive.", ["Three.js", "Scroll storytelling", "Accessible interactions"], "IX"],
              ["03", "Curiosity", "The habits behind the work. Always a work in progress.", ["Visual exploration", "Learning by making", "Care for the details"], "∞"],
            ].map(([n, name, text, tags, mark]) => <article className={s.skillTicket} key={String(n)}><h4>{name}</h4><p>{text}</p><ul>{(tags as string[]).map(tag => <li key={tag}>{tag}</li>)}</ul><div className={s.ticketTear}>CUT ALONG LINE <span>✂</span></div><div className={s.ticketBottom}><span>YNZ / FIELD {n}<br/>SOFTWARE ENGINEERING</span><b>{mark}</b></div></article>)}
          </div></>}
          {open === "about" && <div className={s.aboutWindow}><Image src="/images/editorial/studio-editorial.png" alt="Generated illustration of a woman coding in a warm studio" width={900} height={506}/><span className={s.micro}>A STUDIO STUDY / GENERATED ARTWORK</span><h3>Hello, I’m {profile.name}.</h3><p>{profile.introduction}</p><a href="/studio">Visit my interactive workspace ↗</a></div>}
          {open === "notes" && <div className={s.notesWindow}><span className={s.micro}>PERSONAL NOTES / ALWAYS IN PROGRESS</span><h3>Behind the code.</h3><details open><summary>01 — What I’m drawn to</summary><p>The place where engineering meets visual storytelling. Useful, clear interfaces with a little personality.</p></details><details><summary>02 — What is this website made of?</summary><p>Next.js, TypeScript, native scroll-driven animation, and a Three.js studio. The artwork is a visual exploration created for this portfolio.</p></details><details><summary>03 — A little beyond the screen</summary><p>Pixel art, retro design, and small things that spark a new idea.</p></details></div>}
          {open === "wallpaper" && <div className={s.wallpaperWindow}><Image src="/images/editorial/meadow-wallpaper.png" alt="Soft sage hills under a warm ivory sky" width={1440} height={810}/><p>Somewhere quiet. A generated landscape study in our cozy palette.</p></div>}
        </div>
      </section>}
    </div>
    <div className={s.taskbar}><span>✳ <b>Yainezu OS</b></span><span>GOOD THINGS TAKE A LITTLE CURIOSITY.</span><button onClick={() => show("toolkit")}>⌘ Open toolkit</button></div>
  </div>;
}

export function PlayfulShape() {
  const ref = useRef<HTMLDivElement>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  function move(event: PointerEvent<HTMLDivElement>) {
    if (!start.current || !ref.current) return;
    const x = Math.max(-180, Math.min(180, event.clientX - start.current.x));
    const y = Math.max(-90, Math.min(90, event.clientY - start.current.y));
    ref.current.style.transform = `translate(${x}px, ${y}px) rotate(${x / 2}deg)`;
  }
  function reset() { start.current = null; if (ref.current) ref.current.style.transform = ""; }
  return <div className={s.shapePlayground}><span className={s.micro}>〈 DRAG A LITTLE CURIOSITY 〉</span><div className={s.playShape} ref={ref} role="button" tabIndex={0} aria-label="Play with shape. Drag or use arrow keys. Home resets." onPointerDown={event => { start.current = { x: event.clientX, y: event.clientY }; event.currentTarget.setPointerCapture(event.pointerId); }} onPointerMove={move} onPointerUp={reset} onPointerCancel={reset} onKeyDown={event => { if (event.key === "Home" || event.key === "Escape") reset(); else if (event.key.startsWith("Arrow")) { event.preventDefault(); if (ref.current) ref.current.style.transform = `rotate(${event.key === "ArrowLeft" ? -45 : 45}deg) scale(1.08)`; } }}><svg viewBox="0 0 200 200" aria-hidden="true">{Array.from({length:8},(_,i)=><ellipse key={i} cx="100" cy="55" rx="29" ry="51" transform={`rotate(${i*45} 100 100)`}/>)}</svg></div></div>;
}
