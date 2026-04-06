#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

function printUsage() {
  console.log('Usage: node error-handling.js <file-path>');
}

async function readFileContent(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    console.log('File content successfully read.');
    return data;
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(`File not found: ${filePath}`);
    }
    if (err.code === 'EACCES') {
      throw new Error(`Permission denied: ${filePath}`);
    }
    throw err;
  }
}

async function main() {
  const args = process.argv;
  if (args.length !== 3) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const filePath = path.resolve(args[2]);

  try {
    const content = await readFileContent(filePath);
    console.log('Content length:', content.length);
  } catch (err) {
    console.error('Error:', err.message);
    process.exitCode = 1;
  }
}

main();
