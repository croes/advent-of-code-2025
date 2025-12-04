import { readFileSync } from 'fs';

const startTime = performance.now();

const input = readFileSync(new URL('input', import.meta.url), 'utf-8');

let answer = 0;

const lines = input.split('\n').filter(line => line.trim() !== '');

type Grid = string[][];

let grid: Grid = lines.map(line => line.split(''));

function removeRolls(): {grid: Grid, removedRolls: number} {
  const newGrid: Grid = grid.map(row => row.slice());
  let removedRolls = 0;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y]!.length; x++) {
      const current = grid[y]![x]!;
      if (current !== '@') {
        continue;
      }
      let neighbourRolls = 0;

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
            neighbourRolls++;
          }
        }
      }
      if (neighbourRolls < 4) {
        newGrid[y]![x] = 'x';
        removedRolls++;
      }
    }
  }
  return {grid: newGrid, removedRolls: removedRolls};
}

let totalRollsRemoved = 0;
while (true) {
  const {grid: newGrid, removedRolls} = removeRolls();
  totalRollsRemoved += removedRolls;
  grid = newGrid;

  console.log(`Remove ${removedRolls} rolls of paper:`);
  for (const row of grid) {
    console.log(row.join(''));
  }
  console.log('');

  grid = grid.map(row => row.map(cell => cell === 'x' ? '.' : cell));

  answer += removedRolls;

  if (removedRolls === 0) {
    break;
  }
}

const endTime = performance.now();

console.log(answer);
console.log(`Execution time: ${(endTime - startTime).toFixed(2)} ms`);
