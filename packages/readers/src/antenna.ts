/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

export interface AntennaProps {
  id?: string;
  readerId: string;
  index: number; // 1 to 16
  gain?: number; // dBi (default 6.0)
  power?: number; // dBm (default 30.0)
  frequency?: number; // MHz (default 915.0)
  rssiOffset?: number; // dB offset (default 0)
  readZone?: string; // Zone identifier
  enabled?: boolean;
}

export class Antenna {
  public id: string;
  public readerId: string;
  public index: number;
  public gain: number;
  public power: number;
  public frequency: number;
  public rssiOffset: number;
  public readZone: string;
  public enabled: boolean;

  constructor(props: AntennaProps) {
    if (props.index < 1 || props.index > 16) {
      throw new Error(`Antenna index must be between 1 and 16 (got ${props.index})`);
    }
    this.readerId = props.readerId;
    this.index = props.index;
    this.id = props.id || `${props.readerId}_ant_${props.index}`;
    this.gain = props.gain ?? 6.0;
    this.power = props.power ?? 30.0;
    this.frequency = props.frequency ?? 915.0;
    this.rssiOffset = props.rssiOffset ?? 0;
    this.readZone = props.readZone || 'DefaultZone';
    this.enabled = props.enabled ?? true;
  }

  public toJSON(): AntennaProps {
    return {
      id: this.id,
      readerId: this.readerId,
      index: this.index,
      gain: this.gain,
      power: this.power,
      frequency: this.frequency,
      rssiOffset: this.rssiOffset,
      readZone: this.readZone,
      enabled: this.enabled,
    };
  }
}
