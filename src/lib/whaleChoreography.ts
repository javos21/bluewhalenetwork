// Pose of the whale while it travels between two resting points.
// From the motion-led concept (codex/landing-concept-review, Oct 2026).
//
// progress 0–1 across the trip. The whale crosses first, then descends and
// turns in place near the destination. `facing` is a rotateY angle:
// 0 = facing right (the artwork's natural direction), 180 = facing left.
// By default it turns round on arrival; pass `finalFacing` to end facing a
// particular way instead (e.g. to keep swimming in the same direction).

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => value * value * (3 - 2 * value);

export function whaleChoreography(
  progress: number,
  initialFacing: number,
  mobile: boolean,
  finalFacing = 180 - initialFacing,
) {
  const p = clamp(progress);
  const crossing = clamp(p / 0.72);
  const arrival = clamp((p - 0.72) / 0.28);
  const turn = smooth(clamp((p - 0.8) / 0.16));
  const descent = Math.sin(arrival * Math.PI);
  return {
    horizontal: smooth(crossing),
    facing: initialFacing + (finalFacing - initialFacing) * turn,
    dip: descent * descent * (mobile ? 16 : 38),
    pitch: p <= 0.72
      ? Math.sin(crossing * Math.PI) * (mobile ? 12 : 18)
      : descent * (mobile ? 28 : 72),
    propulsion: Math.sin(crossing * Math.PI) ** 2 * 0.8 + descent * 0.25,
  };
}
