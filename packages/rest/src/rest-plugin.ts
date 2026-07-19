/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import Fastify, { FastifyInstance } from 'fastify';
import { IPlugin, PluginContext, PluginMetadata } from '@openrfid/plugin-api';
import { readerRoutes } from './routes/readers';
import { tagRoutes } from './routes/tags';
import { eventRoutes } from './routes/events';

export class RestPlugin implements IPlugin {
  public server: FastifyInstance | null = null;
  private context: PluginContext | null = null;

  getMetadata(): PluginMetadata {
    return {
      name: 'rest-api',
      version: '0.1.0',
      description: 'Auto-generated REST API server plugin for OpenRFID Simulator',
    };
  }

  async initialize(context: PluginContext): Promise<void> {
    this.context = context;
    this.server = Fastify({ logger: false });

    await readerRoutes(this.server, this.context);
    await tagRoutes(this.server, this.context);
    await eventRoutes(this.server, this.context);
  }

  async start(): Promise<void> {
    if (!this.server || !this.context) return;
    const port = this.context.config.get('server.port') || 3000;
    const host = this.context.config.get('server.host') || '0.0.0.0';

    try {
      await this.server.listen({ port, host });
      this.context.logger.info(`REST API plugin listening on http://${host}:${port}`);
    } catch (err) {
      this.context.logger.error('Failed to start REST API plugin', err);
      throw err;
    }
  }

  async stop(): Promise<void> {
    if (this.server) {
      await this.server.close();
      this.server = null;
    }
  }

  async dispose(): Promise<void> {
    await this.stop();
  }
}
