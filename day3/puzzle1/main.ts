import { readFileSync } from 'fs';

const input = readFileSync(new URL('input', import.meta.url), 'utf-8');

function findMaxJoltage(bank: number[]): number {
  let highestMax = -Infinity;
  let secondHighestMax = -Infinity;
  let highestMaxIdx = -1;
  let secondHighestMaxIdx = -1;
  for (let i = 0; i < bank.length; i++) {
    const value = bank[i]!;
    // highest max cannot appear in the last position
    // something needs to be after it to form a two-digit number
    if (value > highestMax && (i < bank.length - 1)) {
      secondHighestMax = -Infinity;
      secondHighestMaxIdx = -1;
      highestMax = value;
      highestMaxIdx = i;
    } else if (value > secondHighestMax) {
      secondHighestMax = value;
      secondHighestMaxIdx = i;
    }
  }
  if (highestMaxIdx > secondHighestMaxIdx) {
    return (secondHighestMax) * 10 + highestMax;
  }
  return highestMax * 10 + secondHighestMax;
}

const lines = input.split('\n').filter(line => line.trim() !== '');

let totalJoltage = 0;

for (const line of lines) {
  const bank: number[] = [];
  for (let i = 0; i < line.length; i++) {
    bank.push(parseInt(line[i], 10));
  }

  const highestJoltage = findMaxJoltage(bank);
  totalJoltage += highestJoltage;

  console.log(`bank = ${line}, highest joltage = ${highestJoltage}`);
}

console.log(totalJoltage);