/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import { FastifyInstance } from 'fastify';
import { Tag, TagGenerator } from '@openrfid/tags';
import { PluginContext } from '@openrfid/plugin-api';

export async function tagRoutes(fastify: FastifyInstance, context: PluginContext) {
  fastify.get('/tags', async () => {
    return context.simulator.getAllTags().map((t) => t.toJSON());
  });

  fastify.post<{ Body: { epc: string; tid?: string; userMemory?: string } }>('/tags', async (request, reply) => {
    const { epc, tid, userMemory } = request.body || {};
    if (!epc) {
      return reply.status(400).send({ error: 'EPC is required' });
    }
    const tag = new Tag({ epc, tid, userMemory });
    context.simulator.addTag(tag);
    return reply.status(201).send(tag.toJSON());
  });

  fastify.post<{ Body: { count?: number; type?: 'sequential' | 'random' | 'sgtin96'; header?: string } }>(
    '/tags/generate',
    async (request, reply) => {
      const { count = 10, type = 'sequential', header } = request.body || {};
      const batch = TagGenerator.generateBatch({ count, type, header });
      context.simulator.addTagBatch(batch);
      return reply.status(201).send(batch.map((t) => t.toJSON()));
    }
  );

  fastify.delete<{ Params: { epc: string } }>('/tags/:epc', async (request, reply) => {
    context.simulator.removeTag(request.params.epc);
    return { success: true };
  });
}
