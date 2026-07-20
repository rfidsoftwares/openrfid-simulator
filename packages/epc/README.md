<div align="center">

<img src="https://raw.githubusercontent.com/rfidsoftwares/openrfid-simulator/main/assets/logo.svg" alt="OpenRFID Simulator Logo" width="180" />

# `@openrfid/epc`

### Bit-Level EPC Gen2 Memory Bank Encoders, Decoders & PC Bit Utilities

[![npm version](https://img.shields.io/npm/v/@openrfid/epc.svg)](https://www.npmjs.com/package/@openrfid/epc)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Powered By](https://img.shields.io/badge/Sponsored%20By-RFIDSoftwares.com-0066cc.svg)](https://rfidsoftwares.com)

</div>

---

## 🚀 Overview

`@openrfid/epc` is a specialized bit-level encoding and decoding library for **EPCglobal Class-1 Generation-2 (ISO/IEC 18000-6C)** RFID tags. It provides memory bank modeling (Reserved, EPC, TID, User), Protocol Control (PC) word parsing, bitwise mask operations, and binary/hexadecimal conversions.

Developed & Maintained by **[RFID Software India Private Limited](https://rfidsoftwares.com)**.

---

## 📦 Installation

```bash
# npm
npm install @openrfid/epc

# pnpm
pnpm add @openrfid/epc
```

---

## 💻 Code Example

### 1. Decoding EPC Memory & Protocol Control (PC) Word
```typescript
import { EpcDecoder, parseProtocolControl } from '@openrfid/epc';

// Parse 16-bit Protocol Control Word (e.g. 0x3000 -> 96-bit EPC length)
const pcWord = 0x3000;
const pcInfo = parseProtocolControl(pcWord);

console.log('EPC Length (bits):', pcInfo.epcLengthBits); // 96
console.log('Toggle Bit (UMI):', pcInfo.userMemoryIndicator); // false
console.log('Toggle Bit (XI):', pcInfo.extendedHeaderIndicator); // false

// Validate hex EPC string
const rawEpc = 'E28011700000020C3C9101AB';
const isChecksumValid = EpcDecoder.validateHex(rawEpc);
console.log('Valid EPC Hex:', isChecksumValid);
```

### 2. Modeling Full EPC Gen2 Tag Memory
```typescript
import { TagMemoryBanks } from '@openrfid/epc';

const tagMemory = new TagMemoryBanks({
  reserved: '0000000000000000', // Kill (32b) + Access (32b) Passwords
  epc: 'E28011700000020C3C9101AB',  // 96-bit EPC Hex
  tid: 'E2801105200070123456789A',  // Impinj Monza R6 TID
  user: '00000000'                 // Custom User Memory
});

console.log('EPC Bank (Bank 1):', tagMemory.getEpc());
console.log('TID Bank (Bank 2):', tagMemory.getTid());
```

---

## 📚 API Reference

| Export | Description |
| :--- | :--- |
| `EpcEncoder` | Utility class for encoding bitstream payloads into Hex EPC strings |
| `EpcDecoder` | Utility class for parsing and validating Hex EPC payloads |
| `parseProtocolControl(pc)` | Parses Gen2 16-bit PC word into EPC length, UMI, XI, and ISO flags |
| `TagMemoryBanks` | Data structure modeling Gen2 Memory Bank 0 (Reserved), 1 (EPC), 2 (TID), 3 (User) |

---

## 🌐 Monorepo Ecosystem

| Package | Description |
| :--- | :--- |
| [`@openrfid/gs1`](https://www.npmjs.com/package/@openrfid/gs1) | GS1 SGTIN-96, GRAI-96, GIAI-96 encoders |
| [`@openrfid/tags`](https://www.npmjs.com/package/@openrfid/tags) | RFID tag domain models & memory generator |
| [`@openrfid/simulator`](https://www.npmjs.com/package/@openrfid/simulator) | High-throughput inventory simulation engine |

---

## 📄 License & Corporate Support

Licensed under the **MIT License**.  
Brought to you by **RFID Software India Private Limited**.  
For enterprise RFID middleware, hardware drivers, or custom protocol plugins, visit **[rfidsoftwares.com](https://rfidsoftwares.com)**.
