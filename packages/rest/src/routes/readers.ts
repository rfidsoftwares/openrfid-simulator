/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import { FastifyInstance } from 'fastify';
import { VirtualReader } from '@openrfid/readers';
import { PluginContext } from '@openrfid/plugin-api';

export async function readerRoutes(fastify: FastifyInstance, context: PluginContext) {
  fastify.get('/readers', async () => {
    return context.simulator.getAllReaders().map((r) => r.toJSON());
  });

  fastify.get<{ Params: { id: string } }>('/readers/:id', async (request, reply) => {
    const reader = context.simulator.getReader(request.params.id);
    if (!reader) {
      return reply.status(404).send({ error: 'Reader not found' });
    }
    return reader.toJSON();
  });

  fastify.post<{ Body: { name: string; vendor?: string; model?: string; ip?: string; port?: number } }>(
    '/readers',
    async (request, reply) => {
      const { name, vendor, model, ip, port } = request.body || {};
      if (!name) {
        return reply.status(400).send({ error: 'Reader name is required' });
      }
      const reader = new VirtualReader({ name, vendor, model, ip, port });
      context.simulator.addReader(reader);
      return reply.status(201).send(reader.toJSON());
    }
  );

  fastify.delete<{ Params: { id: string } }>('/readers/:id', async (request, reply) => {
    context.simulator.removeReader(request.params.id);
    return { success: true };
  });

  fastify.post<{ Params: { id: string } }>('/readers/:id/start', async (request, reply) => {
    try {
      context.simulator.startReader(request.params.id);
      return { success: true, message: 'Reader started' };
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.post<{ Params: { id: string } }>('/readers/:id/stop', async (request, reply) => {
    context.simulator.stopReader(request.params.id);
    return { success: true, message: 'Reader stopped' };
  });
}
