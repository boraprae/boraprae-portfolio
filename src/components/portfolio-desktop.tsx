"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { profile } from "@/data/portfolio";
import FocusPresentation from "@/components/focus-presentation";
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
  const [expanded, setExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null);
  const fileRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const present = () => { setOpen("toolkit"); setExpanded(false); setPosition({ x: 0, y: 0 }); };
    window.addEventListener("portfolio:present", present);
    return () => window.removeEventListener("portfolio:present", present);
  }, []);

  function show(id: WindowName) { setPosition({ x: 0, y: 0 }); setExpanded(true); setOpen(id); }
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

  return <div className={s.desktopOS} data-desktop-content data-open-window={open || "none"} data-expanded={expanded}>
    <Image className={s.wallpaper} src="/images/editorial/meadow-wallpaper.png" alt="" fill sizes="100vw" />
    <div className={s.desktopMessage}>A curious mind.<br/><em>A few open windows.</em></div>
    <div className={s.desktopFiles} aria-label="Desktop files" data-desktop-controls>
      {files.map((file, index) => <button key={file.id} ref={node => { fileRefs.current[index] = node; }} onClick={() => show(file.id)} aria-pressed={open === file.id}><span className={s.fileIcon}>{file.icon}</span>{file.label}</button>)}
      <a href="/studio"><span className={s.fileIcon}>✳</span>Studio.url</a>
    </div>
    <div className={s.windowEntrance}>
      {open && <section className={s.osWindow} style={{ translate: `${position.x}px ${position.y}px` }} aria-label={files.find(file => file.id === open)?.label} onKeyDown={event => { if (event.key === "Escape") close(); }}>
        <div className={s.titlebar} data-window-controls onPointerDown={startDrag} onPointerMove={move} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}>
          <span>◈</span><span>{files.find(file => file.id === open)?.label}</span>
          <button aria-label={expanded ? "Restore window size" : "Expand window"} onClick={() => { setPosition({ x: 0, y: 0 }); setExpanded(!expanded); }}>□</button><button aria-label="Close window" onClick={close}>×</button>
        </div>
        <div className={s.windowBody}>
          {open === "toolkit" && <FocusPresentation/>}
          {open === "about" && <div className={s.aboutWindow}><Image src="/images/editorial/studio-editorial.png" alt="Generated illustration of a woman coding in a warm studio" width={900} height={506}/><span className={s.micro}>A STUDIO STUDY / GENERATED ARTWORK</span><h3>Hello, I’m {profile.name}.</h3><p>{profile.introduction}</p><a href="/studio">Visit my interactive workspace ↗</a></div>}
          {open === "notes" && <div className={s.notesWindow}><span className={s.micro}>PERSONAL NOTES / ALWAYS IN PROGRESS</span><h3>Behind the code.</h3><details open><summary>01 — What I’m drawn to</summary><p>The place where engineering meets visual storytelling. Useful, clear interfaces with a little personality.</p></details><details><summary>02 — What is this website made of?</summary><p>Next.js, TypeScript, native scroll-driven animation, and a Three.js studio. The artwork is a visual exploration created for this portfolio.</p></details><details><summary>03 — A little beyond the screen</summary><p>Pixel art, retro design, and small things that spark a new idea.</p></details></div>}
          {open === "wallpaper" && <div className={s.wallpaperWindow}><Image src="/images/editorial/meadow-wallpaper.png" alt="Soft sage hills under a warm ivory sky" width={1440} height={810}/><p>Somewhere quiet. A generated landscape study in our cozy palette.</p></div>}
        </div>
      </section>}
    </div>
    <div className={s.taskbar} data-desktop-controls><span>✳ <b>Yainezu OS</b></span><span>GOOD THINGS TAKE A LITTLE CURIOSITY.</span><button onClick={() => show("toolkit")}>⌘ Open toolkit</button></div>
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
