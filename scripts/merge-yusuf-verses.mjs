#!/usr/bin/env node
/**
 * Merges full Yusuf verses (11-111) from yusuf-generated.txt into surahs.data.ts
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const dataPath = path.join(root, 'src/app/core/data/surahs.data.ts');
const generatedPath = path.join(__dirname, 'yusuf-generated.txt');

const data = fs.readFileSync(dataPath, 'utf8');
const generated = fs.readFileSync(generatedPath, 'utf8');

// Extract verses 11-111 from generated (lines 21-124, 0-indexed 20-123)
const generatedLines = generated.split('\n');
const verses11to111 = generatedLines.slice(20, 124).join('\n');

// In surahs.data.ts we have verse 10 ending with "..."' }  and then \n    ]
// We need to replace "}\n    ]\n  },\n  {\n    id: 'yasin'" (the yusuf closing) with "},\n" + verses11to111 + "\n    ]\n  },\n  {\n    id: 'yasin'"
// Unique pattern: verse 10 closing brace through start of yasin (so we add comma after verse 10)
const marker = `فَـٰعِلِينَ', translation: 'Said a speaker among them, "Do not kill Joseph but throw him into the bottom of the well; some travelers will pick him up - if you would do [something]."' }
    ]
  },
  {
    id: 'yasin',`;

const replacement = `فَـٰعِلِينَ', translation: 'Said a speaker among them, "Do not kill Joseph but throw him into the bottom of the well; some travelers will pick him up - if you would do [something]."' },
${verses11to111}
    ]
  },
  {
    id: 'yasin',`;

if (!data.includes(marker)) {
  console.error('Marker not found in surahs.data.ts');
  process.exit(1);
}
const newData = data.replace(marker, replacement);
fs.writeFileSync(dataPath, newData);
console.log('Merged Yusuf verses 11-111 into surahs.data.ts');