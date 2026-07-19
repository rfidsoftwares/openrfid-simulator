---
title: Quickstart Guide
description: Quick setup guide for OpenRFID Simulator.
---

# Quickstart Guide

This guide will help you set up and run OpenRFID Simulator in your local environment.

## 1. Web Console Developer Setup

To run the simulator locally in web development mode:

1. **Clone the repository** and navigate to the project directory:
   ```bash
   cd open-rfid-simulator
   ```
2. **Install dependencies**:
   ```bash
   pnpm install
   ```
3. **Start the Developer Console & background runner**:
   ```bash
   pnpm dev
   ```
4. Open [http://localhost:5173/](http://localhost:5173/) in your browser to access the control panel.

---

## 2. Desktop Application Installation

If you compiled the standalone native Windows installers:

1. **Locate the Installer**:
   * MSI Setup: `apps/desktop/src-tauri/target/release/bundle/msi/OpenRFID Simulator_1.0.0_x64_en-US.msi`
   * NSIS Executable: `apps/desktop/src-tauri/target/release/bundle/nsis/OpenRFID Simulator_1.0.0_x64-setup.exe`
2. **Double-click to install** and follow the setup wizard prompts.
3. **Launch the application** from your Desktop shortcut or Start Menu. All services and network sidecars launch automatically.

---

## 3. Command Line Interface (CLI)

The CLI tool allows you to initialize simulator environments and run headless servers:

1. **Initialize Config**:
   ```bash
   pnpm cli init
   ```
2. **Start Headless Simulator Server**:
   ```bash
   pnpm cli simulator
   ```
3. **Interact & Generate Mock Data**:
   * Create Reader: `pnpm cli create-reader`
   * Create Tags: `pnpm cli create-tag`
