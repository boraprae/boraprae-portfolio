"use client";

import React, { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import {
  AT, CARD, CLAMP, CODE_LINES, DURATION, EASE, EASE_IN, EASE_OUT, Easing, FPS, GLIDE,
  GRID_CELL, HELLO_CHARS, HELLO_CLICK, HELLO_CURSOR, HELLO_EXIT, HELLO_FONT, HELLO_LOAD,
  HELLO_RUN_BTN, HELLO_SPARKS, HELLO_TYPE, HELLO_WINDOW_W, IDE, IDE_HANDOFF, KEYWORD,
  KEYWORD_FOCUS, KEYWORD_PAN, KEYWORD_PUSH, LAST_ROLE_X, LAUNCH_AT, LAUNCH_GROW, LEAD_IN,
  LOGO_POP_AT, LOGO_POP_SIZE, NAME, NAME_T, OUTRO_LINE1, OUTRO_TOGETHER, OVERVIEW,
  PEAR_BODY, PROJECTS, PROMPT_BOX, ROLE_FINAL, ROLE_LAST, ROLE_NODES, ROLE_SEGMENTS,
  ROLE_SEG_TIMING, ROLE_TIMING, SCENES, SHOW_OUT, STACKS, TAGLINE, TRACK_STEPS, TYPED,
  interpolate, interpolateColors, launchPearSize, mix, pearPathAt, pointAt, progress,
  random, smoothstep, smoothstep as _ss, spring, type Pt, type Segment,
} from "@/lib/film";

void _ss;

/* ======================================================================== */
/* the clock                                                                */
/* ======================================================================== */

const FrameContext = createContext(0);
const useFrame = () => useContext(FrameContext);

/** absolute inset-0, the shape every Remotion scene was built in. */
const Fill: React.FC<{ className?: string; style?: React.CSSProperties; children?: React.ReactNode }> =
  ({ className = "", style, children }) => (
    <div className={`absolute inset-0 ${className}`} style={style}>{children}</div>
  );

/* ======================================================================== */
/* backgrounds                                                              */
/* ======================================================================== */

const AuroraBackground: React.FC<{ frameOffset?: number }> = ({ frameOffset = 0 }) => {
  const frame = useFrame() + frameOffset;
  const moveX = Math.sin(frame / 40) * 60;
  const moveY = Math.cos(frame / 40) * 40;
  return (
    <Fill className="overflow-hidden" style={{ background: "#040711" }}>
      <div style={{ transform: `translate(${moveX}px,${moveY}px)` }}
        className="absolute -top-40 -left-40 w-[900px] h-[900px] rounded-full bg-blue-600/25 blur-[160px]" />
      <div style={{ transform: `translate(${-moveX}px,${-moveY}px)` }}
        className="absolute -bottom-40 -right-40 w-[800px] h-[800px] rounded-full bg-indigo-500/20 blur-[150px]" />
    </Fill>
  );
};

const RIBBONS = [
  { top: 600, rot: -14, speed: 0.7, amp: 50, from: "rgba(124,58,237,0.95)", to: "rgba(59,130,246,0.9)" },
  { top: 160, rot: 20, speed: 0.5, amp: 40, from: "rgba(37,99,235,0.85)", to: "rgba(192,38,211,0.7)" },
  { top: 900, rot: -4, speed: 0.9, amp: 30, from: "rgba(168,85,247,0.7)", to: "rgba(79,70,229,0.8)" },
];

const PurpleWaves: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const t = useFrame() / 30;
  return (
    <Fill className="overflow-hidden" style={{ background: "#05040f", opacity }}>
      {RIBBONS.map((r, i) => (
        <div key={i} className="absolute rounded-full" style={{
          left: -300, top: r.top - 150, width: 2520, height: 300,
          background: `linear-gradient(90deg, transparent 0%, ${r.from} 30%, ${r.to} 70%, transparent 100%)`,
          filter: "blur(70px)",
          transform: `translateY(${Math.sin(t * r.speed + i) * r.amp}px) rotate(${r.rot + Math.sin(t * r.speed * 0.8) * 4}deg)`,
        }} />
      ))}
    </Fill>
  );
};

const BlueGlowBackground: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const breathe = 1 + Math.sin(useFrame() / 25) * 0.04;
  return (
    <Fill className="overflow-hidden" style={{ background: "#040816", opacity }}>
      <div className="absolute rounded-full" style={{
        left: "50%", bottom: -460, width: 2000, height: 900,
        transform: `translateX(-50%) scale(${breathe})`,
        background: "radial-gradient(closest-side, rgba(110,130,255,0.95), rgba(59,80,230,0.55) 45%, rgba(30,40,140,0) 100%)",
        filter: "blur(30px)",
      }} />
    </Fill>
  );
};

const BrightBackground: React.FC = () => {
  const frame = useFrame();
  return (
    <Fill className="overflow-hidden" style={{
      background: "linear-gradient(180deg, #f1edff 0%, #b8c4ff 14%, #6d86f5 32%, #2a3fbf 55%, #0d1550 78%, #060a1f 100%)",
    }}>
      <div className="absolute rounded-full" style={{
        left: "50%", top: -380, width: 1800, height: 700,
        transform: `translateX(-50%) translateX(${Math.sin(frame / 30) * 80}px)`,
        background: "radial-gradient(closest-side, rgba(255,255,255,0.9), rgba(255,255,255,0))",
        filter: "blur(40px)",
      }} />
    </Fill>
  );
};

const SplitBackground: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <Fill style={{ opacity, display: "flex", flexDirection: "row" }}>
    <div className="w-1/2 h-full" style={{ background: "#090d16" }} />
    <div className="w-1/2 h-full" style={{ background: "#161f30" }} />
  </Fill>
);

const GridLines: React.FC<{ p: number }> = ({ p }) => {
  const x0 = 960 - GRID_CELL.w / 2, x1 = 960 + GRID_CELL.w / 2;
  const y0 = 540 - GRID_CELL.h / 2, y1 = 540 + GRID_CELL.h / 2;
  return (
    <Fill className="pointer-events-none">
      {[y0, y1].map((y) => <div key={`h${y}`} className="absolute left-0 w-full h-px bg-white/20" style={{ top: y, transform: `scaleX(${p})` }} />)}
      {[x0, x1].map((x) => <div key={`v${x}`} className="absolute top-0 h-full w-px bg-white/20" style={{ left: x, transform: `scaleY(${p})` }} />)}
    </Fill>
  );
};

/* ======================================================================== */
/* shared marks                                                             */
/* ======================================================================== */

const LogoMark: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => {
  const id = `pear${useId().replace(/:/g, "")}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{
      flexShrink: 0, overflow: "visible",
      filter: `drop-shadow(0 0 ${size * 0.22}px rgba(56,189,248,0.6))`, ...style,
    }}>
      <defs>
        <linearGradient id={id} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#a5f3fc" />
          <stop offset="45%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>
      <path d="M50 18 C50 12 51 8 54 5" fill="none" stroke="#7dd3fc" strokeWidth={4} strokeLinecap="round" />
      <path d="M55 10 C60 2 71 2 75 6 C70 13 61 15 55 10 Z" fill="#5eead4" />
      <path d={PEAR_BODY} fill={`url(#${id})`} />
      <ellipse cx={36} cy={66} rx={7} ry={13} fill="white" opacity={0.28} transform="rotate(18 36 66)" />
      <path d="M40 61 L49 69.5 L40 78" fill="none" stroke="white" strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M54 78.5 H64" stroke="white" strokeWidth={5.5} strokeLinecap="round" />
    </svg>
  );
};

const ScrambleText: React.FC<{
  text: string; start: number; seed: string; exitStart?: number;
  colors?: string[]; style?: React.CSSProperties; maxDelay?: number;
}> = ({ text, start, seed, exitStart, colors, style, maxDelay = 12 }) => {
  const frame = useFrame();
  const chars = [...text];
  return (
    <span style={{ display: "inline-flex", whiteSpace: "pre", ...style }}>
      {chars.map((ch, i) => {
        const dx = (random(`${seed}-x-${i}`) - 0.5) * 220;
        const dy = (random(`${seed}-y-${i}`) - 0.5) * 120;
        const delay = random(`${seed}-d-${i}`) * maxDelay;
        const enter = spring({ frame: frame - start - delay, config: { damping: 16, stiffness: 110 } });
        const exit = exitStart === undefined ? 0
          : progress(frame, exitStart + delay * 0.6, exitStart + delay * 0.6 + 14, EASE_IN);
        const off = 1 - enter + exit;
        const color = colors
          ? interpolateColors(chars.length > 1 ? i / (chars.length - 1) : 0, colors.map((_, k) => k / (colors.length - 1)), colors)
          : undefined;
        return (
          <span key={i} style={{
            display: "inline-block",
            transform: `translate(${dx * off}px, ${dy * off}px)`,
            opacity: Math.min(1, enter) * (1 - exit),
            filter: `blur(${Math.max(0, off) * 12}px)`, color,
          }}>{ch === " " ? " " : ch}</span>
        );
      })}
    </span>
  );
};

const NameLockup: React.FC<{ reveal: number; markSize: number; markStyle?: React.CSSProperties; exitStart?: number }> =
  ({ reveal, markSize, markStyle, exitStart }) => (
    <div className="flex items-center">
      <LogoMark size={markSize} style={markStyle} />
      <div style={{ maxWidth: reveal * 1200, paddingLeft: reveal * 34, overflow: reveal >= 0.999 ? "visible" : "hidden" }}>
        <div className="text-white font-extrabold tracking-tight" style={{
          fontSize: 112, lineHeight: 1.15, whiteSpace: "pre",
          transform: `translateX(${(1 - reveal) * -280}px)`,
          opacity: interpolate(reveal, [0, 0.4], [0, 1], CLAMP),
        }}>
          <ScrambleText text={NAME} start={-1000} seed="name" exitStart={exitStart} />
        </div>
      </div>
    </div>
  );

const GlobeIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18" />
  </svg>
);

const MouseCursor: React.FC<{ press: number; style?: React.CSSProperties }> = ({ press, style }) => (
  <svg width={44} height={44} viewBox="0 0 24 24" style={{
    transformOrigin: "3px 2px", transform: `scale(${1 - press * 0.15})`,
    filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.45))", ...style,
  }}>
    <path d="M3 2 L3 19.5 L7.6 15.4 L10.6 22 L13.6 20.7 L10.7 14.2 L17 14.2 Z"
      fill="white" stroke="#0b1020" strokeWidth={1.3} strokeLinejoin="round" />
  </svg>
);

/* ======================================================================== */
/* scene 0 — console.log("hello world")                                     */
/* ======================================================================== */

const HelloScene: React.FC = () => {
  const frame = useFrame();
  const windowIn = spring({ frame: frame - 2, config: { damping: 20, stiffness: 80 } });
  const typed = interpolate(frame, [HELLO_TYPE.start, HELLO_TYPE.end], [0, HELLO_CHARS.length],
    { ...CLAMP, easing: Easing.bezier(0.37, 0, 0.63, 1) });
  const glow = progress(frame, HELLO_TYPE.end - 2, HELLO_TYPE.end + 14, EASE);
  const out = progress(frame, HELLO_EXIT, HELLO_EXIT + 20, EASE);
  const logoPop = spring({ frame: frame - LOGO_POP_AT, config: { damping: 11, stiffness: 150 } });
  const logoSize = frame < LAUNCH_AT ? LOGO_POP_SIZE : launchPearSize(frame - LAUNCH_AT);
  const caretOpacity =
    (frame < HELLO_TYPE.end
      ? frame < HELLO_TYPE.start ? 0.6 + 0.4 * Math.cos(frame / 2.5) : 1
      : 0.55 + 0.45 * Math.cos((frame - HELLO_TYPE.end) / 5)) *
    (1 - progress(frame, HELLO_CLICK, HELLO_CLICK + 8));

  const cursorMove = progress(frame, HELLO_CURSOR.enter, HELLO_CURSOR.arrive, Easing.bezier(0.25, 0.1, 0.25, 1));
  const cursorOpacity = progress(frame, HELLO_CURSOR.enter, HELLO_CURSOR.enter + 6) * (1 - progress(frame, HELLO_CLICK + 14, HELLO_CLICK + 24));
  const press = progress(frame, HELLO_CLICK, HELLO_CLICK + 3) * (1 - progress(frame, HELLO_CLICK + 3, HELLO_CLICK + 8));
  const ripple = progress(frame, HELLO_CLICK, HELLO_CLICK + 18, EASE_OUT);
  const ran = progress(frame, HELLO_CLICK, HELLO_CLICK + 6);
  const shock = progress(frame, HELLO_CLICK, HELLO_CLICK + 26, EASE_OUT);
  const sparks = progress(frame, HELLO_CLICK, HELLO_CLICK + 20, EASE_OUT);
  const shake = frame >= HELLO_CLICK ? 5 * (1 - progress(frame, HELLO_CLICK, HELLO_CLICK + 9)) * Math.sin(frame * 2.7) : 0;

  const panel = progress(frame, HELLO_LOAD.open, HELLO_LOAD.open + 12, EASE);
  const load = progress(frame, HELLO_LOAD.start, HELLO_LOAD.end, Easing.bezier(0.45, 0, 0.2, 1));
  const done = progress(frame, HELLO_LOAD.end, HELLO_LOAD.end + 6);
  const shimmer = ((frame - HELLO_LOAD.start) * 3) % 140;

  return (
    <Fill>
      <AuroraBackground />
      <Fill style={{
        transform: `translate(${shake}px, ${shake * 0.6}px) scale(${1 - out * 0.08})`,
        opacity: 1 - out, filter: out > 0 ? `blur(${out * 10}px)` : undefined,
      }}>
        <Fill className="flex items-center justify-center">
          <div className="relative" style={{
            width: HELLO_WINDOW_W,
            transform: `translateY(${(1 - windowIn) * 24}px) scale(${mix(windowIn, 0.94, 1)})`,
            filter: `blur(${(1 - Math.min(1, windowIn)) * 8}px)`,
            opacity: Math.min(1, windowIn),
          }}>
            <div className="relative rounded-3xl border border-white/15 overflow-hidden" style={{
              boxShadow: "0 30px 100px rgba(0,0,0,0.55)",
              background: "linear-gradient(160deg,rgba(30,41,82,0.82),rgba(12,18,40,0.88))",
            }}>
              <div className="h-12 px-5 flex items-center gap-2.5 border-b border-white/10" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                <span className="ml-3 font-mono text-[17px] text-white/50">hello.ts</span>
                <div className="ml-auto relative h-8 px-4 rounded-full flex items-center gap-2 text-[16px] font-semibold border" style={{
                  transform: `scale(${1 - press * 0.08})`,
                  background: `rgba(52,211,153,${mix(ran, 0.16, 0.35)})`,
                  borderColor: `rgba(110,231,183,${mix(ran, 0.35, 0.7)})`,
                  color: "#d1fae5",
                  boxShadow: `0 0 ${ran * 24}px rgba(52,211,153,0.55)`,
                }}>
                  <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 1 L11 6 L2 11 Z" fill="currentColor" /></svg>
                  Run
                  <span className="absolute inset-0 rounded-full border-2 border-emerald-300" style={{
                    transform: `scale(${mix(ripple, 1, 1.9)})`, opacity: ripple > 0 ? (1 - ripple) * 0.8 : 0,
                  }} />
                </div>
              </div>

              <div className="flex items-center font-mono px-12 py-9" style={{ fontSize: HELLO_FONT, lineHeight: 1.3 }}>
                <span className="text-white/20 mr-[1.2ch]">1</span>
                <span className="relative inline-flex" style={{ whiteSpace: "pre" }}>
                  {HELLO_CHARS.map(({ ch, c }, i) => {
                    const p = smoothstep(typed - i);
                    const isString = c === "#86efac";
                    return (
                      <span key={i} style={{
                        display: "inline-block", width: "1ch", color: c, opacity: p,
                        filter: `blur(${(1 - p) * 8}px)`, transform: `translateY(${(1 - p) * 14}px)`,
                        textShadow: isString ? `0 0 ${glow * 28}px rgba(134,239,172,${0.7 * glow})` : undefined,
                      }}>{ch === " " ? " " : ch}</span>
                    );
                  })}
                  <span className="absolute bg-cyan-300 rounded-full" style={{
                    left: `${typed}ch`, top: "12%", width: 5, height: "76%", marginLeft: 4,
                    opacity: caretOpacity, boxShadow: "0 0 16px rgba(103,232,249,0.9)",
                  }} />
                </span>
              </div>

              <div className="overflow-hidden" style={{ maxHeight: panel * 120, opacity: panel }}>
                <div className="border-t border-white/10 px-12 pt-5 pb-7 font-mono">
                  <div className="flex items-center justify-between text-[22px]">
                    <span style={{ color: interpolateColors(done, [0, 1], ["rgba(226,232,240,0.7)", "#6ee7b7"]) }}>
                      {done > 0.5 ? "✓ Done — hello world" : "› Running hello.ts…"}
                    </span>
                    <span className="text-white/60 tabular-nums">{Math.round(load * 100)}%</span>
                  </div>
                  <div className="mt-3 h-2.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full relative overflow-hidden" style={{
                      width: `${load * 100}%`,
                      background: "linear-gradient(90deg, #2563eb, #22d3ee)",
                      boxShadow: "0 0 18px rgba(34,211,238,0.7)",
                    }}>
                      <div className="absolute top-0 h-full w-24" style={{
                        left: shimmer - 40,
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
                        opacity: 1 - done,
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute" style={{
              left: "calc(100% - 72px)", top: 20, opacity: cursorOpacity,
              transform: `translate(${(1 - cursorMove) * 340}px, ${(1 - cursorMove) * 380}px)`,
            }}>
              <MouseCursor press={press} />
            </div>
          </div>
        </Fill>
      </Fill>

      {frame >= HELLO_CLICK && shock < 1 && (
        <div className="absolute rounded-full" style={{
          left: HELLO_RUN_BTN.x, top: HELLO_RUN_BTN.y,
          width: mix(shock, 40, 2600), height: mix(shock, 40, 2600),
          transform: "translate(-50%, -50%)",
          border: `${mix(shock, 4, 1.5)}px solid rgba(110,231,183,${0.7 * (1 - shock)})`,
          boxShadow: `0 0 40px rgba(52,211,153,${0.4 * (1 - shock)}), inset 0 0 40px rgba(52,211,153,${0.25 * (1 - shock)})`,
        }} />
      )}
      {frame >= HELLO_CLICK && sparks < 1 && HELLO_SPARKS.map((sp, i) => (
        <div key={i} className="absolute rounded-full" style={{
          left: HELLO_RUN_BTN.x + Math.cos(sp.angle) * sp.dist * sparks,
          top: HELLO_RUN_BTN.y + Math.sin(sp.angle) * sp.dist * sparks,
          width: sp.size, height: sp.size, transform: "translate(-50%, -50%)",
          background: i % 2 ? "#6ee7b7" : "#67e8f9",
          boxShadow: "0 0 12px rgba(103,232,249,0.9)", opacity: 1 - sparks,
        }} />
      ))}

      {frame >= LOGO_POP_AT && (
        <div className="absolute" style={{
          left: 960 - logoSize / 2, top: 540 - logoSize / 2,
          transform: `scale(${logoPop}) rotate(${(1 - Math.min(1, logoPop)) * -40}deg)`,
        }}>
          <LogoMark size={logoSize} />
        </div>
      )}
    </Fill>
  );
};

/* ======================================================================== */
/* scene 1 — the pear opens into the prompt box                             */
/* ======================================================================== */

const PromptScene: React.FC = () => {
  const frame = useFrame();
  const clip = frame >= LAUNCH_GROW ? undefined : `path('${pearPathAt(960, 540, launchPearSize(frame))}')`;

  const plusIn = spring({ frame: frame - 16, config: { damping: 13, stiffness: 140 } });
  const pillP = progress(frame, 32, 52, EASE_OUT);
  const boxP = progress(frame, 52, 80, EASE);
  const pillW = pillP * 236;
  const rowW = 64 + (pillW > 0.5 ? 14 + pillW : 0);
  const boxW = mix(boxP, rowW, PROMPT_BOX.w);
  const boxH = mix(boxP, 64, PROMPT_BOX.h);
  const pad = mix(boxP, 0, PROMPT_BOX.pad);

  const titleIn = progress(frame, 66, 86, EASE_OUT);
  const placeholder = progress(frame, 74, 86) * (1 - progress(frame, 96, 100));
  const zoom = progress(frame, 96, 140, EASE);
  const charsShown = Math.floor(interpolate(frame, [100, 142], [0, TYPED.length], CLAMP));
  const pan = progress(frame, KEYWORD_PAN.start, KEYWORD_PAN.end, EASE);
  const push = progress(frame, KEYWORD_PUSH.start, KEYWORD_PUSH.end, Easing.bezier(0.4, 0, 0.85, 0.45));
  const textLeft = 960 - PROMPT_BOX.w / 2 + PROMPT_BOX.pad + 10;
  const textY = PROMPT_BOX.cy - PROMPT_BOX.h / 2 + PROMPT_BOX.pad + 30;

  return (
    <Fill style={{ clipPath: clip }}>
      <AuroraBackground frameOffset={AT.prompt} />
      <Fill style={{
        background: "linear-gradient(160deg, #a5f3fc 0%, #38bdf8 45%, #2563eb 100%)",
        opacity: 1 - progress(frame, 4, LAUNCH_GROW - 4, EASE),
      }} />
      <Fill style={{
        background: "radial-gradient(circle at 50% 50%, rgba(165,205,255,0.75) 0%, rgba(59,130,246,0.35) 30%, rgba(30,58,138,0) 65%)",
        opacity: 1 - progress(frame, 24, 70),
      }} />

      <Fill style={{
        transformOrigin: `${KEYWORD_FOCUS.x}px ${KEYWORD_FOCUS.y}px`,
        transform: `translate(${pan * (960 - KEYWORD_FOCUS.x)}px, ${pan * (540 - KEYWORD_FOCUS.y)}px) scale(${mix(push, 1, 5.5)})`,
        filter: push > 0 ? `blur(${push * push * 6}px)` : undefined,
      }}>
        <Fill style={{
          transformOrigin: `${textLeft}px ${textY}px`,
          transform: `translateX(${mix(zoom, 0, -180)}px) scale(${mix(zoom, 1, 1.95)})`,
        }}>
          <div className="absolute left-0 right-0 flex flex-col items-center" style={{
            top: PROMPT_BOX.cy - PROMPT_BOX.h / 2 - 170,
            opacity: titleIn * (1 - zoom),
            filter: `blur(${(1 - titleIn) * 12}px)`,
            transform: `translateY(${(1 - titleIn) * 20}px)`,
          }}>
            <div className="flex items-center gap-4 text-white font-bold tracking-tight" style={{ fontSize: 60 }}>
              Looking for a builder?<LogoMark size={46} />
            </div>
            <div className="mt-2 text-white/60" style={{ fontSize: 26 }}>
              From business needs to deployed AI — end to end
            </div>
          </div>

          <div className="absolute rounded-[32px]" style={{
            left: 960 - boxW / 2, top: PROMPT_BOX.cy - boxH / 2, width: boxW, height: boxH,
            background: `rgba(255,255,255,${0.06 * boxP})`,
            border: `1px solid rgba(255,255,255,${0.15 * boxP})`,
            backdropFilter: boxP > 0 ? "blur(24px)" : undefined,
            boxShadow: `0 20px 80px rgba(0,100,255,${0.2 * boxP})`,
          }}>
            <div className="absolute flex items-center text-white font-light tracking-wide"
              style={{ left: pad + 10, top: pad + 6, height: 48, fontSize: 34 }}>
              {charsShown > 0
                ? <span>{TYPED.slice(0, charsShown)}</span>
                : <span className="text-white/45" style={{ opacity: placeholder }}>Ask Pear to build something…</span>}
              {frame >= 98 && frame < KEYWORD_PAN.start && (
                <span style={{ opacity: Math.sin(frame / 4) > 0 ? 1 : 0 }} className="inline-block w-[3px] h-10 bg-cyan-300 ml-1" />
              )}
            </div>

            <div className="absolute flex items-center" style={{ left: pad, bottom: pad, height: 64 }}>
              <div className="w-16 h-16 rounded-full bg-white/10 border border-white/25 backdrop-blur-xl flex items-center justify-center text-white"
                style={{ transform: `scale(${plusIn}) rotate(${(1 - plusIn) * 90}deg)` }}>
                <svg width="26" height="26" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none">
                  <path d="M12 4v16M4 12h16" />
                </svg>
              </div>
              <div className="h-16 rounded-full bg-white/10 border border-white/25 backdrop-blur-xl text-white/90 overflow-hidden flex items-center"
                style={{ width: pillW, marginLeft: pillW > 0.5 ? 14 : 0, opacity: pillP > 0 ? 1 : 0 }}>
                <div className="flex items-center gap-3 px-5 whitespace-nowrap" style={{ fontSize: 24 }}>
                  <GlobeIcon /> Public Profile
                </div>
              </div>
              <div className="flex items-center gap-2.5 ml-3.5">
                {STACKS.map((stack, i) => {
                  const badge = spring({ frame: frame - (80 + i * 4), config: { damping: 12 } });
                  return (
                    <div key={stack} style={{ transform: `scale(${badge})`, opacity: Math.min(1, badge) }}
                      className="px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-cyan-200 text-[15px] font-medium whitespace-nowrap">
                      {stack}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="absolute w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl" style={{
              right: pad, bottom: pad + 4,
              transform: `scale(${progress(frame, 70, 84, EASE_OUT)})`,
              background: "linear-gradient(to top right, #2563eb, #22d3ee)",
              boxShadow: "0 10px 30px rgba(59,130,246,0.4)",
            }}>↑</div>
          </div>
        </Fill>
      </Fill>
    </Fill>
  );
};

/* ======================================================================== */
/* scene 2 — the keyword becomes the name                                   */
/* ======================================================================== */

const IdeaNameScene: React.FC = () => {
  const frame = useFrame();
  const bgIn = progress(frame, 0, 6, EASE_OUT);
  const wordIn = progress(frame, 0, NAME_T.wordIn, EASE_OUT);
  const wordFade = progress(frame, 0, 4);
  const wordOut = progress(frame, NAME_T.wordOut[0], NAME_T.wordOut[1], EASE_IN);
  const markP = spring({ frame: frame - NAME_T.mark, config: { damping: 11, stiffness: 90 } });
  const markShrink = progress(frame, NAME_T.shrink[0], NAME_T.shrink[1], EASE);
  const reveal = progress(frame, NAME_T.reveal[0], NAME_T.reveal[1], GLIDE);
  const captionIn = progress(frame, NAME_T.caption[0], NAME_T.caption[1], EASE_OUT) * (1 - progress(frame, NAME_T.caption[2], NAME_T.caption[3]));
  const markExit = progress(frame, NAME_T.exit, NAME_T.exit + 14, EASE_IN);

  return (
    <Fill>
      <PurpleWaves opacity={bgIn} />
      <Fill className="flex items-center justify-center">
        <div className="font-bold tracking-tight text-white" style={{
          fontSize: 210, lineHeight: 1.2,
          opacity: wordFade * (1 - wordOut),
          transform: `scale(${mix(wordIn, 1.8, 1) * mix(wordOut, 1, 0.35)})`,
          filter: `blur(${mix(wordIn, 8, 0) + wordOut * 24}px) drop-shadow(0 0 36px rgba(165,180,252,0.75))`,
        }}>{KEYWORD}</div>
      </Fill>

      {frame >= NAME_T.mark - 2 && (
        <Fill className="flex flex-col items-center justify-center">
          <div className="text-cyan-300 uppercase font-semibold mb-6" style={{
            fontSize: 26, letterSpacing: "0.35em",
            opacity: captionIn, filter: `blur(${(1 - captionIn) * 8}px)`,
          }}>Meet The Builder</div>
          <NameLockup reveal={reveal} markSize={mix(markShrink, 150, 104)} exitStart={NAME_T.exit}
            markStyle={{
              transform: `scale(${markP * (1 - markExit)}) rotate(${(1 - markP) * -140}deg)`,
              filter: `blur(${Math.max(0, 1 - markP) * 10 + markExit * 12}px)`,
            }} />
        </Fill>
      )}
    </Fill>
  );
};

/* ======================================================================== */
/* scene 3 — the line through every role                                    */
/* ======================================================================== */

const RolesPathScene: React.FC = () => {
  const frame = useFrame();
  const bgIn = progress(frame, 0, 20, EASE);
  const lead = progress(frame, 0, 16, EASE_OUT);
  const segP = ROLE_SEG_TIMING.map(([a, b]) => progress(frame, a, b, EASE));
  const ring = progress(frame, ROLE_LAST + ROLE_FINAL.ring[0], ROLE_LAST + ROLE_FINAL.ring[1], EASE);
  const ov = progress(frame, ROLE_LAST + ROLE_FINAL.overview[0], ROLE_LAST + ROLE_FINAL.overview[1], EASE);
  const exit = progress(frame, ROLE_LAST + ROLE_FINAL.exit[0], ROLE_LAST + ROLE_FINAL.exit[1], EASE_IN);

  let head: Pt = ROLE_NODES[0];
  ROLE_SEGMENTS.forEach((seg, k) => { if (frame >= ROLE_SEG_TIMING[k][0]) head = pointAt(seg, segP[k]); });
  const camX = mix(ov, head.x, OVERVIEW.x);
  const camY = mix(ov, head.y * 0.6, 0);
  const camScale = mix(ov, 1, OVERVIEW.scale) * (1 - exit * 0.08);
  const drawing = segP.some((p) => p > 0 && p < 1);

  const dims = ROLE_NODES.map((_, i) =>
    i === ROLE_NODES.length - 1 ? 1
      : mix(ov, 1 - 0.6 * progress(frame, ROLE_TIMING[i + 1].label, ROLE_TIMING[i + 1].label + 14), 0.75));

  const lineStroke = (seg: Segment, p: number, key: string) => (
    <path key={key} d={seg.d} fill="none" stroke="url(#role-line)" strokeWidth={4} strokeLinecap="round"
      strokeDasharray={`${seg.length} ${seg.length}`} strokeDashoffset={seg.length * (1 - p)} opacity={p > 0 ? 1 : 0} />
  );

  return (
    <Fill>
      <BlueGlowBackground opacity={bgIn * (1 - exit)} />
      <Fill style={{ opacity: 1 - exit, filter: `blur(${exit * 12}px)` }}>
        <div className="absolute left-0 top-0" style={{
          transform: `translate(960px, 540px) scale(${camScale}) translate(${-camX}px, ${-camY}px)`,
        }}>
          <svg className="absolute" style={{ left: -1600, top: -800, overflow: "visible", filter: "drop-shadow(0 0 10px rgba(125,211,252,0.8))" }}
            width={LAST_ROLE_X + 3200} height={1600} viewBox={`-1600 -800 ${LAST_ROLE_X + 3200} 1600`}>
            <defs>
              <linearGradient id="role-line" gradientUnits="userSpaceOnUse" x1={-1200} x2={LAST_ROLE_X} y1={0} y2={0}>
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="30%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#7dd3fc" />
              </linearGradient>
            </defs>
            {ROLE_SEGMENTS.map((seg, i) => (
              <path key={`rail-${i}`} d={seg.d} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={3}
                strokeDasharray="2 16" strokeLinecap="round" opacity={bgIn} />
            ))}
            {lineStroke(LEAD_IN, lead, "lead")}
            {ROLE_SEGMENTS.map((seg, k) => lineStroke(seg, segP[k], `seg-${k}`))}
          </svg>

          {drawing && (
            <div className="absolute rounded-full bg-white" style={{
              left: head.x - 9, top: head.y - 9, width: 18, height: 18,
              boxShadow: "0 0 24px 8px rgba(125,211,252,0.9), 0 0 70px 20px rgba(96,165,250,0.6)",
            }} />
          )}

          {ROLE_NODES.map((node, i) => {
            const hero = i === ROLE_NODES.length - 1;
            const dot = spring({ frame: frame - ROLE_TIMING[i].dot, config: { damping: 10, stiffness: 160 } });
            const dotSize = hero ? 30 : 22;
            const pulse = progress(frame, ROLE_TIMING[i].dot, ROLE_TIMING[i].dot + 30, EASE_OUT);
            const tagIn = progress(frame, ROLE_TIMING[i].label + 6, ROLE_TIMING[i].label + 20, EASE_OUT);
            return (
              <React.Fragment key={node.label}>
                <div className="absolute rounded-full" style={{
                  left: node.x - dotSize / 2, top: node.y - dotSize / 2, width: dotSize, height: dotSize,
                  background: hero ? "#a5f3fc" : "#ffffff", transform: `scale(${dot})`,
                  boxShadow: hero ? "0 0 30px 10px rgba(56,189,248,0.9)" : "0 0 18px 4px rgba(255,255,255,0.6)",
                }} />
                {hero && (
                  <div className="absolute rounded-full border-2 border-cyan-300" style={{
                    left: node.x - 30, top: node.y - 30, width: 60, height: 60,
                    transform: `scale(${mix(pulse, 0.5, 3.2)})`, opacity: pulse > 0 ? (1 - pulse) * 0.8 : 0,
                  }} />
                )}
                <div className="absolute flex flex-col items-center" style={{
                  left: node.x, top: node.y, opacity: dims[i],
                  transform: node.above ? "translate(-50%, calc(-100% - 56px))" : "translate(-50%, 56px)",
                }}>
                  {node.above && (
                    <div className="mb-3 font-mono uppercase" style={{
                      fontSize: 26, letterSpacing: "0.3em", opacity: tagIn,
                      color: hero ? "#67e8f9" : "rgba(255,255,255,0.55)",
                    }}>{node.tag}</div>
                  )}
                  <div className="relative" style={{ padding: hero ? "18px 48px" : 0 }}>
                    {hero && (
                      <svg className="absolute inset-0 w-full h-full" style={{ overflow: "visible" }}>
                        <rect x={0} y={0} width="100%" height="100%" rx={92} pathLength={1}
                          fill={`rgba(56,189,248,${0.08 * ring})`} stroke="#67e8f9" strokeWidth={3}
                          strokeDasharray="1 1" strokeDashoffset={1 - ring} opacity={ring > 0 ? 1 : 0}
                          style={{ filter: "drop-shadow(0 0 12px rgba(103,232,249,0.8))" }} />
                      </svg>
                    )}
                    <ScrambleText text={node.label} start={ROLE_TIMING[i].label} seed={`role-${i}`} maxDelay={5}
                      colors={hero ? ["#ffffff", "#a5f3fc", "#60a5fa"] : undefined}
                      style={{
                        fontSize: hero ? 104 : 92, fontWeight: hero ? 800 : 600,
                        letterSpacing: "-0.02em", lineHeight: 1.15, color: "white",
                      }} />
                  </div>
                  {!node.above && (
                    <div className="mt-3 font-mono uppercase text-white/55" style={{ fontSize: 26, letterSpacing: "0.3em", opacity: tagIn }}>
                      {node.tag}
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </Fill>
    </Fill>
  );
};

/* ======================================================================== */
/* scene 4 — the pill becomes an IDE                                        */
/* ======================================================================== */

const IDEScene: React.FC = () => {
  const frame = useFrame();
  const pillIn = spring({ frame: frame - 2, config: { damping: 14, stiffness: 160 } });
  const widen = progress(frame, 12, 32, EASE);
  const tall = progress(frame, 30, 54, EASE);
  const exit = progress(frame, IDE_HANDOFF, IDE_HANDOFF + 20, EASE);
  const w = mix(widen, 96, IDE.w);
  const h = mix(tall, mix(widen, 34, 56), IDE.h);
  const radius = Math.min(h / 2, 24);
  const chromeIn = progress(frame, 22, 34);
  const bodyIn = progress(frame, 44, 58);
  const previewIn = progress(frame, 58, 80, EASE);
  const dim = progress(frame, 78, 90);

  return (
    <Fill>
      <div className="absolute overflow-hidden" style={{
        left: 960 - w / 2, top: 540 - h / 2, width: w, height: h, borderRadius: radius,
        opacity: 1 - exit, transform: `scale(${pillIn * mix(exit, 1, 0.94)})`,
        background: `linear-gradient(90deg, rgba(37,99,235,${1 - widen}), rgba(56,189,248,${1 - widen})), rgba(15,23,42,${0.75 * widen})`,
        border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(24px)",
        boxShadow: `0 30px 100px rgba(0,0,0,${0.8 * widen}), 0 0 ${40 * (1 - widen)}px rgba(56,189,248,0.8)`,
        filter: `blur(${dim * 6}px) brightness(${1 - dim * 0.35})`,
      }}>
        <div className="absolute left-1/2 top-0 flex flex-col" style={{ width: IDE.w, height: IDE.h, marginLeft: -IDE.w / 2 }}>
          <div className="h-14 border-b border-white/10 px-6 flex items-center justify-between"
            style={{ opacity: chromeIn, background: "rgba(255,255,255,0.03)" }}>
            <div className="flex items-center gap-3">
              <div className="w-3.5 h-3.5 rounded-full bg-rose-500/80" />
              <div className="w-3.5 h-3.5 rounded-full bg-amber-400/80" />
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-400/80" />
              <span className="ml-4 text-sm text-white/60 font-mono">src/architect/PearThanchanok.tsx</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-4 py-1 rounded-full bg-white/10 text-xs text-white/80">⚡ AI-Augmented Workflow</span>
              <span className="px-4 py-1 rounded-full bg-blue-500 text-xs text-white font-semibold">Deploy Ready</span>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-12 overflow-hidden" style={{ opacity: bodyIn }}>
            <div className="col-span-6 p-8 font-mono text-base leading-relaxed border-r border-white/10 flex flex-col justify-center">
              {CODE_LINES.map((line, i) => {
                const start = 52 + i * 4;
                const shown = Math.floor(interpolate(frame, [start, start + 8], [0, line.length], CLAMP));
                const typing = frame >= start && frame < start + 10;
                return (
                  <div key={i} className="flex" style={{ opacity: frame >= start ? 1 : 0 }}>
                    <span className="w-8 text-slate-600 select-none">{i + 1}</span>
                    <span className="text-cyan-200 whitespace-pre">{line.slice(0, shown)}</span>
                    {typing && <span className="inline-block w-2 h-5 bg-cyan-300 ml-0.5" />}
                  </div>
                );
              })}
            </div>
            <div className="col-span-6 p-6 flex flex-col justify-center items-center relative" style={{ background: "rgba(2,6,23,0.6)" }}>
              <div className="w-full h-full rounded-2xl overflow-hidden border border-white/15 relative" style={{
                opacity: previewIn, transform: `scale(${mix(previewIn, 0.94, 1)})`,
                boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/film/home-portfolio.jpg" alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Fill className="flex items-center justify-center" style={{ perspective: 1200 }}>
        <div className="flex font-bold tracking-tight" style={{
          fontSize: 132, whiteSpace: "pre", transform: "rotateY(-16deg) rotateX(8deg)",
          opacity: 1 - progress(frame, IDE_HANDOFF, IDE_HANDOFF + 10),
          filter: `blur(${progress(frame, IDE_HANDOFF, IDE_HANDOFF + 10) * 16}px)`,
        }}>
          {[...TAGLINE].map((ch, j) => {
            const p = progress(frame, 80 + j * 1.2, 90 + j * 1.2, EASE_OUT);
            const accent = j >= TAGLINE.indexOf("production");
            return (
              <span key={j} style={{
                display: "inline-block", opacity: p, filter: `blur(${(1 - p) * 14}px)`,
                transform: `translateZ(${(1 - p) * 200}px)`,
                color: accent ? "#7dd3fc" : "white", textShadow: "0 10px 40px rgba(0,0,0,0.5)",
              }}>{ch === " " ? " " : ch}</span>
            );
          })}
        </div>
      </Fill>
    </Fill>
  );
};

/* ======================================================================== */
/* scene 5 — the braces and the project belt                                */
/* ======================================================================== */

const ShowcaseScene: React.FC = () => {
  const frame = useFrame();
  const pos = TRACK_STEPS.reduce((acc, [a, b]) => acc + progress(frame, a, b, EASE), 0);
  const bracketOpen = spring({ frame: frame - 4, config: { damping: 14, stiffness: 90 } });
  const bracketGap = mix(bracketOpen, 380, 480);
  const bracketOpacity = Math.min(progress(frame, 4, 14), 1 - progress(frame, SHOW_OUT, SHOW_OUT + 10));
  const neighborsIn = progress(frame, 4, 18);
  const neighborsOut = progress(frame, SHOW_OUT, SHOW_OUT + 14, EASE_IN);
  const lineIn = progress(frame, 0, 18, EASE_OUT);
  const gridIn = progress(frame, SHOW_OUT + 8, SHOW_OUT + 30, EASE_OUT);
  const morph = progress(frame, SHOW_OUT + 14, SHOW_OUT + 40, EASE);
  const bgIn = progress(frame, 0, 14);
  const last = PROJECTS.length - 1;

  return (
    <Fill className="overflow-hidden">
      <SplitBackground opacity={bgIn} />
      <div className="absolute left-0 w-full bg-white/20" style={{ height: 2, top: 539, transform: `scaleX(${lineIn})`, opacity: 1 - neighborsOut }} />
      <GridLines p={gridIn} />

      {PROJECTS.map((proj, i) => {
        const d = i - pos;
        const a = Math.min(1, Math.abs(d));
        const isLast = i === last;
        const cardW = isLast ? mix(morph, CARD.w, GRID_CELL.w) : CARD.w;
        const cardH = isLast ? mix(morph, CARD.h, GRID_CELL.h) : CARD.h;
        const scale = (1 - 0.16 * a) * (isLast ? 1 : 1 - neighborsOut * 0.1);
        const opacity = (1 - 0.5 * a) * (i === 0 ? bgIn : neighborsIn) * (isLast ? 1 : 1 - neighborsOut);
        const content = isLast ? 1 - progress(frame, SHOW_OUT + 18, SHOW_OUT + 36) : 1;
        const chip = progress(frame, 10, 22) * (isLast ? 1 - progress(frame, SHOW_OUT + 10, SHOW_OUT + 20) : 1);
        return (
          <div key={proj.title} className="absolute overflow-hidden" style={{
            left: 960 + d * CARD.step - cardW / 2, top: 540 - cardH / 2, width: cardW, height: cardH,
            opacity, transform: `scale(${scale})`,
            borderRadius: mix(isLast ? morph : 0, 16, 0),
            border: `1px solid rgba(255,255,255,${isLast ? mix(morph, 0.25, 0) : 0.25})`,
            background: isLast ? `rgba(255,255,255,${0.06 * morph})` : undefined,
            backdropFilter: isLast && morph > 0 ? "blur(20px)" : undefined,
            boxShadow: `0 25px 70px rgba(0,0,0,${0.65 * content})`, zIndex: 10,
          }}>
            <div className="absolute inset-0" style={{ opacity: content, background: "#0f172a" }}>
              {proj.type === "wide" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={`/film/${proj.img}`} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center gap-8 p-6" style={{ background: "#071a12" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/film/${proj.img}`} alt="" className="h-full w-auto rounded-xl border border-emerald-500/30 object-contain" />
                  {proj.imgSecond && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={`/film/${proj.imgSecond}`} alt="" className="h-full w-auto rounded-xl border border-emerald-500/30 object-contain" />
                  )}
                </div>
              )}
              <div className="absolute bottom-4 left-4 px-5 py-2.5 rounded-xl border border-white/15 backdrop-blur-md"
                style={{ opacity: chip, background: "rgba(0,0,0,0.65)" }}>
                <div className="text-white font-bold text-lg">{proj.title}</div>
                <div className="text-cyan-300 text-xs">{proj.subtitle}</div>
              </div>
            </div>
          </div>
        );
      })}

      {["{", "}"].map((ch, i) => (
        <div key={ch} className="absolute z-20 font-extralight text-white select-none leading-none" style={{
          fontSize: 340, left: 960 + (i === 0 ? -bracketGap : bracketGap), top: 540,
          opacity: bracketOpacity, transform: "translate(-50%, -54%)",
        }}>{ch}</div>
      ))}
    </Fill>
  );
};

/* ======================================================================== */
/* scene 6 — more about what's next                                         */
/* ======================================================================== */

const GRID_WORDS = [
  { t: "More", at: 4 }, { t: "about", at: 12 },
  { t: "what’s", at: 20 }, { t: "next", at: 30, accent: true },
];

const GridTextScene: React.FC = () => {
  const frame = useFrame();
  return (
    <Fill>
      <SplitBackground />
      <GridLines p={1} />
      <div className="absolute flex items-center justify-center text-white font-medium tracking-tight" style={{
        left: 960 - GRID_CELL.w / 2, top: 540 - GRID_CELL.h / 2,
        width: GRID_CELL.w, height: GRID_CELL.h, fontSize: 64, gap: "0.28em",
        background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)",
      }}>
        {GRID_WORDS.map((w) => {
          const p = progress(frame, w.at, w.at + 12, EASE_OUT);
          return (
            <span key={w.t} style={{
              opacity: p, filter: `blur(${(1 - p) * 12}px)`, transform: `translateY(${(1 - p) * 12}px)`,
              color: w.accent ? interpolateColors(frame, [w.at + 14, w.at + 34], ["#22d3ee", "#ffffff"]) : undefined,
            }}>{w.t}</span>
          );
        })}
      </div>
    </Fill>
  );
};

/* ======================================================================== */
/* scene 7 — let's build together                                           */
/* ======================================================================== */

const OutroScene: React.FC = () => {
  const frame = useFrame();
  const wipe = progress(frame, 0, 20, EASE);
  const mask = wipe < 1 ? `linear-gradient(to bottom, #000 ${wipe * 130 - 30}%, transparent ${wipe * 130}%)` : undefined;
  const wordsOut = progress(frame, 76, 88, EASE_IN);
  const darkIn = progress(frame, 80, 92);
  const markP = spring({ frame: frame - 84, config: { damping: 12, stiffness: 80 } });
  const markShrink = progress(frame, 100, 112, EASE);
  const reveal = progress(frame, 108, 134, GLIDE);
  const sloganIn = progress(frame, 126, 140, EASE_OUT);
  const subIn = progress(frame, 132, 146, EASE_OUT);
  const emailIn = progress(frame, 142, 156, EASE_OUT);
  const linkIn = progress(frame, 148, 162, EASE_OUT);

  return (
    <Fill style={{ WebkitMaskImage: mask, maskImage: mask }}>
      <BrightBackground />

      <Fill className="flex flex-col items-center justify-center" style={{
        opacity: 1 - wordsOut, filter: `blur(${wordsOut * 16}px)`,
        transform: `scale(${mix(progress(frame, 10, 88), 1, 1.04) + wordsOut * 0.06})`,
      }}>
        <div className="flex font-medium text-white/85 tracking-tight" style={{ fontSize: 72, lineHeight: 1.1, gap: "0.3em" }}>
          {OUTRO_LINE1.map((w) => {
            const p = progress(frame, w.at, w.at + 14, EASE_OUT);
            return (
              <span key={w.t} style={{
                display: "inline-block", opacity: p,
                transform: `translateY(${(1 - p) * 36}px)`, filter: `blur(${(1 - p) * 10}px)`,
              }}>{w.t}</span>
            );
          })}
        </div>
        <div className="flex font-bold tracking-tight" style={{ fontSize: 176, lineHeight: 1.15 }}>
          {[...OUTRO_TOGETHER.t].map((ch, j) => {
            const p = progress(frame, OUTRO_TOGETHER.at + j * 1.4, OUTRO_TOGETHER.at + j * 1.4 + 14, EASE_OUT);
            return (
              <span key={j} style={{
                display: "inline-block", opacity: p,
                transform: `translateY(${(1 - p) * 60}px) scale(${mix(p, 0.9, 1)})`,
                filter: `blur(${(1 - p) * 12}px)`,
                backgroundImage: "linear-gradient(to bottom, #ffffff, #bae6fd)",
                WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
              }}>{ch}</span>
            );
          })}
        </div>
      </Fill>

      <Fill style={{ background: "#050817", opacity: darkIn }}>
        <Fill style={{ background: "radial-gradient(ellipse 50% 45% at 50% 50%, rgba(37,99,235,0.28), transparent 70%)" }} />
      </Fill>

      {frame >= 84 && (
        <Fill className="flex flex-col items-center justify-center">
          <NameLockup reveal={reveal} markSize={mix(markShrink, 260, 104)} markStyle={{
            transform: `scale(${markP}) rotate(${(1 - markP) * 160}deg)`,
            filter: `blur(${Math.max(0, 1 - markP) * 12}px)`,
          }} />
          <p className="mt-7 text-white/90 font-semibold tracking-tight" style={{
            fontSize: 38, opacity: sloganIn, transform: `translateY(${(1 - sloganIn) * 16}px)`,
          }}>Your one-stop builder, end to end.</p>
          <p className="mt-2 text-white/55 font-light" style={{
            fontSize: 26, opacity: subIn, transform: `translateY(${(1 - subIn) * 12}px)`,
          }}>From business problem to deployed AI.</p>

          <div className="mt-9 flex items-center gap-4">
            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-sky-400/15 border border-sky-300/40 text-sky-50 text-2xl" style={{
              opacity: emailIn, transform: `scale(${mix(emailIn, 0.9, 1)})`,
              boxShadow: `0 0 ${emailIn * 30}px rgba(56,189,248,0.35)`,
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2.5" />
                <path d="M3.5 6.5 L12 13 L20.5 6.5" />
              </svg>
              thanchanok.thv@gmail.com
            </div>
            <div className="px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white/80 text-xl" style={{
              opacity: linkIn, transform: `scale(${mix(linkIn, 0.9, 1)})`,
            }}>@mee.webdev</div>
          </div>
        </Fill>
      )}
    </Fill>
  );
};

/* ======================================================================== */
/* the stage                                                                */
/* ======================================================================== */

const SCENE_COMPONENTS = {
  hello: HelloScene, prompt: PromptScene, idea: IdeaNameScene, roles: RolesPathScene,
  showcase: ShowcaseScene, ide: IDEScene, grid: GridTextScene, outro: OutroScene,
} as const;

/** The film is laid out on a fixed 1920×1080 canvas, then scaled to cover. */
export default function TeaserFilm({ frame }: { frame: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "#040711" }}>
      <div style={{
        position: "absolute", left: "50%", top: "50%", width: 1920, height: 1080,
        transform: "translate(-50%,-50%) scale(var(--film-scale,1))", transformOrigin: "center",
      }}>
        <FrameContext.Provider value={frame}>
          {SCENES.map(({ key, from, length }) => {
            if (frame < from || frame >= from + length) return null;
            const Scene = SCENE_COMPONENTS[key];
            return (
              <FrameContext.Provider key={key} value={frame - from}>
                <Scene />
              </FrameContext.Provider>
            );
          })}
        </FrameContext.Provider>
      </div>
    </div>
  );
}

/** Drives the film clock: 30fps, looping, and only while it is on screen. */
export function useFilmClock(hostRef: React.RefObject<HTMLElement | null>, playing: boolean) {
  const [frame, setFrame] = useState(0);
  const started = useRef<number | null>(null);
  const offset = useRef(0);
  const visible = useRef(true);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; }, { threshold: 0.2 });
    io.observe(host);
    return () => io.disconnect();
  }, [hostRef]);

  useEffect(() => {
    if (!playing) { started.current = null; return; }
    let raf = 0;
    let lastRendered = -1;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible.current) { started.current = now - (offset.current / FPS) * 1000; return; }
      if (started.current === null) started.current = now - (offset.current / FPS) * 1000;
      const f = Math.floor(((now - started.current) / 1000) * FPS) % DURATION;
      offset.current = f;
      if (f !== lastRendered) { lastRendered = f; setFrame(f); }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const restart = () => { started.current = null; offset.current = 0; setFrame(0); };
  return { frame, restart };
}

export { DURATION };
