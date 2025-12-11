import {readFileSync} from "fs";

const startTime = performance.now();

const input = readFileSync(new URL('input', import.meta.url), 'utf-8');

let answer = 0;

const lines = input.split('\n').filter(line => line.trim() !== '');

interface Button {
  toggles: number[];
}

interface Machine {
  id: number;
  target: boolean[];
  buttons: Button[];
}

interface MachineState {
  lights: boolean[];
}

interface MachineStateTreeNode {
  state: MachineState;
  parent: MachineStateTreeNode | null;
  buttonPressed: Button | null;
  depth: number;
}

const machines: Machine[] = lines.map((line, idx) => {
  const parts = line.split(' ');
  const target = parts[0].slice(1, -1).split('').map(c => c === '#');
  const buttons: Button[] = parts.slice(1, -1).map(p => {
    const contents = p.slice(1, -1);
    const toggles: number[] = contents.split(',').map(s => parseInt(s, 10));
    return {toggles};
  });
  return {id: idx, target, buttons};
});

for (const machine of machines) {
  const initialState: MachineState = {
    lights: new Array(machine.target.length).fill(false)
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
        const newLights = currentNode.state.lights.slice();
        for (const toggleIdx of button.toggles) {
          newLights[toggleIdx] = !newLights[toggleIdx];
        }
        const newState: MachineState = {lights: newLights};

        // if the new state was already reached in fewer moves, do not add it to the queue
        let stateAlreadyReached = false;
        for (let node: MachineStateTreeNode | null = currentNode; node !== null; node = node.parent) {
          if (node.state.lights.every((light, idx) => light === newState.lights[idx])) {
            stateAlreadyReached = true;
          }
        }

        if (stateAlreadyReached) {
          continue;
        }

        const newNode: MachineStateTreeNode = {
          state: newState,
          parent: currentNode,
          buttonPressed: button,
          depth: currentNode.depth + 1,
        };

        levels[depth].push(newNode);

        // check if new state matches target
        if (newNode.depth < solutionDepth && newLights.every((light, idx) => light === machine.target[idx])) {
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
      console.log(`Step ${i}: Lights: ${step.state.lights.map(l => l ? '#' : '.').join('')} Button pressed: ${step.buttonPressed ? '[' + step.buttonPressed.toggles.join(',') + ']' : 'None'}`);
    }
    answer += solutionDepth;
    console.log("Current answer:", answer);
  }
 
}

const endTime = performance.now();

console.log(answer);
console.log(`Execution time: ${(endTime - startTime).toFixed(2)} ms`);