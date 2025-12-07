import { readFileSync } from 'fs';

const startTime = performance.now();

const input = readFileSync(new URL('input', import.meta.url), 'utf-8');

let answer = 0;

const lines = input.split('\n').filter(line => line.trim() !== '');

const grid: string[][] = lines.map(line => line.split(''));
const beamCounts: number[][] = Array.from({ length: grid.length }, () => Array(grid[0]!.length).fill(0));

for (let y = 1; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    if (grid[y - 1][x] === 'S') {
      grid[y][x] = '|';
      beamCounts[y][x] = 1;
    } else if (x < grid[y].length - 1 && grid[y][x + 1] === '^' && grid[y - 1][x + 1] === '|') {
      grid[y][x] = '|';
    } else if (x >= 1 && grid[y][x - 1] === '^' && grid[y - 1][x - 1] === '|') {
      grid[y][x] = '|';
    } else if (grid[y - 1][x] === '|' && grid[y][x] === '.') {
      grid[y][x] = '|';
    }
    
    // propagate beam counts
    if (grid[y][x] === '|' && grid[y - 1][x] === '|') {
      beamCounts[y][x] += beamCounts[y - 1][x];
    }
    if (y < grid.length - 1 && grid[y][x] === '^' && grid[y - 1][x] === '|') {
      if (x >= 1) {
        beamCounts[y][x - 1] += beamCounts[y - 1][x];
      }
      if (x < grid[y].length - 1) {
        beamCounts[y][x + 1] += beamCounts[y - 1][x];
      }
    }
  }
  // console.log(grid.map(l => l.join('')).join('\n'));
  // console.log(beamCounts.map(l => l.join('')).join('\n'));
}

function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0);
}

console.log(sum(beamCounts[beamCounts.length - 1]));

const endTime = performance.now();

console.log(answer);
console.log(`Execution time: ${(endTime - startTime).toFixed(2)} ms`);
