import { TYPES, validateCounts, createTiles, landingRotation } from './wheel.js';

const $ = id => document.getElementById(id);
const storageKey = 'productivity-roulette-v1';
const colors = { bad: '#db886c', neutral: '#e5dfcc', good: '#91ad83' };
const symbols = { bad: '×', neutral: '−', good: '✦' };
let tiles = [];
let rotation = 0;
let spinning = false;
let valid = true;

function counts() {
  return Object.fromEntries(TYPES.map(type => [type, $(type).value === '' ? NaN : Number($(type).value)]));
}

function save() {
  try {
    localStorage.setItem(storageKey, JSON.stringify({ counts: counts(), consequence: $('consequence').value, reward: $('reward').value }));
    $('save-status').textContent = 'Saved on this device. Just for you.';
  } catch {
    $('save-status').textContent = 'Saving unavailable. Keep this tab open to keep your setup.';
  }
}

function restore() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    if (!stored || !stored.counts || validateCounts(stored.counts)) return;
    TYPES.forEach(type => { $(type).value = stored.counts[type]; });
    ['consequence', 'reward'].forEach(id => { if (typeof stored[id] === 'string') $(id).value = stored[id].slice(0, 160); });
  } catch { /* A missing or malformed save uses the default setup. */ }
}

function showResult(title, description, kind = '') {
  $('result').replaceChildren();
  const strong = document.createElement('strong');
  const span = document.createElement('span');
  strong.textContent = title;
  span.textContent = description;
  $('result').append(strong, span);
  $('result').dataset.kind = kind;
}

function updateControls() {
  $('spin').disabled = spinning || !valid;
  $('shuffle').disabled = spinning || !valid;
  $('progress').disabled = spinning || !valid || counts().bad === 0;
  [...TYPES, 'consequence', 'reward'].forEach(id => { $(id).disabled = spinning; });
}

function svgElement(name, attrs) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', name);
  Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}

function drawWheel() {
  const svg = $('wheel');
  svg.replaceChildren();
  rotation = 0;
  svg.style.transform = 'rotate(0deg)';
  const angle = 2 * Math.PI / tiles.length;
  const point = a => [250 + 247 * Math.sin(a), 250 - 247 * Math.cos(a)];
  tiles.forEach((type, index) => {
    let wedge;
    if (tiles.length === 1) {
      wedge = svgElement('circle', { cx: 250, cy: 250, r: 247, fill: colors[type] });
    } else {
      const start = point(index * angle);
      const end = point((index + 1) * angle);
      wedge = svgElement('path', { d: `M250 250 L${start.join(' ')} A247 247 0 ${angle > Math.PI ? 1 : 0} 1 ${end.join(' ')} Z`, fill: colors[type], stroke: '#faf7ec', 'stroke-width': tiles.length > 80 ? 0.6 : 1.5 });
    }
    svg.append(wedge);
    if (tiles.length <= 60) {
      const middle = (index + 0.5) * angle;
      const label = svgElement('text', { x: 250 + 190 * Math.sin(middle), y: 250 - 190 * Math.cos(middle), fill: type === 'neutral' ? '#8d846d' : '#fff8ec', 'font-size': Math.min(30, 650 / tiles.length), 'text-anchor': 'middle', 'dominant-baseline': 'central', 'aria-hidden': 'true' });
      label.textContent = symbols[type];
      svg.append(label);
    }
  });
  const current = counts();
  svg.setAttribute('aria-label', `${tiles.length} equal tiles: ${current.bad} bad, ${current.neutral} neutral, ${current.good} good.`);
}

function rebuild(message) {
  const current = counts();
  const error = validateCounts(current);
  valid = !error;
  $('validation').textContent = error;
  TYPES.forEach(type => $(type).setAttribute('aria-invalid', String(!valid)));
  updateControls();
  if (!valid) {
    showResult('Check your tile counts.', 'The wheel shows your last valid setup.');
    return;
  }
  tiles = createTiles(current);
  drawWheel();
  $('total').textContent = tiles.length;
  TYPES.forEach(type => { $(type + '-odds').textContent = `${Number((current[type] / tiles.length * 100).toFixed(1))}%`; });
  showResult(message || 'Your next chapter is a spin away.', 'Each tile has an equal chance of being picked.');
  save();
}

async function spin() {
  if (spinning || !valid) return;
  spinning = true;
  updateControls();
  $('spin').textContent = 'Spinning…';
  showResult('Round and round we go…', 'Let’s see where your progress takes you.');
  const index = Math.floor(Math.random() * tiles.length);
  const next = landingRotation(rotation, index, tiles.length);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animation = $('wheel').animate([{ transform: `rotate(${rotation}deg)` }, { transform: `rotate(${next}deg)` }], { duration: reduced ? 0 : 4600, easing: 'cubic-bezier(0.15, 0.7, 0.15, 1)', fill: 'forwards' });
  await animation.finished;
  rotation = next % 360;
  $('wheel').style.transform = `rotate(${rotation}deg)`;
  animation.cancel();
  const type = tiles[index];
  if (type === 'bad') showResult('× Bad tile — time to follow through.', $('consequence').value.trim() || 'Follow through on the consequence you agreed on with your friends.', type);
  if (type === 'neutral') showResult('− Neutral tile — you’re in the clear.', 'Nothing owed. Every little bit of progress mattered.', type);
  if (type === 'good') showResult('✦ Good tile — a little joy from a friend.', $('reward').value.trim() || 'Enjoy the reward your friend sponsored. You’ve got someone cheering you on.', type);
  spinning = false;
  $('spin').innerHTML = 'Spin again <span aria-hidden="true">↗</span>';
  updateControls();
}

TYPES.forEach(type => {
  $(type).setAttribute('aria-describedby', 'validation');
  $(type).addEventListener('input', () => rebuild());
});
['consequence', 'reward'].forEach(id => $(id).addEventListener('input', () => { if (valid) save(); }));
$('shuffle').addEventListener('click', () => rebuild('A fresh arrangement. The same chances.'));
$('progress').addEventListener('click', () => {
  if (!valid || spinning || counts().bad < 1) return;
  $('bad').value = counts().bad - 1;
  $('neutral').value = counts().neutral + 1;
  rebuild('One step forward. One less bad tile.');
});
$('spin').addEventListener('click', spin);
restore();
rebuild();
