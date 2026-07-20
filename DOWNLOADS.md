<div align="center">

<img src="./assets/logo.svg" alt="OpenRFID Simulator Logo" width="200" />

# 📥 Download OpenRFID Simulator

### Official Release Downloads & Installation Packages

[![Version](https://img.shields.io/badge/version-v1.0.0--MVP-blue.svg)](https://github.com/rfidsoftwares/openrfid-simulator/releases)
[![Platform](https://img.shields.io/badge/platform-Windows%20x64-0078D6.svg)](https://github.com/rfidsoftwares/openrfid-simulator/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

---

## 💾 Direct Downloads (Latest Stable v1.0.0)

| Package Format | Target Platform | Architecture | File Name / Download Link | Description |
| :--- | :--- | :---: | :--- | :--- |
| **Windows 64-bit MSI** | Windows 10 / 11 | `x64` (64-bit) | [**📥 OpenRFID_Simulator_v1.0.0_x64.msi**](https://github.com/rfidsoftwares/openrfid-simulator/releases/latest/download/OpenRFID_Simulator_v1.0.0_x64_en-US.msi) | Standard 64-bit Windows Installer package. Self-registers background services. |
| **Windows 64-bit EXE** | Windows 10 / 11 | `x64` (64-bit) | [**📥 OpenRFID_Simulator_v1.0.0_x64_Setup.exe**](https://github.com/rfidsoftwares/openrfid-simulator/releases/latest/download/OpenRFID_Simulator_v1.0.0_x64-setup.exe) | Portable 64-bit setup wizard with custom install path options. |
| **Headless CLI (NPM)** | Windows / macOS / Linux | `x64 / arm64` | `npx @openrfid/cli simulator start` | Instant command-line runner for CI/CD pipelines & headless testing. |

---

## ⚡ Quick Installation Steps

### Option A: Standard MSI Windows Installation
1. Click the link above to download **`OpenRFID_Simulator_v1.0.0_x64.msi`**.
2. Double-click the `.msi` file to launch the **OpenRFID Simulator Setup Wizard**.
3. Accept the EULA license agreement (RFID Software India Private Limited) and click **Install**.
4. Launch **OpenRFID Simulator** from your Start Menu or Desktop shortcut.

### Option B: Silent Enterprise Deployment (Command Prompt)
To deploy the `.msi` package silently across enterprise workstations or automated test labs:

```cmd
msiexec /i OpenRFID_Simulator_v1.0.0_x64_en-US.msi /qn /norestart
```

---

## 🖥️ System Requirements

- **Operating System**: Windows 10, Windows 11, or Windows Server 2019+ (64-bit).
- **RAM**: 4 GB minimum (8 GB recommended for 10,000+ tag simulation benchmarks).
- **Disk Space**: 150 MB free disk space.
- **Network**: Local loopback TCP/UDP ports enabled (`9090`, `9091`, `3000`, `3001`, `1883`).
- **Dependencies**: None. (Self-contained desktop executable with bundled sidecar runner).

---

## 🔒 Verification & Security

All official release binaries are compiled with Link-Time Optimization (LTO) and fully stripped of debug symbols.

You can verify the checksum of your downloaded package using PowerShell:

```powershell
Get-FileHash -Algorithm SHA256 .\OpenRFID_Simulator_v1.0.0_x64_en-US.msi
```

---

## 🌐 Enterprise Drivers & Support

Need custom reader drivers, LLRP v2 protocol extensions, or enterprise hardware integration?  
Visit **[https://rfidsoftwares.com](https://rfidsoftwares.com)** or contact [support@rfidsoftwares.com](mailto:support@rfidsoftwares.com).
