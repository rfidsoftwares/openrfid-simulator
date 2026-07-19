---
title: Hopeland TCP/UDP Protocol
description: Binary frame format and discovery details for the Hopeland protocol emulation.
---

# Hopeland Protocol Reference

OpenRFID Simulator emulates the official Hopeland RFID binary protocol. Any client using the standard Hopeland SDK or middleware APIs can communicate with the simulator out-of-the-box.

---

## 1. UDP Multicast Discovery

The simulator broadcasts a UDP packet every 2 seconds to the multicast group **`230.1.1.116:9091`** to announce its availability:

```ascii
^RFID_READER_INFORMATION:OpenRFID-Sim,IP:192.168.1.5,MAC:52-46-XX-XX-XX-XX,PORT:9090,HOST_SERVER_IP:0.0.0.0,HOST_SERVER_PORT:0,MODE:SERVER,NET_STATE:CONNECTED$
```

---

## 2. TCP Command Interface

The middleware connects to the simulator via TCP on port **`9090`** (or the custom configured port) to issue start, stop, and parameter commands.

### Active Commands:
* **Start Reading (GetEPC)**: `0x10`
* **Stop Reading (Stop)**: `0xFF`
* **Tag Data Notification**: `0x12`

---

## 3. Tag Data Packet Dissection

Incoming tag detection events are forwarded to the connected TCP client as binary frames:

```ascii
AA 02 12 00 19 00 01 34 0C E2 00 00 00 00 00 00 00 00 00 00 01 08 E2 80 00 00 00 00 00 00 86 2D
```

### Field Breakdown:
* **`AA`**: Frame Header (Start marker).
* **`02`**: Reader Address.
* **`12`**: Command type (`0x12` = Tag Data Notification).
* **`00 19`**: Data length (25 bytes).
* **`00`**: Result code (Success).
* **`01`**: Antenna Port #1.
* **`34`**: RSSI (`0x34` = 52 in decimal, representing absolute value of `-52 dBm`).
* **`0C`**: EPC length (12 bytes).
* **`E2 00 00 00 00 00 00 00 00 00 00 01`**: Tag EPC.
* **`08`**: TID length (8 bytes).
* **`E2 80 00 00 00 00 00 00`**: Tag TID.
* **`86 2D`**: CRC16 Checksum.
