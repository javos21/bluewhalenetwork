const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => value * value * (3 - 2 * value);

/** Cross first, then descend and turn in place near the destination. */
export function whaleChoreography(progress: number, initialFacing: number, mobile: boolean) {
  const p = clamp(progress);
  const crossing = clamp(p / 0.72);
  const arrival = clamp((p - 0.72) / 0.28);
  const turn = smooth(clamp((p - 0.8) / 0.16));
  const descent = Math.sin(arrival * Math.PI);
  return {
    horizontal: smooth(crossing),
    facing: initialFacing + (180 - initialFacing * 2) * turn,
    dip: descent * descent * (mobile ? 16 : 38),
    pitch: p <= 0.72
      ? Math.sin(crossing * Math.PI) * (mobile ? 12 : 18)
      : descent * (mobile ? 28 : 72),
    propulsion: Math.sin(crossing * Math.PI) ** 2 * 0.8 + descent * 0.25,
  };
}
