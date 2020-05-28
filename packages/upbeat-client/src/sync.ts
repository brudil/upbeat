/**
 * @packageDocumentation
 * @module @upbeat/client/sync
 */

import murmurhash from 'murmurhash';

// interface BinaryTreeNode<A> {
//   left: BinaryTreeNode<A>;
//   right: BinaryTreeNode<A>;
//   data: A;
// }
//
// class BinaryTree<A> {
//   private tree: BinaryTreeNode<A>;
//
//   removeNode
// }

type Tree = [number, undefined | [Node, Node]];
type Node = Tree | Leaf | undefined;
type Leaf = number;

export class MerkleTree {
  private operations: { op: any; hash: number }[];
  constructor() {
    this.operations = [];
  }

  addOperation(obj: any) {
    this.operations.push({
      op: obj,
      hash: murmurhash.v3(JSON.stringify(obj)),
    });
  }

  getHash(): Node {
    return this.getHashCalculate(this.operations.map((x) => x.hash));
  }

  getHashCalculate(hashes: Node[]): Node {
    // empty, return null tree.
    if (hashes.length === 0) {
      return [0, undefined];
    }

    // single, return leaf
    if (hashes.length === 1) {
      return hashes[0];
    }

    const hashes2: Node[] = [];
    while (hashes.length > 0) {
      const left = hashes.shift();
      const right = hashes.shift();
      const hash = murmurhash.v3(JSON.stringify([left, right]));
      hashes2.push([hash, [left, right]]);
    }

    return this.getHashCalculate(hashes2);
  }
}
