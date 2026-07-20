<div align="center">

<img src="https://raw.githubusercontent.com/rfidsoftwares/openrfid-simulator/main/assets/logo.svg" alt="OpenRFID Simulator Logo" width="180" />

# `@openrfid/ui`

### Shared React Component Library & Visual Theme Tokens for OpenRFID Simulator

[![npm version](https://img.shields.io/npm/v/@openrfid/ui.svg)](https://www.npmjs.com/package/@openrfid/ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Powered By](https://img.shields.io/badge/Sponsored%20By-RFIDSoftwares.com-0066cc.svg)](https://rfidsoftwares.com)

</div>

---

## 🚀 Overview

`@openrfid/ui` is the shared React component library powering the **OpenRFID Simulator** web SPA console and Tauri desktop application. Built with **React 18**, **Tailwind CSS**, and **Lucide Icons**, it provides accessible dashboard widgets, reader configuration forms, real-time tag scan monitors, and antenna power tuning sliders.

Developed & Maintained by **[RFID Software India Private Limited](https://rfidsoftwares.com)**.

---

## 📦 Installation

```bash
# npm
npm install @openrfid/ui

# pnpm
pnpm add @openrfid/ui
```

---

## 💻 Code Example

```tsx
import React from 'react';
import { StatCard, StatusBadge, Button } from '@openrfid/ui';

export function DashboardOverview() {
  return (
    <div className="grid grid-cols-3 gap-4 p-6">
      <StatCard 
        title="Active Readers" 
        value="4 Online" 
        subtitle="16 Antennas Configured"
      />
      <StatCard 
        title="Read Throughput" 
        value="5,240 / sec" 
        subtitle="Peak Read Cycle Rate"
      />
      <div className="flex items-center gap-2">
        <StatusBadge status="online" label="Engine Active" />
        <Button variant="primary" onClick={() => console.log('Start')}>
          Start Simulation
        </Button>
      </div>
    </div>
  );
}
```

---

## 🌐 Monorepo Ecosystem

| Package | Description |
| :--- | :--- |
| [`@openrfid/shell`](https://www.npmjs.com/package/@openrfid/shell) | Cross-platform application integration shell |
| [`@openrfid/simulator`](https://www.npmjs.com/package/@openrfid/simulator) | High-throughput inventory simulation engine |
| [`@openrfid/core`](https://www.npmjs.com/package/@openrfid/core) | Core EventBus, Config, & SQLite persistence |

---

## 📄 License & Corporate Support

Licensed under the **MIT License**.  
Brought to you by **RFID Software India Private Limited**.  
For enterprise RFID middleware, hardware drivers, or custom protocol plugins, visit **[rfidsoftwares.com](https://rfidsoftwares.com)**.
