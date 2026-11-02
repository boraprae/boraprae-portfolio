"use client";

import { useEffect, useRef, useState } from "react";
import s from "@/app/editorial.module.css";

const SRC = "/video/pear-teaser.mp4";
const POSTER = "/video/pear-teaser-poster.jpg";

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
        <button className={s.pill} onClick={toggleSound} aria-pressed={sound}>
          <span aria-hidden="true">{sound ? "♪" : "⏾"}</span>
          {sound ? "Sound on" : "Turn on sound"}
        </button>
        <button className={s.pill} onClick={togglePlay} aria-pressed={!playing}>
          <span aria-hidden="true">{playing ? "❙❙" : "▶"}</span>
          {playing ? "Pause" : "Play"}
        </button>
        <button className={s.pill} onClick={restart}>
          <span aria-hidden="true">↺</span>Replay
        </button>
        <a href="#intro" className={`${s.pill} ${s.pillGhost}`}>
          Keep scrolling<span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
