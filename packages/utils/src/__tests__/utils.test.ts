/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import { describe, it, expect } from 'vitest';
import { RandomGenerator } from '../random';
import { DataFormatter } from '../formatters';
import { NetworkValidator } from '../network';

describe('Utils Package', () => {
  it('should generate numbers within uniform range', () => {
    for (let i = 0; i < 50; i++) {
      const val = RandomGenerator.uniform(5, 15);
      expect(val).toBeGreaterThanOrEqual(5);
      expect(val).toBeLessThanOrEqual(15);
    }
  });

  it('should format and parse CSV accurately', () => {
    const data = [
      { epc: 'E20000000001', rssi: '-55' },
      { epc: 'E20000000002', rssi: '-60' },
    ];
    const csv = DataFormatter.toCSV(data);
    const parsed = DataFormatter.parseCSV(csv);

    expect(parsed.length).toBe(2);
    expect(parsed[0].epc).toBe('E20000000001');
    expect(parsed[1].rssi).toBe('-60');
  });

  it('should validate IP addresses and ports', () => {
    expect(NetworkValidator.isValidIPv4('192.168.1.100')).toBe(true);
    expect(NetworkValidator.isValidIPv4('999.1.1.1')).toBe(false);
    expect(NetworkValidator.isValidPort(5084)).toBe(true);
    expect(NetworkValidator.isValidPort(70000)).toBe(false);
  });
});
