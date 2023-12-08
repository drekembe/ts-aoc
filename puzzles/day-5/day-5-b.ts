import { readData } from '../../shared.ts';
import chalk from 'chalk';
import { takeWhile, min, chunk, reverse, sortBy } from 'lodash-es';

function splitBy<T>(ls: T[], pred: (elem: T) => boolean): T[][] {
  const take = takeWhile(ls, (p) => !pred(p));
  const drop = ls.slice(take.length + 1);
  if (drop.length === 0) return [take];
  return [[...take], ...splitBy(drop, pred)];
}

export async function day5a(dataPath?: string) {
  const data = await readData(dataPath);
  const lines = data;

  const [ss, ...maps] = splitBy(lines, (l) => l === '');

  const seeds = ss[0]
    .split(':')[1]
    .trim()
    .split(' ')
    .map((s) => Number.parseInt(s));

  function* moreSeeds() {
    for (let [i, l] of chunk(seeds, 2)) {
      for (let x = 0; x < l; x++) {
        yield i + x;
      }
    }
  }

  const seedRanges = chunk(seeds, 2);

  function parseMap(s: string[]): Mappe {
    return (s.slice(1) as [string, string, string])
      .map((w) => w.split(' ').map((r) => Number.parseInt(r)))
      .map(([dest, source, offset]) => ({ dest, source, offset }));
  }

  const allMaps = maps.map(parseMap);

  function determineNext(seedNumber: number, m: Mappe) {
    for (let entry of m) {
      if (
        seedNumber >= entry.source &&
        seedNumber < entry.source + entry.offset
      ) {
        return seedNumber + (entry.dest - entry.source);
      }
    }
    return seedNumber;
  }

  function determineSource(dest: number, m: Mappe) {
    for (let entry of m) {
      if (dest >= entry.dest && dest < entry.dest + entry.offset) {
        return entry.source + (dest - entry.dest);
      }
    }
    return dest;
  }

  function processSeed(seedNumber: number) {
    let next = seedNumber;
    for (let m of allMaps) {
      next = determineNext(next, m);
      console.log(`next is ${next}`);
    }
    return next;
  }

  function processLocation(locationNumber: number) {
    let next = locationNumber;
    for (let m of reverse([...allMaps])) {
      next = determineSource(next, m);
    }
    return next;
  }

  type MapEntry = {
    source: number;
    dest: number;
    offset: number;
  };

  type Mappe = MapEntry[];

  function* yieldAllLocations() {
    const locations = sortBy(allMaps[allMaps.length - 1], (m) => m.dest);
    for (let m of locations) {
      for (let l of [...Array(m.offset).keys()].map((o) => o + m.dest)) {
        yield l;
      }
    }
  }

  function inSeedRanges(n: number) {
    for (let [x, offset] of seedRanges) {
      if (n >= x && n < x + offset) return true;
    }
    return false;
  }

  function getMinLocation() {
    let location = 0;
    while (true) {
      const seedNumber = processLocation(location);
      if (inSeedRanges(seedNumber)) return location;
      location++;
    }
  }

  return getMinLocation();
}

const answer = await day5a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
