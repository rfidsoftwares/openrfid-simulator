<div align="center">

<img src="https://raw.githubusercontent.com/rfidsoftwares/openrfid-simulator/main/assets/logo.svg" alt="OpenRFID Simulator Logo" width="180" />

# `@openrfid/rest`

### Fastify REST API Plugin for OpenRFID Simulator

[![npm version](https://img.shields.io/npm/v/@openrfid/rest.svg)](https://www.npmjs.com/package/@openrfid/rest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Powered By](https://img.shields.io/badge/Sponsored%20By-RFIDSoftwares.com-0066cc.svg)](https://rfidsoftwares.com)

</div>

---

## 🚀 Overview

`@openrfid/rest` is the official Fastify HTTP REST API plugin for **OpenRFID Simulator**. It exposes RESTful endpoints (`/api/v1/readers`, `/api/v1/tags`, `/api/v1/simulation`, `/api/v1/events`) for programmatically starting/stopping simulations, managing virtual readers, and querying scan history.

Developed & Maintained by **[RFID Software India Private Limited](https://rfidsoftwares.com)**.

---

## 📦 Installation

```bash
# npm
npm install @openrfid/rest

# pnpm
pnpm add @openrfid/rest
```

---

## 💻 Code Example

```typescript
import { SimulationEngine } from '@openrfid/simulator';
import { RestPlugin } from '@openrfid/rest';

const engine = new SimulationEngine();

// Instantiate Fastify REST API plugin on port 3000
const restPlugin = new RestPlugin({
  port: 3000,
  host: '0.0.0.0',
  cors: true
});

await engine.pluginManager.registerPlugin(restPlugin);
await engine.start();

console.log('REST API server listening at http://localhost:3000/api/v1');
```

---

## 📡 REST API Endpoint Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | System health check & memory usage |
| `GET` | `/api/v1/readers` | List all configured virtual readers |
| `POST` | `/api/v1/readers` | Create a new virtual reader instance |
| `GET` | `/api/v1/tags` | Retrieve active tag inventory pool |
| `POST` | `/api/v1/simulation/start` | Trigger simulation inventory loop |
| `POST` | `/api/v1/simulation/stop` | Pause active inventory simulation |
| `GET` | `/api/v1/events/recent` | Query recent tag scan events |

---

## 🌐 Monorepo Ecosystem

| Package | Description |
| :--- | :--- |
| [`@openrfid/plugin-api`](https://www.npmjs.com/package/@openrfid/plugin-api) | Plugin lifecycle interfaces & sandbox manager |
| [`@openrfid/simulator`](https://www.npmjs.com/package/@openrfid/simulator) | High-throughput inventory simulation engine |
| [`@openrfid/websocket`](https://www.npmjs.com/package/@openrfid/websocket) | WebSocket real-time tag stream broadcaster |

---

## 📄 License & Corporate Support

Licensed under the **MIT License**.  
Brought to you by **RFID Software India Private Limited**.  
For enterprise RFID middleware, hardware drivers, or custom protocol plugins, visit **[rfidsoftwares.com](https://rfidsoftwares.com)**.
