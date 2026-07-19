/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import { Antenna, AntennaProps } from './antenna';

export type ReaderStatus = 'OFFLINE' | 'ONLINE' | 'CONNECTING' | 'ERROR';

export interface ReaderProps {
  id?: string;
  name: string;
  vendor?: string;
  model?: string;
  ip?: string;
  port?: number;
  protocol?: string;
  antennasCount?: number;
  readRate?: number;
  readMode?: 'continuous' | 'periodic';
  readIntervalValue?: number;
  readIntervalUnit?: 'seconds' | 'minutes' | 'hours';
  epcFilterStart?: string;
  epcFilterEnd?: string;
  epcFilterPrefix?: string;
}

export class VirtualReader {
  public id: string;
  public name: string;
  public vendor: string;
  public model: string;
  public ip: string;
  public port: number;
  public protocol: string;
  public status: ReaderStatus = 'OFFLINE';
  public antennas: Map<number, Antenna> = new Map();
  public createdAt: string;
  public readRate: number;
  public readMode: 'continuous' | 'periodic';
  public readIntervalValue: number;
  public readIntervalUnit: 'seconds' | 'minutes' | 'hours';
  public epcFilterStart: string;
  public epcFilterEnd: string;
  public epcFilterPrefix: string;

  constructor(props: ReaderProps) {
    this.name = props.name;
    this.id = props.id || `reader_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    this.vendor = props.vendor || 'Generic';
    this.model = props.model || 'Simulated Reader v1';
    this.ip = props.ip || '127.0.0.1';
    this.port = props.port || 5084;
    this.protocol = props.protocol || 'LLRP';
    this.createdAt = new Date().toISOString();
    this.readRate = props.readRate ?? 0;
    this.readMode = props.readMode || 'continuous';
    this.readIntervalValue = props.readIntervalValue ?? 1;
    this.readIntervalUnit = props.readIntervalUnit || 'seconds';
    this.epcFilterStart = props.epcFilterStart || '';
    this.epcFilterEnd = props.epcFilterEnd || '';
    this.epcFilterPrefix = props.epcFilterPrefix || '';

    const count = props.antennasCount || 4;
    for (let i = 1; i <= count; i++) {
      this.antennas.set(i, new Antenna({ readerId: this.id, index: i }));
    }
  }

  public setStatus(status: ReaderStatus): void {
    this.status = status;
  }

  public getAntenna(index: number): Antenna | undefined {
    return this.antennas.get(index);
  }

  public getActiveAntennas(): Antenna[] {
    return Array.from(this.antennas.values()).filter((ant) => ant.enabled);
  }

  public addAntenna(props: Partial<AntennaProps>): Antenna {
    const nextIndex = props.index || this.antennas.size + 1;
    const antenna = new Antenna({ ...props, readerId: this.id, index: nextIndex });
    this.antennas.set(nextIndex, antenna);
    return antenna;
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      vendor: this.vendor,
      model: this.model,
      ip: this.ip,
      port: this.port,
      protocol: this.protocol,
      status: this.status,
      createdAt: this.createdAt,
      antennas: Array.from(this.antennas.values()).map((a) => a.toJSON()),
      readRate: this.readRate,
      readMode: this.readMode,
      readIntervalValue: this.readIntervalValue,
      readIntervalUnit: this.readIntervalUnit,
      epcFilterStart: this.epcFilterStart,
      epcFilterEnd: this.epcFilterEnd,
      epcFilterPrefix: this.epcFilterPrefix,
    };
  }
}
