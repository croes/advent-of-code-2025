import { readFileSync } from 'fs';
import { createPoint, createPolygon} from '@luciad/ria/shape/ShapeFactory.js';
import type {Point} from "@luciad/ria/shape/Point.js";
import {getReference} from "@luciad/ria/reference/ReferenceProvider.js";

const startTime = performance.now();

const input = readFileSync(new URL('input', import.meta.url), 'utf-8');

let answer = 0;

const lines = input.split('\n').filter(line => line.trim() !== '');

const reference = getReference("LUCIAD:XYZ");

const points: Point[] = lines.map(l => {
  const [x, y] = l.split(',').map(Number);
  return createPoint(reference, [x, y]);
});

const polygon = createPolygon(reference, points);

function pairwise<T>(list: T[]): [T, T][] {
  if (list.length < 2) {
    return [];
  }
  let first = list[0],
      rest = list.slice(1),
      pairs = rest.map(function(x) {
        return [first, x];
      });
  return pairs.concat(pairwise(rest)) as [T, T][];
}

let maxRectangleArea = -Infinity;
for (const [p1, p2] of pairwise(points)) {
  const area = (Math.abs(p1.x - p2.x) + 1) * (Math.abs(p1.y - p2.y) + 1);
  if (area > maxRectangleArea) {
    maxRectangleArea = area;
  }
}

answer = maxRectangleArea;

const endTime = performance.now();

console.log(answer);
console.log(`Execution time: ${(endTime - startTime).toFixed(2)} ms`);