<div align="center">

<img src="https://raw.githubusercontent.com/rfidsoftwares/openrfid-simulator/main/assets/logo.svg" alt="OpenRFID Simulator Logo" width="180" />

# `@openrfid/tags`

### RFID Tag Domain Models, Bulk Tag Pool Generator & Memory Bank Inspector

[![npm version](https://img.shields.io/npm/v/@openrfid/tags.svg)](https://www.npmjs.com/package/@openrfid/tags)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Powered By](https://img.shields.io/badge/Sponsored%20By-RFIDSoftwares.com-0066cc.svg)](https://rfidsoftwares.com)

</div>

---

## 🚀 Overview

`@openrfid/tags` provides domain models and bulk generation algorithms for RFID tags in **OpenRFID Simulator**. It supports generating bulk tag pools via **Sequential Hex**, **Random Hex**, or **GS1 SGTIN-96 Barcodes**, complete with memory bank inspection (Reserved, EPC, TID, User) and RSSI signal calibration.

Developed & Maintained by **[RFID Software India Private Limited](https://rfidsoftwares.com)**.

---

## 📦 Installation

```bash
# npm
npm install @openrfid/tags

# pnpm
pnpm add @openrfid/tags
```

---

## 💻 Code Example

### 1. Generate Bulk Tag Pool
```typescript
import { TagGenerator } from '@openrfid/tags';

// Generate 500 SGTIN-96 GS1 Barcode RFID tags
const tagPool = TagGenerator.generatePool({
  count: 500,
  format: 'sgtin-96',
  companyPrefix: '0614141',
  itemReference: '00002',
  startSerial: 1000
});

console.log(`Generated ${tagPool.length} tags.`);
console.log('Sample Tag EPC:', tagPool[0].epc);
```

### 2. Inspect Tag Memory Banks
```typescript
import { TagModel } from '@openrfid/tags';

const tag = new TagModel({
  epc: 'E28011700000020C3C9101AB',
  tid: 'E2801105200070123456789A',
  userMemory: '0000000000000000'
});

console.log('Tag EPC:', tag.getEpc());
console.log('Tag TID:', tag.getTid());
```

---

## 🌐 Monorepo Ecosystem

| Package | Description |
| :--- | :--- |
| [`@openrfid/epc`](https://www.npmjs.com/package/@openrfid/epc) | Bit-level EPC Gen2 memory bank encoders/decoders |
| [`@openrfid/gs1`](https://www.npmjs.com/package/@openrfid/gs1) | GS1 SGTIN-96, GRAI-96, GIAI-96 encoders |
| [`@openrfid/simulator`](https://www.npmjs.com/package/@openrfid/simulator) | High-throughput inventory simulation engine |

---

## 📄 License & Corporate Support

Licensed under the **MIT License**.  
Brought to you by **RFID Software India Private Limited**.  
For enterprise RFID middleware, hardware drivers, or custom protocol plugins, visit **[rfidsoftwares.com](https://rfidsoftwares.com)**.
