/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import React, { useState, useEffect } from 'react';
import { EventBus, IStorageDriver } from '@openrfid/core';
import { TagSignalMeter } from '@openrfid/ui';

interface EventItem {
  id: string;
  timestamp: string;
  readerId: string;
  antennaId: number;
  epc: string;
  rssi: number;
  protocol: string;
}

interface Props {
  eventBus: EventBus;
  storage?: IStorageDriver;
  onViewHistory?: () => void;
}

export const EventMonitorView: React.FC<Props> = ({ eventBus, storage, onViewHistory }) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [paused, setPaused] = useState(false);
  const [totalStored, setTotalStored] = useState(0);

  // Live polling for total stored count
  useEffect(() => {
    if (!storage) return;
    const loadCount = async () => {
      const stats = await storage.getEventStats();
      setTotalStored(stats.totalEvents);
    };
    loadCount();
    const interval = setInterval(loadCount, 2000);
    return () => clearInterval(interval);
  }, [storage]);

  useEffect(() => {
    const unsub = eventBus.on('TagDetected', (payload) => {
      if (paused) return;
      const item: EventItem = {
        id: `ev_${Date.now()}_${Math.random()}`,
        timestamp: new Date().toLocaleTimeString(),
        readerId: payload.readerId,
        antennaId: payload.antennaId,
        epc: payload.epc,
        rssi: payload.rssi,
        protocol: payload.protocol || 'GEN2',
      };

      setEvents((prev) => [item, ...prev.slice(0, 199)]);
    });

    return () => unsub();
  }, [eventBus, paused]);

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Real-Time Event Stream ({events.length})</h2>
          {storage && (
            <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>
              Total persisted events: <strong style={{ color: '#00E5EE' }}>{totalStored.toLocaleString()}</strong> in database
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {onViewHistory && (
            <button
              onClick={onViewHistory}
              style={{ backgroundColor: '#7C3AED', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              📊 View Storage History
            </button>
          )}
          <button
            onClick={() => setPaused(!paused)}
            style={{ backgroundColor: paused ? '#10B981' : '#F59E0B', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {paused ? 'Resume Stream' : 'Pause Stream'}
          </button>
          <button
            onClick={() => setEvents([])}
            style={{ backgroundColor: '#334155', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Clear Stream
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: '#1E293B', borderRadius: '8px', border: '1px solid #334155', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#0F172A', borderBottom: '1px solid #334155', color: '#94A3B8' }}>
              <th style={{ padding: '12px 16px' }}>Time</th>
              <th style={{ padding: '12px 16px' }}>Reader</th>
              <th style={{ padding: '12px 16px' }}>Antenna Port</th>
              <th style={{ padding: '12px 16px' }}>Tag EPC</th>
              <th style={{ padding: '12px 16px' }}>Signal (RSSI)</th>
              <th style={{ padding: '12px 16px' }}>Protocol</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '30px', textAlign: 'center', color: '#64748B' }}>
                  No real-time events. Start simulated readers to see tag detections live.
                </td>
              </tr>
            ) : (
              events.map((e) => (
                <tr key={e.id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '12px 16px', color: '#94A3B8' }}>{e.timestamp}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>{e.readerId}</td>
                  <td style={{ padding: '12px 16px' }}>Port #{e.antennaId}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 'bold', color: '#00E5EE' }}>{e.epc}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <TagSignalMeter rssi={e.rssi} />
                  </td>
                  <td style={{ padding: '12px 16px' }}>{e.protocol}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
