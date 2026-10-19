import { test } from "node:test";
import assert from "node:assert/strict";
import { whaleChoreography } from "./whaleChoreography.ts";

for (const facing of [0, 180]) {
  test(`holds ${facing}° orientation throughout horizontal swimming`, () => {
    for (let p = 0; p <= 0.72; p += 0.01) {
      assert.equal(whaleChoreography(p, facing, false).facing, facing);
    }
  });
  test(`turns only after horizontal arrival from ${facing}°`, () => {
    for (let p = 0.8; p <= 1; p += 0.01) {
      assert.equal(whaleChoreography(p, facing, false).horizontal, 1);
    }
    const arrival = whaleChoreography(1, facing, false);
    assert.equal(arrival.facing, 180 - facing);
    assert.ok(Math.abs(arrival.pitch) < 0.0001);
    assert.ok(Math.abs(arrival.dip) < 0.0001);
  });
}
test("mobile uses a smaller descent and pitch", () => {
  assert.ok(whaleChoreography(0.86, 180, true).pitch < whaleChoreography(0.86, 180, false).pitch);
  assert.ok(whaleChoreography(0.86, 180, true).dip < whaleChoreography(0.86, 180, false).dip);
});
