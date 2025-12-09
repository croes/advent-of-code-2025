import { parentPort, workerData } from 'worker_threads';
import { getReference } from "@luciad/ria/reference/ReferenceProvider.js";
import { createPoint, createPolygon } from "@luciad/ria/shape/ShapeFactory.js";

const { pairs, polygonPoints, initialMaxArea, workerId } = workerData;

const reference = getReference("LUCIAD:XYZ");
const points = polygonPoints.map((p) => createPoint(reference, [p.x, p.y]));
const polygon = createPolygon(reference, points);

let localMaxArea = initialMaxArea;

let i = 0;
for (const [p1, p2] of pairs) {
  let numberOfPolygonChecks = 0;
  const startTime = performance.now();
  const area = (Math.abs(p1.x - p2.x) + 1) * (Math.abs(p1.y - p2.y) + 1);
  if (area > localMaxArea) {
    let isValid = true;
    const minX = Math.min(p1.x, p2.x);
    const maxX = Math.max(p1.x, p2.x);
    const minY = Math.min(p1.y, p2.y);
    const maxY = Math.max(p1.y, p2.y);
    const corners = [{x: minX, y: minY}, {x: maxX, y: minY}, {x: maxX, y: maxY}, {x: minX, y: maxY}];
    for (const c of corners) {
      if (!polygon.contains2DCoordinates(c.x, c.y)) {
        isValid = false;
        numberOfPolygonChecks++;
        break;
      }
    }
    if (isValid) {
      for (let i = 0; i < corners.length; i++) {
        const c1 = corners[i];
        const c2 = corners[(i + 1) % corners.length];
        for (let x = Math.min(c1.x, c2.x); x <= Math.max(c1.x, c2.x); x++) {
          if (!isValid) break;
          for (let y = Math.min(c1.y, c2.y); y <= Math.max(c1.y, c2.y); y++) {
            if (!polygon.contains2DCoordinates(x, y)) {
              isValid = false;
              numberOfPolygonChecks++;
              break;
            }
            numberOfPolygonChecks++;
          }
        }
      }
    }
    
    if (isValid) {
      localMaxArea = area;
    }
  }
  const endTime = performance.now();
  i++;
  if (i % 1000 === 0) {
    console.log(`[Worker ${workerId}] Checked ${i} / ${pairs.length} point pairs in ${(endTime - startTime).toFixed(2)} ms. # polygon checks: ${numberOfPolygonChecks} Current max area: ${localMaxArea}`);
  }
}

console.log(`[Worker ${workerId}] finished. Local max area: ${localMaxArea}`);

parentPort?.postMessage(localMaxArea);