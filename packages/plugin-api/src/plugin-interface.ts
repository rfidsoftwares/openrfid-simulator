/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import { EventBus, ConfigManager, Logger, IStorageDriver } from '@openrfid/core';
import { SimulatorManager } from '@openrfid/simulator';

export interface PluginMetadata {
  name: string;
  version: string;
  author?: string;
  description?: string;
  dependencies?: Record<string, string>;
}

export interface PluginContext {
  eventBus: EventBus;
  config: ConfigManager;
  logger: Logger;
  simulator: SimulatorManager;
  storage?: IStorageDriver;
}

export interface IPlugin {
  getMetadata(): PluginMetadata;
  initialize(context: PluginContext): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void>;
  dispose(): Promise<void>;
}
