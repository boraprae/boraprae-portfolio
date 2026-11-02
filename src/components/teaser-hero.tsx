"use client";

import { useEffect, useRef, useState } from "react";
import s from "@/app/editorial.module.css";

const SRC = "/video/pear-teaser.mp4";
const POSTER = "/video/pear-teaser-poster.jpg";

/* Thin-stroke marks in the film's own idiom; the label moves to aria-label. */
const Icon = ({ d, fill = false }: { d: string; fill?: boolean }) => (
  <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"
    fill={fill ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const SPEAKER = "M4 9.5h3.2L12 5.5v13l-4.8-4H4z";
const WAVES = "M16 9.2a4 4 0 0 1 0 5.6M18.8 6.6a7.6 7.6 0 0 1 0 10.8";
const SLASH = "M16.5 9.8l4.5 4.4M21 9.8l-4.5 4.4";
const PAUSE = "M9.5 5.5v13M14.5 5.5v13";
const PLAY = "M8 5.4l10.5 6.6L8 18.6z";
const REPLAY = "M19.5 12a7.5 7.5 0 1 1-2.4-5.5M19.6 4.6v4.2h-4.2";


/**
 * The opening scene: the teaser fills the viewport and plays itself, silent and
 * looping. Sound is opt-in because the clip carries a voiceover and because a
 * browser will refuse to autoplay anything that is not muted.
 *
 * Playback follows the viewport — scrolling the film off screen pauses it, and
 * scrolling back resumes it, unless the visitor has paused it themselves.
 */
export default function TeaserHero() {
  const video = useRef<HTMLVideoElement>(null);
  /** What the visitor last asked for. The observer never overrides this. */
  const wanted = useRef(true);
  const [sound, setSound] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");

    const play = () => element.play().catch(() => {});
    const sync = () => setPlaying(!element.paused);
    element.addEventListener("play", sync);
    element.addEventListener("pause", sync);

    // An arrow, not a hoisted declaration: that is what keeps `element` narrowed.
    const applyPreference = () => {
      setReduced(preference.matches);
      wanted.current = !preference.matches;
      if (preference.matches) element.pause();
      else play();
    };
    applyPreference();
    preference.addEventListener("change", applyPreference);

    // A film playing to nobody still decodes frames and burns battery.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { if (wanted.current) play(); }
      else element.pause();
    }, { threshold: .35 });
    observer.observe(element);

    return () => {
      observer.disconnect();
      preference.removeEventListener("change", applyPreference);
      element.removeEventListener("play", sync);
      element.removeEventListener("pause", sync);
    };
  }, []);

  function toggleSound() {
    const element = video.current;
    if (!element) return;
    const next = !sound;
    element.muted = !next;
    if (next) element.volume = 1;
    setSound(next);
    // Unmuting a paused film is a dead end — start it for them.
    if (next && element.paused) { wanted.current = true; element.play().catch(() => {}); }
  }

  function togglePlay() {
    const element = video.current;
    if (!element) return;
    wanted.current = element.paused;
    if (element.paused) element.play().catch(() => {});
    else element.pause();
  }

  function restart() {
    const element = video.current;
    if (!element) return;
    element.currentTime = 0;
    wanted.current = true;
    element.play().catch(() => {});
  }

  return (
    <section className={s.teaser} id="teaser" data-scene="teaser" aria-label="Teaser film">
      <video
        ref={video}
        className={s.teaserVideo}
        width={1920}
        height={1080}
        poster={POSTER}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        controls={reduced}
        aria-label="A fifty second teaser film introducing my work"
      >
        <source src={SRC} type="video/mp4" />
        Your browser cannot play this video.{" "}
        <a href={SRC}>Download the teaser instead.</a>
      </video>

      <div className={s.teaserControls}>
        <button className={s.iconPill} onClick={toggleSound} aria-pressed={sound}
          aria-label={sound ? "Turn off sound" : "Turn on sound"}
          title={sound ? "Turn off sound" : "Turn on sound"}>
          <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"
            fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d={SPEAKER} />
            <path d={sound ? WAVES : SLASH} />
          </svg>
        </button>
        <button className={s.iconPill} onClick={togglePlay} aria-pressed={!playing}
          aria-label={playing ? "Pause the film" : "Play the film"}
          title={playing ? "Pause the film" : "Play the film"}>
          <Icon d={playing ? PAUSE : PLAY} fill={!playing} />
        </button>
        <button className={s.iconPill} onClick={restart} aria-label="Replay from the start" title="Replay from the start">
          <Icon d={REPLAY} />
        </button>
        <a href="#intro" className={s.scrollHint}>
          Keep scrolling<span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
