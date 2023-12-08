import { readFile } from 'fs/promises';

export async function readData(path?: string) {
  const fileName = path || process.argv[2];
  const data = (await readFile(fileName)).toString().split('\n');
  return data;
}


export function getFrequency<T extends string | number>(t: T[]) {
    return t.reduce((acc, card) => ({ ...acc, [card]: (acc[card] ?? 0) + 1 }), {} as Record<T, number>);
}