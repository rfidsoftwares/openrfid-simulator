/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { EventBus, ConfigManager, Logger } from '@openrfid/core';
import { SimulatorManager } from '@openrfid/simulator';
import { VirtualReader } from '@openrfid/readers';
import { Tag } from '@openrfid/tags';
import { RestPlugin } from '../rest-plugin';

describe('@openrfid/rest plugin', () => {
  let plugin: RestPlugin;
  let simulator: SimulatorManager;

  beforeEach(async () => {
    const eventBus = new EventBus();
    const config = new ConfigManager({ server: { port: 0, host: '127.0.0.1' } });
    const logger = new Logger('Test');
    simulator = new SimulatorManager(eventBus);

    plugin = new RestPlugin();
    await plugin.initialize({ eventBus, config, logger, simulator });
  });

  afterEach(async () => {
    await plugin.stop();
  });

  it('should return health status', async () => {
    const res = await plugin.server!.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
    expect(res.json().status).toBe('OK');
  });

  it('should handle reader CRUD endpoints', async () => {
    // POST /readers
    const postRes = await plugin.server!.inject({
      method: 'POST',
      url: '/readers',
      payload: { name: 'Dock 1' },
    });
    expect(postRes.statusCode).toBe(201);
    const created = postRes.json();
    expect(created.name).toBe('Dock 1');

    // GET /readers
    const getRes = await plugin.server!.inject({ method: 'GET', url: '/readers' });
    expect(getRes.statusCode).toBe(200);
    expect(getRes.json().length).toBe(1);

    // DELETE /readers/:id
    const delRes = await plugin.server!.inject({ method: 'DELETE', url: `/readers/${created.id}` });
    expect(delRes.statusCode).toBe(200);
  });

  it('should handle tag endpoints', async () => {
    const genRes = await plugin.server!.inject({
      method: 'POST',
      url: '/tags/generate',
      payload: { count: 3, type: 'sequential' },
    });
    expect(genRes.statusCode).toBe(201);
    expect(genRes.json().length).toBe(3);

    const getTagsRes = await plugin.server!.inject({ method: 'GET', url: '/tags' });
    expect(getTagsRes.statusCode).toBe(200);
    expect(getTagsRes.json().length).toBe(3);
  });
});
