/** Pure scroll sampling: the same position always produces the same pose. */
export const clamp = (value: number) => Math.max(0, Math.min(1, value));
export const smooth = (value: number) => {
  const p = clamp(value);
  return p * p * (3 - 2 * p);
};
export const between = (p: number, start: number, end: number) => smooth((p - start) / (end - start));

export function processPose(progress: number, index: number) {
  const p = clamp(progress);
  const finalHeight = [100, 85, 72, 62][index];
  return {
    height: 30 + (finalHeight - 30) * between(p, index * .14, index * .14 + .25),
    mobileY: index === 0 ? 0 : 115 * (1 - between(p, index * .23 - .08, index * .23 + .03)),
  };
}

export const processIndex = (p: number) => p < .26 ? 0 : p < .49 ? 1 : p < .72 ? 2 : 3;

export function workPose(progress: number, index: number) {
  const p = clamp(progress);
  const entrance = index === 0 ? 1 : between(p, index === 1 ? .25 : .59, index === 1 ? .39 : .73);
  const exit = index === 2 ? 0 : between(p, index === 0 ? .25 : .59, index === 0 ? .39 : .73);
  return { y: 115 * (1 - entrance), rotation: 7 * (1 - entrance), scale: 1 - .06 * exit };
}
export const workIndex = (p: number) => p < .39 ? 0 : p < .73 ? 1 : 2;
export const workStops = [.12, .5, .87];

// Focus and tickets finish BEFORE the computer appears, then its screen zooms
// into the interactive desktop. These intervals also reverse without state.
export const desktopStop = .95;
export function computerPose(progress: number) {
  const p = clamp(progress);
  const zoom = between(p, .74, .89);
  const desktop = between(p, .855, .90);
  const monitorEntrance = between(p, .62, .68);
  return {
    monitorScale: 1 + zoom * 5.5,
    monitorOpacity: monitorEntrance * (1 - desktop),
    introOpacity: monitorEntrance * (1 - between(p, .72, .77)),
    desktopOpacity: desktop,
    desktopScale: .86 + desktop * .14,
    windowY: 0,
    windowOpacity: 1,
    interactive: p >= .90,
    zoom,
    dock: 1,
    presentationOpacity: 1 - between(p, .56, .62),
    presentationY: -12 * between(p, .56, .62),
    focusOpacity: between(p, 0, .025) * (1 - between(p, .34, .40)),
    focusBlur: 5 * between(p, .10, .16),
    emphasisBlur: 5 * between(p, .30, .37),
    washScale: 1 + between(p, 0, .10) * 2.5,
    washOpacity: 1,
    labelOpacity: between(p, .40, .44),
  };
}

export function focusCardPose(progress: number, index: number, mobile = false) {
  const start = mobile ? .17 + index * .105 : .18 + index * .055;
  const arrive = between(clamp(progress), start, start + (mobile ? .065 : .10));
  return { y: (1 - arrive) * 125, rotation: (1 - arrive) * 180 };
}
