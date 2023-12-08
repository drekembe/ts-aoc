import { sortBy } from 'lodash-es';
import { readData, getFrequency } from '../../shared.ts';
import chalk from 'chalk';

type Hand = {
  cards: string;
  bid: number;
  strength: number;
};

function parseInput(data: string[]): Omit<Hand, 'strength'>[] {
  return data.map((line) => ({
    cards: line.split(' ')[0],
    bid: Number.parseInt(line.split(' ')[1]),
  }));
}

function getHandStrength(cards: string) {
  const nonJs = cards.split('').filter(f => f !== 'J').join('');
  const jSize = cards.length - nonJs.length;
  const freqCards = getFrequency(nonJs.split(''));
  const sorted = sortBy(Object.entries(freqCards), ([card, freq]) => -freq);
  const jokered = cards === 'JJJJJ' ? { 'K': 5 } : Object.fromEntries([[sorted[0][0], sorted[0][1] + jSize], ...sorted.slice(1)])
  const freq = getFrequency(Object.entries(jokered).map(([_, n]) => n));
  if (freq[5] === 1) return 6;
  if (freq[4] === 1) return 5;
  if (freq[3] === 1 && freq[2] === 1) return 4;
  if (freq[3] === 1 && freq[1] === 2) return 3;
  if (freq[2] === 2 && freq[1] === 1) return 2;
  if (freq[2] === 1 && freq[1] === 3) return 1;
  return 0;
}

function getCardStrength(card: string) {
  if (Number.parseInt(card)) return card;
  if (card === 'T') return 'A';
  if (card === 'J') return '1';
  if (card === 'Q') return 'C';
  if (card === 'K') return 'D';
  if (card === 'A') return 'E';
}

export async function day7b(dataPath?: string) {
  const data = await readData(dataPath);
  const hands = parseInput(data);
  const sortedHands = sortBy(
    hands,
    (hand) =>
      `${getHandStrength(hand.cards)}${hand.cards
        .split('')
        .map(getCardStrength)
        .join('')}`
  );
  const debug = sortedHands.map((hand, i) => ({ ...hand, strength: getHandStrength(hand.cards), rank: i + 1})).filter(hand => hand.cards.includes('JJJJJ'));
  //console.log(JSON.stringify(debug, null, 2));
  let sum = 0;
  for (let x = 0; x < sortedHands.length; x++) {
    sum += sortedHands[x].bid * (x + 1);
  }
  return sum;
  return;
}

const answer = await day7b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
