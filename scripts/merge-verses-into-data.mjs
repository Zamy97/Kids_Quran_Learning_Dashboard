#!/usr/bin/env node
/**
 * Merges fetched verses (from fetch-missing-verses.mjs output) into surahs.data.ts.
 * Replaces verses_data: placeholderVerses(N) in order with the blocks from the fetched file.
 * Usage: node scripts/merge-verses-into-data.mjs <fetched.txt>
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const fetchedPath = process.argv[2];
if (!fetchedPath) {
  console.error('Usage: node scripts/merge-verses-into-data.mjs <fetched.txt>');
  process.exit(1);
}

const dataPath = path.join(ROOT, 'src/app/core/data/surahs.data.ts');
const out = fs.readFileSync(path.join(ROOT, fetchedPath), 'utf8');
let data = fs.readFileSync(dataPath, 'utf8');

// Order of placeholder counts as they appear in surahs.data.ts (surahs 78-99)
const placeholderCounts = [40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8];

const blocks = out.split(/^\/\/ /m).slice(1);
if (blocks.length !== placeholderCounts.length) {
  console.error(`Expected ${placeholderCounts.length} blocks, got ${blocks.length}`);
  process.exit(1);
}

for (let i = 0; i < blocks.length; i++) {
  const block = blocks[i];
  const match = block.match(/^verses_data: \[([\s\S]*?)^    \]/m);
  if (!match) {
    console.error('No match for block', i + 1);
    continue;
  }
  const replacement = 'verses_data: [' + match[1] + '    ]';
  const oldStr = 'verses_data: placeholderVerses(' + placeholderCounts[i] + ')';
  const idx = data.indexOf(oldStr);
  if (idx === -1) {
    console.error('Old string not found:', oldStr);
    continue;
  }
  data = data.slice(0, idx) + replacement + data.slice(idx + oldStr.length);
  console.log('Replaced placeholderVerses(' + placeholderCounts[i] + ') with block', i + 1);
}

fs.writeFileSync(dataPath, data);
console.log('Done. Updated', dataPath);
