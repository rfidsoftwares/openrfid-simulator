/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import Database from 'better-sqlite3';
import {
  IStorageDriver,
  ReaderRecord,
  TagRecord,
  EventRecord,
  EventQueryOptions,
  EventStorageStats,
  AntennaRecord,
} from './storage-interface';

export class SqliteStorageDriver implements IStorageDriver {
  private db: Database.Database | null = null;

  constructor(private dbPath: string = ':memory:') {}

  public async connect(): Promise<void> {
    this.db = new Database(this.dbPath);
    this.db.pragma('journal_mode = WAL');
    this.initTables();
  }

  public async disconnect(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  private initTables(): void {
    if (!this.db) return;

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS readers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        vendor TEXT NOT NULL,
        model TEXT NOT NULL,
        ip TEXT NOT NULL,
        port INTEGER NOT NULL,
        protocol TEXT NOT NULL,
        status TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        readRate INTEGER DEFAULT 0,
        readMode TEXT DEFAULT 'continuous',
        readIntervalValue INTEGER DEFAULT 1,
        readIntervalUnit TEXT DEFAULT 'seconds',
        epcFilterStart TEXT DEFAULT '',
        epcFilterEnd TEXT DEFAULT '',
        epcFilterPrefix TEXT DEFAULT ''
      );

      CREATE TABLE IF NOT EXISTS antennas (
        id TEXT PRIMARY KEY,
        reader_id TEXT NOT NULL,
        antenna_index INTEGER NOT NULL,
        gain REAL NOT NULL,
        power REAL NOT NULL,
        frequency REAL NOT NULL,
        rssi_offset REAL NOT NULL,
        read_zone TEXT NOT NULL,
        enabled INTEGER NOT NULL DEFAULT 1,
        FOREIGN KEY (reader_id) REFERENCES readers(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS tags (
        id TEXT PRIMARY KEY,
        epc TEXT UNIQUE NOT NULL,
        tid TEXT,
        userMemory TEXT,
        accessPassword TEXT,
        killPassword TEXT,
        protocol TEXT
      );

      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        readerId TEXT NOT NULL,
        antennaId INTEGER NOT NULL,
        epc TEXT NOT NULL,
        rssi REAL NOT NULL,
        protocol TEXT NOT NULL,
        payload TEXT
      );

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS plugins (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        version TEXT NOT NULL,
        status TEXT NOT NULL,
        config TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
      CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp);
      CREATE INDEX IF NOT EXISTS idx_events_epc ON events(epc);
      CREATE INDEX IF NOT EXISTS idx_events_reader ON events(readerId);
      CREATE INDEX IF NOT EXISTS idx_tags_epc ON tags(epc);
    `);
  }

  // ─── Readers ─────────────────────────────────────────────────────────────

  public async getReaders(): Promise<ReaderRecord[]> {
    this.checkConnection();
    return this.db!.prepare('SELECT * FROM readers').all() as ReaderRecord[];
  }

  public async getReaderById(id: string): Promise<ReaderRecord | null> {
    this.checkConnection();
    const row = this.db!.prepare('SELECT * FROM readers WHERE id = ?').get(id);
    return row ? (row as ReaderRecord) : null;
  }

  public async saveReader(reader: ReaderRecord): Promise<void> {
    this.checkConnection();
    this.db!.prepare(`
      INSERT INTO readers (id, name, vendor, model, ip, port, protocol, status, createdAt,
                           readRate, readMode, readIntervalValue, readIntervalUnit,
                           epcFilterStart, epcFilterEnd, epcFilterPrefix)
      VALUES (@id, @name, @vendor, @model, @ip, @port, @protocol, @status, @createdAt,
              @readRate, @readMode, @readIntervalValue, @readIntervalUnit,
              @epcFilterStart, @epcFilterEnd, @epcFilterPrefix)
      ON CONFLICT(id) DO UPDATE SET
        name=excluded.name, vendor=excluded.vendor, model=excluded.model,
        ip=excluded.ip, port=excluded.port, protocol=excluded.protocol,
        status=excluded.status, readRate=excluded.readRate, readMode=excluded.readMode,
        readIntervalValue=excluded.readIntervalValue, readIntervalUnit=excluded.readIntervalUnit,
        epcFilterStart=excluded.epcFilterStart, epcFilterEnd=excluded.epcFilterEnd,
        epcFilterPrefix=excluded.epcFilterPrefix
    `).run({
      ...reader,
      readRate: reader.readRate ?? 0,
      readMode: reader.readMode ?? 'continuous',
      readIntervalValue: reader.readIntervalValue ?? 1,
      readIntervalUnit: reader.readIntervalUnit ?? 'seconds',
      epcFilterStart: reader.epcFilterStart ?? '',
      epcFilterEnd: reader.epcFilterEnd ?? '',
      epcFilterPrefix: reader.epcFilterPrefix ?? '',
    });
  }

  public async deleteReader(id: string): Promise<void> {
    this.checkConnection();
    this.db!.prepare('DELETE FROM readers WHERE id = ?').run(id);
  }

  // ─── Antennas ─────────────────────────────────────────────────────────────

  public async saveAntenna(antenna: AntennaRecord): Promise<void> {
    this.checkConnection();
    this.db!.prepare(`
      INSERT INTO antennas (id, reader_id, antenna_index, gain, power, frequency, rssi_offset, read_zone, enabled)
      VALUES (@id, @readerId, @index, @gain, @power, @frequency, @rssiOffset, @readZone, @enabled)
      ON CONFLICT(id) DO UPDATE SET
        gain=excluded.gain, power=excluded.power, frequency=excluded.frequency,
        rssi_offset=excluded.rssi_offset, read_zone=excluded.read_zone, enabled=excluded.enabled
    `).run({
      id: antenna.id,
      readerId: antenna.readerId,
      index: antenna.index,
      gain: antenna.gain,
      power: antenna.power,
      frequency: antenna.frequency,
      rssiOffset: antenna.rssiOffset,
      readZone: antenna.readZone,
      enabled: antenna.enabled ? 1 : 0,
    });
  }

  public async getAntennasByReaderId(readerId: string): Promise<AntennaRecord[]> {
    this.checkConnection();
    const rows = this.db!.prepare('SELECT * FROM antennas WHERE reader_id = ?').all(readerId) as any[];
    return rows.map((r) => ({
      id: r.id,
      readerId: r.reader_id,
      index: r.antenna_index,
      gain: r.gain,
      power: r.power,
      frequency: r.frequency,
      rssiOffset: r.rssi_offset,
      readZone: r.read_zone,
      enabled: r.enabled === 1,
    }));
  }

  // ─── Tags ─────────────────────────────────────────────────────────────────

  public async getTags(): Promise<TagRecord[]> {
    this.checkConnection();
    return this.db!.prepare('SELECT * FROM tags').all() as TagRecord[];
  }

  public async getTagByEpc(epc: string): Promise<TagRecord | null> {
    this.checkConnection();
    const row = this.db!.prepare('SELECT * FROM tags WHERE epc = ?').get(epc);
    return row ? (row as TagRecord) : null;
  }

  public async saveTag(tag: TagRecord): Promise<void> {
    this.checkConnection();
    // Fixed: use ON CONFLICT(epc) — epc is the natural unique key
    this.db!.prepare(`
      INSERT INTO tags (id, epc, tid, userMemory, accessPassword, killPassword, protocol)
      VALUES (@id, @epc, @tid, @userMemory, @accessPassword, @killPassword, @protocol)
      ON CONFLICT(epc) DO UPDATE SET
        tid=excluded.tid, userMemory=excluded.userMemory,
        accessPassword=excluded.accessPassword, killPassword=excluded.killPassword,
        protocol=excluded.protocol
    `).run({
      id: tag.id,
      epc: tag.epc,
      tid: tag.tid ?? null,
      userMemory: tag.userMemory ?? null,
      accessPassword: tag.accessPassword ?? null,
      killPassword: tag.killPassword ?? null,
      protocol: tag.protocol ?? null,
    });
  }

  public async deleteTag(id: string): Promise<void> {
    this.checkConnection();
    this.db!.prepare('DELETE FROM tags WHERE id = ?').run(id);
  }

  // ─── Events — basic ───────────────────────────────────────────────────────

  public async logEvent(event: EventRecord): Promise<void> {
    this.checkConnection();
    this.db!.prepare(`
      INSERT INTO events (id, date, timestamp, readerId, antennaId, epc, rssi, protocol, payload)
      VALUES (@id, @date, @timestamp, @readerId, @antennaId, @epc, @rssi, @protocol, @payload)
    `).run({
      id: event.id,
      date: event.date,
      timestamp: event.timestamp,
      readerId: event.readerId,
      antennaId: event.antennaId,
      epc: event.epc,
      rssi: event.rssi,
      protocol: event.protocol,
      payload: event.payload ?? null,
    });
  }

  // ─── Events — advanced queries ────────────────────────────────────────────

  public async getEvents(options: EventQueryOptions = {}): Promise<EventRecord[]> {
    this.checkConnection();
    let sql = 'SELECT * FROM events WHERE 1=1';
    const params: any[] = [];

    if (options.date)     { sql += ' AND date = ?';        params.push(options.date); }
    if (options.from)     { sql += ' AND timestamp >= ?';  params.push(options.from); }
    if (options.to)       { sql += ' AND timestamp <= ?';  params.push(options.to); }
    if (options.readerId) { sql += ' AND readerId = ?';    params.push(options.readerId); }
    if (options.epc)      { sql += ' AND epc = ?';         params.push(options.epc); }
    if (options.protocol) { sql += ' AND protocol = ?';    params.push(options.protocol); }

    sql += ' ORDER BY timestamp DESC';
    sql += ` LIMIT ${options.limit ?? 1000} OFFSET ${options.offset ?? 0}`;

    return this.db!.prepare(sql).all(...params) as EventRecord[];
  }

  public async getEventsByDate(date: string, limit = 1000, offset = 0): Promise<EventRecord[]> {
    this.checkConnection();
    return this.db!.prepare(
      'SELECT * FROM events WHERE date = ? ORDER BY timestamp DESC LIMIT ? OFFSET ?'
    ).all(date, limit, offset) as EventRecord[];
  }

  public async getEventDates(): Promise<{ date: string; count: number }[]> {
    this.checkConnection();
    return this.db!.prepare(
      'SELECT date, COUNT(*) as count FROM events GROUP BY date ORDER BY date DESC'
    ).all() as { date: string; count: number }[];
  }

  public async getEventStats(): Promise<EventStorageStats> {
    this.checkConnection();
    const total = (this.db!.prepare('SELECT COUNT(*) as n FROM events').get() as any).n as number;
    const oldest = (this.db!.prepare('SELECT MIN(date) as d FROM events').get() as any).d as string | null;
    const newest = (this.db!.prepare('SELECT MAX(date) as d FROM events').get() as any).d as string | null;
    const byDate = await this.getEventDates();

    return {
      totalEvents: total,
      totalDays: byDate.length,
      oldestEventDate: oldest,
      newestEventDate: newest,
      eventsByDate: byDate,
    };
  }

  public async getEventCount(options: Omit<EventQueryOptions, 'limit' | 'offset'> = {}): Promise<number> {
    this.checkConnection();
    let sql = 'SELECT COUNT(*) as n FROM events WHERE 1=1';
    const params: any[] = [];

    if (options.date)     { sql += ' AND date = ?';       params.push(options.date); }
    if (options.from)     { sql += ' AND timestamp >= ?'; params.push(options.from); }
    if (options.to)       { sql += ' AND timestamp <= ?'; params.push(options.to); }
    if (options.readerId) { sql += ' AND readerId = ?';   params.push(options.readerId); }
    if (options.epc)      { sql += ' AND epc = ?';        params.push(options.epc); }
    if (options.protocol) { sql += ' AND protocol = ?';   params.push(options.protocol); }

    return (this.db!.prepare(sql).get(...params) as any).n as number;
  }

  // ─── Events — management ─────────────────────────────────────────────────

  public async deleteEventsByDate(date: string): Promise<{ deleted: number }> {
    this.checkConnection();
    const result = this.db!.prepare('DELETE FROM events WHERE date = ?').run(date);
    return { deleted: result.changes };
  }

  public async clearAllEvents(): Promise<{ deleted: number }> {
    this.checkConnection();
    const result = this.db!.prepare('DELETE FROM events').run();
    return { deleted: result.changes };
  }

  // Nuclear clear — wipes all data
  public async clearAllData(): Promise<void> {
    this.checkConnection();
    this.db!.exec('DELETE FROM events; DELETE FROM tags; DELETE FROM readers; DELETE FROM antennas;');
  }

  // ─── Internal ────────────────────────────────────────────────────────────

  private checkConnection(): void {
    if (!this.db) {
      throw new Error('Database is not connected. Call connect() first.');
    }
  }
}
