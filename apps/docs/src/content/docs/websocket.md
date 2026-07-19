---
title: WebSocket Events
description: WebSocket interface and event structures for real-time tag scan streaming.
---

# WebSocket Stream Reference

The WebSocket broadcaster server (default port `4000`) streams real-time tag scan events in JSON format. Clients can connect and listen to these events to feed their live dashboard applications.

---

## Event Stream API

### Connection
Connect to the server using any standard WebSocket client:
```javascript
const socket = new WebSocket('ws://localhost:4000');
```

---

## Events Emitted

### `tag_read`
Emitted every time a virtual reader successfully scans a tag:
* **Payload Structure**:
  ```json
  {
    "readerId": "reader_12345",
    "epc": "E20000000000000000000001",
    "tid": "E280000000000000",
    "antennaIndex": 1,
    "rssi": -51.9,
    "timestamp": "2026-07-20T00:25:39.123Z"
  }
  ```
