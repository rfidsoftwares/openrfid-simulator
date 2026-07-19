/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import { describe, it, expect, vi } from 'vitest';
import { EventBus } from '../event-bus';

describe('EventBus', () => {
  it('should register and emit events correctly', async () => {
    const bus = new EventBus();
    const handler = vi.fn();

    bus.on('ReaderConnected', handler);
    await bus.emit('ReaderConnected', { readerId: 'r-1', name: 'Reader 1', ip: '127.0.0.1', port: 5084 });

    expect(handler).toHaveBeenCalledWith({ readerId: 'r-1', name: 'Reader 1', ip: '127.0.0.1', port: 5084 });
  });

  it('should unsubscribe handler correctly', async () => {
    const bus = new EventBus();
    const handler = vi.fn();

    const unsubscribe = bus.on('TagDetected', handler);
    unsubscribe();

    await bus.emit('TagDetected', { readerId: 'r-1', antennaId: 1, epc: 'E20000000001', rssi: -50, timestamp: Date.now() });
    expect(handler).not.toHaveBeenCalled();
  });
});
