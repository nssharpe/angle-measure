/*
 * geometry.js — pure, DOM-free angle math for Angle Measure.
 *
 * Kept in its own file so it can be unit-tested under Node (see
 * tests/geometry.test.mjs) and reused by the canvas/SVG drawing code.
 * Loaded as a classic <script> in the browser (attaches to window) and
 * via require() in Node (module.exports).
 *
 * Point = { x, y }.  Items:
 *   triplet:  { type:'triplet',  points:[a, v, b] }
 *   linepair: { type:'linepair', ref:[p0, p1], seg:[p0, p1], flipped }
 */
(function (root) {
  'use strict';

  var TWO_PI = Math.PI * 2;
  var EPS = 1e-9;

  // Normalize an angle (radians) to the range (-π, π].
  function normalizeAngle(d) {
    while (d > Math.PI) d -= TWO_PI;
    while (d <= -Math.PI) d += TWO_PI;
    return d;
  }

  // Direction (radians) of a segment [p0, p1], from p0 toward p1.
  function lineDir(seg) {
    return Math.atan2(seg[1].y - seg[0].y, seg[1].x - seg[0].x);
  }

  // Angle geometry for a triplet [a, v, b] with vertex v.
  // Returns { a1, delta, deg }:
  //   a1    = direction from v to a
  //   delta = signed sweep (normalized) from arm a to arm b
  //   deg   = interior angle in degrees, 0..180
  function triangleGeom(points) {
    var a = points[0], v = points[1], b = points[2];
    var a1 = Math.atan2(a.y - v.y, a.x - v.x);
    var a2 = Math.atan2(b.y - v.y, b.x - v.x);
    var l1 = Math.hypot(a.x - v.x, a.y - v.y);
    var l2 = Math.hypot(b.x - v.x, b.y - v.y);
    if (l1 < EPS || l2 < EPS) return { a1: a1, delta: 0, deg: 0 };
    var delta = normalizeAngle(a2 - a1);
    return { a1: a1, delta: delta, deg: Math.abs(delta) * 180 / Math.PI };
  }

  // Angle geometry for a line pair. Measures from the reference direction
  // (reversed when `flipped`) to the measured segment direction.
  // Returns { aRef, delta, deg }:
  //   aRef  = reference direction used (flipped adds π)
  //   delta = signed sweep (normalized) from reference to segment
  //   deg   = angle in degrees, 0..180
  function linePairGeom(item) {
    var aRef = lineDir(item.ref) + (item.flipped ? Math.PI : 0);
    var delta = normalizeAngle(lineDir(item.seg) - aRef);
    return { aRef: aRef, delta: delta, deg: Math.abs(delta) * 180 / Math.PI };
  }

  function linePairAngleDeg(item) {
    return linePairGeom(item).deg;
  }

  // Interior angle of a triplet, in degrees (0..180).
  function interiorAngleDeg(triplet) {
    return triangleGeom(triplet.points).deg;
  }

  // Dispatch: measured angle for any item, in degrees (0..180).
  function itemAngleDeg(item) {
    return item.type === 'linepair'
      ? linePairGeom(item).deg
      : triangleGeom(item.points).deg;
  }

  var api = {
    normalizeAngle: normalizeAngle,
    lineDir: lineDir,
    triangleGeom: triangleGeom,
    linePairGeom: linePairGeom,
    linePairAngleDeg: linePairAngleDeg,
    interiorAngleDeg: interiorAngleDeg,
    itemAngleDeg: itemAngleDeg,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;          // Node / tests
  } else {
    for (var k in api) root[k] = api[k]; // browser globals
  }
})(typeof window !== 'undefined' ? window : globalThis);
