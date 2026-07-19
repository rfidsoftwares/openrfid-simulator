/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import { describe, it, expect } from 'vitest';
import { ReaderStatusBadge } from '../components/ReaderStatusBadge';
import { TagSignalMeter } from '../components/TagSignalMeter';

describe('@openrfid/ui components', () => {
  it('should export component functions', () => {
    expect(typeof ReaderStatusBadge).toBe('function');
    expect(typeof TagSignalMeter).toBe('function');
  });
});
