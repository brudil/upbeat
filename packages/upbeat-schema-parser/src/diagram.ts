import path from 'path';

import * as chevrotain from 'chevrotain';

import fs from 'fs';
import { UpbeatSchemaParser } from './parser';

// extract the serialized grammar.
const parserInstance = new UpbeatSchemaParser();
const serializedGrammar = parserInstance.getSerializedGastProductions();

// create the HTML Text
const htmlText = chevrotain.createSyntaxDiagramsCode(serializedGrammar);

// Write the HTML file to disk
const outPath = path.resolve(__dirname, '../');
fs.writeFileSync(outPath + '/generated_diagrams.html', htmlText);
