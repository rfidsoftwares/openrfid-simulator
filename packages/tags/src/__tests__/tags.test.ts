/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import { describe, it, expect } from 'vitest';
import { Tag } from '../tag-model';
import { TagGenerator } from '../tag-generator';
import { TagSerializer } from '../tag-serializer';

describe('@openrfid/tags package', () => {
  it('should initialize tag and update metrics on read', () => {
    const tag = new Tag({ epc: 'E20000000001' });
    expect(tag.epc).toBe('E20000000001');
    expect(tag.readCount).toBe(0);

    tag.recordRead(-52);
    expect(tag.readCount).toBe(1);
    expect(tag.currentRssi).toBe(-52);
    expect(tag.lastSeen).toBeGreaterThan(0);
  });

  it('should generate batch of sequential tags', () => {
    const batch = TagGenerator.generateBatch({ count: 5, type: 'sequential' });
    expect(batch.length).toBe(5);
    expect(batch[0].epc).toBe('E20000000000000000000001');
    expect(batch[4].epc).toBe('E20000000000000000000005');
  });

  it('should generate batch of SGTIN-96 tags', () => {
    const batch = TagGenerator.generateBatch({ count: 3, type: 'sgtin96' });
    expect(batch.length).toBe(3);
    expect(batch[0].epc.startsWith('30')).toBe(true);
  });

  it('should serialize and deserialize tags via CSV and JSON', () => {
    const original = TagGenerator.generateBatch({ count: 2, type: 'sequential' });
    const jsonStr = TagSerializer.toJSON(original);
    const restoredFromJson = TagSerializer.fromJSON(jsonStr);

    expect(restoredFromJson.length).toBe(2);
    expect(restoredFromJson[0].epc).toBe(original[0].epc);

    const csvStr = TagSerializer.toCSV(original);
    const restoredFromCsv = TagSerializer.fromCSV(csvStr);
    expect(restoredFromCsv.length).toBe(2);
    expect(restoredFromCsv[1].epc).toBe(original[1].epc);
  });
});
