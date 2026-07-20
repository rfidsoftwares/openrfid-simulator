---
title: Download Desktop & Installers
description: Download official Windows MSI installers, EXE setup wizards, and CLI packages for OpenRFID Simulator.
---

# 📥 Download OpenRFID Simulator

Download the latest stable release binaries for Windows desktop deployment or run instantly via NPM.

## 💾 Official Release Packages (v1.0.0)

| Package | Format | Arch | Download Link |
| :--- | :---: | :---: | :--- |
| **Windows MSI Installer** | `.msi` | `x64` | [**📥 Download OpenRFID_Simulator_v1.0.0_x64.msi**](https://github.com/rfidsoftwares/openrfid-simulator/releases/latest/download/OpenRFID_Simulator_v1.0.0_x64_en-US.msi) |
| **Windows EXE Setup** | `.exe` | `x64` | [**📥 Download OpenRFID_Simulator_v1.0.0_x64_Setup.exe**](https://github.com/rfidsoftwares/openrfid-simulator/releases/latest/download/OpenRFID_Simulator_v1.0.0_x64-setup.exe) |
| **Headless CLI (NPM)** | CLI | `x64/arm64` | `npx @openrfid/cli simulator start` |

---

## ⚡ Installation Instructions

### Windows Standard MSI Installation
1. Click the link above to download `OpenRFID_Simulator_v1.0.0_x64.msi`.
2. Double-click the file to launch the **OpenRFID Simulator Setup Wizard**.
3. Accept the license agreement and click **Install**.
4. Open **OpenRFID Simulator** from your Start Menu.

### Silent Enterprise Installation
To install silently across network workstations:

```cmd
msiexec /i OpenRFID_Simulator_v1.0.0_x64.msi /qn /norestart
```

---

## 🖥️ System Requirements

* **OS**: Windows 10 / 11 64-bit
* **RAM**: 4 GB minimum (8 GB recommended)
* **Disk Space**: 150 MB
* **Dependencies**: None (self-contained executable)
