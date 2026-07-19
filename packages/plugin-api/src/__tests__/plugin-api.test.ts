/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import { describe, it, expect, vi } from 'vitest';
import { EventBus, ConfigManager, Logger } from '@openrfid/core';
import { SimulatorManager } from '@openrfid/simulator';
import { IPlugin, PluginContext, PluginMetadata } from '../plugin-interface';
import { PluginManager } from '../plugin-manager';

class MockPlugin implements IPlugin {
  public initialized = false;
  public started = false;
  public stopped = false;

  getMetadata(): PluginMetadata {
    return { name: 'mock-plugin', version: '1.0.0' };
  }
  async initialize(context: PluginContext): Promise<void> {
    this.initialized = true;
  }
  async start(): Promise<void> {
    this.started = true;
  }
  async stop(): Promise<void> {
    this.stopped = true;
  }
  async dispose(): Promise<void> {}
}

describe('@openrfid/plugin-api package', () => {
  it('should register, initialize, start, and stop plugins correctly', async () => {
    const eventBus = new EventBus();
    const config = new ConfigManager();
    const logger = new Logger('Test');
    const simulator = new SimulatorManager(eventBus);

    const manager = new PluginManager({ eventBus, config, logger, simulator });
    const plugin = new MockPlugin();

    manager.register(plugin);
    expect(manager.getPlugin('mock-plugin')?.state).toBe('REGISTERED');

    await manager.initializeAll();
    expect(plugin.initialized).toBe(true);
    expect(manager.getPlugin('mock-plugin')?.state).toBe('INITIALIZED');

    await manager.startAll();
    expect(plugin.started).toBe(true);
    expect(manager.getPlugin('mock-plugin')?.state).toBe('STARTED');

    await manager.stopAll();
    expect(plugin.stopped).toBe(true);
    expect(manager.getPlugin('mock-plugin')?.state).toBe('STOPPED');
  });
});
