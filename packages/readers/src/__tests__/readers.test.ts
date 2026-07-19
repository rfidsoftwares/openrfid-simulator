/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import { describe, it, expect } from 'vitest';
import { VirtualReader } from '../reader';
import { Antenna } from '../antenna';

describe('@openrfid/readers package', () => {
  it('should initialize reader with 4 default antennas', () => {
    const reader = new VirtualReader({ name: 'Dock 1 Reader' });
    expect(reader.name).toBe('Dock 1 Reader');
    expect(reader.status).toBe('OFFLINE');
    expect(reader.antennas.size).toBe(4);
  });

  it('should manage antenna configuration', () => {
    const reader = new VirtualReader({ name: 'Portal Reader', antennasCount: 2 });
    expect(reader.getActiveAntennas().length).toBe(2);

    const ant1 = reader.getAntenna(1);
    expect(ant1?.power).toBe(30.0);

    ant1!.enabled = false;
    expect(reader.getActiveAntennas().length).toBe(1);
  });

  it('should throw error if antenna index is out of 1-16 bounds', () => {
    expect(() => new Antenna({ readerId: 'r1', index: 0 })).toThrow();
    expect(() => new Antenna({ readerId: 'r1', index: 17 })).toThrow();
  });
});
