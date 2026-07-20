<div align="center">

<img src="https://raw.githubusercontent.com/rfidsoftwares/openrfid-simulator/main/assets/logo.svg" alt="OpenRFID Simulator Logo" width="180" />

# `@openrfid/gs1`

### GS1 SGTIN-96, GRAI-96, & GIAI-96 Barcode & EPC Tag Encoders/Decoders

[![npm version](https://img.shields.io/npm/v/@openrfid/gs1.svg)](https://www.npmjs.com/package/@openrfid/gs1)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Powered By](https://img.shields.io/badge/Sponsored%20By-RFIDSoftwares.com-0066cc.svg)](https://rfidsoftwares.com)

</div>

---

## 🚀 Overview

`@openrfid/gs1` provides bit-level bidirectional conversion between **GS1 Enterprise Identifiers** (UPC / GTIN barcodes) and **96-bit Gen2 RFID EPC Tag Headers**. It supports **SGTIN-96** (Serialized Global Trade Item Number), **GRAI-96** (Global Returnable Asset Identifier), and **GIAI-96** (Global Individual Asset Identifier) encoding standards across partition tables 0 through 6.

Developed & Maintained by **[RFID Software India Private Limited](https://rfidsoftwares.com)**.

---

## 📦 Installation

```bash
# npm
npm install @openrfid/gs1

# pnpm
pnpm add @openrfid/gs1
```

---

## 💻 Code Example

### 1. Encode GTIN-14 Barcode + Serial to SGTIN-96 EPC Hex
```typescript
import { encodeSgtin96, decodeSgtin96 } from '@openrfid/gs1';

// Convert UPC/GTIN + Serial Number to 96-bit RFID EPC Hex string
const gtin = '00614141000024'; // 14-digit GTIN (Company Prefix: 0614141, Item Ref: 00002)
const serial = 1048576; // Integer serial number
const filterValue = 3;  // Filter 3 = Single Shipping Unit

const epcHex = encodeSgtin96({ gtin, serial, filter: filterValue });
console.log('Generated SGTIN-96 EPC Hex:', epcHex);
// Output: "3034257BF4000B4000100000"
```

### 2. Decode SGTIN-96 EPC Hex to GTIN Barcode
```typescript
import { decodeSgtin96 } from '@openrfid/gs1';

const epcHex = '3034257BF4000B4000100000';
const decoded = decodeSgtin96(epcHex);

console.log('GTIN-14:', decoded.gtin);      // "00614141000024"
console.log('Company Prefix:', decoded.companyPrefix); // "0614141"
console.log('Item Reference:', decoded.itemReference); // "00002"
console.log('Serial Number:', decoded.serial); // 1048576
console.log('Filter Value:', decoded.filter);  // 3
```

---

## 📚 Supported GS1 Standards & Partition Tables

| Standard | Header (Hex) | Description | Use Case |
| :--- | :---: | :--- | :--- |
| **SGTIN-96** | `0x30` | Serialized Global Trade Item Number | Retail, Consumer Goods, Apparel |
| **GRAI-96** | `0x33` | Global Returnable Asset Identifier | Reusable Pallets, Cages, Containers |
| **GIAI-96** | `0x34` | Global Individual Asset Identifier | Fixed Capital Assets, Medical Devices |

---

## 🌐 Monorepo Ecosystem

| Package | Description |
| :--- | :--- |
| [`@openrfid/epc`](https://www.npmjs.com/package/@openrfid/epc) | Bit-level EPC Gen2 memory bank encoders/decoders |
| [`@openrfid/tags`](https://www.npmjs.com/package/@openrfid/tags) | RFID tag domain models & memory generator |
| [`@openrfid/simulator`](https://www.npmjs.com/package/@openrfid/simulator) | High-throughput inventory simulation engine |

---

## 📄 License & Corporate Support

Licensed under the **MIT License**.  
Brought to you by **RFID Software India Private Limited**.  
For enterprise RFID middleware, hardware drivers, or custom protocol plugins, visit **[rfidsoftwares.com](https://rfidsoftwares.com)**.
