/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { WebSocket } from 'ws';
import { EventBus, ConfigManager, Logger } from '@openrfid/core';
import { SimulatorManager } from '@openrfid/simulator';
import { WebSocketPlugin } from '../websocket-plugin';

describe('@openrfid/websocket plugin', () => {
  let plugin: WebSocketPlugin;
  let eventBus: EventBus;

  beforeEach(async () => {
    eventBus = new EventBus();
    const config = new ConfigManager({ server: { port: 3100 }, websocket: { port: 3101 } });
    const logger = new Logger('Test');
    const simulator = new SimulatorManager(eventBus);

    plugin = new WebSocketPlugin();
    await plugin.initialize({ eventBus, config, logger, simulator });
    await plugin.start();
  });

  afterEach(async () => {
    await plugin.stop();
  });

  it('should broadcast TagDetected events to connected clients', async () => {
    const ws = new WebSocket('ws://localhost:3101');

    await new Promise<void>((resolve) => {
      ws.on('open', () => resolve());
    });

    const receivedPromise = new Promise<any>((resolve) => {
      ws.on('message', (data) => {
        resolve(JSON.parse(data.toString()));
      });
    });

    await eventBus.emit('TagDetected', {
      readerId: 'r1',
      antennaId: 1,
      epc: 'E20000000001',
      rssi: -55,
      timestamp: Date.now(),
    });

    const msg = await receivedPromise;
    expect(msg.event).toBe('TagDetected');
    expect(msg.data.epc).toBe('E20000000001');

    ws.close();
  });
});
