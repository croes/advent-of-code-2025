import {readFileSync} from "fs";

const startTime = performance.now();

const input = readFileSync(new URL('input', import.meta.url), 'utf-8');

let answer = 0;

const lines = input.split('\n').filter(line => line.trim() !== '');

interface Button {
  bumps: number[];
}

interface Machine {
  id: number;
  target: number[];
  buttons: Button[];
}

interface MachineState {
  joltages: number[];
}

interface MachineStateTreeNode {
  state: MachineState;
  parent: MachineStateTreeNode | null;
  buttonPressed: Button | null;
  depth: number;
}

const machines: Machine[] = lines.map((line, idx) => {
  const parts = line.split(' ');
  const target = parts[parts.length - 1].slice(1, -1).split('').map(n => parseInt(n, 10));
  const buttons: Button[] = parts.slice(1, -1).map(p => {
    const contents = p.slice(1, -1);
    const bumps: number[] = contents.split(',').map(s => parseInt(s, 10));
    return {bumps};
  });
  return {id: idx, target, buttons};
});

for (const machine of machines) {
  const initialState: MachineState = {
    joltages: new Array(machine.target.length).fill(0)
  }
  const rootNode: MachineStateTreeNode = {
    state: initialState,
    parent: null,
    buttonPressed: null,
    depth: 0
  };
  
  let solutionDepth = Infinity;
  let solution: MachineStateTreeNode | null = null;
  
  const MAX_DEPTH = 10;
  
  let levels: {[level: number]: MachineStateTreeNode[]} = {
    0: [rootNode]
  }; 
  for (let depth = 1; depth <= MAX_DEPTH; depth++) {
    console.log(depth);
    // generate current level based on previous level
    levels[depth] = [];
    for (const currentNode of levels[depth - 1]) {
      if (solution) {
        break;
      }
      for (const button of machine.buttons) {
        if (solution) {
          break;
        }
        const newJoltages = currentNode.state.joltages.slice();
        for (const bumpIdx of button.bumps) {
          newJoltages[bumpIdx] += 1;
          if (newJoltages[bumpIdx] > machine.target[bumpIdx]) {
            // invalid state, skip
            continue;
          }
        }
        const newState: MachineState = {joltages: newJoltages};

        const newNode: MachineStateTreeNode = {
          state: newState,
          parent: currentNode,
          buttonPressed: button,
          depth: currentNode.depth + 1,
        };

        levels[depth].push(newNode);

        // check if new state matches target
        if (newNode.depth < solutionDepth && newJoltages.every((joltage, idx) => joltage === machine.target[idx])) {
          solutionDepth = newNode.depth;
          solution = newNode;
          break;
        }
      }
    }
  }

  if (solution) {
    console.log(`Found solution for machine ${machine.id} in ${solutionDepth} moves.`);
    const steps: MachineStateTreeNode[] = [];
    let currentNode: MachineStateTreeNode | null = solution;
    while (currentNode) {
      steps.push(currentNode);
      currentNode = currentNode.parent;
    }
    steps.reverse();
    for (const [i, step] of steps.entries()) {
      console.log(`Step ${i}: Joltages: {${step.state.joltages.join(',')}} Button pressed: ${step.buttonPressed ? '(' + step.buttonPressed.bumps.join(',') + ')' : 'None'}`);
    }
    answer += solutionDepth;
    console.log("Current answer:", answer);
  }
 
}

const endTime = performance.now();

console.log(answer);
console.log(`Execution time: ${(endTime - startTime).toFixed(2)} ms`);