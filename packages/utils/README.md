<div align="center">

<img src="https://raw.githubusercontent.com/rfidsoftwares/openrfid-simulator/main/assets/logo.svg" alt="OpenRFID Simulator Logo" width="180" />

# `@openrfid/utils`

### Math Probability Distributions, Network Helpers, & Bitwise Utilities

[![npm version](https://img.shields.io/npm/v/@openrfid/utils.svg)](https://www.npmjs.com/package/@openrfid/utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Powered By](https://img.shields.io/badge/Sponsored%20By-RFIDSoftwares.com-0066cc.svg)](https://rfidsoftwares.com)

</div>

---

## 🚀 Overview

`@openrfid/utils` provides shared mathematical algorithms, statistical probability distributions (Gaussian, Uniform, Exponential), RSSI signal loss calculators, bitwise padding, and network address validation helpers for **OpenRFID Simulator**.

Developed & Maintained by **[RFID Software India Private Limited](https://rfidsoftwares.com)**.

---

## 📦 Installation

```bash
# npm
npm install @openrfid/utils

# pnpm
pnpm add @openrfid/utils
```

---

## 💻 Code Example

### 1. Gaussian RSSI Signal Noise Generator
```typescript
import { generateGaussianNoise, hexToBinary, binaryToHex } from '@openrfid/utils';

// Generate simulated RSSI noise around mean of -55 dBm (stdDev = 3.5)
const simulatedRssi = generateGaussianNoise({ mean: -55.0, stdDev: 3.5 });
console.log(`Calculated RSSI: ${simulatedRssi.toFixed(2)} dBm`);

// Bitwise Conversions
const binary = hexToBinary('3034');
console.log('Binary:', binary); // "0011000000110100"
const hex = binaryToHex(binary);
console.log('Hex:', hex); // "3034"
```

---

## 🌐 Monorepo Ecosystem

| Package | Description |
| :--- | :--- |
| [`@openrfid/core`](https://www.npmjs.com/package/@openrfid/core) | Core EventBus, Config, & SQLite persistence |
| [`@openrfid/epc`](https://www.npmjs.com/package/@openrfid/epc) | Bit-level EPC Gen2 memory bank encoders/decoders |
| [`@openrfid/simulator`](https://www.npmjs.com/package/@openrfid/simulator) | High-throughput inventory simulation engine |

---

## 📄 License & Corporate Support

Licensed under the **MIT License**.  
Brought to you by **RFID Software India Private Limited**.  
For enterprise RFID middleware, hardware drivers, or custom protocol plugins, visit **[rfidsoftwares.com](https://rfidsoftwares.com)**.
