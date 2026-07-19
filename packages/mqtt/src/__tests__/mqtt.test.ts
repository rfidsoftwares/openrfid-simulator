/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { EventBus, ConfigManager, Logger } from '@openrfid/core';
import { SimulatorManager } from '@openrfid/simulator';
import { MqttPlugin } from '../mqtt-plugin';

describe('@openrfid/mqtt plugin', () => {
  let plugin: MqttPlugin;
  let eventBus: EventBus;

  beforeEach(async () => {
    eventBus = new EventBus();
    const config = new ConfigManager({ mqtt: { enabled: false } });
    const logger = new Logger('Test');
    const simulator = new SimulatorManager(eventBus);

    plugin = new MqttPlugin();
    await plugin.initialize({ eventBus, config, logger, simulator });
  });

  afterEach(async () => {
    await plugin.stop();
  });

  it('should initialize and report metadata', () => {
    const meta = plugin.getMetadata();
    expect(meta.name).toBe('mqtt-telemetry');
    expect(meta.version).toBe('0.1.0');
  });
});
