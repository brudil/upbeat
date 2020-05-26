import { serialiseTimestamp, Timestamp } from '@upbeat/core/src/timestamp';
import murmurhash from 'murmurhash';

type Tree = {
  hash: number;
  0?: Tree;
  1?: Tree;
  2?: Tree;
};

function getKeys(tree: Tree): string[] {
  return Object.keys(tree).filter((x) => x !== 'hash');
}

function getTimestampFromKeyPath(keyPath: string) {
  // 16 is the length of the base 3 value of the current time in
  // minutes. Ensure it's padded to create the full value
  const fullkey = keyPath + '0'.repeat(16 - keyPath.length);

  // Parse the base 3 representation
  return parseInt(fullkey, 3) * 1000 * 60; // a key has a minutes precision, these are our 'blocks'
}

function insertKey(tree: Tree, keyPath: string, hash: number): Tree {
  if (keyPath.length === 0) {
    return tree;
  }
  const c = keyPath[0] as any;
  const n = (tree as any)[c] || {};
  return Object.assign({}, tree, {
    [c]: Object.assign({}, n, insertKey(n, keyPath.slice(1), hash), {
      hash: n.hash ^ hash,
    }),
  });
}

export function insert(tree: Tree, timestamp: Timestamp) {
  const hash = murmurhash.v3(serialiseTimestamp(timestamp));

  const keyPath = Number((timestamp.time / 1000 / 60) | 0).toString(3);

  tree = Object.assign({}, tree, { hash: tree.hash ^ hash });
  const i = insertKey(tree, keyPath, hash);

  return i;
}

export function build(timestamps: Timestamp[]): Tree {
  return timestamps.reduce((tree, ts) => insert(tree, ts), { hash: -1 });
}

export function diff(treeA: Tree, treeB: Tree) {
  if (treeA.hash === treeB.hash) {
    return null;
  }

  let node1 = treeA;
  let node2 = treeB;
  let k = '';

  while (1) {
    const keyset = new Set([...getKeys(node1), ...getKeys(node2)]);
    const keys = [...keyset.values()];
    keys.sort();

    const diffkey = keys.find((key) => {
      const next1 = node1[key] || {};
      const next2 = node2[key] || {};
      return next1.hash !== next2.hash;
    });

    if (!diffkey) {
      return getTimestampFromKeyPath(k);
    }

    k += diffkey;
    node1 = node1[diffkey] || {};
    node2 = node2[diffkey] || {};
  }
}
