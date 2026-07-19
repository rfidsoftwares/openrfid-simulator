/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import { IPlugin, PluginContext, PluginMetadata } from './plugin-interface';

export type PluginState = 'REGISTERED' | 'INITIALIZED' | 'STARTED' | 'STOPPED' | 'ERROR';

export interface RegisteredPlugin {
  instance: IPlugin;
  metadata: PluginMetadata;
  state: PluginState;
  error?: string;
}

export class PluginManager {
  private plugins = new Map<string, RegisteredPlugin>();

  constructor(private context: PluginContext) {}

  public register(plugin: IPlugin): void {
    const metadata = plugin.getMetadata();
    if (this.plugins.has(metadata.name)) {
      throw new Error(`Plugin '${metadata.name}' is already registered.`);
    }

    this.plugins.set(metadata.name, {
      instance: plugin,
      metadata,
      state: 'REGISTERED',
    });
  }

  public async initializeAll(): Promise<void> {
    for (const item of this.plugins.values()) {
      try {
        await item.instance.initialize(this.context);
        item.state = 'INITIALIZED';
      } catch (err: any) {
        item.state = 'ERROR';
        item.error = err.message || String(err);
        this.context.logger.error(`Failed to initialize plugin '${item.metadata.name}'`, err);
      }
    }
  }

  public async startAll(): Promise<void> {
    for (const item of this.plugins.values()) {
      if (item.state === 'INITIALIZED' || item.state === 'STOPPED') {
        try {
          await item.instance.start();
          item.state = 'STARTED';
        } catch (err: any) {
          item.state = 'ERROR';
          item.error = err.message || String(err);
          this.context.logger.error(`Failed to start plugin '${item.metadata.name}'`, err);
        }
      }
    }
  }

  public async stopAll(): Promise<void> {
    for (const item of this.plugins.values()) {
      if (item.state === 'STARTED') {
        try {
          await item.instance.stop();
          item.state = 'STOPPED';
        } catch (err: any) {
          item.state = 'ERROR';
          item.error = err.message || String(err);
        }
      }
    }
  }

  public async unregister(name: string): Promise<void> {
    const item = this.plugins.get(name);
    if (!item) return;

    if (item.state === 'STARTED') {
      try {
        await item.instance.stop();
      } catch (err) {
        this.context.logger.error(`Error stopping plugin '${name}' during unregister:`, err);
      }
    }

    try {
      await item.instance.dispose?.();
    } catch (err) {
      this.context.logger.error(`Error disposing plugin '${name}' during unregister:`, err);
    }

    this.plugins.delete(name);
  }

  public async disposeAll(): Promise<void> {
    for (const name of Array.from(this.plugins.keys())) {
      await this.unregister(name);
    }
  }

  public getPlugin(name: string): RegisteredPlugin | undefined {
    return this.plugins.get(name);
  }

  public getAllPlugins(): RegisteredPlugin[] {
    return Array.from(this.plugins.values());
  }
}
