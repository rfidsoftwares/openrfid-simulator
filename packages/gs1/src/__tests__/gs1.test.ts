/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import { describe, it, expect } from 'vitest';
import { Sgtin96 } from '../sgtin96';
import { Grai96 } from '../grai96';
import { Giai96 } from '../giai96';

describe('GS1 Encoders and Decoders', () => {
  it('should encode and decode SGTIN-96 correctly', () => {
    const params = {
      filter: 1,
      partition: 5,
      companyPrefix: '0614141',
      itemRef: '123456',
      serialNumber: '10001',
    };

    const hex = Sgtin96.encode(params);
    expect(hex.length).toBe(24);
    expect(hex.startsWith('30')).toBe(true);

    const decoded = Sgtin96.decode(hex);
    expect(decoded.filter).toBe(params.filter);
    expect(decoded.partition).toBe(params.partition);
    expect(decoded.companyPrefix).toBe(params.companyPrefix);
    expect(decoded.itemRef).toBe(params.itemRef);
    expect(decoded.serialNumber).toBe(params.serialNumber);
  });

  it('should encode and decode GRAI-96 correctly', () => {
    const params = {
      filter: 3,
      partition: 5,
      companyPrefix: '1234567',
      assetType: '9999',
      serialNumber: '42',
    };

    const hex = Grai96.encode(params);
    expect(hex.length).toBe(24);
    expect(hex.startsWith('33')).toBe(true);

    const decoded = Grai96.decode(hex);
    expect(decoded.filter).toBe(params.filter);
    expect(decoded.companyPrefix).toBe(params.companyPrefix);
    expect(decoded.serialNumber).toBe(params.serialNumber);
  });

  it('should encode and decode GIAI-96 correctly', () => {
    const params = {
      filter: 0,
      partition: 5,
      companyPrefix: '9876543',
      individualAssetReference: '123456789',
    };

    const hex = Giai96.encode(params);
    expect(hex.length).toBe(24);
    expect(hex.startsWith('34')).toBe(true);

    const decoded = Giai96.decode(hex);
    expect(decoded.companyPrefix).toBe(params.companyPrefix);
    expect(decoded.individualAssetReference).toBe(params.individualAssetReference);
  });
});
