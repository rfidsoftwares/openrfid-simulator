/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import { describe, it, expect, vi } from 'vitest';
import { EventBus } from '@openrfid/core';
import { VirtualReader } from '@openrfid/readers';
import { TagGenerator } from '@openrfid/tags';
import { InventoryEngine } from '../inventory-engine';
import { SimulatorManager } from '../simulator-manager';

describe('@openrfid/simulator package', () => {
  it('should execute read cycles and emit TagDetected events', () => {
    const eventBus = new EventBus();
    const reader = new VirtualReader({ name: 'Dock Reader', antennasCount: 2 });
    const tags = TagGenerator.generateBatch({ count: 10, type: 'sequential' });

    const tagDetectedHandler = vi.fn();
    eventBus.on('TagDetected', tagDetectedHandler);

    const engine = new InventoryEngine(reader, () => tags, eventBus, { readProbability: 1.0 });
    reader.setStatus('ONLINE');

    const reads = engine.executeReadCycle();
    expect(reads).toBe(20); // 10 tags x 2 active antennas
    expect(tagDetectedHandler).toHaveBeenCalledTimes(20);
  });

  it('should manage multiple readers via SimulatorManager', () => {
    const eventBus = new EventBus();
    const manager = new SimulatorManager(eventBus);

    const reader1 = new VirtualReader({ id: 'r1', name: 'Reader 1' });
    const reader2 = new VirtualReader({ id: 'r2', name: 'Reader 2' });
    const tags = TagGenerator.generateBatch({ count: 5, type: 'sequential' });

    manager.addReader(reader1);
    manager.addReader(reader2);
    manager.addTagBatch(tags);

    expect(manager.getAllReaders().length).toBe(2);
    expect(manager.getAllTags().length).toBe(5);

    manager.startReader('r1');
    expect(reader1.status).toBe('ONLINE');

    manager.stopAll();
    expect(reader1.status).toBe('OFFLINE');
  });

  it('should achieve high read throughput (> 5,000 tag reads/sec benchmark)', () => {
    const eventBus = new EventBus();
    const reader = new VirtualReader({ name: 'High Capacity Reader', antennasCount: 4 });
    const tags = TagGenerator.generateBatch({ count: 1000, type: 'sequential' });

    const engine = new InventoryEngine(reader, () => tags, eventBus, { readProbability: 1.0 });
    reader.setStatus('ONLINE');

    const start = performance.now();
    let totalReads = 0;
    // Execute 5 cycles of 4000 potential tag-antenna combinations (total 20,000 reads)
    for (let i = 0; i < 5; i++) {
      totalReads += engine.executeReadCycle();
    }
    const end = performance.now();
    const durationSeconds = (end - start) / 1000;
    const readsPerSecond = totalReads / durationSeconds;

    expect(totalReads).toBe(20000);
    expect(readsPerSecond).toBeGreaterThan(5000);
  });
});
