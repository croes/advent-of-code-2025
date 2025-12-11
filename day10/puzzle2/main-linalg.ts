import {readFileSync} from "fs";
import { solve } from "yalps"

const startTime = performance.now();

const input = readFileSync(new URL("input", import.meta.url), "utf-8");
let answer = 0;
const lines = input.split("\n").filter(line => line.trim() !== "");

interface Button {
  increases: number[];
}

interface Machine {
  id: number;
  target: number[];
  buttons: Button[];
}

const machines: Machine[] = lines.map((line, idx) => {
  const parts = line.split(" ");
  const target = parts[parts.length - 1]
      .slice(1, -1)
      .split(",")
      .map(n => parseInt(n, 10));
  const buttons: Button[] = parts.slice(1, -1).map(p => {
    const contents = p.slice(1, -1);
    const increases = contents.split(",").map(s => parseInt(s, 10));
    return { increases };
  });
  return { id: idx, target, buttons };
});

const EPSILON = 1e-9;

for (const machine of machines) {
  const objective = {};
  for (let i = 0; i < machine.target.length; i++) {
    //@ts-ignore
    objective["joltage-" + i] = {equal: machine.target[i]}
  }
  const variables = {};
  for (let i = 0; i < machine.buttons.length; i++) {
    const button = machine.buttons[i];
    //@ts-ignore
    variables["button-" + i] = {};
    for (const bumpIndex of button.increases) {
      //@ts-ignore
      variables["button-" + i]["joltage-" + bumpIndex] = 1;
    }
  }
  const model = {
    direction: "minimize",
    objective,
    variables,
    integers: true
  }
  
  const solution = solve(model);
  
  for (let i = 0; i < machine.buttons.length; i++) {
    for (const increaseIndex of machine.buttons[i].increases) {
      a.set(increaseIndex, i, 1);
    }
  }

  const svd = new SingularValueDecomposition(a, {
    computeLeftSingularVectors: true,
    computeRightSingularVectors: true,
    autoTranspose: true // let ml-matrix handle wide matrices
  });

  // least-squares solution (ml-matrix handles the transpose logic internally)
  const particularSolution = svd.solve(b); // n x 1

  console.log(particularSolution);
  
  const V_compact = svd.rightSingularVectors; // This is n x m (6x4)
  const n = a.columns; // n = 6
  const m = a.rows;    // m = 4
  
  // The columns of V_compact form an orthonormal basis for the row space of A.
  // The null space of A is the orthogonal complement of the row space.
  // The QR decomposition of V_compact gives a "thin" Q matrix (n x m).
  // We need to extend this to a full n x n orthogonal matrix to find the null space.
  const qr = new QrDecomposition(V_compact);
  let Q = qr.orthogonalMatrix; // This is n x m (6x4)

  // Augment Q with identity vectors to span the full R^n space
  const augmentedQ = Matrix.zeros(n, n);
  augmentedQ.setSubMatrix(Q, 0, 0);
  for (let i = m; i < n; i++) {
    augmentedQ.set(i, i, 1);
  }

  // Orthonormalize the augmented matrix to get a full Q_full (n x n)
  const qr_full = new QrDecomposition(augmentedQ);
  const Q_full = qr_full.orthogonalMatrix; // This is n x n (6x6)

  const nullSpaceBasis: Matrix[] = [];

  // The last n - m columns of the full Q matrix form the basis for the null space.
  for (let i = m; i < n; i++) {
    nullSpaceBasis.push(Q_full.getColumnVector(i));
  }

  let integerSolution: number[] | null = null;

  const partArr = particularSolution.to1DArray();
  if (partArr.every(v => Math.abs(v - Math.round(v)) < EPSILON)) {
    const rounded = partArr.map(v => Math.round(v));
    if (rounded.every(v => v >= 0)) {
      integerSolution = rounded;
    }
  }

  if (!integerSolution && nullSpaceBasis.length > 0) {
    const basis = nullSpaceBasis[0]; // n x 1
    for (let k = 0; k <= 200; k++) {
      if (k === 0) continue;
      const candidate = particularSolution.clone().add(basis.clone().mul(k));
      const arr = candidate.to1DArray();
      console.log(`candidate for k=${k}:`, arr);
      if (arr.every(v => Math.abs(v - Math.round(v)) < EPSILON)) {
        const rounded = arr.map(v => Math.round(v));
        if (rounded.every(v => v >= 0)) {
          const curSum = integerSolution?.reduce((s0, v) => s0 + v, 0) ?? Infinity;
          const newSum = rounded.reduce((s0, v) => s0 + v, 0);
          if (newSum < curSum) {
            integerSolution = rounded;
          }
        }
      }
    }
  }

  if (integerSolution) {
    console.log("Found integer solution:", integerSolution);
    answer += integerSolution.reduce((sum, val) => sum + val, 0);
  } else {
    console.log("No simple integer solution found for machine", machine.id);
  }
}

const endTime = performance.now();
console.log(answer);
console.log(`Execution time: ${(endTime - startTime).toFixed(2)} ms`);