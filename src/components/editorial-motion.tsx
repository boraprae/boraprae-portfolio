"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { between, clamp, computerPose, desktopStop, focusCardPose, processIndex, processPose, smooth, workIndex, workPose, workStops } from "@/lib/editorial-timeline";

/** Native scroll owns every scene. Frames run only when the viewport changes. */
export default function EditorialMotion({ children, className }: { children: ReactNode; className: string }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const scenes = [...element.querySelectorAll<HTMLElement>("[data-scene]")];
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motionButton = element.querySelector<HTMLButtonElement>("[data-motion-toggle]");
    const cards = [...element.querySelectorAll<HTMLElement>("[data-process-card]")];
    const panels = [...element.querySelectorAll<HTMLElement>("[data-work-panel]")];
    const workButtons = [...element.querySelectorAll<HTMLButtonElement>("[data-work-jump]")];
    const desktop = element.querySelector<HTMLElement>("[data-desktop-content]");
    const intro = element.querySelector<HTMLElement>("[data-computer-intro]");
    let frame = 0;
    let navigation = 0;
    let paused = false;
    let desktopWasInteractive = false;
    let motion = !preference.matches;
    element.dataset.motion = motion ? "on" : "off";

    function property(scene: HTMLElement, name: string, value: number, unit = "") {
      scene.style.setProperty(name, `${value.toFixed(4)}${unit}`);
    }
    function render() {
      frame = 0;
      const height = window.innerHeight;
      const mobile = window.innerWidth <= 750;
      element!.dataset.scrolled = String(window.scrollY > 160);
      const measurements = scenes.map(scene => ({ scene, box: scene.getBoundingClientRect() }));
      for (const { scene, box } of measurements) {
        const p = clamp(-box.top / Math.max(1, box.height - height));
        property(scene, "--p", p);
        switch (scene.dataset.scene) {
          case "hero":
            property(scene, "--hero-y", clamp(-box.top / height) * 55, "px");
            break;
          case "reel": {
            const expand = between((height * .65 - box.top) / height, 0, 1.25);
            property(scene, "--reel-scale", .42 + .58 * expand);
            property(scene, "--photo-x", -p * (mobile ? 25 : 75), "px");
            property(scene, "--photo-y", -p * 70, "px");
            property(scene, "--photo-scale", 1 + p * .12);
            property(scene, "--ui-x", p * (mobile ? 20 : 100), "px");
            property(scene, "--ui-y", -p * 95, "px");
            property(scene, "--ui-r", -5 + p * 9, "deg");
            property(scene, "--code-y", -p * 110, "px");
            property(scene, "--code-r", -7 + p * 13, "deg");
            property(scene, "--type-y", p * 90, "px");
            property(scene, "--wall-x", -p * 90, "px");
            property(scene, "--star-r", p * 200, "deg");
            break;
          }
          case "process":
            cards.forEach((card, index) => {
              const pose = processPose(p, index);
              property(card, "--card-height", pose.height, "%");
              property(card, "--mobile-card-y", pose.mobileY, "%");
              property(card, "--drawing-x", -25 + p * 50, "px");
              property(card, "--drawing-r", p * (index % 2 ? -25 : 25), "deg");
              const active = processIndex(p);
              card.inert = motion && mobile && index !== active;
            });
            break;
          case "work": {
            const current = workIndex(p);
            panels.forEach((panel, index) => {
              const pose = workPose(p, index);
              property(panel, "--panel-y", pose.y, "%");
              property(panel, "--panel-r", pose.rotation, "deg");
              property(panel, "--panel-scale", pose.scale);
              panel.inert = motion && index !== current;
              panel.setAttribute("aria-hidden", String(motion && index !== current));
            });
            workButtons.forEach((button, index) => {
              if (index === current) button.setAttribute("aria-current", "true");
              else button.removeAttribute("aria-current");
            });
            break;
          }
          case "computer": {
            const pose = computerPose(p);
            property(scene, "--monitor-scale", pose.monitorScale);
            property(scene, "--monitor-y", -height * .14 * pose.zoom, "px");
            property(scene, "--monitor-opacity", pose.monitorOpacity);
            property(scene, "--intro-opacity", pose.introOpacity);
            property(scene, "--intro-y", -pose.zoom * 70, "px");
            property(scene, "--desktop-opacity", pose.desktopOpacity);
            property(scene, "--desktop-scale", pose.desktopScale);
            property(scene, "--window-y", pose.windowY, "px");
            property(scene, "--window-opacity", pose.windowOpacity);
            property(scene, "--dock", pose.dock);
            property(scene, "--focus-opacity", pose.focusOpacity);
            property(scene, "--focus-blur", pose.focusBlur, "px");
            property(scene, "--emphasis-blur", pose.emphasisBlur, "px");
            property(scene, "--wash-scale", pose.washScale);
            property(scene, "--wash-opacity", pose.washOpacity);
            property(scene, "--focus-label-opacity", pose.labelOpacity);
            property(scene, "--presentation-opacity", pose.presentationOpacity);
            property(scene, "--presentation-y", pose.presentationY, "svh");
            const focusScene = scene.querySelector<HTMLElement>("[data-focus-scene]");
            if (focusScene) {
              focusScene.inert = motion && pose.presentationOpacity < .1;
              focusScene.setAttribute("aria-hidden", String(motion && pose.presentationOpacity < .1));
              focusScene.querySelectorAll<HTMLElement>("[data-focus-card]").forEach((card, index) => {
                const cardPose = focusCardPose(p, index, mobile);
                property(card, "--flip-y", cardPose.y, "svh");
                property(card, "--flip-r", cardPose.rotation, "deg");
                card.setAttribute("aria-hidden", String(motion && (cardPose.rotation > 90 || (mobile && index < 2 && focusCardPose(p, index + 1, true).y === 0))));
              });
              focusScene.querySelector<HTMLElement>("[data-focus-statement]")?.setAttribute("aria-hidden", String(motion && pose.focusOpacity < .1));
            }
            if (desktop) {
              if (motion && p < .78 && desktopWasInteractive) {
                desktopWasInteractive = false;
                window.dispatchEvent(new Event("portfolio:present"));
              }
              if (pose.interactive) desktopWasInteractive = true;
              desktop.inert = motion && !pose.interactive;
              desktop.setAttribute("aria-hidden", String(motion && !pose.interactive));
              desktop.querySelectorAll<HTMLElement>("[data-desktop-controls], [data-window-controls]").forEach(control => {
                control.inert = motion && !pose.interactive;
              });
              desktop.querySelectorAll<HTMLElement>("[data-focus-card]").forEach((card, index) => {
                const cardPose = focusCardPose(1, index, mobile);
                property(card, "--flip-y", cardPose.y, "svh");
                property(card, "--flip-r", cardPose.rotation, "deg");
                card.setAttribute("aria-hidden", String(motion && desktop.dataset.expanded !== "true" && (cardPose.rotation > 90 || (mobile && index < 2 && focusCardPose(1, index + 1, true).y === 0))));
              });
              desktop.querySelector<HTMLElement>("[data-focus-statement]")?.setAttribute("aria-hidden", String(motion && pose.focusOpacity < .1));
            }
            if (intro) intro.inert = motion && pose.introOpacity < .1;
            break;
          }
          case "reveal":
            property(scene, "--reveal-y", (1 - between((height - box.top) / height, .08, .6)) * 70, "px");
            break;
        }
      }
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(render); }
    function cancelNavigation() { cancelAnimationFrame(navigation); navigation = 0; }
    function scrollToPosition(destination: number) {
      cancelNavigation();
      const start = window.scrollY;
      const distance = destination - start;
      if (!motion || Math.abs(distance) < 2) {
        window.scrollTo({ top: destination, behavior: "instant" });
        schedule();
        return;
      }
      const duration = Math.min(2400, 1500 + Math.abs(distance) / window.innerHeight * 80);
      let started = 0;
      function advance(now: number) {
        if (!started) started = now;
        const p = clamp((now - started) / duration);
        window.scrollTo({ top: start + distance * smooth(p), behavior: "instant" });
        if (p < 1) navigation = requestAnimationFrame(advance);
        else navigation = 0;
      }
      navigation = requestAnimationFrame(advance);
    }
    function changeMotion() {
      cancelNavigation();
      // Preserve the current section when its pinned scroll space is collapsed.
      const current = scenes.find(scene => {
        const box = scene.getBoundingClientRect();
        return box.top <= window.innerHeight * .3 && box.bottom > window.innerHeight * .3;
      });
      const before = current?.getBoundingClientRect();
      const fraction = before ? clamp(-before.top / Math.max(1, before.height - window.innerHeight)) : 0;
      motion = !paused && !preference.matches;
      element!.dataset.motion = motion ? "on" : "off";
      if (motionButton) {
        motionButton.textContent = preference.matches ? "Reduced motion" : paused ? "Resume motion" : "Pause motion";
        motionButton.setAttribute("aria-pressed", String(!motion));
        motionButton.disabled = preference.matches;
      }
      if (current && before && before.top < 0) {
        const after = current.getBoundingClientRect();
        window.scrollTo({ top: window.scrollY + after.top + fraction * Math.max(0, after.height - window.innerHeight), behavior: "instant" });
      }
      render();
    }
    function click(event: MouseEvent) {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target as Element;
      if (target.closest("[data-motion-toggle]")) { paused = !paused; changeMotion(); return; }
      const workButton = target.closest<HTMLElement>("[data-work-jump]");
      const jump = target.closest<HTMLElement>("[data-desktop-jump]");
      if (workButton || jump) {
        const section = element!.querySelector<HTMLElement>(workButton ? '[data-scene="work"]' : '[data-scene="computer"]');
        if (!section) return;
        const box = section.getBoundingClientRect();
        const progress = workButton ? workStops[Number(workButton.dataset.workJump)] : desktopStop;
        if (!motion && workButton) {
          const panel = panels[Number(workButton.dataset.workJump)];
          scrollToPosition(window.scrollY + panel.getBoundingClientRect().top - 70);
        } else scrollToPosition(window.scrollY + box.top + progress * Math.max(0, box.height - window.innerHeight));
        return;
      }
      const link = target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href")!.slice(1);
      const destination = document.getElementById(id);
      if (!destination) return;
      event.preventDefault();
      history.replaceState(null, "", `#${id}`);
      scrollToPosition(id === "top" ? 0 : window.scrollY + destination.getBoundingClientRect().top - 58);
    }
    const observer = new ResizeObserver(schedule);
    observer.observe(element);
    // Files can replace the toolkit after the timeline has stopped scrolling.
    const desktopObserver = new MutationObserver(schedule);
    if (desktop) desktopObserver.observe(desktop, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-expanded"] });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("wheel", cancelNavigation, { passive: true });
    window.addEventListener("touchstart", cancelNavigation, { passive: true });
    window.addEventListener("pointerdown", cancelNavigation);
    window.addEventListener("keydown", cancelNavigation);
    preference.addEventListener("change", changeMotion);
    element.addEventListener("click", click);
    changeMotion();
    // A deep link is first laid out without JS. Re-align it once pinning changes
    // document height, rather than leaving it at the static layout's old offset.
    const initialHash = window.location.hash.slice(1);
    function restoreHash() {
      if (!initialHash) return;
      const target = document.getElementById(initialHash);
      if (!target) return;
      window.scrollTo({ top: initialHash === "top" ? 0 : window.scrollY + target.getBoundingClientRect().top - 58, behavior: "instant" });
      schedule();
    }
    const restoreFrame = requestAnimationFrame(restoreHash);
    window.addEventListener("load", restoreHash, { once: true });
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(restoreFrame);
      window.removeEventListener("load", restoreHash);
      cancelNavigation();
      observer.disconnect();
      desktopObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("wheel", cancelNavigation);
      window.removeEventListener("touchstart", cancelNavigation);
      window.removeEventListener("pointerdown", cancelNavigation);
      window.removeEventListener("keydown", cancelNavigation);
      preference.removeEventListener("change", changeMotion);
      element.removeEventListener("click", click);
      delete element.dataset.motion;
      [...cards, ...panels].forEach(node => { node.inert = false; node.removeAttribute("aria-hidden"); });
      if (desktop) {
        desktop.inert = false; desktop.removeAttribute("aria-hidden");
        desktop.querySelectorAll<HTMLElement>("[data-desktop-controls], [data-window-controls], [data-focus-card], [data-focus-statement]").forEach(node => { node.inert = false; node.removeAttribute("aria-hidden"); });
      }
      if (intro) intro.inert = false;
    };
  }, []);

  return <main ref={root} className={className} id="top" tabIndex={-1}>{children}</main>;
}
