import { readFileSync } from 'fs';

const startTime = performance.now();

const input = readFileSync(new URL('input', import.meta.url), 'utf-8');

let answer = 0;

const lines = input.split('\n').filter(line => line.trim() !== '');

const grid: string[][] = lines.map(line => line.split(''));

for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y]!.length; x++) {
    const current = grid[y]![x]!;
    if (current === '.') {
      continue;
    }
    let rolls = 0;
    // check all 8 directions
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || ny >= grid.length || nx >= grid[ny]!.length) {
          continue;
        }
        if (dx === 0 && dy === 0) {
          continue;
        }
        if (grid[ny]![nx] === '@') {
          rolls++;
        }
      }
    }
    if (rolls < 4) {
      answer++;
    }
  }
}

for (const row of grid) {
  console.log(row.join(''));
}

const endTime = performance.now();

console.log(answer);
console.log(`Execution time: ${(endTime - startTime).toFixed(2)} ms`);
