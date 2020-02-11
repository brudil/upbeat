import fs from 'fs';
import { promisify } from 'util';
import { parseInput } from './parser';

const readFile = promisify(fs.readFile);

async function run() {
  const file = await readFile('./spec.ub', { encoding: 'utf-8' });

  console.log(JSON.stringify(parseInput(file), undefined, 2));
}

run();