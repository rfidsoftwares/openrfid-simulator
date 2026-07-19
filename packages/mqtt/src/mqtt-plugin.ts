/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import mqtt, { MqttClient } from 'mqtt';
import { IPlugin, PluginContext, PluginMetadata } from '@openrfid/plugin-api';

export class MqttPlugin implements IPlugin {
  public client: MqttClient | null = null;
  private context: PluginContext | null = null;
  private unsubscribers: Array<() => void> = [];

  getMetadata(): PluginMetadata {
    return {
      name: 'mqtt-telemetry',
      version: '0.1.0',
      description: 'MQTT client publisher and remote control listener plugin',
    };
  }

  async initialize(context: PluginContext): Promise<void> {
    this.context = context;
  }

  async start(): Promise<void> {
    if (!this.context) return;
    const enabled = this.context.config.get('mqtt.enabled') ?? false;
    const brokerUrl = this.context.config.get('mqtt.brokerUrl') || 'mqtt://localhost:1883';
    const topicPrefix = this.context.config.get('mqtt.topicPrefix') || 'openrfid';

    if (!enabled && process.env.NODE_ENV !== 'test') {
      this.context.logger.info('MQTT plugin disabled by config.');
      return;
    }

    try {
      this.client = mqtt.connect(brokerUrl, { reconnectPeriod: 5000 });

      this.client.on('connect', () => {
        this.context?.logger.info(`MQTT plugin connected to broker ${brokerUrl}`);
        this.client?.subscribe(`${topicPrefix}/commands/#`);
      });

      this.client.on('message', (topic, message) => {
        try {
          const payload = JSON.parse(message.toString());
          if (topic.endsWith('/commands/start')) {
            if (payload.readerId) this.context?.simulator.startReader(payload.readerId);
          } else if (topic.endsWith('/commands/stop')) {
            if (payload.readerId) this.context?.simulator.stopReader(payload.readerId);
          }
        } catch (err) {
          this.context?.logger.error(`Error parsing MQTT message on topic ${topic}`, err);
        }
      });

      // Listen to TagDetected on EventBus and publish to MQTT
      const unsub = this.context.eventBus.on('TagDetected', (data) => {
        if (this.client?.connected) {
          const topic = `${topicPrefix}/readers/${data.readerId}/tags`;
          const payload = JSON.stringify(data);
          this.client.publish(topic, payload, { qos: 0 });
          this.context?.eventBus.emit('MQTTPublished', { topic, payload, qos: 0 });
        }
      });
      this.unsubscribers.push(unsub);
    } catch (err) {
      this.context.logger.error('Failed to start MQTT plugin', err);
    }
  }

  async stop(): Promise<void> {
    for (const unsub of this.unsubscribers) {
      unsub();
    }
    this.unsubscribers = [];

    if (this.client) {
      this.client.end();
      this.client = null;
    }
  }

  async dispose(): Promise<void> {
    await this.stop();
  }
}
