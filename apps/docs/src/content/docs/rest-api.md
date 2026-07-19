---
title: REST API Reference
description: Fastify REST API endpoints for OpenRFID Simulator management.
---

# REST API Reference

The simulator server exposes a REST API (default port `3000`) for configuring, starting, and monitoring virtual readers.

---

## Endpoints

### 1. Readers Management

#### Get All Readers
* **URL**: `/api/readers`
* **Method**: `GET`
* **Response**: List of reader objects.

#### Add a Virtual Reader
* **URL**: `/api/readers`
* **Method**: `POST`
* **Payload**:
  ```json
  {
    "name": "Gate-1",
    "protocol": "Hopeland",
    "ip": "127.0.0.1",
    "port": 9090
  }
  ```

#### Control Reader Simulation State
* **Start**: `POST /api/readers/:id/start`
* **Stop**: `POST /api/readers/:id/stop`

---

## 2. Tag Inventory Management

#### Get Tag Inventory
* **URL**: `/api/tags`
* **Method**: `GET`

#### Import Tag Batch
* **URL**: `/api/tags`
* **Method**: `POST`
* **Payload**: Array of tag records.
