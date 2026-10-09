This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3200](http://localhost:3200) with your browser to see the result.

The page is in `src/app/page.tsx`. The development server updates the preview as files change.

## Editorial redesign

The `/` route follows the visual sequence of https://neutomni.com/ while retaining our cozy-paper palette and personal portfolio content. The previous 3D portfolio remains at `/studio` and in baseline commit `199f9d1` on `master`.

- `src/app/page.tsx`: large wordmark, expanding montage, asymmetric introduction, rising process columns, three stacked work panels, a CRT zoom, selective-focus statement, staggered ticket flips, a continuous window-to-desktop transition, and contact section.
- `src/components/editorial-motion.tsx`: native, reversible scroll timeline; scoped to `data-scene`. No scroll hijacking. Anchor/project navigation takes 1.5–2.4 seconds and yields immediately to manual input.
- `src/lib/editorial-timeline.ts`: deterministic process, project, and computer keyframes. Project reading holds and the desktop dwell do not move while reading.
- `src/components/portfolio-desktop.tsx`: interactive files, draggable window, close/reopen/reset controls, notebook disclosures, and keyboard-operable footer shape.
- `src/app/editorial.module.css`: desktop and mobile scene layouts. Pause motion and system reduced-motion preferences restore continuous static content; hidden scene content is not keyboard-focusable.
- `public/images/editorial/`: generated studio, CRT, and meadow artwork. Prompts and provenance are recorded in `GENERATION.md`. They illustrate concepts, not client work or the portfolio owner's real appearance.
- `tests/editorial-timeline.test.mjs`: `node --experimental-strip-types --test tests/editorial-timeline.test.mjs` (Node 22.6+). The app supports the Node version specified in package.json.

The reference's film-like introduction is recreated with independently moving image/interface layers rather than a pre-rendered video. Real profile/contact details still come from `src/data/portfolio.ts`; unverified career claims and testimonials are not invented.

## Portfolio content and scenes

- `src/data/portfolio.ts` contains the profile, eight chapters, experience, projects, education, and contact links. Unknown career details are intentionally empty; add verified CV content here.
- `src/components/workspace-world.tsx` builds the Three.js studio and camera timeline. Each chapter has a reading interval between camera movements. Scene geometry and textures are generated locally; no external 3D assets are needed.
- `src/app/globals.css` controls the responsive layout and scroll distance: 4800svh on desktop, 5200svh on mobile. Reading intervals hold a fixed camera pose, and chapter-button transitions take 2–3.2 seconds; manual scrolling interrupts them.
- The palette references work-burn-dashboard’s cozy-paper tokens: paper `#fcfbf6`, ink `#433f35`, sage `#8d9c75`, forest `#426653`, and warm wood/terracotta.
- “Read résumé” provides a continuous text view. The scene supports reduced motion, a manual motion toggle, and an illustrated fallback when WebGL is unavailable.

Validate with `pnpm lint` and `pnpm build`. To preview on a spare port, use `pnpm dev --port 3002` without stopping another app.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
