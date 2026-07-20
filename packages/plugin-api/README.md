<div align="center">

<img src="https://raw.githubusercontent.com/rfidsoftwares/openrfid-simulator/main/assets/logo.svg" alt="OpenRFID Simulator Logo" width="180" />

# `@openrfid/plugin-api`

### Hot-Swappable Plugin Lifecycle Interfaces & Extensibility Sandbox

[![npm version](https://img.shields.io/npm/v/@openrfid/plugin-api.svg)](https://www.npmjs.com/package/@openrfid/plugin-api)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Powered By](https://img.shields.io/badge/Sponsored%20By-RFIDSoftwares.com-0066cc.svg)](https://rfidsoftwares.com)

</div>

---

## 🚀 Overview

`@openrfid/plugin-api` defines the standard plugin lifecycle interfaces, hook contracts, and registration sandbox for building custom protocol adapters, data formatters, and network transport extensions for **OpenRFID Simulator**.

Developed & Maintained by **[RFID Software India Private Limited](https://rfidsoftwares.com)**.

---

## 📦 Installation

```bash
# npm
npm install @openrfid/plugin-api

# pnpm
pnpm add @openrfid/plugin-api
```

---

## 💻 Code Example: Writing a Custom Protocol Plugin

```typescript
import { BasePlugin, PluginContext, TagDetectedEvent } from '@openrfid/plugin-api';

export class CustomUdpPlugin extends BasePlugin {
  readonly id = 'custom-udp-plugin';
  readonly name = 'Custom UDP Protocol Adapter';
  readonly version = '1.0.0';

  async onInit(context: PluginContext): Promise<void> {
    console.log('Initializing Custom UDP Plugin...');
    
    // Subscribe to tag detection events
    context.eventBus.on('TagDetected', (event: TagDetectedEvent) => {
      this.handleTagDetected(event);
    });
  }

  async onStart(): Promise<void> {
    console.log('Custom UDP Plugin Started!');
  }

  async onStop(): Promise<void> {
    console.log('Custom UDP Plugin Stopped.');
  }

  private handleTagDetected(event: TagDetectedEvent): void {
    // Custom binary network packet encoding
    console.log(`[UDP] Sending payload for EPC: ${event.epc}`);
  }
}
```

---

## 📚 Lifecycle Hooks

| Lifecycle Method | Description |
| :--- | :--- |
| `onInit(context)` | Called when plugin is registered; provides EventBus, Config, & DI container |
| `onStart()` | Called when simulation engine starts running |
| `onStop()` | Called during simulation shutdown to release network sockets/ports |
| `onDestroy()` | Cleanup resources before plugin removal |

---

## 🌐 Monorepo Ecosystem

| Package | Description |
| :--- | :--- |
| [`@openrfid/simulator`](https://www.npmjs.com/package/@openrfid/simulator) | High-throughput inventory simulation engine |
| [`@openrfid/core`](https://www.npmjs.com/package/@openrfid/core) | Core EventBus, Config, & SQLite persistence |
| [`@openrfid/rest`](https://www.npmjs.com/package/@openrfid/rest) | Fastify REST API plugin |
| [`@openrfid/mqtt`](https://www.npmjs.com/package/@openrfid/mqtt) | MQTT IoT publisher plugin |

---

## 📄 License & Corporate Support

Licensed under the **MIT License**.  
Brought to you by **RFID Software India Private Limited**.  
For enterprise RFID middleware, hardware drivers, or custom protocol plugins, visit **[rfidsoftwares.com](https://rfidsoftwares.com)**.
