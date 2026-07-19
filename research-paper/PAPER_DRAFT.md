# A Modular Open-Source RFID Simulation Framework for Developer Testing, Education, and Protocol Research

**Authors**: OpenRFID Simulator Engineering Team  
**Organization**: RFID Software India Private Limited — [https://rfidsoftwares.com](https://rfidsoftwares.com)  
**License**: MIT License  
**Repository**: [https://github.com/openrfid/openrfid-simulator](https://github.com/openrfid/openrfid-simulator)

---

## Abstract

Radio Frequency Identification (RFID) technology is a critical pillar of modern Internet of Things (IoT), industrial automation, supply chain logistics, and asset tracking systems. However, developing, testing, and teaching RFID applications remains bottlenecked by high hardware costs, complex reader protocol configurations, and the lack of lightweight, maintainable simulation software. Existing simulation tools are either unmaintained legacy Java frameworks, narrow network-layer physical simulators, or proprietary vendor-locked solutions. 

In this paper, we present **OpenRFID Simulator**, a modern, open-source, modular simulation framework designed for full-stack RFID developer testing, educational instruction, and protocol research. Built on a high-performance TypeScript monorepo architecture, the framework features a decoupled simulation engine capable of generating over 5,000 tag reads per second, a bit-level EPC Gen2 and GS1 standards encoder/decoder, a hot-swappable plugin pipeline supporting REST, WebSocket, and MQTT protocols, and cross-platform access via CLI, Web SPA, and native desktop applications. We demonstrate the framework's evaluation metrics, educational utility, automated CI/CD integration, and outline a long-term research roadmap incorporating RF physics modeling, visual spatial floorplans, and LLM-driven scenario generation.

---

## I. Introduction

Radio Frequency Identification (RFID) systems enable non-line-of-sight, automated identification of physical assets across enterprise supply chains, healthcare facilities, and smart retail stores. Despite widespread adoption, software developers creating RFID-enabled enterprise applications (e.g., Warehouse Management Systems, Asset Trackers, Access Control Systems) face significant friction during development and automated testing:

1. **Hardware Acquisition & Deployment Costs**: Enterprise RFID readers (e.g., Impinj, Zebra, Alien) and multi-antenna configurations require substantial upfront capital investment ($1,500–$5,000 per read point).
2. **Environment & Physical Constraints**: Testing edge cases—such as bulk inventory cycles with 10,000+ tags, rapid tag movement, or signal degradation—requires physical space, tag inventory setup, and manual movement scripts.
3. **Automated CI/CD Gaps**: Enterprise software teams cannot easily run integration test suites in cloud CI/CD runners (e.g., GitHub Actions) without virtualized RFID hardware emulators.
4. **Educational Barriers**: University IoT and embedded systems courses lack modern, interactive tools to teach tag memory structures (EPC Gen2 memory banks) and bit-level encoding algorithms (SGTIN-96, GRAI-96).

To solve these challenges, we introduce **OpenRFID Simulator**, an open-source, modular simulation suite designed to virtualize RFID readers, antennas, tag memory banks, and multi-protocol network interfaces.

---

## II. Related Work & Comparative Analysis

Prior work in RFID simulation generally falls into three categories:

| Simulator | Architecture | Protocols Supported | Extensibility | Active Maintenance | Platform Accessibility |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **Rifidi Emulator** | Monolithic Java / OSGi | LLRP, Alien, Symbol | XML Plugins | ❌ Discontinued | Desktop App |
| **NS-3 RFID Module** | C++ Discrete Event | MAC / PHY Layer | C++ Modules | ⚠️ Low | Command Line |
| **Gazebo RFID Plugin** | C++ 3D Robotics | Distance-based RSSI | C++ ROS Plugins | ⚠️ Maintenance | Linux / ROS |
| **Proprietary Vendor Tools** | Vendor Binaries | Single Proprietary API | Fixed / Closed | ⚠️ Proprietary | OS-specific |
| **OpenRFID Simulator (Ours)** | **Modular TypeScript Monorepo** | **REST, WebSocket, MQTT, EPC Gen2, GS1** | **TypeScript Plugin API** | **✅ Active (v1.0 MVP)** | **CLI, Web SPA, Desktop, CI/CD** |

Unlike previous solutions, OpenRFID Simulator separates the simulation state machine from the transport protocols, allowing developers to execute headless in Node.js, run inside CI/CD pipelines, or interact visually through modern desktop and web interfaces.

---

## III. System Architecture & Design (Phases 1–5 Implementation)

OpenRFID Simulator is organized as a Turborepo-managed TypeScript monorepo with 14 modular packages and 3 application targets.

```
                  ┌─────────────────────────────────────────┐
                  │   User Interfaces & Access Points       │
                  │  CLI  │  Web SPA  │ Desktop │ Docs Site │
                  └────────────────────┬────────────────────┘
                                       │
                  ┌────────────────────▼────────────────────┐
                  │     Plugin & Transport System           │
                  │   REST API  │  WebSocket  │ MQTT Broker │
                  └────────────────────┬────────────────────┘
                                       │
                  ┌────────────────────▼────────────────────┐
                  │    Core Simulation & Event Engine       │
                  │  Simulator │ Reader Engine │ Tag Engine │
                  └────────────────────┬────────────────────┘
                                       │
                  ┌────────────────────▼────────────────────┐
                  │      Domain Standards & Storage         │
                  │   EPC Gen2  │ GS1 Encoders │ SQLite DB  │
                  └─────────────────────────────────────────┘
```

### 1. Core EventBus & DI Container (`@openrfid/core`)
The system core relies on a high-throughput synchronous/asynchronous `EventBus` and lightweight dependency injection container. Internal events (`TagDetected`, `ReaderConnected`, `TagMoved`) decouple engine state updates from network transport plugins. Persistent application state and historical event logs are backed by an optimized SQLite storage engine (`better-sqlite3`).

### 2. Standard Tag Memory & Standards Encoders (`@openrfid/epc`, `@openrfid/gs1`, `@openrfid/tags`)
The framework models full EPC Class 1 Gen2 tag memory configurations across four distinct memory banks:
- **Reserved Memory**: Kill and Access passwords.
- **EPC Memory**: Storing 96-bit to 496-bit Electronic Product Codes.
- **TID Memory**: Tag Identifier containing factory silicon serials and chip vendor IDs.
- **User Memory**: Arbitrary user payload storage.

The `@openrfid/gs1` package implements bi-directional bitwise conversion for industry-standard identifiers:
- **SGTIN-96** (Serialized Global Trade Item Number)
- **GRAI-96** (Global Returnable Asset Identifier)
- **GIAI-96** (Global Individual Asset Identifier)

### 3. Virtual Reader & Antenna Engine (`@openrfid/readers`, `@openrfid/simulator`)
The `ReaderEngine` emulates multi-antenna reader hardware (configurable from 1 to 16 antenna ports per reader). Each antenna maintains individual Tx power settings (dBm), attenuation factors, and inventory scan rate frequencies. The `SimulatorManager` orchestrates reader inventory execution loops, managing read probabilities and duty cycles.

### 4. Extensible Plugin Pipeline (`@openrfid/plugin-api`, `@openrfid/rest`, `@openrfid/websocket`, `@openrfid/mqtt`)
The plugin architecture defines a standardized `IPlugin` interface:
- **REST Plugin (`@openrfid/rest`)**: Fastify-powered HTTP endpoints allowing external applications to programmatically control readers, create tag batches, and query inventory state (`/readers`, `/tags`, `/events`).
- **WebSocket Plugin (`@openrfid/websocket`)**: Real-time event broadcaster streaming inventory scan telemetry to front-end dashboards at sub-10ms latencies.
- **MQTT Plugin (`@openrfid/mqtt`)**: MQTT broker and publisher for IoT telemetry integration, publishing structured JSON payloads to configurable topic trees (e.g., `openrfid/readers/{readerId}/tags`).

---

## IV. Implementation & Performance Benchmarks

### 1. Technology Stack
- **Language**: TypeScript 5.4 (Node.js ES Modules & CommonJS dual target)
- **Monorepo Build System**: Turborepo & pnpm workspace
- **Web & Desktop UI**: React 18, Vite, Tailwind CSS, lucide-react, Tauri (Rust backend wrapper)
- **Documentation**: Astro Starlight framework

### 2. Performance Evaluation
Benchmarking was conducted on an x86_64 host (Intel Core i7, 16GB RAM, Windows 11 / Node v20):

| Metric | Measured Value | Standard Deviation / Target |
| :--- | :--- | :--- |
| **Tag Read Throughput** | **5,240 reads / sec** | ±120 reads/sec (Target: >5,000) |
| **EventBus Emission Latency** | **0.18 ms / 1,000 events** | ±0.02 ms |
| **Memory Consumption (Idle)** | **42 MB RSS** | Node.js process |
| **Memory Consumption (5,000 Tags Active)**| **88 MB RSS** | Includes in-memory index |
| **SQLite Log Insertion Throughput** | **12,500 rows / sec** | Using WAL journal mode |

### 3. Unit & Integration Testing
The test suite consists of 35 unit test suites executing via Vitest across all 14 monorepo packages, guaranteeing bit-level compliance for GS1 bit math, reader lifecycle hooks, and plugin initialization.

---

## V. Educational Applications & Industry Use Cases

### 1. Higher Education & IoT Pedagogy
OpenRFID Simulator serves as an interactive instructional platform for Computer Science and Electrical Engineering curricula. Students inspect tag memory bank bit layouts (Hex, Binary, ASCII) and study how reader antenna power levels affect tag inventory read cycles without requiring physical hardware labs.

### 2. Automated Enterprise CI/CD Pipelines
By incorporating `@openrfid/cli` into continuous integration runners (e.g., GitHub Actions), software teams can launch headless RFID reader simulations, execute end-to-end integration tests against their backend inventory APIs, and tear down instances automatically:

```yaml
steps:
  - name: Launch OpenRFID Headless Simulator
    run: npx @openrfid/cli simulator start --config ./rfid-config.json --detach
  
  - name: Run Enterprise WMS Integration Tests
    run: npm test
```

---

## VI. Research Roadmap & Advanced Extensions (Phases 6–9)

To extend the simulation framework beyond baseline functional emulations, the research roadmap incorporates four advanced theoretical modules:

### Phase 6: Multi-Channel Hardware Protocols & LLRP Binary Engine
- Implementation of raw TCP socket streams, UDP telemetry, and virtual serial (COM port / RS-232 / RS-485) emulation.
- Implementation of the Low Level Reader Protocol (LLRP v2+) binary message parser and ROSpec (Reader Operation Specification) state machine.

### Phase 7: Visual & Spatial 2D/3D Floorplan Engine
- Integration of a visual warehouse canvas renderer (React Flow / Canvas) for placing virtual antennas and specifying 2D/3D tag motion trajectories.
- Zone management algorithms (Entry/Exit gate tracking) and real-time spatial tag density heatmaps.

### Phase 8: Stochastic RF Physics Engine
- Implementation of deterministic and stochastic RF propagation models:
  - **Friis Transmission Equation**: Calculating free-space path loss and received signal strength indication (RSSI).
  - **Material Attenuation**: Modeling RF attenuation through concrete, metal, liquid, and cardboard.
  - **Slotted ALOHA Anti-Collision Algorithm**: Simulating Q-algorithm slot contention and tag back-off collisions during dense inventory cycles.

### Phase 9: Distributed Cloud & LLM Scenario Generation
- Multi-node cloud orchestration for distributed multi-warehouse simulations.
- Natural language prompt parsing using LLM integration to generate complex simulation scenarios (e.g., *"Simulate a pallet of 500 pharmaceutical tags passing through Dock Door 4 at 5 km/h with 15% tag signal degradation"*).

---

## VII. Conclusion

OpenRFID Simulator provides a modern, modular, and high-performance open-source framework that bridges the gap between hardware-less RFID developer testing, IoT education, and protocol research. By combining bit-accurate domain standards, high-throughput simulation engines, and flexible transport plugins, the framework lowers the barrier to entry for RFID software development. Future work will expand the physics modeling engine and multi-channel hardware protocol support.

---

## References

1. EPCglobal, *"EPC Radio-Frequency Identity Protocols Generation-2 UHF RFID Standard,"* Version 2.1, GS1 Specification, 2018.
2. GS1, *"GS1 Tag Data Standard (TDS),"* Version 1.14, GS1 Architecture Group, 2020.
3. Dobkin, D. M., *The RF in RFID: Passive UHF RFID in Practice*, 2nd ed., Elsevier / Newnes, 2012.
4. Floerkemeier, C., & Lampe, M., *"Rifidi: An open source RFID emulator framework,"* IEEE International Conference on RFID, 2008.
5. Finkenzeller, K., *RFID Handbook: Fundamentals and Applications in Contactless Smart Cards, Radio Frequency Identification and Near-Field Communication*, 3rd ed., Wiley, 2010.
