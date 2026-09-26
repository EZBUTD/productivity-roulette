export const MAX_TILES = 200;
export const TYPES = ['bad', 'neutral', 'good'];

export function validateCounts(counts) {
  if (TYPES.some(type => !Number.isInteger(counts[type]) || counts[type] < 0 || counts[type] > MAX_TILES)) {
    return `Use whole numbers from 0 to ${MAX_TILES} for each tile type.`;
  }
  const total = TYPES.reduce((sum, type) => sum + counts[type], 0);
  return total < 1 || total > MAX_TILES ? `Choose between 1 and ${MAX_TILES} tiles in total.` : '';
}

export function createTiles(counts, random = Math.random) {
  const error = validateCounts(counts);
  if (error) throw new Error(error);
  const tiles = TYPES.flatMap(type => Array(counts[type]).fill(type));
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  return tiles;
}

// Each wedge starts at twelve o'clock and runs clockwise. Put the selected
// wedge's center under the fixed pointer after five full turns.
export function landingRotation(current, index, count) {
  const target = (360 - (index + 0.5) * 360 / count) % 360;
  const normalized = ((current % 360) + 360) % 360;
  return current + 1800 + ((target - normalized + 360) % 360);
}
