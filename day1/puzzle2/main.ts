import { readFileSync } from 'fs';

// Read and parse input, relative to this scripts location. __dirname doesn't exist in ES modules.
const input = readFileSync(new URL('input', import.meta.url), 'utf-8');

const lines = input.split('\n').filter(line => line.trim() !== '');

let pos = 50;
const max = 100;

let nbOfZeroClicks = 0;

for (const line of lines) {
  const sign = line[0];
  const number = parseInt(line.slice(1), 10);

  let dPos = 0;
  if (sign === 'R') {
    dPos = 1;
  } else if (sign === 'L') {
    dPos = -1;
  }

  let newClicks = 0;
  for (let i = 1; i <= number; i++) {
    pos += dPos;
    if (pos < 0) {
      pos += max;
    }
    if (pos >= max) {
      pos -= max;
    }
    if (pos === 0) {
      newClicks++;
    }
  }

  nbOfZeroClicks += newClicks;

  let msg = `The dial is rotated ${sign}${number} to point at ${pos}`;
  if (newClicks > 0) {
    msg += `; during this rotation, there are ${newClicks} new clicks`;
  }
  console.log(msg);
}

console.log(nbOfZeroClicks);