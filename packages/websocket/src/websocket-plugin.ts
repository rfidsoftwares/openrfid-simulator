/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import { WebSocketServer, WebSocket } from 'ws';
import { IPlugin, PluginContext, PluginMetadata } from '@openrfid/plugin-api';
import { EventMap } from '@openrfid/core';

export class WebSocketPlugin implements IPlugin {
  public wss: WebSocketServer | null = null;
  private context: PluginContext | null = null;
  private unsubscribeEvents: Array<() => void> = [];

  getMetadata(): PluginMetadata {
    return {
      name: 'websocket-broadcast',
      version: '0.1.0',
      description: 'Real-time WebSocket event broadcaster plugin',
    };
  }

  async initialize(context: PluginContext): Promise<void> {
    this.context = context;
  }

  async start(): Promise<void> {
    if (!this.context) return;
    const port = this.context.config.get('websocket.port') || 3001;

    this.wss = new WebSocketServer({ port });
    this.context.logger.info(`WebSocket plugin running on ws://localhost:${port}`);

    // Subscribe to EventBus and broadcast to all connected WS clients
    const eventsToBroadcast: Array<keyof EventMap> = ['TagDetected', 'ReaderConnected', 'ReaderDisconnected', 'TagRemoved', 'TagMoved'];

    for (const eventName of eventsToBroadcast) {
      const unsub = this.context.eventBus.on(eventName, (payload) => {
        this.broadcast({ event: eventName, data: payload, timestamp: Date.now() });
      });
      this.unsubscribeEvents.push(unsub);
    }
  }

  public broadcast(message: any): void {
    if (!this.wss) return;
    const jsonStr = JSON.stringify(message);

    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(jsonStr);
      }
    });
  }

  async stop(): Promise<void> {
    for (const unsub of this.unsubscribeEvents) {
      unsub();
    }
    this.unsubscribeEvents = [];

    if (this.wss) {
      this.wss.close();
      this.wss = null;
    }
  }

  async dispose(): Promise<void> {
    await this.stop();
  }
}
