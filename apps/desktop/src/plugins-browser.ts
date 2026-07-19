/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import { IPlugin, PluginContext, PluginMetadata } from '@openrfid/plugin-api';

export class BrowserRestPlugin implements IPlugin {
  getMetadata(): PluginMetadata {
    return {
      name: 'rest-api-server',
      version: '0.1.0',
      description: 'Fastify HTTP REST API plugin (Running in Simulation Mode)',
    };
  }
  async initialize(context: PluginContext): Promise<void> {}
  async start(): Promise<void> {}
  async stop(): Promise<void> {}
  async dispose(): Promise<void> {}
}

export class BrowserWebSocketPlugin implements IPlugin {
  getMetadata(): PluginMetadata {
    return {
      name: 'websocket-broadcaster',
      version: '0.1.0',
      description: 'Real-time WebSocket broadcasting server plugin (Running in Simulation Mode)',
    };
  }
  async initialize(context: PluginContext): Promise<void> {}
  async start(): Promise<void> {}
  async stop(): Promise<void> {}
  async dispose(): Promise<void> {}
}

export class BrowserMqttPlugin implements IPlugin {
  getMetadata(): PluginMetadata {
    return {
      name: 'mqtt-telemetry',
      version: '0.1.0',
      description: 'MQTT client publisher and remote control listener plugin (Running in Simulation Mode)',
    };
  }
  async initialize(context: PluginContext): Promise<void> {}
  async start(): Promise<void> {}
  async stop(): Promise<void> {}
  async dispose(): Promise<void> {}
}

export class BrowserHopelandDiscoveryPlugin implements IPlugin {
  private socket: WebSocket | null = null;
  private context: PluginContext | null = null;
  private reconnectTimer: any = null;
  private isStarted = false;

  getMetadata(): PluginMetadata {
    return {
      name: 'hopeland-discovery',
      version: '0.1.0',
      description: 'Hopeland/Identium UDP multicast discovery bridge (Active client connection to background runner)',
    };
  }

  async initialize(context: PluginContext): Promise<void> {
    this.context = context;
  }

  async start(): Promise<void> {
    this.isStarted = true;
    this.connectBridge();

    // Listen to EventBus events to forward to the runner
    this.context?.eventBus.on('TagDetected', (payload) => {
      this.send({
        type: 'tag-detected',
        epc: payload.epc,
        tid: payload.tid,
        antennaId: payload.antennaId,
        rssi: payload.rssi,
      });
    });

    this.context?.eventBus.on('ReaderConnected', (payload) => {
      this.sendReaderStatus(payload.readerId, 'ONLINE');
    });

    this.context?.eventBus.on('ReaderDisconnected', (payload) => {
      this.sendReaderStatus(payload.readerId, 'OFFLINE');
    });
  }

  private connectBridge() {
    if (!this.isStarted || this.socket) return;

    this.socket = new WebSocket('ws://localhost:9098');

    this.socket.onopen = () => {
      this.context?.logger.info('[HopelandBridge] Connected to background runner.');
      // Send initial status of all readers
      const readers = this.context?.simulator.getAllReaders() || [];
      for (const r of readers) {
        this.sendReaderStatus(r.id, r.status === 'ONLINE' ? 'ONLINE' : 'OFFLINE');
      }
    };

    this.socket.onclose = () => {
      this.socket = null;
      if (this.isStarted && !this.reconnectTimer) {
        this.reconnectTimer = setTimeout(() => {
          this.reconnectTimer = null;
          this.connectBridge();
        }, 3000);
      }
    };

    this.socket.onerror = () => {
      this.socket?.close();
    };
  }

  private sendReaderStatus(readerId: string, status: 'ONLINE' | 'OFFLINE') {
    const reader = this.context?.simulator.getReader(readerId);
    if (!reader) return;
    this.send({
      type: 'reader-status',
      id: reader.id,
      name: reader.name,
      status,
      ip: reader.ip,
      port: reader.port,
      vendor: reader.vendor,
    });
  }

  private send(data: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }

  async stop(): Promise<void> {
    this.isStarted = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  async dispose(): Promise<void> {
    await this.stop();
  }
}

