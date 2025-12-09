import {readFileSync} from 'fs';
import {Worker, isMainThread} from 'worker_threads';
import {getReference} from "@luciad/ria/reference/ReferenceProvider.js";
import {createPoint} from "@luciad/ria/shape/ShapeFactory.js";
import type {Point} from "@luciad/ria/shape/Point.js";
import {URL} from 'url';

if (isMainThread) {
  const startTime = performance.now();

  const input = readFileSync(new URL('input', import.meta.url), 'utf-8');
  const lines = input.split('\n').filter(line => line.trim() !== '');
  const reference = getReference("LUCIAD:XYZ");

  const points: Point[] = lines.map(l => {
    const [x, y] = l.split(',').map(Number);
    return createPoint(reference, [x, y]);
  });

  function pairwise<T>(list: T[]): [T, T][] {
    if (list.length < 2) {
      return [];
    }
    const first = list[0];
    const rest = list.slice(1);
    const pairs = rest.map(x => [first, x] as [T, T]);
    return pairs.concat(pairwise(rest));
  }

  const pairs = pairwise(points).map(([p1, p2]) => {
    return [{x: p1.x, y: p1.y}, {x: p2.x, y: p2.y}];
  });
  console.log(`Checking ${pairs.length} point pairs across 16 workers.`);

  const NUM_WORKERS = 16;
  const chunkSize = Math.ceil(pairs.length / NUM_WORKERS);
  const workerPromises: Promise<number>[] = [];

  // A serializable representation of points for the polygon
  const serializablePolygonPoints = points.map(p => ({x: p.x, y: p.y}));

  let workerId = 0;

  for (let i = 0; i < NUM_WORKERS; i++) {
    const start = i * chunkSize;
    const end = start + chunkSize;
    const chunk = pairs.slice(start, end);

    if (chunk.length > 0) {
      const workerPromise = new Promise<number>((resolve, reject) => {
        const worker = new Worker(new URL('worker.js', import.meta.url), {
          workerData: {
            workerId: workerId++,
            pairs: chunk,
            polygonPoints: serializablePolygonPoints,
            initialMaxArea: 1400081872 // Initial value
          }
        });
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
          if (code !== 0) {
            reject(new Error(`Worker stopped with exit code ${code}`));
          }
        });
      });
      workerPromises.push(workerPromise);
    }
  }

  Promise.all(workerPromises).then(results => {
    const maxRectangleArea = Math.max(...results);
    const endTime = performance.now();
    console.log(maxRectangleArea);
    console.log(`Execution time: ${(endTime - startTime).toFixed(2)} ms`);
  }).catch(err => {
    console.error("A worker failed:", err);
  });
}