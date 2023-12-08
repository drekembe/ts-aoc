import { readData } from '../../shared.ts';
import chalk from 'chalk';
import { zip, pull } from 'lodash-es'

function* getDistances(time: number) {
  for (let x=0; x<=time; x++) {
    const held = x;
    const remainingTime = time - x;
    const speed = held;
    const totalDistance = speed * remainingTime;
    yield totalDistance;
  }
}

function countDistancesOver(time: number, record: number) {
  let count = 0;
  for (let distance of getDistances(time)) {
    if (distance > record) count++;
  }
  return count;
}

function getResult(races: [number, number][]) {
  let x = 1;
  for (let [time, record] of races) {
    x = x * countDistancesOver(time, record);
  }
  return x;
}


export async function day6a(dataPath?: string) {
  const data = await readData(dataPath);
  const [timesString, distancesString] = data;
  const times = timesString.split(':')[1].trim().split(' ').filter(t => t).map(t => Number.parseInt(t))
  const distances = distancesString.split(':')[1].trim().split(' ').filter(t => t).map(t => Number.parseInt(t))
  const races = zip(times, distances);
  return getResult(races);
}

const answer = await day6a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
