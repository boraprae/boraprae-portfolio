/**
 * The teaser film, ported off Remotion.
 *
 * thanchanok-portfolio-frames/src/PearTeaser.tsx renders this with Remotion at
 * 30fps. Everything below is the same timeline — the same frame numbers, the
 * same easings, the same geometry — with Remotion's four primitives
 * (interpolate, spring, Easing, random) reimplemented so the scenes can run as
 * ordinary DOM in the browser. Keep the frame numbers in step with that file.
 */

export const FPS = 30;

type Extrapolate = "clamp" | "extend";
type InterpolateOptions = {
  extrapolateLeft?: Extrapolate;
  extrapolateRight?: Extrapolate;
  easing?: (t: number) => number;
};

export const CLAMP: InterpolateOptions = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
};

export function interpolate(
  input: number,
  inputRange: readonly number[],
  outputRange: readonly number[],
  options: InterpolateOptions = {},
): number {
  const { extrapolateLeft = "extend", extrapolateRight = "extend", easing } = options;
  const last = inputRange.length - 1;
  if (input <= inputRange[0] && extrapolateLeft === "clamp") return outputRange[0];
  if (input >= inputRange[last] && extrapolateRight === "clamp") return outputRange[last];

  let i = 0;
  while (i < last - 1 && input >= inputRange[i + 1]) i++;
  const span = inputRange[i + 1] - inputRange[i];
  let t = span === 0 ? 0 : (input - inputRange[i]) / span;
  if (easing) t = easing(t);
  return outputRange[i] + (outputRange[i + 1] - outputRange[i]) * t;
}

/** Remotion's spring: a damped harmonic oscillator from 0 to 1, solved analytically. */
export function spring({
  frame,
  fps = FPS,
  config = {},
}: {
  frame: number;
  fps?: number;
  config?: { damping?: number; stiffness?: number; mass?: number };
}): number {
  const { damping = 10, stiffness = 100, mass = 1 } = config;
  if (frame <= 0) return 0;
  const t = frame / fps;
  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    return (
      1 -
      Math.exp(-zeta * w0 * t) *
        (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t))
    );
  }
  return 1 - (1 + w0 * t) * Math.exp(-w0 * t);
}

/* ---- easing ------------------------------------------------------------ */

const bezier = (x1: number, y1: number, x2: number, y2: number) => {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const d = sampleX(t) - x;
      if (Math.abs(d) < 1e-6) return sampleY(t);
      const s = slopeX(t);
      if (Math.abs(s) < 1e-6) break;
      t -= d / s;
    }
    let lo = 0, hi = 1;
    t = x;
    for (let i = 0; i < 20; i++) {
      const v = sampleX(t);
      if (Math.abs(v - x) < 1e-6) break;
      if (v > x) hi = t; else lo = t;
      t = (lo + hi) / 2;
    }
    return sampleY(t);
  };
};

export const Easing = {
  bezier,
  quad: (t: number) => t * t,
  inOut:
    (fn: (t: number) => number) =>
    (t: number) =>
      t < 0.5 ? fn(t * 2) / 2 : 1 - fn((1 - t) * 2) / 2,
};

export const EASE = bezier(0.65, 0, 0.35, 1);
export const EASE_OUT = bezier(0.16, 1, 0.3, 1);
export const EASE_IN = bezier(0.7, 0, 0.84, 0);
export const GLIDE = bezier(0.33, 0, 0.1, 1);

export const progress = (
  frame: number,
  start: number,
  end: number,
  easing: (t: number) => number = EASE,
) => interpolate(frame, [start, end], [0, 1], { ...CLAMP, easing });

export const mix = (p: number, from: number, to: number) => from + (to - from) * p;

export const smoothstep = (x: number) => {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
};

/** Deterministic hash in [0,1) — stands in for Remotion's seeded random(). */
export function random(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 15;
  h = Math.imul(h, 2246822507);
  h ^= h >>> 13;
  return (h >>> 0) / 4294967296;
}

const parseColor = (c: string): [number, number, number, number] => {
  if (c.startsWith("#")) {
    const h = c.slice(1);
    const n = h.length === 3 ? [...h].map((x) => x + x).join("") : h;
    return [
      parseInt(n.slice(0, 2), 16),
      parseInt(n.slice(2, 4), 16),
      parseInt(n.slice(4, 6), 16),
      1,
    ];
  }
  const m = c.match(/[\d.]+/g) ?? ["0", "0", "0"];
  return [+m[0], +m[1], +m[2], m[3] === undefined ? 1 : +m[3]];
};

export function interpolateColors(
  input: number,
  inputRange: readonly number[],
  colors: readonly string[],
): string {
  const parsed = colors.map(parseColor);
  const channel = (k: number) =>
    interpolate(input, inputRange, parsed.map((p) => p[k]), CLAMP);
  const [r, g, b] = [0, 1, 2].map((k) => Math.round(channel(k)));
  return `rgba(${r},${g},${b},${channel(3).toFixed(3)})`;
}

/* ---- the pear mark ----------------------------------------------------- */

export const PEAR_BODY =
  "M50 16 C59 16 63 25 63 34 C63 42 69 46 75 53 C84 63 85 80 75 89 C67 96 57 98 50 98 C43 98 33 96 25 89 C15 80 16 63 25 53 C31 46 37 42 37 34 C37 25 41 16 50 16 Z";
const PEAR_CENTER_Y = 50;

/** The pear outline as screen coordinates, for clip-path: path(). */
export const pearPathAt = (cx: number, cy: number, size: number) => {
  const tokens = PEAR_BODY.match(/[MCZ]|-?[\d.]+/g) ?? [];
  let isX = true;
  return tokens
    .map((t) => {
      if (/[MCZ]/.test(t)) { isX = true; return t; }
      const n = Number(t);
      const v = isX ? cx + ((n - 50) / 100) * size : cy + ((n - PEAR_CENTER_Y) / 100) * size;
      isX = !isX;
      return v.toFixed(1);
    })
    .join(" ");
};

/* ---- scene 0: hello world ---------------------------------------------- */

export const NAME = "Pear Thanchanok";
const PUNCT = "rgba(226,232,240,0.55)";
export const HELLO_TOKENS = [
  { t: "console", c: "#7dd3fc" },
  { t: ".", c: PUNCT },
  { t: "log", c: "#c4b5fd" },
  { t: "(", c: PUNCT },
  { t: '"hello world"', c: "#86efac" },
  { t: ")", c: PUNCT },
  { t: ";", c: PUNCT },
];
export const HELLO_CHARS = HELLO_TOKENS.reduce<{ ch: string; c: string }[]>(
  (acc, tok) => acc.concat([...tok.t].map((ch) => ({ ch, c: tok.c }))),
  [],
);
export const HELLO_FONT = 48;
export const HELLO_TYPE = { start: 16, end: 70 };
export const HELLO_CURSOR = { enter: 70, arrive: 88 };
export const HELLO_CLICK = 90;
export const HELLO_LOAD = { open: 94, start: 98, end: 128 };
export const HELLO_EXIT = 140;
export const HELLO_WINDOW_W = 1000;
const HELLO_HEADER_H = 48;
const HELLO_CODE_ROW_H = 72 + HELLO_FONT * 1.3;
const HELLO_PANEL_H = 104;
const HELLO_WINDOW_H = 2 + HELLO_HEADER_H + HELLO_CODE_ROW_H + HELLO_PANEL_H;
export const HELLO_RUN_BTN = {
  x: 960 + HELLO_WINDOW_W / 2 - 64,
  y: 540 - (HELLO_WINDOW_H - HELLO_PANEL_H) / 2 + HELLO_HEADER_H / 2,
};
export const HELLO_SPARKS = Array.from({ length: 16 }, (_, i) => ({
  angle: (i / 16) * Math.PI * 2 + random(`spark-a-${i}`) * 0.3,
  dist: 110 + random(`spark-d-${i}`) * 120,
  size: 4 + random(`spark-s-${i}`) * 5,
}));

export const LOGO_POP_AT = HELLO_EXIT + 6;
export const LOGO_POP_SIZE = 150;
export const LAUNCH_AT = LOGO_POP_AT + 6;
export const LAUNCH_GROW = 30;
export const launchPearSize = (t: number) =>
  LOGO_POP_SIZE *
  Math.pow(
    9000 / LOGO_POP_SIZE,
    interpolate(t, [0, LAUNCH_GROW], [0, 1], { ...CLAMP, easing: Easing.inOut(Easing.quad) }),
  );

/* ---- scene 1: the prompt box ------------------------------------------- */

export const PROMPT_BOX = { w: 1200, h: 232, cy: 610, pad: 26 };
export const TYPED = "Every business problem deserves a real solution";
export const KEYWORD = "solution";
export const KEYWORD_FOCUS = { x: 1503, y: 553 };
export const KEYWORD_PAN = { start: 142, end: 170 };
export const KEYWORD_PUSH = { start: 166, end: 188 };
export const STACKS = ["React / Next.js", "Vue / Nuxt.js", "TypeScript", "Tailwind CSS", "AI Workflow"];

/* ---- scene 2: keyword becomes the name --------------------------------- */

export const NAME_T = {
  wordIn: 20,
  wordOut: [52, 70] as const,
  mark: 60,
  shrink: [80, 94] as const,
  reveal: [88, 124] as const,
  caption: [112, 128, 152, 162] as const,
  exit: 158,
  end: 178,
};

/* ---- scene 3: the roles path ------------------------------------------- */

export type Pt = { x: number; y: number };
export type Segment = { d: string; samples: Pt[]; lens: number[]; length: number };

const ROLE_LABELS = [
  "Business Analysis",
  "System Analysis",
  "UX/UI Designer",
  "Software Developer",
  "QA Engineer",
  "AI Forward Deployed Engineer",
];
const ROLE_STEP = 1050;
export const ROLE_NODES = ROLE_LABELS.map((label, i) => {
  const fromLast = ROLE_LABELS.length - 1 - i;
  return {
    x: i * ROLE_STEP,
    y: fromLast % 2 === 0 ? 40 : -40,
    label,
    tag: fromLast === 0 ? `0${i + 1} — Now` : `0${i + 1}`,
    above: fromLast % 2 === 0,
  };
});

const cubicAt = (a: Pt, b: Pt, c: Pt, d: Pt, t: number): Pt => {
  const u = 1 - t;
  return {
    x: u * u * u * a.x + 3 * u * u * t * b.x + 3 * u * t * t * c.x + t * t * t * d.x,
    y: u * u * u * a.y + 3 * u * u * t * b.y + 3 * u * t * t * c.y + t * t * t * d.y,
  };
};

const buildSegment = (a: Pt, b: Pt): Segment => {
  const dx = b.x - a.x;
  const c1 = { x: a.x + dx * 0.5, y: a.y };
  const c2 = { x: b.x - dx * 0.5, y: b.y };
  const samples: Pt[] = [];
  const lens: number[] = [];
  for (let i = 0; i <= 80; i++) {
    const p = cubicAt(a, c1, c2, b, i / 80);
    lens.push(i === 0 ? 0 : lens[i - 1] + Math.hypot(p.x - samples[i - 1].x, p.y - samples[i - 1].y));
    samples.push(p);
  }
  return { d: `M ${a.x} ${a.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${b.x} ${b.y}`, samples, lens, length: lens[lens.length - 1] };
};

export const pointAt = (seg: Segment, p: number): Pt => {
  const target = p * seg.length;
  const i = Math.max(1, seg.lens.findIndex((l) => l >= target));
  const span = seg.lens[i] - seg.lens[i - 1] || 1;
  const t = (target - seg.lens[i - 1]) / span;
  return { x: mix(t, seg.samples[i - 1].x, seg.samples[i].x), y: mix(t, seg.samples[i - 1].y, seg.samples[i].y) };
};

export const LEAD_IN = buildSegment({ x: -1200, y: 40 }, ROLE_NODES[0]);
export const ROLE_SEGMENTS = ROLE_NODES.slice(1).map((node, i) => buildSegment(ROLE_NODES[i], node));
const ROLE_BEAT = 51;
const ROLE_LINE_DRAW = 18;
export const ROLE_TIMING = ROLE_NODES.map((_, i) => ({ dot: 6 + i * ROLE_BEAT, label: 8 + i * ROLE_BEAT }));
export const ROLE_SEG_TIMING = ROLE_SEGMENTS.map((_, i): [number, number] => [
  6 + (i + 1) * ROLE_BEAT - ROLE_LINE_DRAW,
  6 + (i + 1) * ROLE_BEAT,
]);
export const ROLE_LAST = ROLE_TIMING[ROLE_TIMING.length - 1].dot;
export const ROLE_FINAL = { ring: [20, 42], overview: [66, 90], exit: [112, 128] } as const;
export const ROLES_CROSSFADE = 20;
export const ROLES_DURATION = ROLE_LAST + ROLE_FINAL.exit[1] + 2;
export const LAST_ROLE_X = ROLE_NODES[ROLE_NODES.length - 1].x;
export const OVERVIEW = { x: LAST_ROLE_X / 2 + 280, scale: 1400 / LAST_ROLE_X };

/* ---- scene 4: the IDE --------------------------------------------------- */

export const IDE = { w: 1550, h: 820 };
export const CARD = { w: 820, h: 480, step: 880 };
export const CODE_LINES = [
  `import { Engineer, AIWorkflow } from '@pear/core';`,
  `import { Vue, Nuxt, React, Next, TypeScript } from 'tech-stack';`,
  ``,
  `export const PearThanchanok = () => {`,
  `  const role = "AI Forward Deployed Engineer";`,
  `  const philosophy = "Every business problem deserves a real solution.";`,
  ``,
  `  return (`,
  `    <DigitalExperience`,
  `      architect="Pear Thanchanok"`,
  `      stack={[Vue, Nuxt, React, Next, TypeScript, "TailwindCSS"]}`,
  `      state={["Redux-Saga", "React Query", "Docker"]}`,
  `      aiPowered={true}`,
  `    />`,
  `  );`,
  `};`,
];
export const TAGLINE = "from problem to production";
export const IDE_HANDOFF = 140;

/* ---- scene 5: the showcase --------------------------------------------- */

export const PROJECTS = [
  { title: "Expedition 26", subtitle: "Clair Obscur–inspired Frontend Portfolio", img: "home-expedition.png", type: "wide" as const },
  { title: "Moonlit Choices", subtitle: "Interactive Romantic Fantasy Web", img: "home-moonlit.jpg", type: "wide" as const },
  { title: "Little House Workspace", subtitle: "3D Interactive Cat Task & Repo Space", img: "home-work.jpg", type: "wide" as const },
  { title: "Life Quest Companion", subtitle: "Smart Daily Finance & Planning AI", img: "home-life-mobile.png", imgSecond: "life-finance.png", type: "mobile-pair" as const },
];
export const GRID_CELL = { w: 900, h: 300 };
export const TRACK_STEPS: [number, number][] = [[44, 60], [90, 106], [136, 152]];
export const SHOW_OUT = 184;

/* ---- scene 7: the outro ------------------------------------------------- */

export const OUTRO_LINE1 = [{ t: "Let’s", at: 10 }, { t: "build", at: 24 }];
export const OUTRO_TOGETHER = { t: "together.", at: 31 };

/* ---- the running order -------------------------------------------------- */

const AT_PROMPT = LAUNCH_AT;
const AT_IDEA = AT_PROMPT + KEYWORD_PUSH.end - 2;
const AT_ROLES = AT_IDEA + NAME_T.end - 5;
const AT_IDE = AT_ROLES + ROLES_DURATION - 15;

export const AT = {
  hello: 0,
  prompt: AT_PROMPT,
  idea: AT_IDEA,
  roles: AT_ROLES,
  ide: AT_IDE,
  showcase: AT_IDE + IDE_HANDOFF,
  grid: AT_IDE + IDE_HANDOFF + 226,
  outro: AT_IDE + IDE_HANDOFF + 298,
};

export const DURATION = AT.outro + 200;

/** The scenes, with the overlaps that make one transition into the next. */
export const SCENES = [
  { key: "hello", from: AT.hello, length: AT.prompt + 45 },
  { key: "prompt", from: AT.prompt, length: KEYWORD_PUSH.end + 4 },
  { key: "idea", from: AT.idea, length: AT.roles - AT.idea + ROLES_CROSSFADE },
  { key: "roles", from: AT.roles, length: ROLES_DURATION },
  { key: "showcase", from: AT.showcase, length: AT.grid - AT.showcase },
  { key: "ide", from: AT.ide, length: IDE_HANDOFF + 22 },
  { key: "grid", from: AT.grid, length: 90 },
  { key: "outro", from: AT.outro, length: 200 },
] as const;

export type SceneKey = (typeof SCENES)[number]["key"];
