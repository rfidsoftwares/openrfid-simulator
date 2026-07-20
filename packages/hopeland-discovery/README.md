<div align="center">

<img src="https://raw.githubusercontent.com/rfidsoftwares/openrfid-simulator/main/assets/logo.svg" alt="OpenRFID Simulator Logo" width="180" />

# `@openrfid/hopeland-discovery`

### Hopeland / Identium UDP Multicast Discovery & TCP Command Server Protocol Plugin

[![npm version](https://img.shields.io/npm/v/@openrfid/hopeland-discovery.svg)](https://www.npmjs.com/package/@openrfid/hopeland-discovery)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Powered By](https://img.shields.io/badge/Sponsored%20By-RFIDSoftwares.com-0066cc.svg)](https://rfidsoftwares.com)

</div>

---

## 🚀 Overview

`@openrfid/hopeland-discovery` is an industrial hardware protocol plugin for **OpenRFID Simulator**. It emulates **Hopeland** and **Identium** RFID reader communication protocols, including **UDP Multicast Auto-Discovery** (`230.1.1.116:9091`) and **TCP Binary Command Servers** (`port 9090`). It enables enterprise software built against official C# or Java Hopeland SDKs (`MyReaderAPI.dll`) to seamlessly discover and connect to virtual simulated readers.

Developed & Maintained by **[RFID Software India Private Limited](https://rfidsoftwares.com)**.

---

## 📦 Installation

```bash
# npm
npm install @openrfid/hopeland-discovery

# pnpm
pnpm add @openrfid/hopeland-discovery
```

---

## 💻 Code Example

### 1. Register Plugin into OpenRFID Simulator Instance
```typescript
import { SimulationEngine } from '@openrfid/simulator';
import { HopelandDiscoveryPlugin } from '@openrfid/hopeland-discovery';

const engine = new SimulationEngine();

// Instantiate Hopeland discovery plugin (UDP 9091 + TCP 9090)
const hopelandPlugin = new HopelandDiscoveryPlugin({
  multicastAddress: '230.1.1.116',
  multicastPort: 9091,
  commandPort: 9090,
  readerMac: '00:0E:C6:8A:12:34',
  readerIp: '192.168.1.100'
});

// Register plugin into simulation lifecycle
await engine.pluginManager.registerPlugin(hopelandPlugin);
await engine.start();

console.log('Hopeland Discovery Plugin active on UDP 230.1.1.116:9091 and TCP 9090');
```

---

## 📡 Protocol Details

* **UDP Multicast Beacon**: Broadcasts periodic JSON payload on `230.1.1.116:9091` containing reader MAC, IP address, firmware version, and online status.
* **TCP Server Command Protocol**: Listens on `port 9090` for binary packet framing: `0xA0` (Header), Payload Length, Command Code, and Checksum validation.

---

## 🌐 Monorepo Ecosystem

| Package | Description |
| :--- | :--- |
| [`@openrfid/plugin-api`](https://www.npmjs.com/package/@openrfid/plugin-api) | Plugin lifecycle interfaces & sandbox manager |
| [`@openrfid/simulator`](https://www.npmjs.com/package/@openrfid/simulator) | High-throughput inventory simulation engine |
| [`@openrfid/readers`](https://www.npmjs.com/package/@openrfid/readers) | Virtual reader hardware and antenna models |

---

## 📄 License & Corporate Support

Licensed under the **MIT License**.  
Brought to you by **RFID Software India Private Limited**.  
For enterprise RFID middleware, hardware drivers, or custom protocol plugins, visit **[rfidsoftwares.com](https://rfidsoftwares.com)**.
