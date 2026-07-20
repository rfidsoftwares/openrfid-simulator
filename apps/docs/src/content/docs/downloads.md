---
title: Download Desktop & Installers
description: Download official Windows 64-bit MSI installers, EXE setup wizards, and CLI packages for OpenRFID Simulator.
---

# 📥 Download OpenRFID Simulator

Download official 64-bit (x64) Windows desktop installers or run instantly via NPM.

## 💾 Official Release Packages (v1.0.0)

| Package | Format | Arch | Download Link |
| :--- | :---: | :---: | :--- |
| **Windows 64-bit MSI** | `.msi` | `x64` | [**📥 Download OpenRFID_Simulator_v1.0.0_x64.msi**](https://github.com/rfidsoftwares/openrfid-simulator/releases/download/v1.0.0/OpenRFID.Simulator_1.0.0_x64_en-US.msi) |
| **Headless CLI (NPM)** | CLI | `x64/arm64` | `npx @openrfid/cli simulator start` |

---

## ⚡ Installation Instructions

### Standard Installation
1. Download `OpenRFID.Simulator_1.0.0_x64_en-US.msi` above.
2. Double-click to launch the **OpenRFID Simulator Setup Wizard**.
3. Accept the license agreement and click **Install**.

### Silent Enterprise Deployment
```cmd
msiexec /i OpenRFID.Simulator_1.0.0_x64_en-US.msi /qn /norestart
```

---

## 🖥️ System Requirements

* **OS**: Windows 10 / 11 64-bit
* **RAM**: 4 GB minimum (8 GB recommended)
* **Disk Space**: 150 MB
* **Dependencies**: None (self-contained executable)
