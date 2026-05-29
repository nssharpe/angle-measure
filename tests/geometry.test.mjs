// Unit tests for geometry.js — run with:  node --test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const G = require('../geometry.js');

const close = (a, b, eps = 1e-6) => Math.abs(a - b) <= eps;
const P = (x, y) => ({ x, y });
const triplet = (a, v, b) => ({ type: 'triplet', points: [a, v, b] });
const linepair = (ref, seg, flipped = false) => ({ type: 'linepair', ref, seg, flipped });

/* ---------------- normalizeAngle ---------------- */

test('normalizeAngle wraps into (-π, π]', () => {
  assert.ok(close(G.normalizeAngle(0), 0));
  assert.ok(close(G.normalizeAngle(Math.PI), Math.PI));
  assert.ok(close(G.normalizeAngle(-Math.PI), Math.PI)); // -π maps to π
  assert.ok(close(G.normalizeAngle(1.5 * Math.PI), -0.5 * Math.PI));
  assert.ok(close(G.normalizeAngle(3 * Math.PI), Math.PI));
  assert.ok(close(G.normalizeAngle(-3 * Math.PI), Math.PI));
});

/* ---------------- lineDir ---------------- */

test('lineDir reports segment direction', () => {
  assert.ok(close(G.lineDir([P(0, 0), P(1, 0)]), 0));            // +x → 0
  assert.ok(close(G.lineDir([P(0, 0), P(0, 1)]), Math.PI / 2));  // +y → 90° (screen down)
  assert.ok(close(G.lineDir([P(0, 0), P(-1, 0)]), Math.PI));     // -x → 180°
});

/* ---------------- triplet interior angle ---------------- */

test('triplet: right angle = 90°', () => {
  // arms along +x and +y from vertex at origin
  assert.ok(close(G.interiorAngleDeg(triplet(P(10, 0), P(0, 0), P(0, 10))), 90));
});

test('triplet: straight line = 180°', () => {
  assert.ok(close(G.interiorAngleDeg(triplet(P(-10, 0), P(0, 0), P(10, 0))), 180));
});

test('triplet: 45°', () => {
  assert.ok(close(G.interiorAngleDeg(triplet(P(10, 0), P(0, 0), P(10, 10))), 45));
});

test('triplet: acute angle independent of arm order', () => {
  const a = G.interiorAngleDeg(triplet(P(10, 0), P(0, 0), P(7, 7)));
  const b = G.interiorAngleDeg(triplet(P(7, 7), P(0, 0), P(10, 0)));
  assert.ok(close(a, b));
});

test('triplet: degenerate (zero-length arm) returns 0 without NaN', () => {
  const deg = G.interiorAngleDeg(triplet(P(0, 0), P(0, 0), P(10, 0)));
  assert.ok(!Number.isNaN(deg));
  assert.equal(deg, 0);
});

test('triangleGeom.deg matches interiorAngleDeg', () => {
  const pts = [P(3, 1), P(0, 0), P(1, 4)];
  assert.ok(close(G.triangleGeom(pts).deg, G.interiorAngleDeg({ points: pts })));
});

/* ---------------- line pair angle ---------------- */

test('linepair: 30° from vertical reference', () => {
  const ref = [P(50, 100), P(50, 0)];                 // vertical, pointing up
  const seg = [P(0, 100), P(50, 100 - 86.6)];          // ~30° from vertical
  assert.ok(close(G.linePairAngleDeg(linepair(ref, seg)), 30, 0.2));
});

test('linepair: perpendicular = 90°', () => {
  const ref = [P(50, 100), P(50, 0)];                 // vertical
  const seg = [P(0, 50), P(100, 50)];                 // horizontal
  assert.ok(close(G.linePairAngleDeg(linepair(ref, seg)), 90));
});

test('linepair: parallel = 0°', () => {
  const ref = [P(0, 0), P(0, 10)];
  const seg = [P(5, 0), P(5, 10)];
  assert.ok(close(G.linePairAngleDeg(linepair(ref, seg)), 0));
});

test('linepair: anti-parallel = 0° (lines, not rays)... actually 180 since directed', () => {
  // seg points opposite to ref → directed angle is 180°
  const ref = [P(0, 0), P(0, 10)];
  const seg = [P(5, 10), P(5, 0)];
  assert.ok(close(G.linePairAngleDeg(linepair(ref, seg)), 180));
});

/* ---------------- flip (supplementary) ---------------- */

test('flip yields 180 − value', () => {
  const ref = [P(50, 100), P(50, 0)];
  const seg = [P(60, 150), P(150, 90)];
  const base = G.linePairAngleDeg(linepair(ref, seg, false));
  const flipped = G.linePairAngleDeg(linepair(ref, seg, true));
  assert.ok(close(base + flipped, 180));
});

test('flip of perpendicular stays 90°', () => {
  const ref = [P(50, 100), P(50, 0)];
  const seg = [P(0, 50), P(100, 50)];
  assert.ok(close(G.linePairAngleDeg(linepair(ref, seg, true)), 90));
});

test('flip of parallel becomes 180°', () => {
  const ref = [P(0, 0), P(0, 10)];
  const seg = [P(5, 0), P(5, 10)];
  assert.ok(close(G.linePairAngleDeg(linepair(ref, seg, true)), 180));
});

/* ---------------- itemAngleDeg dispatch ---------------- */

test('itemAngleDeg dispatches by type', () => {
  const t = triplet(P(10, 0), P(0, 0), P(0, 10));
  const l = linepair([P(0, 0), P(0, 10)], [P(5, 0), P(5, 10)]);
  assert.ok(close(G.itemAngleDeg(t), 90));
  assert.ok(close(G.itemAngleDeg(l), 0));
});

/* ---------------- output range invariant ---------------- */

test('all angles fall in [0, 180] across random inputs', () => {
  let seed = 12345;
  const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff * 200 - 100;
  for (let i = 0; i < 2000; i++) {
    const ref = [P(rnd(), rnd()), P(rnd(), rnd())];
    const seg = [P(rnd(), rnd()), P(rnd(), rnd())];
    for (const f of [false, true]) {
      const d = G.linePairAngleDeg(linepair(ref, seg, f));
      assert.ok(d >= -1e-9 && d <= 180 + 1e-9, `out of range: ${d}`);
    }
    const deg = G.interiorAngleDeg(triplet(P(rnd(), rnd()), P(rnd(), rnd()), P(rnd(), rnd())));
    assert.ok(deg >= -1e-9 && deg <= 180 + 1e-9, `triplet out of range: ${deg}`);
  }
});
