/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 *
 * Hopeland/Identium UDP Multicast Discovery Announcer
 * =====================================================
 * This plugin makes the OpenRFID Simulator behave like a real Hopeland/Identium
 * RFID reader on the local network. It implements the exact discovery protocol
 * used by the Hopeland MyReaderAPI SDK:
 *
 *  - UDP Multicast group: 230.1.1.116  (hardcoded in the SDK)
 *  - UDP Port:            9091         (hardcoded in the SDK)
 *  - Message format (ASCII):
 *      ^RFID_READER_INFORMATION:<type>,IP:<ip>,MAC:<mac>,PORT:<port>,
 *       HOST_SERVER_IP:0.0.0.0,HOST_SERVER_PORT:0,MODE:SERVER,NET_STATE:CONNECTED$
 *
 * The SDK's DeviceSearch class joins this multicast group, listens for these
 * packets, and parses them into Device_Mode objects shown in the search dialog.
 * Any middleware using MyReaderAPI (unmodified) will discover the simulator
 * automatically.
 *
 * Also opens a TCP server on port 9090 so that CreateTcpConn() succeeds
 * (Hopeland binary protocol — full implementation pending Wireshark capture).
 */

import * as dgram from 'dgram';
import * as net from 'net';
import * as os from 'os';
import { IPlugin, PluginContext, PluginMetadata } from '@openrfid/plugin-api';

// ── Hopeland protocol constants (extracted from ReaderAPI.dll via ILSpy) ──────
const MULTICAST_GROUP = '230.1.1.116';
const MULTICAST_PORT  = 9091;
const TCP_PORT        = 9090;

// Announcement interval — real readers announce roughly every 2 seconds
const ANNOUNCE_INTERVAL_MS = 2000;

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Returns the first non-loopback IPv4 address of this machine.
 * This is what gets advertised so the middleware knows where to connect via TCP.
 */
function getLocalIpv4(): string {
  const interfaces = os.networkInterfaces();
  const allIfaces = Array.from(Object.values(interfaces));
  for (const iface of allIfaces) {
    if (!iface) continue;
    for (const entry of iface) {
      if (entry.family === 'IPv4' && !entry.internal) {
        return entry.address;
      }
    }
  }
  return '127.0.0.1';
}

/**
 * Returns a stable fake MAC based on the machine's hostname so that repeated
 * restarts of the simulator show the same device in the middleware list.
 */
function buildFakeMac(): string {
  const hostname = os.hostname();
  let hash = 0;
  for (let i = 0; i < hostname.length; i++) {
    hash = ((hash << 5) - hash) + hostname.charCodeAt(i);
    hash |= 0;
  }
  const hex = (Math.abs(hash) + 0x100000).toString(16).padStart(8, '0');
  return `52-46-${hex.slice(0, 2)}-${hex.slice(2, 4)}-${hex.slice(4, 6)}-${hex.slice(6, 8)}`.toUpperCase();
}

/**
 * Builds the exact ASCII announcement string the Hopeland SDK expects.
 * Verified against the Device_Mode(string param) constructor in ReaderAPI.dll.
 */
function buildAnnouncementPacket(localIp: string, mac: string): Buffer {
  const msg =
    `^RFID_READER_INFORMATION:OpenRFID-Sim,` +
    `IP:${localIp},` +
    `MAC:${mac},` +
    `PORT:${TCP_PORT},` +
    `HOST_SERVER_IP:0.0.0.0,` +
    `HOST_SERVER_PORT:0,` +
    `MODE:SERVER,` +
    `NET_STATE:CONNECTED$`;
  return Buffer.from(msg, 'ascii');
}

// ── Plugin ────────────────────────────────────────────────────────────────────

export class HopelandDiscoveryPlugin implements IPlugin {
  private udpSocket: dgram.Socket | null = null;
  private tcpServer: net.Server | null   = null;
  private announceTimer: ReturnType<typeof setInterval> | null = null;
  private context: PluginContext | null = null;

  getMetadata(): PluginMetadata {
    return {
      name:        'hopeland-discovery',
      version:     '0.1.0',
      description: `Hopeland/Identium UDP multicast device discovery announcer. Makes the simulator visible as a real RFID reader on the local network (multicast ${MULTICAST_GROUP}:${MULTICAST_PORT}, TCP ${TCP_PORT}).`,
    };
  }

  async initialize(context: PluginContext): Promise<void> {
    this.context = context;
  }

  async start(): Promise<void> {
    const localIp  = getLocalIpv4();
    const fakeMac  = buildFakeMac();
    const packet   = buildAnnouncementPacket(localIp, fakeMac);

    this.context?.logger.info(
      `[HopelandDiscovery] Local IP: ${localIp}  Fake MAC: ${fakeMac}`
    );

    // ── 1. UDP Multicast Announcer ─────────────────────────────────────────
    // The Hopeland SDK (DeviceSearch) binds port 9091 and joins multicast
    // group 230.1.1.116.  We send our announcement packet to that group so
    // every running instance of the middleware discovers us automatically.
    this.udpSocket = dgram.createSocket({ type: 'udp4', reuseAddr: true });

    this.udpSocket.on('error', (err: Error) => {
      this.context?.logger.error('[HopelandDiscovery] UDP socket error', err);
    });

    await new Promise<void>((resolve, reject) => {
      this.udpSocket!.bind(0, () => {
        try {
          this.udpSocket!.setMulticastTTL(16);
          this.udpSocket!.setMulticastLoopback(true); // visible on localhost too
          resolve();
        } catch (e) {
          reject(e as Error);
        }
      });
    });

    // Send immediately, then on every interval
    const sendAnnouncement = () => {
      this.udpSocket?.send(
        packet, 0, packet.length,
        MULTICAST_PORT, MULTICAST_GROUP,
        (err: Error | null) => {
          if (err) this.context?.logger.error('[HopelandDiscovery] UDP send error', err);
        }
      );
    };

    sendAnnouncement();
    this.announceTimer = setInterval(sendAnnouncement, ANNOUNCE_INTERVAL_MS);

    this.context?.logger.info(
      `[HopelandDiscovery] Announcing on UDP multicast ${MULTICAST_GROUP}:${MULTICAST_PORT} every ${ANNOUNCE_INTERVAL_MS}ms`
    );

    // ── 2. TCP Server on port 9090 ─────────────────────────────────────────
    // After discovery the middleware calls CreateTcpConn("<ip>:9090", this).
    // We must accept the connection so the SDK doesn't report an error.
    // Full Hopeland binary frame protocol (GetEPC responses, tag data frames)
    // will be added after a Wireshark capture from the physical reader.
    this.tcpServer = net.createServer((socket: net.Socket) => {
      const remote = `${socket.remoteAddress}:${socket.remotePort}`;
      this.context?.logger.info(`[HopelandDiscovery] TCP connection from ${remote}`);

      socket.on('error', (err: Error) => {
        this.context?.logger.error(`[HopelandDiscovery] TCP socket error from ${remote}`, err);
      });

      socket.on('close', () => {
        this.context?.logger.info(`[HopelandDiscovery] TCP connection closed: ${remote}`);
      });

      // Keep connection alive — data handler to be filled in after Wireshark
      socket.on('data', (_data: Buffer) => {
        // TODO: parse Hopeland binary frames and respond with tag data
        // This requires a Wireshark capture from the physical reader.
        // Phase 2 will implement GetEPC responses here.
      });
    });

    this.tcpServer.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        this.context?.logger.error(
          `[HopelandDiscovery] TCP port ${TCP_PORT} already in use. Is another reader application running?`
        );
      } else {
        this.context?.logger.error('[HopelandDiscovery] TCP server error', err);
      }
    });

    await new Promise<void>((resolve) => {
      this.tcpServer!.listen(TCP_PORT, '0.0.0.0', () => {
        this.context?.logger.info(
          `[HopelandDiscovery] TCP server listening on 0.0.0.0:${TCP_PORT} — middleware can now connect`
        );
        resolve();
      });
    });
  }

  async stop(): Promise<void> {
    if (this.announceTimer) {
      clearInterval(this.announceTimer);
      this.announceTimer = null;
    }

    if (this.udpSocket) {
      this.udpSocket.close();
      this.udpSocket = null;
    }

    await new Promise<void>((resolve) => {
      if (this.tcpServer) {
        this.tcpServer.close(() => resolve());
        this.tcpServer = null;
      } else {
        resolve();
      }
    });

    this.context?.logger.info('[HopelandDiscovery] Stopped.');
  }

  async dispose(): Promise<void> {
    await this.stop();
  }
}
