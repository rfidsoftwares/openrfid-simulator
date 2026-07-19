---
title: CLI Reference
description: Command reference for the openrfid command line tool.
---

# CLI Reference Guide

The OpenRFID CLI tool (`@openrfid/cli`) provides terminal commands for running headless simulators, setting up configurations, and monitoring MQTT telemetry brokers.

---

## Commands

### 1. `init`
Initializes a new `openrfid.config.json` configuration file in the current working directory.
```bash
pnpm cli init
```

### 2. `simulator`
Starts the headless simulator server. It automatically binds and launches the REST API, WebSocket streams, and Hopeland binary discovery and TCP socket servers.
```bash
pnpm cli simulator [options]
```
* **Options**:
  * `-c, --config <path>`: Path to custom configuration file (default: `openrfid.config.json`).

### 3. `create-reader`
Launches an interactive prompt to define a new virtual reader and saves it to the SQLite storage.
```bash
pnpm cli create-reader [options]
```

### 4. `create-tag`
Generates a batch of virtual tags in the SQLite storage database.
```bash
pnpm cli create-tag [options]
```

### 5. `mqtt`
Launches a CLI telemetry monitor to subscribe to all tag scans published by online readers.
```bash
pnpm cli mqtt [options]
```
* **Options**:
  * `-b, --broker <url>`: MQTT Broker URL (default: `mqtt://localhost:1883`).
