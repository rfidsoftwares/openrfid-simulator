<div align="center">

<img src="./assets/logo.svg" alt="OpenRFID Simulator Logo" width="200" />

# 📥 Download OpenRFID Simulator

### Official Release Downloads & Installation Packages

[![Version](https://img.shields.io/badge/version-v1.0.0--MVP-blue.svg)](https://github.com/rfidsoftwares/openrfid-simulator/releases)
[![Platform](https://img.shields.io/badge/platform-Windows%20x64%20%7C%20x86-0078D6.svg)](https://github.com/rfidsoftwares/openrfid-simulator/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

---

## 💾 Direct Downloads (Latest Stable v1.0.0)

| Package Format | Target Platform | Architecture | File Name / Download Link | Description |
| :--- | :--- | :---: | :--- | :--- |
| **Windows 64-bit MSI** | Windows 10 / 11 | `x64` (64-bit) | [**📥 OpenRFID_Simulator_v1.0.0_x64.msi**](https://github.com/rfidsoftwares/openrfid-simulator/releases/latest/download/OpenRFID_Simulator_v1.0.0_x64_en-US.msi) | Standard 64-bit Windows Installer package. |
| **Windows 32-bit MSI** | Windows 7 / 10 / 11 | `x86` (32-bit) | [**📥 OpenRFID_Simulator_v1.0.0_x86.msi**](https://github.com/rfidsoftwares/openrfid-simulator/releases/latest/download/OpenRFID_Simulator_v1.0.0_x86_en-US.msi) | 32-bit (x86) Windows Installer for legacy/32-bit OS hardware. |
| **Windows 64-bit EXE** | Windows 10 / 11 | `x64` (64-bit) | [**📥 OpenRFID_Simulator_v1.0.0_x64_Setup.exe**](https://github.com/rfidsoftwares/openrfid-simulator/releases/latest/download/OpenRFID_Simulator_v1.0.0_x64-setup.exe) | Portable 64-bit setup wizard. |
| **Windows 32-bit EXE** | Windows 7 / 10 / 11 | `x86` (32-bit) | [**📥 OpenRFID_Simulator_v1.0.0_x86_Setup.exe**](https://github.com/rfidsoftwares/openrfid-simulator/releases/latest/download/OpenRFID_Simulator_v1.0.0_x86-setup.exe) | Portable 32-bit (x86) setup wizard. |
| **Headless CLI (NPM)** | Windows / macOS / Linux | `x64 / arm64` | `npx @openrfid/cli simulator start` | Instant command-line runner for CI/CD & headless testing. |

---

## 🛠️ How to Build 32-Bit (x86) MSI Locally

To generate the 32-bit MSI installer from source:

1. **Add the 32-bit Rust Target Toolchain**:
   ```bash
   rustup target add i686-pc-windows-msvc
   ```
2. **Build the 32-bit Desktop Package**:
   ```bash
   node scripts/build-desktop.js --arch=x86
   ```
   The 32-bit MSI installer will be generated at:
   `apps/desktop/src-tauri/target/i686-pc-windows-msvc/release/bundle/msi/OpenRFID Simulator_1.0.0_x86_en-US.msi`

---

## ⚡ Quick Installation Steps

### Option A: Standard MSI Windows Installation
1. Download either the **`x64` (64-bit)** or **`x86` (32-bit)** `.msi` file above.
2. Double-click the `.msi` file to launch the **OpenRFID Simulator Setup Wizard**.
3. Accept the EULA license agreement (RFID Software India Private Limited) and click **Install**.
4. Launch **OpenRFID Simulator** from your Start Menu.

### Option B: Silent Enterprise Deployment (Command Prompt)
To deploy the `.msi` package silently across enterprise workstations or 32-bit legacy industrial PCs:

```cmd
msiexec /i OpenRFID_Simulator_v1.0.0_x86_en-US.msi /qn /norestart
```

---

## 🖥️ System Requirements

- **Operating System**: Windows 7, Windows 10, Windows 11, or Windows Server (32-bit or 64-bit).
- **RAM**: 2 GB minimum for 32-bit (4 GB recommended for 64-bit).
- **Disk Space**: 150 MB free disk space.
- **Dependencies**: None. (Self-contained desktop executable with bundled sidecar runner).
