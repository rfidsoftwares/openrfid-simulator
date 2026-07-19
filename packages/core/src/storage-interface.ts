/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

export interface ReaderRecord {
  id: string;
  name: string;
  vendor: string;
  model: string;
  ip: string;
  port: number;
  protocol: string;
  status: string;
  createdAt: string;
  readRate?: number;
  readMode?: 'continuous' | 'periodic';
  readIntervalValue?: number;
  readIntervalUnit?: 'seconds' | 'minutes' | 'hours';
  epcFilterStart?: string;
  epcFilterEnd?: string;
  epcFilterPrefix?: string;
}

export interface TagRecord {
  id: string;
  epc: string;
  tid?: string;
  userMemory?: string;
  accessPassword?: string;
  killPassword?: string;
  protocol?: string;
}

export interface EventRecord {
  id: string;
  date: string;       // 'YYYY-MM-DD' — used for day-wise bucketing
  timestamp: string;
  readerId: string;
  antennaId: number;
  epc: string;
  rssi: number;
  protocol: string;
  payload?: string;
}

/** Options for filtering/paginating event queries */
export interface EventQueryOptions {
  date?: string;       // Filter by specific day 'YYYY-MM-DD'
  from?: string;       // ISO timestamp range start
  to?: string;         // ISO timestamp range end
  readerId?: string;   // Filter by reader ID
  epc?: string;        // Filter by tag EPC
  protocol?: string;   // Filter by protocol
  limit?: number;      // Max records to return (default 1000)
  offset?: number;     // Pagination offset
}

/** Storage-level statistics about the event log */
export interface EventStorageStats {
  totalEvents: number;
  totalDays: number;
  oldestEventDate: string | null;
  newestEventDate: string | null;
  eventsByDate: { date: string; count: number }[];
}

export interface AntennaRecord {
  id: string;
  readerId: string;
  index: number;
  gain: number;
  power: number;
  frequency: number;
  rssiOffset: number;
  readZone: string;
  enabled: boolean;
}

export interface IStorageDriver {
  connect(): Promise<void>;
  disconnect(): Promise<void>;

  // Reader CRUD
  getReaders(): Promise<ReaderRecord[]>;
  getReaderById(id: string): Promise<ReaderRecord | null>;
  saveReader(reader: ReaderRecord): Promise<void>;
  deleteReader(id: string): Promise<void>;

  // Antenna Persistence
  saveAntenna(antenna: AntennaRecord): Promise<void>;
  getAntennasByReaderId(readerId: string): Promise<AntennaRecord[]>;

  // Tag CRUD
  getTags(): Promise<TagRecord[]>;
  getTagByEpc(epc: string): Promise<TagRecord | null>;
  saveTag(tag: TagRecord): Promise<void>;
  deleteTag(id: string): Promise<void>;

  // Event Log — basic
  logEvent(event: EventRecord): Promise<void>;

  // Event Log — advanced queries
  getEvents(options?: EventQueryOptions): Promise<EventRecord[]>;
  getEventsByDate(date: string, limit?: number, offset?: number): Promise<EventRecord[]>;
  getEventDates(): Promise<{ date: string; count: number }[]>;
  getEventStats(): Promise<EventStorageStats>;
  getEventCount(options?: Omit<EventQueryOptions, 'limit' | 'offset'>): Promise<number>;

  // Event Log — management
  deleteEventsByDate(date: string): Promise<{ deleted: number }>;
  clearAllEvents(): Promise<{ deleted: number }>;

  // Nuclear clear — wipes readers, tags, AND events
  clearAllData(): Promise<void>;
}
