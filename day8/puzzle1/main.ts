import {readFileSync} from 'fs';

const startTime = performance.now();

const input = readFileSync(new URL('input', import.meta.url), 'utf-8');

let answer = 0;

const lines = input.split('\n').filter(line => line.trim() !== '');

const circuits: Point[][] = [];
type PointsWithDistance = { p1: Point; p2: Point, distance: number };
type Point = { x: number; y: number, z: number, circuit: Point[] };

const distances: PointsWithDistance[] = [];

function pairwise(list: Point[]): [Point, Point][] {
  if (list.length < 2) {
    return [];
  }
  let first = list[0],
      rest = list.slice(1),
      pairs = rest.map(function(x) {
        return [first, x];
      });
  return pairs.concat(pairwise(rest)) as [Point, Point][];
}

const points: Point[] = lines.map(l => {
  const [x, y, z] = l.split(',').map(Number);
  const point: Point = {x, y, z, circuit: []};
  point.circuit = [point];
  circuits.push(point.circuit);
  return point;
});

for (const [p1, p2] of pairwise(points)) {
  const distance = distance3D(p1, p2);
  distances.push({p1, p2, distance});
}

distances.sort((a, b) => {
  return a.distance - b.distance;
});

function distance3D(p1: Point, p2: Point): number {
  return Math.sqrt(
      Math.pow(p1.x - p2.x, 2) +
      Math.pow(p1.y - p2.y, 2) +
      Math.pow(p1.z - p2.z, 2)
  );
}

for (let i = 0; i < 1000; i++) {
  const closestPair = distances.shift();
  if (!closestPair) {
    break;
  }
  const {p1, p2} = closestPair;
  if (p1.circuit !== p2.circuit) {
    circuits.splice(circuits.indexOf(p1.circuit), 1);
    circuits.splice(circuits.indexOf(p2.circuit), 1);
    const newCircuit: Point[] = [...p1.circuit, ...p2.circuit];
    for (const p of newCircuit) {
      p.circuit = newCircuit;
    }
    circuits.push(newCircuit);
    // console.log(`Created new connection between points (${p1.x},${p1.y},${p1.z}) and (${p2.x},${p2.y},${p2.z})`);
  } else {
    // console.log(`Points (${p1.x},${p1.y},${p1.z}) and (${p2.x},${p2.y},${p2.z}) are already in the same circuit`);
  }

  // console.log(`Circuits:`);
  // console.log(circuits.map((c,i) => (i + 1) + " - " + c.map(p => `(${p.x},${p.y},${p.z})`).join(' -> ')).join('\n'));
}

circuits.sort((a, b) => b.length - a.length);
answer = circuits[0].length * circuits[1].length * circuits[2].length;

const endTime = performance.now();

console.log(answer);
console.log(`Execution time: ${(endTime - startTime).toFixed(2)} ms`);