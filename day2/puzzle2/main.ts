import { readFileSync } from 'fs';

const input = readFileSync(new URL('input', import.meta.url), 'utf-8');

const ranges = input.split(',').filter(line => line.trim() !== '');

let sum = 0;

for (const range of ranges) {
  const [startStr, endStr] = range.split('-');
  const start = parseInt(startStr!, 10);
  const end = parseInt(endStr!, 10);

  for (let number = start; number < end; number++) {
    const nbAsStr = number.toString();
    const digits = nbAsStr.split('').map(d => parseInt(d, 10));

    if (digits.length < 2) {
      continue;
    }

    let isInvalidId = false;
    for (let patternLength = 1; patternLength <= Math.floor(digits.length / 2); patternLength++) {
      if (isInvalidId) break;
      if (digits.length % patternLength === 0) {
        const nbOfPatterns = digits.length / patternLength;
        const pattern = digits.slice(0, patternLength);
        let isRepeated = true;
        for (let i = 1; i < nbOfPatterns; i++) {
          const startIdx = i * patternLength;
          const currentSlice = digits.slice(startIdx, startIdx + patternLength);
          let match = true;
          for (let j = 0; j < patternLength; j++) {
            if (currentSlice[j] !== pattern[j]) {
              match = false;
              break;
            }
          }
          if (!match) {
            isRepeated = false;
            break;
          }
        }
        if (isRepeated) {
          console.log('Found invalid id (repeated pattern):', number, `pattern = ${pattern.join('')}`);
          sum += number;
          isInvalidId = true;
        }
      }
    }
  }
}

console.log(sum);

