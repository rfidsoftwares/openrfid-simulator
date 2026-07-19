/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import { describe, it, expect } from 'vitest';
import { EpcGen2 } from '../epc-gen2';

describe('EpcGen2', () => {
  it('should convert hex to binary and back correctly', () => {
    const hex = 'E2001234567890ABCDEF1234';
    const binary = EpcGen2.hexToBinary(hex);
    expect(binary.length).toBe(96);
    expect(EpcGen2.binaryToHex(binary)).toBe(hex);
  });

  it('should convert ASCII to hex and back correctly', () => {
    const ascii = 'RFID-TEST';
    const hex = EpcGen2.asciiToHex(ascii);
    expect(EpcGen2.hexToAscii(hex)).toBe(ascii);
  });

  it('should generate valid sequential EPCs', () => {
    const epc1 = EpcGen2.generateSequentialEpc(1);
    const epc2 = EpcGen2.generateSequentialEpc(2);
    expect(epc1.length).toBe(24);
    expect(epc1).toBe('E20000000000000000000001');
    expect(epc2).toBe('E20000000000000000000002');
  });

  it('should generate random EPCs with custom header', () => {
    const epc = EpcGen2.generateRandomEpc('3034');
    expect(epc.startsWith('3034')).toBe(true);
    expect(epc.length).toBe(24);
  });
});
