/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import { EventBus } from '@openrfid/core';
import { VirtualReader } from '@openrfid/readers';
import { Tag } from '@openrfid/tags';
import { RandomGenerator } from '@openrfid/utils';

export interface InventoryOptions {
  readIntervalMs?: number;
  readProbability?: number; // 0 to 1
  baseRssi?: number;
  maxTagsPerSecond?: number;
  epcFilterStart?: string;
  epcFilterEnd?: string;
  epcFilterPrefix?: string;
}

export class InventoryEngine {
  private timer: ReturnType<typeof setInterval> | null = null;
  private isRunning = false;
  private lastSecondStart = 0;
  private tagsReadThisSecond = 0;

  constructor(
    private reader: VirtualReader,
    /** A1 fix — accepts a live getter instead of a frozen snapshot */
    private getTags: () => Tag[],
    private eventBus: EventBus,
    private options: InventoryOptions = {}
  ) {}

  private getPeriodicIntervalMs(): number {
    const value = this.reader.readIntervalValue || 1;
    const unit = this.reader.readIntervalUnit || 'seconds';
    if (unit === 'hours') return value * 60 * 60 * 1000;
    if (unit === 'minutes') return value * 60 * 1000;
    return value * 1000;
  }

  private getEffectiveOptions() {
    return {
      readIntervalMs: this.reader.readMode === 'periodic'
        ? this.getPeriodicIntervalMs()
        : (this.options.readIntervalMs || 500),
      readProbability: this.options.readProbability ?? 0.95,
      baseRssi: this.options.baseRssi ?? -55.0,
      maxTagsPerSecond: this.options.maxTagsPerSecond ?? this.reader.readRate,
      epcFilterStart: this.options.epcFilterStart ?? this.reader.epcFilterStart,
      epcFilterEnd: this.options.epcFilterEnd ?? this.reader.epcFilterEnd,
      epcFilterPrefix: this.options.epcFilterPrefix ?? this.reader.epcFilterPrefix,
    };
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.reader.setStatus('ONLINE');

    this.eventBus.emit('ReaderConnected', {
      readerId: this.reader.id,
      name: this.reader.name,
      ip: this.reader.ip,
      port: this.reader.port,
    }).catch((e) => console.error('[EventBus] ReaderConnected error:', e));

    const effectiveOpts = this.getEffectiveOptions();
    const interval = effectiveOpts.readIntervalMs;
    this.timer = setInterval(() => {
      this.executeReadCycle();
    }, interval);
  }

  public stop(): void {
    if (!this.isRunning) return;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
    this.reader.setStatus('OFFLINE');

    this.eventBus.emit('ReaderDisconnected', {
      readerId: this.reader.id,
      reason: 'Simulator stopped',
    }).catch((e) => console.error('[EventBus] ReaderDisconnected error:', e));
  }

  public executeReadCycle(): number {
    if (this.reader.status !== 'ONLINE') return 0;
    let readCount = 0;

    const activeAntennas = this.reader.getActiveAntennas();
    if (activeAntennas.length === 0) return 0;

    const effectiveOpts = this.getEffectiveOptions();
    const baseProb = effectiveOpts.readProbability;
    const baseRssi = effectiveOpts.baseRssi;

    const now = Date.now();
    if (now - this.lastSecondStart >= 1000) {
      this.lastSecondStart = now;
      this.tagsReadThisSecond = 0;
    }

    // Apply EPC Filters:
    let tagsToRead = this.getTags();
    if (effectiveOpts.epcFilterPrefix) {
      const prefix = effectiveOpts.epcFilterPrefix.toUpperCase();
      tagsToRead = tagsToRead.filter((tag) => tag.epc.startsWith(prefix));
    }
    if (effectiveOpts.epcFilterStart || effectiveOpts.epcFilterEnd) {
      tagsToRead = tagsToRead.filter((tag) => {
        const epc = tag.epc;
        if (effectiveOpts.epcFilterStart && epc < effectiveOpts.epcFilterStart.toUpperCase()) return false;
        if (effectiveOpts.epcFilterEnd && epc > effectiveOpts.epcFilterEnd.toUpperCase()) return false;
        return true;
      });
    }

    // A1 fix — use live getter so newly-added tags are immediately visible
    for (const tag of tagsToRead) {
      if (effectiveOpts.maxTagsPerSecond > 0 && this.tagsReadThisSecond >= effectiveOpts.maxTagsPerSecond) {
        break;
      }

      for (const antenna of activeAntennas) {
        if (effectiveOpts.maxTagsPerSecond > 0 && this.tagsReadThisSecond >= effectiveOpts.maxTagsPerSecond) {
          break;
        }

        const antennaFactor = (antenna.power + antenna.gain) / 36.0;
        const totalProb = Math.min(1.0, baseProb * antennaFactor);

        if (RandomGenerator.boolean(totalProb)) {
          const rssiNoise = RandomGenerator.gaussian(0, 2.5);
          const calculatedRssi = parseFloat((baseRssi + antenna.rssiOffset + rssiNoise).toFixed(1));

          tag.recordRead(calculatedRssi);
          readCount++;
          this.tagsReadThisSecond++;

          // BUG-6 fix — attach .catch() so async errors are not silently swallowed
          this.eventBus.emit('TagDetected', {
            readerId: this.reader.id,
            antennaId: antenna.index,
            epc: tag.epc,
            tid: tag.tid,
            rssi: calculatedRssi,
            timestamp: Date.now(),
            protocol: tag.protocol,
          }).catch((e) => console.error('[EventBus] TagDetected error:', e));
        }
      }
    }

    return readCount;
  }

  public getStatus(): boolean {
    return this.isRunning;
  }
}
