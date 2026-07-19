const fs = require('fs');
const path = require('path');

const HEADER = `/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */\n\n`;

const TARGET_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.cjs', '.mjs', '.css']);
const IGNORE_DIRS = new Set(['node_modules', 'dist', '.turbo', '.next', 'coverage', '.git']);

let updatedCount = 0;
let skippedCount = 0;

function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.has(entry.name)) {
        processDirectory(fullPath);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (TARGET_EXTENSIONS.has(ext)) {
        processFile(fullPath);
      }
    }
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if header already exists
  if (content.includes('Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com')) {
    skippedCount++;
    return;
  }

  // Remove old headers if any exist
  if (content.startsWith('/**') && content.indexOf('*/') !== -1 && content.indexOf('*/') < 400) {
    const endIdx = content.indexOf('*/') + 2;
    content = content.substring(endIdx).trimStart();
  }

  fs.writeFileSync(filePath, HEADER + content, 'utf8');
  console.log(`[Header Injected] ${path.relative(process.cwd(), filePath)}`);
  updatedCount++;
}

console.log('Starting RFID Software India Private Limited License Header Injection...');
const targetFolders = ['packages', 'scripts', 'apps'];

for (const folder of targetFolders) {
  const absPath = path.resolve(__dirname, '..', folder);
  if (fs.existsSync(absPath)) {
    processDirectory(absPath);
  }
}

console.log(`\nBranding Header Summary:`);
console.log(`- Files updated: ${updatedCount}`);
console.log(`- Files skipped (already branded): ${skippedCount}`);
console.log(`- Website URL: https://rfidsoftwares.com\n`);
