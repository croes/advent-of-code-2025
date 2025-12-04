import { readFileSync } from 'fs';

const startTime = performance.now();

const input = readFileSync(new URL('input', import.meta.url), 'utf-8');

const numberOfJoltageDigits = 12;
function findMaxJoltage(bank: number[]): number {
  const digits: number[] = new Array(numberOfJoltageDigits).fill(-Infinity);

  for (let i = 0; i < bank.length; i++) {
    const value = bank[i]!;

    const remainingBatteries = bank.length - i;
    const firstDigitIdx = Math.max(0, digits.length - remainingBatteries);
    for (let j = firstDigitIdx; j < digits.length; j++) {
      if (value > digits[j]!) {
        // check if there are still positions in the bank to fill the remaining digits after j
        const digitsNeeded = digits.length - j - 1;
        if (remainingBatteries > digitsNeeded) {
          digits[j] = value;
          digits.fill(-Infinity, j + 1); // reset remaining positions
          break;
        }
      }
    }
  }
  // convert digits array to a number
  return parseInt(digits.map(d => d.toString(10)).join(''));
}

const lines = input.split('\n').filter(line => line.trim() !== '');

let totalJoltage = 0;

for (const line of lines) {
  const bank: number[] = [];
  for (const char of line) {
    bank.push(parseInt(char, 10));
  }

  const highestJoltage = findMaxJoltage(bank);
  totalJoltage += highestJoltage;

  // console.log(`bank = ${line}, highest joltage = ${highestJoltage}`);
}

const endTime = performance.now();

console.log(totalJoltage);
console.log(`Execution time: ${(endTime - startTime).toFixed(2)} ms`);
