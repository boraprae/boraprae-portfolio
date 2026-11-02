"use client";

import { useEffect, useRef, useState } from "react";
import s from "@/app/editorial.module.css";

const SRC = "/video/pear-teaser.mp4";
const POSTER = "/video/pear-teaser-poster.jpg";

/**
 * The opening scene: the teaser plays itself, silent and looping, the moment the
 * page opens. Sound is opt-in because the clip carries a voiceover and sfx, and
 * a browser will refuse to autoplay anything that is not muted.
 */
export default function TeaserHero() {
  const video = useRef<HTMLVideoElement>(null);
  const [sound, setSound] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setReduced(preference.matches);
      const element = video.current;
      if (!element) return;
      if (preference.matches) {
        element.pause();
        setPlaying(false);
      } else {
        element.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      }
    };
    apply();
    preference.addEventListener("change", apply);
    return () => preference.removeEventListener("change", apply);
  }, []);

  function toggleSound() {
    const element = video.current;
    if (!element) return;
    const next = !sound;
    element.muted = !next;
    if (next) element.volume = 1;
    setSound(next);
    // Unmuting a paused video is a dead end — start it for them.
    if (next && element.paused) element.play().then(() => setPlaying(true)).catch(() => {});
  }

  function togglePlay() {
    const element = video.current;
    if (!element) return;
    if (element.paused) element.play().then(() => setPlaying(true)).catch(() => {});
    else { element.pause(); setPlaying(false); }
  }

  function restart() {
    const element = video.current;
    if (!element) return;
    element.currentTime = 0;
    element.play().then(() => setPlaying(true)).catch(() => {});
  }

  return (
    <section className={s.teaser} id="teaser" data-scene="teaser" aria-label="Teaser film">
      <div className={s.teaserInner}>
        <div className={s.teaserTopline}>
          <span className={s.micro}>00 / THE TEASER</span>
          <span className={s.micro}>
            <i className={s.liveDot} aria-hidden="true" />
            {reduced ? "PAUSED FOR REDUCED MOTION" : "NOW PLAYING"}
          </span>
          <span className={s.micro}>1920 × 1080 · 50s</span>
        </div>

        <div className={s.teaserGlow} aria-hidden="true" />
        <div className={s.teaserFrame}>
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
        </div>

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
      </div>
    </section>
  );
}
