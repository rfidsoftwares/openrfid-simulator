/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

export interface AppConfig {
  server: {
    port: number;
    host: string;
  };
  mqtt: {
    enabled: boolean;
    brokerUrl: string;
    topicPrefix: string;
  };
  websocket: {
    port: number;
  };
  storage: {
    dbPath: string;
    memoryEventLimit: number;       // Max in-memory events (default 10,000)
    eventWarningThreshold: number;  // Warn in UI when this many events in memory
    autoTrimEnabled: boolean;        // Auto-drop oldest events when limit hit
  };
  simulator: {
    defaultReadIntervalMs: number;
    defaultRssi: number;
  };
  [key: string]: any;
}

export const defaultConfig: AppConfig = {
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  mqtt: {
    enabled: false,
    brokerUrl: 'mqtt://localhost:1883',
    topicPrefix: 'openrfid',
  },
  websocket: {
    port: 3001,
  },
  storage: {
    dbPath: './openrfid.db',
    memoryEventLimit: 10_000,
    eventWarningThreshold: 8_000,
    autoTrimEnabled: true,
  },
  simulator: {
    defaultReadIntervalMs: 500,
    defaultRssi: -55,
  },
};

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export class ConfigManager {
  private config: AppConfig;
  private listeners: Set<(config: AppConfig) => void> = new Set();

  constructor(initialConfig: DeepPartial<AppConfig> = {}) {
    this.config = this.deepMerge({ ...defaultConfig }, initialConfig);
  }

  public get<T = any>(path: string): T {
    const keys = path.split('.');
    let current: any = this.config;
    for (const key of keys) {
      if (current === undefined || current === null) return undefined as any;
      current = current[key];
    }
    return current;
  }

  public set(path: string, value: any): void {
    const keys = path.split('.');
    let current: any = this.config;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
    current[keys[keys.length - 1]] = value;
    this.notify();
  }

  public getAll(): AppConfig {
    return { ...this.config };
  }

  public onChange(listener: (config: AppConfig) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    const freezeCopy = Object.freeze({ ...this.config });
    for (const listener of this.listeners) {
      listener(freezeCopy);
    }
  }

  private deepMerge(target: any, source: any): any {
    const output = { ...target };
    for (const key of Object.keys(source)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        output[key] = this.deepMerge(target[key] ?? {}, source[key]);
      } else {
        output[key] = source[key];
      }
    }
    return output;
  }
}
