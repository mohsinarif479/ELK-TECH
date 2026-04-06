#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

function printUsage() {
  console.log('Usage: node word-frequency.js <input-file> [output-file]');
  console.log('Example: node word-frequency.js ./sample.txt ./freq.json');
}

function validateArgs(args) {
  if (args.length < 3) {
    printUsage();
    process.exitCode = 1;
    return false;
  }

  const inputPath = path.resolve(args[2]);
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Input file not found: ${inputPath}`);
    process.exitCode = 1;
    return false;
  }

  return true;
}

async function countWords(inputFilePath) {
  const counts = {};
  const stream = fs.createReadStream(inputFilePath, { encoding: 'utf8' });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  for await (const line of rl) {
    const words = line
      .trim()
      .toLowerCase()
      .split(/[^a-zA-Z0-9']+/)
      .filter(Boolean);

    for (const word of words) {
      counts[word] = (counts[word] || 0) + 1;
    }
  }

  return counts;
}

async function main() {
  const args = process.argv;
  if (!validateArgs(args)) return;

  const inputPath = path.resolve(args[2]);
  const outputPath = args[3] ? path.resolve(args[3]) : null;

  try {
    const result = await countWords(inputPath);

    if (outputPath) {
      fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
      console.log(`Word frequency written to ${outputPath}`);
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
  } catch (err) {
    console.error('Failed to process file:', err.message);
    process.exitCode = 1;
  }
}

main();
