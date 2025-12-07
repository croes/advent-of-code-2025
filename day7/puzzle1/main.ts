import { readFileSync } from 'fs';

const startTime = performance.now();

const input = readFileSync(new URL('input', import.meta.url), 'utf-8');

let answer = 0;

const lines = input.split('\n').filter(line => line.trim() !== '');

const grid: string[][] = lines.map(line => line.split(''));

for (let y = 1; y < grid.length; y++) {
  const xsSplit = new Set();
  for (let x = 0; x < grid[y].length; x++) {
    if (grid[y - 1][x] === 'S') {
      grid[y][x] = '|';
    } else if (x < grid[y].length - 1 && grid[y][x + 1] === '^' && grid[y - 1][x + 1] === '|') {
      grid[y][x] = '|';
      xsSplit.add(x + 1);
    } else if (x >= 1 && grid[y][x - 1] === '^' && grid[y - 1][x - 1] === '|') {
      grid[y][x] = '|';
      xsSplit.add(x - 1);
    } else if (grid[y - 1][x] === '|' && grid[y][x] === '.') {
      grid[y][x] = '|';
    }
  }
  answer += xsSplit.size;
  console.log(`Row ${y}: splits at ${Array.from(xsSplit).join(', ')}`);
  console.log(grid.map(l => l.join('')).join('\n')); 
}

const endTime = performance.now();

console.log(answer);
console.log(`Execution time: ${(endTime - startTime).toFixed(2)} ms`);
