import { readFileSync } from 'fs';
import IntervalTree from '../IntervalTree.js';

const startTime = performance.now();

const input = readFileSync(new URL('input', import.meta.url), 'utf-8');

let answer = 0;

const lines = input.split('\n');

interface Interval {
  start: number;
  end: number;
}

const freshTree = new IntervalTree<Interval>();

let processingIds: boolean = true;

for (const line of lines) {
  if (line.trim().length === 0) {
    processingIds = false;
    continue;
  }

  if (processingIds) {
    const [startStr, endStr] = line.split('-');
    const start = parseInt(startStr!, 10);
    const end = parseInt(endStr!, 10);
    freshTree.insert(start, end, {start, end});
  } else {
    const id = parseInt(line, 10);
    const overlappingIntervals = freshTree.search(id, id);
    if (overlappingIntervals.length !== 0) {
      answer++;
    }
  }
}

const endTime = performance.now();

console.log(answer);
console.log(`Execution time: ${(endTime - startTime).toFixed(2)} ms`);