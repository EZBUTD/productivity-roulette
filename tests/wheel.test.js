import test from 'node:test';
import assert from 'node:assert/strict';
import { validateCounts, createTiles, landingRotation } from '../wheel.js';

test('rejects empty, fractional, negative, nonnumeric, and oversized setups', () => {
  for (const bad of [-1, 0.5, NaN, Infinity, '4', 201]) assert.ok(validateCounts({ bad, neutral: 1, good: 1 }));
  assert.ok(validateCounts({ bad: 0, neutral: 0, good: 0 }));
  assert.ok(validateCounts({ bad: 100, neutral: 100, good: 1 }));
  assert.equal(validateCounts({ bad: 0, neutral: 0, good: 1 }), '');
  assert.equal(validateCounts({ bad: 200, neutral: 0, good: 0 }), '');
});

test('shuffling preserves the exact requested composition and total', () => {
  for (let i = 0; i < 100; i++) {
    const tiles = createTiles({ bad: 8, neutral: 3, good: 1 });
    assert.equal(tiles.length, 12);
    assert.equal(tiles.filter(t => t === 'bad').length, 8);
    assert.equal(tiles.filter(t => t === 'neutral').length, 3);
    assert.equal(tiles.filter(t => t === 'good').length, 1);
  }
  assert.notDeepEqual(createTiles({ bad: 8, neutral: 3, good: 1 }, () => 0), createTiles({ bad: 8, neutral: 3, good: 1 }, () => 0.999));
});

test('every possible selection lands centered under the pointer, including repeated spins', () => {
  for (const count of [1, 2, 3, 12, 59, 200]) {
    let rotation = 0;
    for (let index = 0; index < count; index++) {
      const next = landingRotation(rotation, index, count);
      assert.ok(next - rotation >= 1800 - 1e-9);
      const selected = Math.floor((((360 - next % 360) % 360) / 360) * count);
      assert.equal(selected, index);
      rotation = next;
    }
  }
});
