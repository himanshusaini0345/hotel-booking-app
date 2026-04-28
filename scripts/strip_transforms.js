// run from repo root:
// node strip_transforms.js

const fs = require('fs');
const path = require('path');

function stripTransformBlocks(content, pattern) {
  let result = '';
  let i = 0;
  let match;

  pattern.lastIndex = 0;

  while ((match = pattern.exec(content)) !== null) {
    result += content.slice(i, match.index);

    let j = match.index + match[0].length; // just after opening '{'
    let depth = 1;

    while (j < content.length && depth > 0) {
      if (content[j] === '{') depth++;
      else if (content[j] === '}') depth--;
      j++;
    }

    // skip ); and newline
    while (j < content.length && content[j] === ' ' || content[j] === '\t') j++;
    if (content[j] === ')') j++;
    if (content[j] === ';') j++;
    if (content[j] === '\n') j++;

    i = j;
    pattern.lastIndex = i;
  }

  result += content.slice(i);
  return result;
}

function processDir(dir,pattern) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else if (entry.name.endsWith('.ts')) {
      const original = fs.readFileSync(fullPath, 'utf8');
      const cleaned = stripTransformBlocks(original, pattern);
      if (cleaned !== original) {
        fs.writeFileSync(fullPath, cleaned);
        console.log(`Cleaned: ${fullPath}`);
      } else {
        console.log(`No change: ${fullPath}`);
      }
    }
  }
}

processDir(
  "backend/src/models",
  /\n?[ \t]*\w+Schema\.set\(\s*['\"](toJSON|toObject)['\"],\s*\{/g,
);