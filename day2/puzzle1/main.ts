import { readFileSync } from 'fs';

const input = readFileSync(new URL('input', import.meta.url), 'utf-8');

const ranges = input.split(',').filter(line => line.trim() !== '');

let sum = 0;

for (const range of ranges) {
  const [startStr, endStr] = range.split('-');
  const start = parseInt(startStr!, 10);
  const end = parseInt(endStr!, 10);

  for (let i = start; i < end; i++) {
    const nbAsStr = i.toString();
    const digits = nbAsStr.split('').map(d => parseInt(d, 10));

    if (digits.length % 2 === 0) {
      const halfLength = Math.floor(digits.length / 2);
      const firstHalf = digits.slice(0, halfLength);
      const secondHalf = digits.slice(halfLength);

      let match = true;
      for (let j = 0; j < halfLength; j++) {
        if (firstHalf[j] !== secondHalf[j]) {
          match = false;
        }
      }

      if (match) {
        console.log('Found invalid id:', i);
        sum += i;
      }
    }
  }
}

console.log(sum);

