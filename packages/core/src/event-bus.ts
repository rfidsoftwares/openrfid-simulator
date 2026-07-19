/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

export interface EventMap {
  ReaderConnected: { readerId: string; name: string; ip: string; port: number };
  ReaderDisconnected: { readerId: string; reason?: string };
  TagDetected: {
    readerId: string;
    antennaId: number;
    epc: string;
    tid?: string;
    rssi: number;
    timestamp: number;
    protocol?: string;
  };
  TagRemoved: { epc: string; readerId: string; timestamp: number };
  TagMoved: { epc: string; fromZone?: string; toZone?: string; timestamp: number };
  ReaderError: { readerId: string; error: string; code?: string };
  MQTTPublished: { topic: string; payload: string; qos: number };
  HTTPRequestReceived: { method: string; path: string; statusCode: number };
  SystemLog: { level: 'debug' | 'info' | 'warn' | 'error'; message: string; data?: any };
}

export type EventHandler<T = any> = (payload: T) => void | Promise<void>;

export class EventBus {
  private listeners: Map<string, Set<EventHandler>> = new Map();

  public on<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): () => void {
    const eventName = String(event);
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName)!.add(handler as EventHandler);

    return () => this.off(event, handler);
  }

  public off<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): void {
    const eventName = String(event);
    const handlers = this.listeners.get(eventName);
    if (handlers) {
      handlers.delete(handler as EventHandler);
      if (handlers.size === 0) {
        this.listeners.delete(eventName);
      }
    }
  }

  public async emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): Promise<void> {
    const eventName = String(event);
    const handlers = this.listeners.get(eventName);
    if (handlers) {
      const promises: Array<void | Promise<void>> = [];
      for (const handler of handlers) {
        try {
          promises.push(handler(payload));
        } catch (err) {
          console.error(`Error in event handler for event '${eventName}':`, err);
        }
      }
      await Promise.all(promises);
    }
  }

  public removeAllListeners(event?: keyof EventMap): void {
    if (event) {
      this.listeners.delete(String(event));
    } else {
      this.listeners.clear();
    }
  }

  public listenerCount(event: keyof EventMap): number {
    return this.listeners.get(String(event))?.size ?? 0;
  }
}
