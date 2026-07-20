<div align="center">

<img src="https://raw.githubusercontent.com/rfidsoftwares/openrfid-simulator/main/assets/logo.svg" alt="OpenRFID Simulator Logo" width="180" />

# `@openrfid/shell`

### Cross-Platform Desktop & Web Integration Orchestration Shell

[![npm version](https://img.shields.io/npm/v/@openrfid/shell.svg)](https://www.npmjs.com/package/@openrfid/shell)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Powered By](https://img.shields.io/badge/Sponsored%20By-RFIDSoftwares.com-0066cc.svg)](https://rfidsoftwares.com)

</div>

---

## 🚀 Overview

`@openrfid/shell` provides cross-platform application bootstrapping, IPC communication bridges, and process orchestration for embedding **OpenRFID Simulator** into Tauri desktop apps or browser-based SPA environments.

Developed & Maintained by **[RFID Software India Private Limited](https://rfidsoftwares.com)**.

---

## 📦 Installation

```bash
# npm
npm install @openrfid/shell

# pnpm
pnpm add @openrfid/shell
```

---

## 💻 Code Example

```typescript
import { ApplicationShell } from '@openrfid/shell';

const shell = new ApplicationShell({
  mode: 'desktop', // 'desktop' (Tauri) or 'web' (Vite)
  enableSidecar: true
});

await shell.bootstrap();
console.log('OpenRFID Application Shell initialized.');
```

---

## 🌐 Monorepo Ecosystem

| Package | Description |
| :--- | :--- |
| [`@openrfid/ui`](https://www.npmjs.com/package/@openrfid/ui) | Shared React component library |
| [`@openrfid/simulator`](https://www.npmjs.com/package/@openrfid/simulator) | High-throughput inventory simulation engine |
| [`@openrfid/core`](https://www.npmjs.com/package/@openrfid/core) | Core EventBus, Config, & SQLite persistence |

---

## 📄 License & Corporate Support

Licensed under the **MIT License**.  
Brought to you by **RFID Software India Private Limited**.  
For enterprise RFID middleware, hardware drivers, or custom protocol plugins, visit **[rfidsoftwares.com](https://rfidsoftwares.com)**.
