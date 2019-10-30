import { HLC } from './timestamp';

const bob = new HLC(Date.now);
const al = new HLC(Date.now);

console.log(bob);

console.log(bob.now());
console.log(bob.update(al.now()));
console.log(bob.now());
console.log(bob.now());
console.log(bob.now());
