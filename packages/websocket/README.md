<div align="center">

<img src="https://raw.githubusercontent.com/rfidsoftwares/openrfid-simulator/main/assets/logo.svg" alt="OpenRFID Simulator Logo" width="180" />

# `@openrfid/websocket`

### Sub-10ms Real-Time WebSocket Tag Stream Broadcaster Plugin

[![npm version](https://img.shields.io/npm/v/@openrfid/websocket.svg)](https://www.npmjs.com/package/@openrfid/websocket)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Powered By](https://img.shields.io/badge/Sponsored%20By-RFIDSoftwares.com-0066cc.svg)](https://rfidsoftwares.com)

</div>

---

## 🚀 Overview

`@openrfid/websocket` is the real-time streaming protocol plugin for **OpenRFID Simulator**. It creates a low-latency WebSocket server (`ws://localhost:3101`) that streams sub-10ms JSON tag detection events directly to web SPA consoles, mobile apps, or enterprise event monitoring dashboards.

Developed & Maintained by **[RFID Software India Private Limited](https://rfidsoftwares.com)**.

---

## 📦 Installation

```bash
# npm
npm install @openrfid/websocket

# pnpm
pnpm add @openrfid/websocket
```

---

## 💻 Code Example

### 1. Register WebSocket Broadcaster Plugin
```typescript
import { SimulationEngine } from '@openrfid/simulator';
import { WebSocketPlugin } from '@openrfid/websocket';

const engine = new SimulationEngine();

// Instantiate WebSocket Broadcaster plugin on port 3101
const wsPlugin = new WebSocketPlugin({
  port: 3101,
  path: '/ws/tags'
});

await engine.pluginManager.registerPlugin(wsPlugin);
await engine.start();

console.log('WebSocket Broadcaster active on ws://localhost:3101/ws/tags');
```

### 2. Connect from Client Browser
```javascript
const socket = new WebSocket('ws://localhost:3101/ws/tags');

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Tag Detection Event:', data.epc, 'RSSI:', data.rssi);
};
```

---

## 🌐 Monorepo Ecosystem

| Package | Description |
| :--- | :--- |
| [`@openrfid/plugin-api`](https://www.npmjs.com/package/@openrfid/plugin-api) | Plugin lifecycle interfaces & sandbox manager |
| [`@openrfid/rest`](https://www.npmjs.com/package/@openrfid/rest) | Fastify REST API plugin |
| [`@openrfid/mqtt`](https://www.npmjs.com/package/@openrfid/mqtt) | MQTT IoT publisher plugin |

---

## 📄 License & Corporate Support

Licensed under the **MIT License**.  
Brought to you by **RFID Software India Private Limited**.  
For enterprise RFID middleware, hardware drivers, or custom protocol plugins, visit **[rfidsoftwares.com](https://rfidsoftwares.com)**.
