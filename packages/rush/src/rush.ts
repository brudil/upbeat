import uuid = require("uuid");


function createRushText(initial: string) {

}

const text = createRushText("hello there");


class Char {
  readonly actorId: string;
  readonly value: string;
}

class RushActor {
  readonly actorId: string = uuid.v4();
  private data = [];

  public insert(value: string, index: number) {

  }
}
