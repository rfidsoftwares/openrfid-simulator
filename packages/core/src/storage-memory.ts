/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import { IStorageDriver, ReaderRecord, TagRecord, EventRecord, EventQueryOptions, EventStorageStats, AntennaRecord } from './storage-interface';
import { ConfigManager } from './config-manager';

export class MemoryStorageDriver implements IStorageDriver {
  private readers = new Map<string, ReaderRecord>();
  private tags = new Map<string, TagRecord>();
  private antennas = new Map<string, AntennaRecord>();
  private events: EventRecord[] = [];
  private connected = false;

  private maxEvents: number;
  private warningThreshold: number;
  private autoTrim: boolean;
  private configUnsubscribe?: () => void;

  constructor(private config?: ConfigManager) {
    this.maxEvents = config?.get<number>('storage.memoryEventLimit') ?? 10_000;
    this.warningThreshold = config?.get<number>('storage.eventWarningThreshold') ?? 8_000;
    this.autoTrim = config?.get<boolean>('storage.autoTrimEnabled') ?? true;

    // Live update when config changes at runtime
    if (config) {
      this.configUnsubscribe = config.onChange((cfg) => {
        this.maxEvents = cfg.storage?.memoryEventLimit ?? 10_000;
        this.warningThreshold = cfg.storage?.eventWarningThreshold ?? 8_000;
        this.autoTrim = cfg.storage?.autoTrimEnabled ?? true;
        // Immediately trim if current events exceed the new limit
        if (this.events.length > this.maxEvents) {
          this.events.length = this.maxEvents;
        }
      });
    }
  }

  public async connect(): Promise<void> {
    this.connected = true;
  }

  public async disconnect(): Promise<void> {
    this.connected = false;
    this.configUnsubscribe?.();
  }

  // Reader CRUD
  public async getReaders(): Promise<ReaderRecord[]> {
    return Array.from(this.readers.values());
  }

  public async getReaderById(id: string): Promise<ReaderRecord | null> {
    return this.readers.get(id) ?? null;
  }

  public async saveReader(reader: ReaderRecord): Promise<void> {
    this.readers.set(reader.id, reader);
  }

  public async deleteReader(id: string): Promise<void> {
    this.readers.delete(id);
    // Delete associated antennas too
    for (const key of Array.from(this.antennas.keys())) {
      if (this.antennas.get(key)?.readerId === id) {
        this.antennas.delete(key);
      }
    }
  }

  // Antenna Persistence
  public async saveAntenna(antenna: AntennaRecord): Promise<void> {
    this.antennas.set(antenna.id, antenna);
  }

  public async getAntennasByReaderId(readerId: string): Promise<AntennaRecord[]> {
    return Array.from(this.antennas.values()).filter((a) => a.readerId === readerId);
  }

  // Tag CRUD
  public async getTags(): Promise<TagRecord[]> {
    return Array.from(this.tags.values());
  }

  public async getTagByEpc(epc: string): Promise<TagRecord | null> {
    for (const tag of this.tags.values()) {
      if (tag.epc === epc) return tag;
    }
    return null;
  }

  public async saveTag(tag: TagRecord): Promise<void> {
    this.tags.set(tag.id, tag);
  }

  public async deleteTag(id: string): Promise<void> {
    this.tags.delete(id);
  }

  // Event Log — basic
  public async logEvent(event: EventRecord): Promise<void> {
    this.events.unshift(event);
    if (this.autoTrim && this.events.length > this.maxEvents) {
      this.events.length = this.maxEvents;
    }
  }

  // Event Log — advanced queries
  public async getEvents(options: EventQueryOptions = {}): Promise<EventRecord[]> {
    let results = [...this.events];

    if (options.date)     results = results.filter((e) => e.date === options.date);
    if (options.from)     results = results.filter((e) => e.timestamp >= options.from!);
    if (options.to)       results = results.filter((e) => e.timestamp <= options.to!);
    if (options.readerId) results = results.filter((e) => e.readerId === options.readerId);
    if (options.epc)      results = results.filter((e) => e.epc === options.epc);
    if (options.protocol) results = results.filter((e) => e.protocol === options.protocol);

    const offset = options.offset ?? 0;
    const limit = options.limit ?? 1000;
    return results.slice(offset, offset + limit);
  }

  public async getEventsByDate(date: string, limit = 1000, offset = 0): Promise<EventRecord[]> {
    const filtered = this.events.filter((e) => e.date === date);
    return filtered.slice(offset, offset + limit);
  }

  public async getEventDates(): Promise<{ date: string; count: number }[]> {
    const map = new Map<string, number>();
    for (const e of this.events) {
      map.set(e.date, (map.get(e.date) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  public async getEventStats(): Promise<EventStorageStats> {
    const byDate = await this.getEventDates();
    const dates = byDate.map((d) => d.date).sort();
    return {
      totalEvents: this.events.length,
      totalDays: byDate.length,
      oldestEventDate: dates[0] ?? null,
      newestEventDate: dates[dates.length - 1] ?? null,
      eventsByDate: byDate,
    };
  }

  public async getEventCount(options: Omit<EventQueryOptions, 'limit' | 'offset'> = {}): Promise<number> {
    const results = await this.getEvents({ ...options, limit: Number.MAX_SAFE_INTEGER, offset: 0 });
    return results.length;
  }

  // Event Log — management
  public async deleteEventsByDate(date: string): Promise<{ deleted: number }> {
    const before = this.events.length;
    this.events = this.events.filter((e) => e.date !== date);
    return { deleted: before - this.events.length };
  }

  public async clearAllEvents(): Promise<{ deleted: number }> {
    const deleted = this.events.length;
    this.events = [];
    return { deleted };
  }

  // Nuclear clear
  public async clearAllData(): Promise<void> {
    this.readers.clear();
    this.tags.clear();
    this.antennas.clear();
    this.events = [];
  }

  // Memory stats for dashboard UI
  public getMemoryUsage(): { current: number; limit: number; percent: number; isWarning: boolean } {
    const percent = Math.round((this.events.length / this.maxEvents) * 100);
    return {
      current: this.events.length,
      limit: this.maxEvents,
      percent,
      isWarning: this.events.length >= this.warningThreshold,
    };
  }

  public setMemoryLimit(limit: number): void {
    const clamped = Math.max(100, Math.min(500_000, limit));
    this.maxEvents = clamped;
    if (this.events.length > clamped) {
      this.events.length = clamped;
    }
    this.config?.set('storage.memoryEventLimit', clamped);
  }
}
