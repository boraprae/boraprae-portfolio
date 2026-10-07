"use client";

import { useEffect, useRef, type ReactNode } from "react";

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => value * value * (3 - 2 * value);

/** Native scroll owns the timeline. No wheel interception or time-based playback. */
export default function EditorialMotion({ children, className }: { children: ReactNode; className: string }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const scenes = [...element.querySelectorAll<HTMLElement>("[data-motion]")];
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    function render() {
      frame = 0;
      const height = window.innerHeight;
      // Read every box before writing styles to avoid interleaved layout work.
      const measurements = scenes.map(scene => ({ scene, box: scene.getBoundingClientRect() }));
      element!.dataset.motionReady = String(!preference.matches);
      for (const { scene, box } of measurements) {
        const pinned = scene.dataset.motion === "collage";
        const progress = preference.matches ? 1 : clamp(pinned
          ? -box.top / Math.max(1, box.height - height)
          : (height * .92 - box.top) / (height * .72));
        const p = ease(progress);
        scene.style.setProperty("--scroll", p.toFixed(4));
        scene.style.setProperty("--enter-y", `${(1 - p) * 90}px`);
        scene.style.setProperty("--enter-angle", `${(1 - p) * -7}deg`);
        scene.style.setProperty("--enter-scale", `${.85 + p * .15}`);
        if (pinned) {
          // Arrival, a long reading hold, then separation. Every pose reverses on scroll up.
          const arrive = ease(clamp(progress / .35));
          const depart = ease(clamp((progress - .75) / .25));
          const mobile = window.innerWidth <= 750;
          scene.style.setProperty("--land-x", `${(1 - arrive) * (mobile ? -65 : -190) - depart * 85}px`);
          scene.style.setProperty("--land-y", `${(1 - arrive) * 100 - depart * 90}px`);
          scene.style.setProperty("--land-r", `${-18 + arrive * 10 - depart * 9}deg`);
          scene.style.setProperty("--code-x", `${(1 - arrive) * (mobile ? 65 : 200) + depart * 95}px`);
          scene.style.setProperty("--code-y", `${(1 - arrive) * 140 - depart * 65}px`);
          scene.style.setProperty("--code-r", `${18 - arrive * 13 + depart * 10}deg`);
          scene.style.setProperty("--note-y", `${(1 - arrive) * 220 + depart * 90}px`);
          scene.style.setProperty("--flower-r", `${progress * 270}deg`);
        }
        if (scene.dataset.motion === "step") {
          const active = box.top < height * .6 && box.bottom > height * .4;
          scene.dataset.active = String(active || preference.matches);
        }
      }
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(render);
    }
    const observer = new ResizeObserver(schedule);
    observer.observe(element);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    preference.addEventListener("change", schedule);
    render();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      preference.removeEventListener("change", schedule);
      delete element.dataset.motionReady;
    };
  }, []);

  return <main ref={root} className={className} id="top" tabIndex={-1}>{children}</main>;
}
