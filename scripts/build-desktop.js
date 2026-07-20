/**
 * OpenRFID Simulator - Desktop Build Script
 * ========================================================
 * 1. Resolves system paths for Rust/Cargo, WiX Toolset, and Git Unix utilities on Windows.
 * 2. Compiles the background Node.js runner using `pkg` into a standalone binary sidecar.
 * 3. Runs `tauri build` to package the UI and sidecar runner into Windows setup installers.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const binariesDir = path.join(rootDir, 'apps', 'desktop', 'src-tauri', 'binaries');

// Ensure binaries directory exists
if (!fs.existsSync(binariesDir)) {
  fs.mkdirSync(binariesDir, { recursive: true });
}

// 1. Detect platform target triple and pkg target
let targetTriple = '';
let pkgTarget = '';
let extension = '';

if (process.platform === 'win32') {
  targetTriple = 'x86_64-pc-windows-msvc';
  pkgTarget = 'node18-win-x64';
  extension = '.exe';
  
  // Set up Cargo, WiX, and Git Unix tools paths
  const homeDir = process.env.USERPROFILE || 'C:\\Users\\Akash';
  const cargoBin = path.join(homeDir, '.cargo', 'bin');
  const wixBin = 'C:\\Program Files (x86)\\WiX Toolset v3.14\\bin';
  const gitUsrBin = 'C:\\Program Files\\Git\\usr\\bin';
  
  let envPaths = [];
  if (fs.existsSync(cargoBin)) envPaths.push(cargoBin);
  if (fs.existsSync(wixBin)) envPaths.push(wixBin);
  if (fs.existsSync(gitUsrBin)) envPaths.push(gitUsrBin);
  
  if (envPaths.length > 0) {
    process.env.PATH = `${envPaths.join(';')};${process.env.PATH}`;
    console.log(`[Build] Prepended local environment paths: ${envPaths.join(';')}`);
  }
  
  // Set lower build concurrency on Windows to prevent file locks
  process.env.CARGO_BUILD_JOBS = '1';
  console.log(`[Build] Set CARGO_BUILD_JOBS = 1`);
} else if (process.platform === 'darwin') {
  targetTriple = process.arch === 'arm64' ? 'aarch64-apple-darwin' : 'x86_64-apple-darwin';
  pkgTarget = process.arch === 'arm64' ? 'node18-macos-arm64' : 'node18-macos-x64';
} else if (process.platform === 'linux') {
  targetTriple = 'x86_64-unknown-linux-gnu';
  pkgTarget = 'node18-linux-x64';
} else {
  console.error(`Unsupported build platform: ${process.platform}`);
  process.exit(1);
}

const sidecarName = `hopeland-runner-${targetTriple}${extension}`;
const sidecarPath = path.join(binariesDir, sidecarName);
const runnerScript = path.join(rootDir, 'packages', 'hopeland-discovery', 'hopeland-discovery-runner.js');

console.log(`[Build] Target Triple: ${targetTriple}`);
console.log(`[Build] Packaging runner script into standalone binary sidecar (${pkgTarget})...`);

// 2. Run pkg to package Node.js runner
try {
  const pkgCmd = `npx pkg "${runnerScript}" --targets ${pkgTarget} --output "${sidecarPath}"`;
  console.log(`[Build] Running: ${pkgCmd}`);
  execSync(pkgCmd, { cwd: rootDir, stdio: 'inherit' });
  console.log(`[Build] Sidecar successfully packaged to: ${sidecarPath}`);
} catch (error) {
  console.error('[Build] Error packaging the Node.js runner sidecar:', error.message);
  process.exit(1);
}

// 3. Build Tauri desktop application
try {
  const tauriCmd = 'pnpm --filter @openrfid/desktop tauri build';
  console.log(`[Build] Running: ${tauriCmd}`);
  execSync(tauriCmd, { cwd: rootDir, stdio: 'inherit' });
  console.log('[Build] Standalone desktop application installer built successfully!');
} catch (error) {
  console.error('[Build] Error building the Tauri desktop application:', error.message);
  process.exit(1);
}
