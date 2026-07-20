<div align="center">

<img src="https://raw.githubusercontent.com/rfidsoftwares/openrfid-simulator/main/assets/logo.svg" alt="OpenRFID Simulator Logo" width="180" />

# `@openrfid/core`

### Core Dependency Injection, EventBus, ConfigManager & SQLite Persistence Engine

[![npm version](https://img.shields.io/npm/v/@openrfid/core.svg)](https://www.npmjs.com/package/@openrfid/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Powered By](https://img.shields.io/badge/Sponsored%20By-RFIDSoftwares.com-0066cc.svg)](https://rfidsoftwares.com)

</div>

---

## 🚀 Overview

`@openrfid/core` provides the foundational architecture for the **OpenRFID Simulator** framework. It includes a decoupled typed `EventBus`, a persistent `ConfigManager`, a lightweight Dependency Injection (`ServiceContainer`) container, and a high-performance SQLite WAL storage engine for persisting RFID reader scan events and system logs.

Developed & Maintained by **[RFID Software India Private Limited](https://rfidsoftwares.com)**.

---

## 📦 Installation

```bash
# npm
npm install @openrfid/core

# pnpm
pnpm add @openrfid/core

# yarn
yarn add @openrfid/core
```

---

## 💻 Code Example

### 1. Using the Typed EventBus
```typescript
import { EventBus } from '@openrfid/core';

// Subscribe to RFID tag detection events
EventBus.on('TagDetected', (event) => {
  console.log(`Tag Detected: ${event.epc} on Reader: ${event.readerId} (RSSI: ${event.rssi} dBm)`);
});

// Emit simulated tag scan event
EventBus.emit('TagDetected', {
  epc: 'E28011700000020C3C9101AB',
  readerId: 'READER-01',
  antennaPort: 1,
  rssi: -58.5,
  timestamp: Date.now()
});
```

### 2. SQLite Event Storage
```typescript
import { SqliteStorageManager } from '@openrfid/core';

const storage = new SqliteStorageManager({ dbPath: './rfid_simulation.db' });
await storage.initialize();

// Save tag detection scan
await storage.saveScanEvent({
  epc: '3034257BF4000B4000000001',
  readerId: 'GATE-NORTH-01',
  antennaPort: 2,
  rssi: -62.0,
  readCount: 1,
  timestamp: Date.now()
});

// Query recent scan history
const recentScans = await storage.getRecentScans({ limit: 50 });
console.log('Recent Scans:', recentScans);
```

---

## 📚 API Reference

| Export | Type | Description |
| :--- | :--- | :--- |
| `EventBus` | Singleton Class | Typed publish-subscribe event emitter for simulation events |
| `ConfigManager` | Class | Load, validate, and update system configuration parameters |
| `ServiceContainer` | Class | Lightweight IoC container for dependency resolution |
| `SqliteStorageManager` | Class | SQLite database manager with WAL logging for high-throughput persistence |

---

## 🌐 Monorepo Ecosystem

| Package | Description |
| :--- | :--- |
| [`@openrfid/simulator`](https://www.npmjs.com/package/@openrfid/simulator) | High-throughput inventory simulation engine |
| [`@openrfid/readers`](https://www.npmjs.com/package/@openrfid/readers) | Virtual reader hardware and antenna models |
| [`@openrfid/epc`](https://www.npmjs.com/package/@openrfid/epc) | EPC Gen2 memory bank encoders & decoders |
| [`@openrfid/plugin-api`](https://www.npmjs.com/package/@openrfid/plugin-api) | Plugin sandbox and lifecycle interfaces |

---

## 📄 License & Corporate Support

Licensed under the **MIT License**.  
Brought to you by **RFID Software India Private Limited**.  
For enterprise RFID middleware, hardware drivers, or custom protocol plugins, visit **[rfidsoftwares.com](https://rfidsoftwares.com)**.
