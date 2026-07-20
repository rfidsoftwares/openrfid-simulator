<div align="center">

<img src="https://raw.githubusercontent.com/rfidsoftwares/openrfid-simulator/main/assets/logo.svg" alt="OpenRFID Simulator Logo" width="180" />

# `@openrfid/mqtt`

### MQTT IoT Broker Publisher & Telemetry Protocol Plugin for OpenRFID Simulator

[![npm version](https://img.shields.io/npm/v/@openrfid/mqtt.svg)](https://www.npmjs.com/package/@openrfid/mqtt)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Powered By](https://img.shields.io/badge/Sponsored%20By-RFIDSoftwares.com-0066cc.svg)](https://rfidsoftwares.com)

</div>

---

## 🚀 Overview

`@openrfid/mqtt` is an IoT protocol plugin for **OpenRFID Simulator**. It connects virtual simulated RFID readers to local or cloud MQTT brokers (e.g. EMQX, Mosquitto, AWS IoT Core, HiveMQ), publishing real-time tag scan telemetry and health diagnostics to structured MQTT topics (`openrfid/readers/{readerId}/tags`).

Developed & Maintained by **[RFID Software India Private Limited](https://rfidsoftwares.com)**.

---

## 📦 Installation

```bash
# npm
npm install @openrfid/mqtt

# pnpm
pnpm add @openrfid/mqtt
```

---

## 💻 Code Example

### 1. Register MQTT Publisher Plugin
```typescript
import { SimulationEngine } from '@openrfid/simulator';
import { MqttPlugin } from '@openrfid/mqtt';

const engine = new SimulationEngine();

// Configure MQTT Plugin
const mqttPlugin = new MqttPlugin({
  brokerUrl: 'mqtt://localhost:1883',
  topicPrefix: 'openrfid/telemetry',
  clientId: 'openrfid-sim-01',
  qos: 1
});

// Register plugin into simulation lifecycle
await engine.pluginManager.registerPlugin(mqttPlugin);
await engine.start();

console.log('MQTT Plugin publishing tag telemetry to mqtt://localhost:1883');
```

---

## 📡 MQTT Topic Structure & JSON Payload

### Published Topic: `openrfid/telemetry/readers/{readerId}/tags`

```json
{
  "epc": "E28011700000020C3C9101AB",
  "readerId": "GATE-WAREHOUSE-01",
  "antennaPort": 1,
  "rssi": -58.5,
  "readCount": 14,
  "timestamp": 1721473200000
}
```

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
