/**
 * @file curated.float.test.js — regression guard for the "懸空" bug: curated
 * elevated shelf items (PF_ELEVATED, parked at their authored surface height
 * ySurf) hung in mid-air for the whole early/mid game because the shop shell
 * that supports them is release-gated (hidden until the ball reaches
 * SHOP_TERRAIN_RELEASE_M = 4 m). Fix: keep elevated items GROUNDED until
 * release instead of floating.
 *
 * _restY(pi, objR, invWS) is a pure method, so we construct a CuratedSpawner
 * (its ctor just flattens cityMap.PLACEMENTS — no pool/hash/GPU work) and
 * assert an elevated placement rests near the ground, not at shelf height,
 * while the shop is unreleased (the default boot state).
 */

import { describe, it, expect } from 'vitest';
import { CuratedSpawner } from './curated.js';
import { ObjectStore } from './objects.js';
import { EventBus } from '../core/events.js';
import { SIM_RADIUS_MIN, START_RADIUS_M } from '../config/tuning.js';

const PF_ELEVATED = 2;
const WS0 = START_RADIUS_M / SIM_RADIUS_MIN; // boot worldScale
const INV_WS = 1 / WS0; // sim units per real metre at boot (= 25)

function makeCurated() {
  const store = new ObjectStore();
  const fakeHash = { insert() {}, remove() {}, rebuild() {} };
  const hashes = [fakeHash, fakeHash, fakeHash];
  const instances = { get: () => ({ alloc: () => 0, free() {}, setTransform() {}, setColor() {}, fadeIn() {}, fadeOut() {} }) };
  const bus = new EventBus();
  return new CuratedSpawner(store, hashes, instances, null, bus, { worldScale: WS0, tierIndex: 0 });
}

describe('curated elevated items stay grounded before shop release', () => {
  it('an elevated placement rests near the ground, not at shelf height (unreleased)', () => {
    const c = makeCurated();
    expect(c._released).toBe(false); // boot state — shell not yet revealed

    // find an elevated placement that has a real shelf height
    let pi = -1;
    for (let i = 0; i < c._count; i++) {
      if ((c._pflags[i] & PF_ELEVATED) !== 0 && c._ySurf[i] > 0) { pi = i; break; }
    }
    expect(pi, 'pack must have elevated shelf placements to guard').toBeGreaterThanOrEqual(0);

    const objR = 0.2; // a representative small sim radius
    const shelfY = c._ySurf[pi] * INV_WS; // height it WOULD float at
    expect(shelfY).toBeGreaterThan(1); // sanity: the shelf is genuinely high

    const y = c._restY(pi, objR, INV_WS);
    // grounded: rest height is on the order of the object's own radius, far
    // below the shelf surface it used to hang from.
    expect(y, `elevated item floats at y=${y.toFixed(2)} (shelf=${shelfY.toFixed(2)})`).toBeLessThan(shelfY * 0.5);
  });
});
