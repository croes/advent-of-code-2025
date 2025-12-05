import { readFileSync } from 'fs';
import IntervalTree from '../IntervalTree.js';

const startTime = performance.now();

const input = readFileSync(new URL('input', import.meta.url), 'utf-8');

let answer: bigint = BigInt(0);

const lines = input.split('\n');

interface Interval {
  start: bigint;
  end: bigint;
}

const freshTree = new IntervalTree<Interval, bigint>();

let processingIds: boolean = true;

for (const line of lines) {
  if (line.trim().length === 0) {
    processingIds = false;
    continue;
  }

  if (processingIds) {
    const [startStr, endStr] = line.split('-');
    const start = BigInt(parseInt(startStr!, 10));
    const end = BigInt(parseInt(endStr!, 10));
    const existingItems = freshTree.search(start, end);
    if (existingItems.length === 0) {
      freshTree.insert(start, end, {start, end});
    } else {
      let newStart = start;
      let newEnd = end;
      for (const item of existingItems) {
        if (item.start < newStart) {
          newStart = item.start;
        }
        if (item.end > newEnd) {
          newEnd = item.end;
        }
        freshTree.remove(item.start, item.end, item);
      }
      freshTree.insert(newStart, newEnd, {start: newStart, end: newEnd});
    }
  }
}

for (const interval of freshTree.inOrder()) {
  answer += (interval.high - interval.low) + 1n;
}

const endTime = performance.now();

console.log(answer);
console.log(`Execution time: ${(endTime - startTime).toFixed(2)} ms`);