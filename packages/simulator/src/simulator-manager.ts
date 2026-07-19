/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import { EventBus, IStorageDriver } from '@openrfid/core';
import { VirtualReader } from '@openrfid/readers';
import { Tag } from '@openrfid/tags';
import { InventoryEngine, InventoryOptions } from './inventory-engine';

export class SimulatorManager {
  private readers: Map<string, VirtualReader> = new Map();
  private tags: Map<string, Tag> = new Map();
  private engines: Map<string, InventoryEngine> = new Map();

  constructor(
    public eventBus: EventBus,
    public storage?: IStorageDriver
  ) {
    // A2.1 — Wire TagDetected events to storage persistence
    this.eventBus.on('TagDetected', (payload) => {
      const now = new Date();
      const date = now.toISOString().split('T')[0]; // 'YYYY-MM-DD'
      this.storage?.logEvent({
        id: `ev_${now.getTime()}_${Math.random().toString(36).slice(2, 7)}`,
        date,
        timestamp: now.toISOString(),
        readerId: payload.readerId,
        antennaId: payload.antennaId,
        epc: payload.epc,
        rssi: payload.rssi,
        protocol: payload.protocol ?? 'GEN2',
      });
    });
  }

  // A3.1 — Load readers and tags from storage on startup
  public async loadFromStorage(): Promise<void> {
    if (!this.storage) return;

    const readers = await this.storage.getReaders();
    for (const r of readers) {
      const reader = new VirtualReader(r);
      // Load antennas:
      const antennas = await this.storage.getAntennasByReaderId(reader.id);
      if (antennas && antennas.length > 0) {
        // Clear default antennas and set from database
        reader.antennas.clear();
        for (const ant of antennas) {
          reader.addAntenna(ant);
        }
      }
      this.readers.set(reader.id, reader);
    }

    const tags = await this.storage.getTags();
    for (const t of tags) {
      const tag = new Tag(t);
      this.tags.set(tag.epc, tag);
    }
  }

  // Returns summary for the startup banner
  public getStorageSummary(): { readerCount: number; tagCount: number } {
    return {
      readerCount: this.readers.size,
      tagCount: this.tags.size,
    };
  }

  public addReader(reader: VirtualReader): void {
    this.readers.set(reader.id, reader);
    if (this.storage) {
      this.storage.saveReader(reader.toJSON());
      for (const antenna of reader.antennas.values()) {
        this.storage.saveAntenna({
          id: antenna.id,
          readerId: antenna.readerId,
          index: antenna.index,
          gain: antenna.gain,
          power: antenna.power,
          frequency: antenna.frequency,
          rssiOffset: antenna.rssiOffset,
          readZone: antenna.readZone,
          enabled: antenna.enabled,
        });
      }
    }
  }

  public removeReader(readerId: string): void {
    this.stopReader(readerId);
    this.readers.delete(readerId);
    if (this.storage) {
      this.storage.deleteReader(readerId);
    }
  }

  public getReader(readerId: string): VirtualReader | undefined {
    return this.readers.get(readerId);
  }

  public getAllReaders(): VirtualReader[] {
    return Array.from(this.readers.values());
  }

  public addTag(tag: Tag): void {
    this.tags.set(tag.epc, tag);
    if (this.storage) {
      this.storage.saveTag(tag.toJSON());
    }
  }

  public addTagBatch(tags: Tag[]): void {
    for (const tag of tags) {
      this.addTag(tag);
    }
  }

  public removeTag(epc: string): void {
    const tag = this.tags.get(epc);
    if (tag) {
      this.tags.delete(epc);
      if (this.storage) {
        this.storage.deleteTag(tag.id);
      }
    }
  }

  public getAllTags(): Tag[] {
    return Array.from(this.tags.values());
  }

  public startReader(readerId: string, options?: InventoryOptions): void {
    const reader = this.readers.get(readerId);
    if (!reader) {
      throw new Error(`Reader '${readerId}' not found.`);
    }

    // C1 fix — always create a fresh engine to avoid stale state
    const engine = new InventoryEngine(
      reader,
      () => Array.from(this.tags.values()), // A1 — live tag getter
      this.eventBus,
      options
    );
    this.engines.set(readerId, engine);
    engine.start();
  }

  public stopReader(readerId: string): void {
    const engine = this.engines.get(readerId);
    if (engine) {
      engine.stop();
      this.engines.delete(readerId);
    }
  }

  // B2 fix — wrap each start in try/catch so one failure doesn't stop others
  public startAll(options?: InventoryOptions): void {
    for (const reader of this.readers.values()) {
      try {
        this.startReader(reader.id, options);
      } catch (e: any) {
        console.error(`[Simulator] Failed to start reader '${reader.id}': ${e.message}`);
      }
    }
  }

  public stopAll(): void {
    for (const readerId of Array.from(this.engines.keys())) {
      this.stopReader(readerId);
    }
  }
}
