import { readData } from '../../shared.ts';
import chalk from 'chalk';

type Node = {
  left: string;
  right: string;
};

type NodeChoice = {
  source: string;
  node: Node;
};

type NodeMap = {
  [k: string]: Node;
};

function parseNodeChoice(nodeString: string): NodeChoice {
  const [source, dests] = nodeString.split('=');
  const [l, r] = dests.slice(2, dests.length - 1).split(',');
  return {
    source: source.trim(),
    node: {
      left: l.trim(),
      right: r.trim(),
    },
  };
}

function createMap(nodes: NodeChoice[]): NodeMap {
  return nodes.reduce((m, n) => ({ [n.source]: n.node, ...m }), {});
}

function* genDirections(directions: string): Generator<'L' | 'R'> {
  const ds = directions.split('') as ('L' | 'R')[];
  while (true) {
    for (let d of ds) {
      yield d;
    }
  }
}

function getNumberOfSteps(directions: string, nodes: string[]) {
  const nodesMap = createMap(nodes.map(parseNodeChoice));
  let currentNode = 'AAA';
  let nSteps = 0;
  for (let direction of genDirections(directions)) {
    if (currentNode === 'ZZZ') return nSteps;
    let { left, right } = nodesMap[currentNode];
    nSteps++;
    currentNode = direction === 'L' ? left : right;
  }
}

function getNumberOfStepsB(directions: string, nodeChoices: string[]) {
  console.log(directions.length);
  const nodesMap = createMap(nodeChoices.map(parseNodeChoice));
  let currentNodes = nodeChoices
    .map(parseNodeChoice)
    .filter((nodeChoice) => nodeChoice.source.endsWith('A'))
    .map((nodeChoice) => nodeChoice.source);
  let nSteps = 0;
  for (let direction of genDirections(directions)) {
    if (currentNodes.every(node => node.endsWith('Z'))) return nSteps;
    nSteps++;
    currentNodes = currentNodes.map(currentNode => {
      let { left, right } = nodesMap[currentNode];
      return direction === 'L' ? left : right;
    })
  }
}

export async function day8a(dataPath?: string) {
  const data = await readData(dataPath);
  const directions = data[0];
  const nodes = data.slice(2);
  return getNumberOfStepsB(directions, nodes);
}

const answer = await day8a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
