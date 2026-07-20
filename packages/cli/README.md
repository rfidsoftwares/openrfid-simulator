<div align="center">

<img src="https://raw.githubusercontent.com/rfidsoftwares/openrfid-simulator/main/assets/logo.svg" alt="OpenRFID Simulator Logo" width="180" />

# `@openrfid/cli`

### Headless Command-Line Interface & CI/CD Runner for OpenRFID Simulator

[![npm version](https://img.shields.io/npm/v/@openrfid/cli.svg)](https://www.npmjs.com/package/@openrfid/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Powered By](https://img.shields.io/badge/Sponsored%20By-RFIDSoftwares.com-0066cc.svg)](https://rfidsoftwares.com)

</div>

---

## 🚀 Overview

`@openrfid/cli` is the zero-dependency headless command-line interface for the **OpenRFID Simulator** ecosystem. It enables developers, QA automation engineers, and DevOps pipelines to spin up virtual RFID readers, start tag inventory generation cycles, and expose simulated REST/WebSocket/MQTT interfaces directly from terminal or CI/CD scripts.

Developed & Maintained by **[RFID Software India Private Limited](https://rfidsoftwares.com)**.

---

## 📦 Installation

```bash
# Global installation via npm
npm install -g @openrfid/cli

# Or run instantly without installation using npx
npx @openrfid/cli simulator start
```

---

## ⚡ Quickstart & CLI Commands

### 1. Start Headless Simulation Server
```bash
npx @openrfid/cli simulator start --port 3100 --websocket 3101
```

### 2. Generate Tag Pool
```bash
npx @openrfid/cli tags generate --count 500 --format sgtin-96 --output tags.json
```

### 3. Add Virtual Reader Instance
```bash
npx @openrfid/cli reader add --name "Warehouse-Gate-1" --antennas 4 --power 30
```

---

## 🧪 CI/CD Integration (GitHub Actions)

Add OpenRFID Simulator directly to your automated integration test pipelines:

```yaml
steps:
  - name: Launch OpenRFID Simulation Server
    run: npx @openrfid/cli simulator start --detach

  - name: Run Enterprise App Integration Tests
    run: npm test
```

---

## 🌐 Monorepo Ecosystem

| Package | Description |
| :--- | :--- |
| [`@openrfid/core`](https://www.npmjs.com/package/@openrfid/core) | Core EventBus, Config, & SQLite persistence |
| [`@openrfid/simulator`](https://www.npmjs.com/package/@openrfid/simulator) | High-throughput inventory simulation engine |
| [`@openrfid/epc`](https://www.npmjs.com/package/@openrfid/epc) | EPC Gen2 memory bank encoders & decoders |
| [`@openrfid/gs1`](https://www.npmjs.com/package/@openrfid/gs1) | GS1 SGTIN-96, GRAI-96, GIAI-96 encoders |

---

## 📄 License & Corporate Support

Licensed under the **MIT License**.  
Brought to you by **RFID Software India Private Limited**.  
For enterprise RFID middleware, hardware drivers, or custom protocol plugins, visit **[rfidsoftwares.com](https://rfidsoftwares.com)**.
