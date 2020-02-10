import { createToken, Lexer } from "chevrotain";
import fs from 'fs';
import { promisify } from 'util';
const readFile = promisify(fs.readFile);
const ResourceKeyword = createToken({ name: 'Resource', pattern: /resource/ });
const SpaceKeyword = createToken({ name: 'Space', pattern: /space/ });
const WhiteSpace = createToken({
    name: "WhiteSpace",
    pattern: /\s+/,
    group: Lexer.SKIPPED
});
const tokens = [
    ResourceKeyword,
    SpaceKeyword,
    WhiteSpace,
];
const upbeatLexer = new Lexer(tokens);
async function run() {
    const file = await readFile('./spec.ub', { encoding: 'utf-8' });
    console.log(upbeatLexer.tokenize(file));
}
run();
//# sourceMappingURL=parser.js.map