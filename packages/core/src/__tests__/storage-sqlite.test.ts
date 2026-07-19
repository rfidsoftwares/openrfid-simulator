/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SqliteStorageDriver } from '../storage-sqlite';

describe('SqliteStorageDriver', () => {
  let storage: SqliteStorageDriver;

  beforeEach(async () => {
    storage = new SqliteStorageDriver(':memory:');
    await storage.connect();
  });

  afterEach(async () => {
    await storage.disconnect();
  });

  it('should save and retrieve readers', async () => {
    const reader = {
      id: 'r-101',
      name: 'Receiving Dock Reader',
      vendor: 'Impinj',
      model: 'Speedway R420',
      ip: '192.168.1.50',
      port: 5084,
      protocol: 'LLRP',
      status: 'ONLINE',
      createdAt: new Date().toISOString(),
    };

    await storage.saveReader(reader);
    const retrieved = await storage.getReaderById('r-101');
    expect(retrieved).not.toBeNull();
    expect(retrieved?.name).toBe('Receiving Dock Reader');

    const all = await storage.getReaders();
    expect(all.length).toBe(1);
  });

  it('should save and retrieve tags', async () => {
    const tag = {
      id: 't-1',
      epc: 'E20000000000000000000001',
      tid: 'E280110520000000',
      userMemory: '0000',
      accessPassword: '00000000',
      killPassword: '00000000',
      protocol: 'GEN2',
    };

    await storage.saveTag(tag);
    const retrieved = await storage.getTagByEpc('E20000000000000000000001');
    expect(retrieved?.epc).toBe(tag.epc);
  });

  it('should log and query events', async () => {
    const event = {
      id: 'ev-1',
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
      readerId: 'r-101',
      antennaId: 1,
      epc: 'E20000000000000000000001',
      rssi: -58.5,
      protocol: 'LLRP',
    };

    await storage.logEvent(event);
    const events = await storage.getEvents({ limit: 10 });
    expect(events.length).toBe(1);
    expect(events[0].epc).toBe('E20000000000000000000001');
  });
});
