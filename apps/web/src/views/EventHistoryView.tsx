/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import React, { useState, useEffect, useCallback } from 'react';
import { IStorageDriver, EventRecord, EventStorageStats } from '@openrfid/core';

interface Props {
  storage: IStorageDriver;
}

const PAGE_SIZE = 1000;

const card: React.CSSProperties = {
  backgroundColor: '#1E293B',
  borderRadius: '10px',
  border: '1px solid #334155',
  padding: '20px',
};

const btn = (color: string): React.CSSProperties => ({
  backgroundColor: color,
  color: '#fff',
  border: 'none',
  padding: '6px 14px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '13px',
});

export const EventHistoryView: React.FC<Props> = ({ storage }) => {
  const [stats, setStats] = useState<EventStorageStats | null>(null);
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [filterEpc, setFilterEpc] = useState('');
  const [filterReader, setFilterReader] = useState('');
  const [filterProtocol, setFilterProtocol] = useState('');
  const [confirmClear, setConfirmClear] = useState<'events' | 'all' | null>(null);
  const [loading, setLoading] = useState(false);

  const loadStats = useCallback(async () => {
    const s = await storage.getEventStats();
    setStats(s);
  }, [storage]);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 5000);
    return () => clearInterval(interval);
  }, [loadStats]);

  const loadDayEvents = useCallback(async (date: string, pageNum = 0) => {
    setLoading(true);
    const [evts, count] = await Promise.all([
      storage.getEvents({
        date,
        epc: filterEpc || undefined,
        readerId: filterReader || undefined,
        protocol: filterProtocol || undefined,
        limit: PAGE_SIZE,
        offset: pageNum * PAGE_SIZE,
      }),
      storage.getEventCount({
        date,
        epc: filterEpc || undefined,
        readerId: filterReader || undefined,
        protocol: filterProtocol || undefined,
      }),
    ]);
    setEvents(evts);
    setTotalCount(count);
    setPage(pageNum);
    setLoading(false);
  }, [storage, filterEpc, filterReader, filterProtocol]);

  const handleExpandDate = (date: string) => {
    if (expandedDate === date) {
      setExpandedDate(null);
      setEvents([]);
    } else {
      setExpandedDate(date);
      loadDayEvents(date, 0);
    }
  };

  const handleDeleteDay = async (date: string) => {
    if (!window.confirm(`Delete ALL events for ${date}? This cannot be undone.`)) return;
    await storage.deleteEventsByDate(date);
    if (expandedDate === date) { setExpandedDate(null); setEvents([]); }
    await loadStats();
  };

  const handleExportCSV = async (date: string) => {
    const evts = await storage.getEvents({ date, limit: 100_000 });
    const csv = [
      'id,date,timestamp,readerId,antennaId,epc,rssi,protocol',
      ...evts.map((e) => `${e.id},${e.date},${e.timestamp},${e.readerId},${e.antennaId},${e.epc},${e.rssi},${e.protocol}`),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `openrfid-events-${date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearEvents = async () => {
    await storage.clearAllEvents();
    setConfirmClear(null);
    setExpandedDate(null);
    setEvents([]);
    await loadStats();
  };

  const handleClearAll = async () => {
    await storage.clearAllData();
    setConfirmClear(null);
    setExpandedDate(null);
    setEvents([]);
    await loadStats();
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
        📊 Event History &amp; Storage Manager
      </h2>

      {/* Stats Bar */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: 'Total Events', value: stats.totalEvents.toLocaleString(), color: '#00E5EE' },
            { label: 'Days with Data', value: String(stats.totalDays), color: '#10B981' },
            { label: 'Oldest Day', value: stats.oldestEventDate ?? '—', color: '#94A3B8' },
            { label: 'Newest Day', value: stats.newestEventDate ?? '—', color: '#94A3B8' },
          ].map((stat) => (
            <div key={stat.label} style={card}>
              <div style={{ fontSize: '12px', color: '#94A3B8' }}>{stat.label}</div>
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: stat.color, marginTop: '4px' }}>{stat.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Action Bar */}
      <div style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Day-by-Day Event Log</span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={btn('#EF4444')} onClick={() => setConfirmClear('events')}>🗑 Clear All Events</button>
          <button style={btn('#7C3AED')} onClick={() => setConfirmClear('all')}>☢️ Clear All Data</button>
        </div>
      </div>

      {/* Confirm Modal */}
      {confirmClear && (
        <div style={{ ...card, border: '1px solid #EF4444', marginBottom: '16px', backgroundColor: '#1F0A0A' }}>
          <p style={{ color: '#FCA5A5', marginBottom: '12px' }}>
            {confirmClear === 'events'
              ? '⚠️ This will permanently delete ALL event history. Readers and tags are kept.'
              : '☢️ This will permanently delete ALL readers, tags, and event history. Cannot be undone.'}
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={btn('#EF4444')} onClick={confirmClear === 'events' ? handleClearEvents : handleClearAll}>
              Confirm Delete
            </button>
            <button style={{ ...btn('#334155') }} onClick={() => setConfirmClear(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Day List */}
      {stats?.eventsByDate.length === 0 && (
        <div style={{ ...card, textAlign: 'center', color: '#64748B', padding: '40px' }}>
          No event history yet. Start a reader and let it run to generate events.
        </div>
      )}

      {stats?.eventsByDate.map(({ date, count }) => (
        <div key={date} style={{ ...card, marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '18px' }}>{expandedDate === date ? '▼' : '▶'}</span>
              <div>
                <span style={{ fontWeight: 'bold', fontSize: '15px' }}>{date}</span>
                <span style={{ fontSize: '13px', color: '#94A3B8', marginLeft: '10px' }}>
                  {count.toLocaleString()} events
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={btn('#0EA5E9')} onClick={() => handleExpandDate(date)}>
                {expandedDate === date ? 'Collapse' : 'View'}
              </button>
              <button style={btn('#10B981')} onClick={() => handleExportCSV(date)}>Export CSV</button>
              <button style={btn('#EF4444')} onClick={() => handleDeleteDay(date)}>Delete</button>
            </div>
          </div>

          {/* Expanded Day View */}
          {expandedDate === date && (
            <div style={{ marginTop: '16px' }}>
              {/* Filters */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <input
                  placeholder="Filter by EPC..."
                  value={filterEpc}
                  onChange={(e) => setFilterEpc(e.target.value)}
                  style={{ backgroundColor: '#0F172A', border: '1px solid #334155', color: '#F8FAFC', padding: '6px 10px', borderRadius: '6px', fontSize: '13px', width: '180px' }}
                />
                <input
                  placeholder="Filter by Reader..."
                  value={filterReader}
                  onChange={(e) => setFilterReader(e.target.value)}
                  style={{ backgroundColor: '#0F172A', border: '1px solid #334155', color: '#F8FAFC', padding: '6px 10px', borderRadius: '6px', fontSize: '13px', width: '180px' }}
                />
                <select
                  value={filterProtocol}
                  onChange={(e) => setFilterProtocol(e.target.value)}
                  style={{ backgroundColor: '#0F172A', border: '1px solid #334155', color: '#F8FAFC', padding: '6px 10px', borderRadius: '6px', fontSize: '13px' }}
                >
                  <option value="">All Protocols</option>
                  <option value="GEN2">GEN2</option>
                  <option value="ISO15693">ISO15693</option>
                  <option value="ISO14443A">ISO14443A</option>
                </select>
                <button style={btn('#00E5EE')} onClick={() => loadDayEvents(date, 0)}>Search</button>
              </div>

              {/* Event Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#0F172A', color: '#94A3B8' }}>
                      {['Time', 'Reader', 'Ant', 'EPC', 'RSSI', 'Protocol'].map((h) => (
                        <th key={h} style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #334155' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: '#64748B' }}>Loading...</td>
                      </tr>
                    ) : events.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: '#64748B' }}>No events match the current filters.</td>
                      </tr>
                    ) : (
                      events.map((e) => (
                        <tr key={e.id} style={{ borderBottom: '1px solid #1E293B' }}>
                          <td style={{ padding: '7px 12px', color: '#94A3B8' }}>{e.timestamp.split('T')[1]?.split('.')[0] ?? e.timestamp}</td>
                          <td style={{ padding: '7px 12px' }}>{e.readerId}</td>
                          <td style={{ padding: '7px 12px', color: '#94A3B8' }}>{e.antennaId}</td>
                          <td style={{ padding: '7px 12px', fontFamily: 'monospace', color: '#00E5EE' }}>{e.epc}</td>
                          <td style={{ padding: '7px 12px', color: e.rssi > -60 ? '#10B981' : '#F59E0B' }}>{e.rssi} dBm</td>
                          <td style={{ padding: '7px 12px', color: '#94A3B8' }}>{e.protocol}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px', justifyContent: 'center' }}>
                  <button
                    style={btn(page > 0 ? '#334155' : '#1E293B')}
                    disabled={page === 0}
                    onClick={() => loadDayEvents(date, page - 1)}
                  >
                    ← Prev
                  </button>
                  <span style={{ color: '#94A3B8', fontSize: '13px' }}>
                    Page {page + 1} of {totalPages} ({totalCount.toLocaleString()} events)
                  </span>
                  <button
                    style={btn(page < totalPages - 1 ? '#334155' : '#1E293B')}
                    disabled={page >= totalPages - 1}
                    onClick={() => loadDayEvents(date, page + 1)}
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
