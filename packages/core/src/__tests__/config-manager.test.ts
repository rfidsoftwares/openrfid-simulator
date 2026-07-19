/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import { describe, it, expect } from 'vitest';
import { ConfigManager, defaultConfig } from '../config-manager';

describe('ConfigManager', () => {
  it('should initialize with default config', () => {
    const config = new ConfigManager();
    expect(config.get('server.port')).toBe(3000);
    expect(config.get('mqtt.brokerUrl')).toBe('mqtt://localhost:1883');
  });

  it('should set and get values correctly', () => {
    const config = new ConfigManager();
    config.set('server.port', 8080);
    expect(config.get('server.port')).toBe(8080);
  });

  it('should notify listeners on change', () => {
    const config = new ConfigManager();
    let updatedPort = 0;
    config.onChange((newConfig) => {
      updatedPort = newConfig.server.port;
    });

    config.set('server.port', 9090);
    expect(updatedPort).toBe(9090);
  });
});
