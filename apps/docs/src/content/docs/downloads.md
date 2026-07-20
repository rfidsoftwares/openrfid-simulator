---
title: Download Desktop & Installers
description: Download official Windows 64-bit and 32-bit (x86) MSI installers, EXE setup wizards, and CLI packages for OpenRFID Simulator.
---

# 📥 Download OpenRFID Simulator

Download official 64-bit (x64) and 32-bit (x86) Windows installers or run instantly via NPM.

## 💾 Official Release Packages (v1.0.0)

| Package | Format | Arch | Download Link |
| :--- | :---: | :---: | :--- |
| **Windows 64-bit MSI** | `.msi` | `x64` | [**📥 Download OpenRFID_Simulator_v1.0.0_x64.msi**](https://github.com/rfidsoftwares/openrfid-simulator/releases/latest/download/OpenRFID_Simulator_v1.0.0_x64_en-US.msi) |
| **Windows 32-bit MSI** | `.msi` | `x86` | [**📥 Download OpenRFID_Simulator_v1.0.0_x86.msi**](https://github.com/rfidsoftwares/openrfid-simulator/releases/latest/download/OpenRFID_Simulator_v1.0.0_x86_en-US.msi) |
| **Windows 64-bit EXE** | `.exe` | `x64` | [**📥 Download OpenRFID_Simulator_v1.0.0_x64_Setup.exe**](https://github.com/rfidsoftwares/openrfid-simulator/releases/latest/download/OpenRFID_Simulator_v1.0.0_x64-setup.exe) |
| **Windows 32-bit EXE** | `.exe` | `x86` | [**📥 Download OpenRFID_Simulator_v1.0.0_x86_Setup.exe**](https://github.com/rfidsoftwares/openrfid-simulator/releases/latest/download/OpenRFID_Simulator_v1.0.0_x86-setup.exe) |
| **Headless CLI (NPM)** | CLI | `x64/arm64` | `npx @openrfid/cli simulator start` |

---

## 🛠️ Building 32-Bit (x86) Locally

To build a 32-bit MSI package locally:

```bash
# 1. Add 32-bit Rust target
rustup target add i686-pc-windows-msvc

# 2. Package 32-bit binary installer
node scripts/build-desktop.js --arch=x86
```

---

## ⚡ Installation Instructions

### Standard Installation
1. Download the **x64 (64-bit)** or **x86 (32-bit)** `.msi` installer above.
2. Double-click to launch the **OpenRFID Simulator Setup Wizard**.
3. Accept the license agreement and click **Install**.

### Silent Enterprise Deployment
```cmd
msiexec /i OpenRFID_Simulator_v1.0.0_x86_en-US.msi /qn /norestart
```
