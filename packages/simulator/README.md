<div align="center">

<img src="https://raw.githubusercontent.com/rfidsoftwares/openrfid-simulator/main/assets/logo.svg" alt="OpenRFID Simulator Logo" width="180" />

# `@openrfid/simulator`

### High-Throughput Tag Inventory Simulation Engine (5,000+ Reads/Sec)

[![npm version](https://img.shields.io/npm/v/@openrfid/simulator.svg)](https://www.npmjs.com/package/@openrfid/simulator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Powered By](https://img.shields.io/badge/Sponsored%20By-RFIDSoftwares.com-0066cc.svg)](https://rfidsoftwares.com)

</div>

---

## 🚀 Overview

`@openrfid/simulator` is the core inventory simulation engine for **OpenRFID Simulator**. It implements a decoupled, high-performance event loop capable of benchmarking **5,000+ RFID tag reads/sec** across multi-reader, multi-antenna setups with configurable read probability distributions, tag movement intervals, and RSSI signal attenuation.

Developed & Maintained by **[RFID Software India Private Limited](https://rfidsoftwares.com)**.

---

## 📦 Installation

```bash
# npm
npm install @openrfid/simulator

# pnpm
pnpm add @openrfid/simulator
```

---

## 💻 Code Example

```typescript
import { SimulationEngine } from '@openrfid/simulator';
import { TagGenerator } from '@openrfid/tags';

// Instantiate core simulation engine
const engine = new SimulationEngine();

// Generate 1,000 simulated SGTIN-96 GS1 RFID tags
const tags = TagGenerator.generatePool({
  count: 1000,
  format: 'sgtin-96',
  companyPrefix: '0614141'
});

// Load tag inventory into simulation memory
engine.inventoryManager.loadTags(tags);

// Start non-blocking inventory simulation loop
await engine.start();

console.log('Simulation engine running at >5,000 tag reads/sec...');
```

---

## 📚 Features

* **High-Throughput Scheduler**: Non-blocking asynchronous event loop optimized for bulk tag inventory cycles.
* **Tag Inventory Manager**: In-memory tag lookup index supporting dynamic insertion, deletion, and tag state transitions.
* **Simulation Statistics**: Real-time throughput metrics (reads/sec, unique tags detected, antenna distribution).

---

## 🌐 Monorepo Ecosystem

| Package | Description |
| :--- | :--- |
| [`@openrfid/core`](https://www.npmjs.com/package/@openrfid/core) | Core EventBus, Config, & SQLite persistence |
| [`@openrfid/readers`](https://www.npmjs.com/package/@openrfid/readers) | Virtual reader hardware and antenna models |
| [`@openrfid/tags`](https://www.npmjs.com/package/@openrfid/tags) | RFID tag domain models & memory generator |
| [`@openrfid/plugin-api`](https://www.npmjs.com/package/@openrfid/plugin-api) | Plugin sandbox and lifecycle interfaces |

---

## 📄 License & Corporate Support

Licensed under the **MIT License**.  
Brought to you by **RFID Software India Private Limited**.  
For enterprise RFID middleware, hardware drivers, or custom protocol plugins, visit **[rfidsoftwares.com](https://rfidsoftwares.com)**.
