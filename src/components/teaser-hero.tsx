"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import s from "@/app/editorial.module.css";
import TeaserFilm, { useFilmClock } from "@/components/teaser-film";

/* Thin-stroke marks in the film's idiom; the label moves to aria-label. */
const Icon = ({ d, fill = false }: { d: string; fill?: boolean }) => (
  <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"
    fill={fill ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const PAUSE = "M9.5 5.5v13M14.5 5.5v13";
const PLAY = "M8 5.4l10.5 6.6L8 18.6z";
const REPLAY = "M19.5 12a7.5 7.5 0 1 1-2.4-5.5M19.6 4.6v4.2h-4.2";

/**
 * The opening scene: the teaser, built from the page's own elements rather than
 * played as a file. It is a port of the Remotion composition in
 * thanchanok-portfolio-frames/src/PearTeaser.tsx — same frames, same easings,
 * now as DOM, so it stays crisp at any size and carries no 11MB download.
 *
 * It plays itself, loops, and stops while off screen — but it no longer presses
 * its own buttons: at the Run button and at the prompt's send button the clock
 * holds, the control blinks under the pointer, and the film waits for a click.
 * Reduced motion holds it on the frame where the name is on screen instead.
 */
export default function TeaserHero() {
  const host = useRef<HTMLElement>(null);
  const [reduced, setReduced] = useState(false);
  const [wanted, setWanted] = useState(true);
  const { frame, gate, release, restart } = useFilmClock(host, wanted && !reduced);

  // Pressing a gate is also a request to watch: it resumes a paused film.
  const press = useCallback(() => { setWanted(true); release(); }, [release]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(preference.matches);
    apply();
    preference.addEventListener("change", apply);
    return () => preference.removeEventListener("change", apply);
  }, []);

  // The film is a 1920×1080 canvas; cover the viewport with it.
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const fit = () => {
      const { width, height } = element.getBoundingClientRect();
      // Cover looks right on a landscape screen, but on a phone it would leave
      // a quarter of the 16:9 frame visible. Below 4:3 the film fits the width
      // instead and the aurora fills the band above and below.
      const scale = width / height >= 4 / 3
        ? Math.max(width / 1920, height / 1080)
        : width / 1920;
      element.style.setProperty("--film-scale", String(scale));
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const playing = wanted && !reduced;
  // A still that reads as the film rather than an empty stage.
  const shown = reduced ? 470 : frame;

  return (
    <section ref={host} className={s.teaser} id="teaser" data-scene="teaser" aria-label="Teaser">
      <TeaserFilm frame={shown} gate={reduced ? null : gate} onRelease={press} />

      <div className={s.teaserControls}>
        <button className={s.iconPill} onClick={() => setWanted((v) => !v)} aria-pressed={!playing}
          disabled={reduced}
          aria-label={playing ? "Pause the teaser" : "Play the teaser"}
          title={playing ? "Pause the teaser" : "Play the teaser"}>
          <Icon d={playing ? PAUSE : PLAY} fill={!playing} />
        </button>
        <button className={s.iconPill} onClick={() => { setWanted(true); restart(); }}
          disabled={reduced} aria-label="Replay from the start" title="Replay from the start">
          <Icon d={REPLAY} />
        </button>
        <a href="#intro" className={s.scrollHint}>
          Keep scrolling<span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
