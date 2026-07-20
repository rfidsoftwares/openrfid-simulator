<div align="center">

<img src="https://raw.githubusercontent.com/rfidsoftwares/openrfid-simulator/main/assets/logo.svg" alt="OpenRFID Simulator Logo" width="180" />

# `@openrfid/readers`

### Virtual RFID Reader & Multi-Antenna Hardware Engine

[![npm version](https://img.shields.io/npm/v/@openrfid/readers.svg)](https://www.npmjs.com/package/@openrfid/readers)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Powered By](https://img.shields.io/badge/Sponsored%20By-RFIDSoftwares.com-0066cc.svg)](https://rfidsoftwares.com)

</div>

---

## 🚀 Overview

`@openrfid/readers` models virtual RFID readers, multi-port antenna configurations (1 to 16 ports per reader), Tx Power tuning (0 to 30 dBm), Antenna Gain (dBi), and RSSI signal attenuation calculations for the **OpenRFID Simulator** ecosystem.

Developed & Maintained by **[RFID Software India Private Limited](https://rfidsoftwares.com)**.

---

## 📦 Installation

```bash
# npm
npm install @openrfid/readers

# pnpm
pnpm add @openrfid/readers
```

---

## 💻 Code Example

### 1. Create and Configure Virtual Reader Hardware
```typescript
import { ReaderModel, ReaderStatus } from '@openrfid/readers';

// Instantiate 4-antenna warehouse gate reader
const reader = new ReaderModel({
  id: 'READER-GATE-01',
  name: 'North Warehouse Dock Gate',
  ipAddress: '192.168.1.150',
  commandPort: 9090,
  antennas: [
    { portNumber: 1, enabled: true, powerDbm: 30, gainDbi: 6.0 },
    { portNumber: 2, enabled: true, powerDbm: 30, gainDbi: 6.0 },
    { portNumber: 3, enabled: true, powerDbm: 27, gainDbi: 6.0 },
    { portNumber: 4, enabled: false, powerDbm: 0, gainDbi: 0 }
  ]
});

console.log('Reader Status:', reader.status); // ReaderStatus.OFFLINE
reader.startInventory();
console.log('Reader Status:', reader.status); // ReaderStatus.INVENTORYING
```

---

## 📚 API Reference

| Export | Type | Description |
| :--- | :--- | :--- |
| `ReaderModel` | Class | Manages virtual reader hardware state, antenna ports, and IP bindings |
| `ReaderStatus` | Enum | Reader states (`OFFLINE`, `ONLINE`, `INVENTORYING`, `FAULT`) |
| `AntennaPortConfig` | Interface | Antenna configuration attributes (port, power, gain, RSSI offset) |

---

## 🌐 Monorepo Ecosystem

| Package | Description |
| :--- | :--- |
| [`@openrfid/simulator`](https://www.npmjs.com/package/@openrfid/simulator) | High-throughput inventory simulation engine |
| [`@openrfid/tags`](https://www.npmjs.com/package/@openrfid/tags) | RFID tag domain models & memory generator |
| [`@openrfid/core`](https://www.npmjs.com/package/@openrfid/core) | Core EventBus, Config, & SQLite persistence |

---

## 📄 License & Corporate Support

Licensed under the **MIT License**.  
Brought to you by **RFID Software India Private Limited**.  
For enterprise RFID middleware, hardware drivers, or custom protocol plugins, visit **[rfidsoftwares.com](https://rfidsoftwares.com)**.
