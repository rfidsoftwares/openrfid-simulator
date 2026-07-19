/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

export interface TagProps {
  id?: string;
  epc: string;
  tid?: string;
  userMemory?: string;
  accessPassword?: string;
  killPassword?: string;
  protocol?: string;
}

export class Tag {
  public id: string;
  public epc: string;
  public tid: string;
  public userMemory: string;
  public accessPassword: string;
  public killPassword: string;
  public protocol: string;

  // Runtime dynamic states
  public readCount = 0;
  public currentRssi = -60;
  public lastSeen: number | null = null;
  public activeZone = 'DefaultZone';

  constructor(props: TagProps) {
    this.epc = props.epc.toUpperCase();
    this.id = props.id || `tag_${this.epc}`;
    this.tid = props.tid || `E280${this.epc.substring(4, 16)}`;
    this.userMemory = props.userMemory || '';
    this.accessPassword = props.accessPassword || '00000000';
    this.killPassword = props.killPassword || '00000000';
    this.protocol = props.protocol || 'GEN2';
  }

  public recordRead(rssi: number, timestamp = Date.now()): void {
    this.readCount++;
    this.currentRssi = rssi;
    this.lastSeen = timestamp;
  }

  public toJSON(): {
    id: string;
    epc: string;
    tid: string;
    userMemory: string;
    accessPassword: string;
    killPassword: string;
    protocol: string;
    readCount: number;
    currentRssi: number;
    lastSeen: number | null;
    activeZone: string;
  } {
    return {
      id: this.id,
      epc: this.epc,
      tid: this.tid,
      userMemory: this.userMemory,
      accessPassword: this.accessPassword,
      killPassword: this.killPassword,
      protocol: this.protocol,
      readCount: this.readCount,
      currentRssi: this.currentRssi,
      lastSeen: this.lastSeen,
      activeZone: this.activeZone,
    };
  }
}
