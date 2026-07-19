/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import { FastifyInstance } from 'fastify';
import { PluginContext } from '@openrfid/plugin-api';

export async function eventRoutes(fastify: FastifyInstance, context: PluginContext) {

  // GET /events — filtered event list
  fastify.get<{
    Querystring: {
      limit?: string;
      offset?: string;
      date?: string;
      from?: string;
      to?: string;
      readerId?: string;
      epc?: string;
      protocol?: string;
    };
  }>('/events', async (request) => {
    if (!context.storage) return [];
    const { limit, offset, date, from, to, readerId, epc, protocol } = request.query;
    return context.storage.getEvents({
      limit: limit ? parseInt(limit, 10) : 1000,
      offset: offset ? parseInt(offset, 10) : 0,
      date,
      from,
      to,
      readerId,
      epc,
      protocol,
    });
  });

  // GET /events/stats — storage statistics summary
  fastify.get('/events/stats', async (_request, reply) => {
    if (!context.storage) return reply.status(503).send({ error: 'Storage not available' });
    return context.storage.getEventStats();
  });

  // GET /events/dates — list of all days with event counts
  fastify.get('/events/dates', async (_request, reply) => {
    if (!context.storage) return reply.status(503).send({ error: 'Storage not available' });
    return context.storage.getEventDates();
  });

  // GET /events/dates/:date — all events for a specific day (paginated)
  fastify.get<{
    Params: { date: string };
    Querystring: { limit?: string; offset?: string };
  }>('/events/dates/:date', async (request, reply) => {
    if (!context.storage) return reply.status(503).send({ error: 'Storage not available' });
    const { date } = request.params;
    const limit = parseInt(request.query.limit || '1000', 10);
    const offset = parseInt(request.query.offset || '0', 10);
    return context.storage.getEventsByDate(date, limit, offset);
  });

  // GET /events/export — CSV export for a day or date range
  fastify.get<{
    Querystring: { date?: string; from?: string; to?: string; readerId?: string };
  }>('/events/export', async (request, reply) => {
    if (!context.storage) return reply.status(503).send({ error: 'Storage not available' });

    const events = await context.storage.getEvents({
      ...request.query,
      limit: 100_000, // large export cap
    });

    const csvHeader = 'id,date,timestamp,readerId,antennaId,epc,rssi,protocol\n';
    const csvBody = events
      .map((e) => `${e.id},${e.date},${e.timestamp},${e.readerId},${e.antennaId},${e.epc},${e.rssi},${e.protocol}`)
      .join('\n');

    const filename = `openrfid-events-${request.query.date || 'export'}.csv`;
    reply
      .header('Content-Type', 'text/csv')
      .header('Content-Disposition', `attachment; filename="${filename}"`)
      .send(csvHeader + csvBody);
  });

  // DELETE /events/dates/:date — delete all events on a specific day
  fastify.delete<{ Params: { date: string } }>('/events/dates/:date', async (request, reply) => {
    if (!context.storage) return reply.status(503).send({ error: 'Storage not available' });
    const result = await context.storage.deleteEventsByDate(request.params.date);
    return { success: true, ...result };
  });

  // DELETE /events — clear ALL events (requires ?confirm=true)
  fastify.delete<{ Querystring: { confirm?: string } }>('/events', async (request, reply) => {
    if (!context.storage) return reply.status(503).send({ error: 'Storage not available' });
    if (request.query.confirm !== 'true') {
      return reply.status(400).send({ error: 'Pass ?confirm=true to clear all events' });
    }
    const result = await context.storage.clearAllEvents();
    return { success: true, ...result };
  });

  // DELETE /storage — nuclear: clear readers, tags, AND events (requires ?confirm=WIPE)
  fastify.delete<{ Querystring: { confirm?: string } }>('/storage', async (request, reply) => {
    if (!context.storage) return reply.status(503).send({ error: 'Storage not available' });
    if (request.query.confirm !== 'WIPE') {
      return reply.status(400).send({ error: 'Pass ?confirm=WIPE to clear all data' });
    }
    await context.storage.clearAllData();
    return { success: true, message: 'All data cleared' };
  });

  // GET /health
  fastify.get('/health', async () => {
    return { status: 'OK', timestamp: new Date().toISOString() };
  });

  // GET /status — simulator runtime info
  fastify.get('/status', async () => {
    const readers = context.simulator.getAllReaders();
    const tags = context.simulator.getAllTags();
    const stats = context.storage ? await context.storage.getEventStats() : null;
    return {
      uptime: process.uptime ? Math.floor(process.uptime()) : null,
      readers: {
        total: readers.length,
        online: readers.filter((r) => r.status === 'ONLINE').length,
        offline: readers.filter((r) => r.status === 'OFFLINE').length,
      },
      tags: { total: tags.length },
      events: stats
        ? { totalLogged: stats.totalEvents, totalDays: stats.totalDays }
        : { totalLogged: 0, totalDays: 0 },
    };
  });
}
