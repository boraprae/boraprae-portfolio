# Portfolio redesign handoff — 2026-10-09

## User intent

Match the layout and scroll choreography of https://neutomni.com/ as closely as possible, using the portfolio's existing cozy-paper CI. The user was unhappy with a loosely inspired static layout and small scroll effects. They explicitly permit generated imagery/video. Keep the software-engineer context. Do not invent career history or portray generated artwork as a real portrait/client project.

## Repository and running app

- Repository: `/Users/thanchanokt/ai-learning/boraprae-portfolio`
- Branch: `codex/cozy-editorial-redesign`
- Preview: http://localhost:3002/
- Start if absent: `pnpm dev --port 3002`
- Do not stop unrelated dev servers. Do not discard concurrent changes.
- Original 3D portfolio remains at `/studio`; baseline master commit `199f9d1`.
- `3afa0a9` contains the new layout/assets but still had the old, incompatible motion controller. The current work replaces that controller and completes the scene wiring.

## Current implementation

1. Oversized Yainezu wordmark, compact fixed navigation, asymmetric hero.
2. Scroll-expanding montage with separately moving photo, interface, typography, and code layers.
3. Asymmetric two-column introduction.
4. Four rising process columns; mobile uses sequential stacked cards.
5. Three overlapping project panels, synchronized selectable index, long reading holds.
6. Generated sage CRT zooms and crossfades into an actual interactive desktop. Files open About, Toolkit, Notes, and wallpaper; windows close/reset/drag. The original studio is a link.
7. Footer shape supports pointer dragging and keyboard interaction.
8. Pause/resume and system reduced motion restore continuous static content. Inactive panels/desktop are inert. Native wheel/touch scrolling is never intercepted; explicit navigation takes 1.5–2.4 seconds and can be interrupted.

## Files

- `src/app/page.tsx`: section structure and content.
- `src/app/editorial.module.css`: scoped layout, responsive and motion styles.
- `src/components/editorial-motion.tsx`: native-scroll controller and navigation.
- `src/lib/editorial-timeline.ts`: pure deterministic keyframes.
- `src/components/portfolio-desktop.tsx`: interactive desktop and footer shape.
- `public/images/editorial/`: generated PNG assets. `GENERATION.md` records the actual prompts/tool provenance. Next Image optimizes delivery.
- `tests/editorial-timeline.test.mjs`: reversible poses, project reading holds, desktop interactivity threshold, mobile process sequencing.

## Validation

- `node --experimental-strip-types --test tests/editorial-timeline.test.mjs`: 8 tests pass (run with Node 22.6+; current environment uses Node 25).
- `pnpm lint` and `pnpm build`.
- Browser checked at 1440×960 and 390×844: native process height changes, project selector/stack states, desktop zoom shortcut, file open/close/reopen, Notes disclosures, pause/resume, direct-hash reload alignment, and horizontal overflow.

## Remaining difference from reference

This is a custom implementation, not the original Webflow source. The reference's prerecorded UI film is recreated as scroll-driven layers; the wordmark and generated visual studies are original. It does not yet have the reference's loading-counter sequence, exact film frames, or the exact desktop OS icon artwork. Do not call this pixel-perfect or claim generated video exists. Prioritize real scroll/transition comparison if the user wants another fidelity pass; do not replace the working scenes with static cards again.

## Ready-to-use continuation prompt

Continue the Neutomni-fidelity redesign in `/Users/thanchanokt/ai-learning/boraprae-portfolio` on `codex/cozy-editorial-redesign`. Read `docs/REDESIGN-HANDOFF.md`, current git status, and relevant installed Next.js docs first. Keep all completed scroll scenes, original `/studio`, and cozy CI (`#fcfbf6`, `#426653`, `#8d9c75`, `#433f35`, warm oak/terracotta). Compare https://neutomni.com/ and localhost:3002 in the browser at matched desktop/mobile dimensions, concentrating on the expanding opening film, rising process columns, work stack, and CRT-to-desktop zoom. Improve the concrete fidelity gaps rather than inventing a new design. If more assets are needed, use the built-in image-generation skill and save outputs inside this repo; do not invent client work or CV facts. Validate native forward/reverse scrolling, keyboard access, reduced motion, desktop interactions, lint, build, and the motion tests. Keep the dev server running and leave updated continuation notes if unfinished.


## Focus choreography update — 2026-10-09

Observed the live reference at 1440×960: sharp centered statement, selective blur of the top lines, staggered cards showing their reverse before flipping front, a reading hold, then the same canvas scales to a lower-left desktop window. Implemented this in `focus-presentation.tsx`, the computer timeline, and scoped CSS using the existing cozy CI. Desktop track is now 1100svh; mobile 1300svh, with sequential tickets and separate reading holds. Reverse scrolling from the interactive desktop resets the presentation canvas. The expanded toolkit presents all three readable cards.

Latest validation: timeline tests, lint and production build pass. The new focus choreography has NOT yet been visually verified: browser security rejected binding the old unavailable localhost tabs (data-protocol error pages). Server was found stopped and started again at port 3002. Do not claim the new screenshots or mobile visual QA are complete. Earlier browser validation above predates this update. Next step: open a working preview and compare the focus, card flip, dock, reverse and expanded-window states at desktop/mobile sizes. This work remains uncommitted.


## User correction: focus must precede CRT

The previous sequence was wrong. Current order is standalone focus/blur/tickets (0–.56), exit (.56–.62), CRT entrance (.62–.68), CRT hold (.68–.74), screen zoom (.74–.89), desktop reveal (.855–.90), desktop interaction (.90–1). FocusPresentation now appears before the monitor in page.tsx, outside the desktop subtree. Desktop reuses the toolkit cards already fully revealed. Timeline regression tests assert that monitor and desktop remain invisible throughout the focus scene. This supersedes the sequence described above.
