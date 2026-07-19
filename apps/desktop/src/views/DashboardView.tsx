/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import React, { useState, useEffect } from 'react';
import { SimulatorManager } from '@openrfid/simulator';
import { MemoryStorageDriver } from '@openrfid/core';

interface Props {
  simulator: SimulatorManager;
  storage?: MemoryStorageDriver;
}

const LIMIT_PRESETS = [1_000, 5_000, 10_000, 50_000, 100_000];

const card: React.CSSProperties = {
  backgroundColor: '#1E293B',
  padding: '20px',
  borderRadius: '10px',
  border: '1px solid #334155',
};

export const DashboardView: React.FC<Props> = ({ simulator, storage }) => {
  const [readers, setReaders] = useState(simulator.getAllReaders());
  const [tags, setTags] = useState(simulator.getAllTags());
  const [memUsage, setMemUsage] = useState(storage?.getMemoryUsage());
  const [customLimit, setCustomLimit] = useState('');
  const [autoTrim, setAutoTrim] = useState(true);
  const [showWarning, setShowWarning] = useState(true);
  const [limitInput, setLimitInput] = useState(storage?.getMemoryUsage().limit ?? 10_000);

  // Live polling every 2s
  useEffect(() => {
    const interval = setInterval(() => {
      setReaders(simulator.getAllReaders());
      setTags(simulator.getAllTags());
      if (storage) setMemUsage(storage.getMemoryUsage());
    }, 2000);
    return () => clearInterval(interval);
  }, [simulator, storage]);

  const onlineCount = readers.filter((r) => r.status === 'ONLINE').length;
  const offlineCount = readers.length - onlineCount;

  const applyLimit = (limit: number) => {
    if (!storage) return;
    storage.setMemoryLimit(limit);
    setLimitInput(limit);
    setMemUsage(storage.getMemoryUsage());
  };

  const handleApplyCustom = () => {
    const v = parseInt(customLimit, 10);
    if (!isNaN(v) && v >= 100) applyLimit(v);
  };

  const handleClearBuffer = () => {
    storage?.clearAllEvents();
    setMemUsage(storage?.getMemoryUsage());
  };

  const mem = memUsage;
  const memPercent = mem?.percent ?? 0;
  const memBarColor = memPercent >= 80 ? '#F59E0B' : memPercent >= 95 ? '#EF4444' : '#10B981';

  return (
    <div style={{ padding: '24px' }}>
      {/* Live Stats Bar */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px', padding: '12px 16px', backgroundColor: '#0F172A', borderRadius: '8px', border: '1px solid #334155', fontSize: '13px' }}>
        <span style={{ color: '#10B981', fontWeight: 'bold' }}>● {onlineCount} Online</span>
        <span style={{ color: '#64748B' }}>|</span>
        <span style={{ color: '#64748B' }}>{offlineCount} Offline</span>
        <span style={{ color: '#64748B' }}>|</span>
        <span style={{ color: '#00E5EE' }}>🏷 {tags.length.toLocaleString()} Tags</span>
        {mem && (
          <>
            <span style={{ color: '#64748B' }}>|</span>
            <span style={{ color: mem.isWarning ? '#F59E0B' : '#94A3B8' }}>
              {mem.isWarning ? '⚠️ ' : ''}Buffer: {mem.current.toLocaleString()}/{mem.limit.toLocaleString()} ({mem.percent}%)
            </span>
          </>
        )}
      </div>

      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Dashboard Overview</h2>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div style={card}>
          <div style={{ fontSize: '13px', color: '#94A3B8' }}>Readers Online</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10B981', marginTop: '4px' }}>{onlineCount}</div>
        </div>
        <div style={card}>
          <div style={{ fontSize: '13px', color: '#94A3B8' }}>Readers Offline</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#64748B', marginTop: '4px' }}>{offlineCount}</div>
        </div>
        <div style={card}>
          <div style={{ fontSize: '13px', color: '#94A3B8' }}>Active Simulated Tags</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#00E5EE', marginTop: '4px' }}>{tags.length.toLocaleString()}</div>
        </div>
        <div style={card}>
          <div style={{ fontSize: '13px', color: '#94A3B8' }}>Event Buffer</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: mem?.isWarning ? '#F59E0B' : '#FFFFFF', marginTop: '4px' }}>
            {mem ? `${mem.current.toLocaleString()}` : '—'}
          </div>
          {mem && <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>of {mem.limit.toLocaleString()} limit</div>}
        </div>
      </div>

      {/* Quick Controls */}
      <div style={{ ...card, marginTop: '20px' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '16px' }}>Quick Controls</h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => simulator.startAll()}
            style={{ backgroundColor: '#10B981', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ▶ Start All Readers
          </button>
          <button
            onClick={() => simulator.stopAll()}
            style={{ backgroundColor: '#EF4444', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ■ Stop All Readers
          </button>
        </div>
      </div>

      {/* Storage & Memory Settings */}
      {storage && (
        <div style={{ ...card, marginTop: '20px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '16px' }}>⚙️ Storage &amp; Memory Settings</h3>

          <div style={{ marginBottom: '14px', fontSize: '14px', color: '#94A3B8' }}>
            In-Memory Event Buffer Limit
          </div>

          {/* Memory Usage Bar */}
          {mem && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ color: mem.isWarning ? '#F59E0B' : '#94A3B8' }}>
                  {mem.isWarning ? '⚠️ ' : ''}{mem.current.toLocaleString()} events in buffer
                </span>
                <span style={{ color: '#64748B' }}>{mem.percent}% of {mem.limit.toLocaleString()}</span>
              </div>
              <div style={{ backgroundColor: '#0F172A', borderRadius: '6px', height: '10px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${Math.min(100, mem.percent)}%`,
                    height: '100%',
                    backgroundColor: memBarColor,
                    borderRadius: '6px',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            </div>
          )}

          {/* Presets */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
            {LIMIT_PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => applyLimit(preset)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: `1px solid ${limitInput === preset ? '#00E5EE' : '#334155'}`,
                  backgroundColor: limitInput === preset ? '#0E3A3F' : '#0F172A',
                  color: limitInput === preset ? '#00E5EE' : '#94A3B8',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: limitInput === preset ? 'bold' : 'normal',
                }}
              >
                {preset.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Custom Input */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center' }}>
            <input
              type="number"
              placeholder="Custom limit (100–500,000)"
              value={customLimit}
              onChange={(e) => setCustomLimit(e.target.value)}
              style={{ backgroundColor: '#0F172A', border: '1px solid #334155', color: '#F8FAFC', padding: '6px 10px', borderRadius: '6px', fontSize: '13px', width: '240px' }}
            />
            <button
              onClick={handleApplyCustom}
              style={{ backgroundColor: '#00E5EE', color: '#0F172A', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
            >
              Apply Limit
            </button>
          </div>

          {/* Toggles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px', fontSize: '14px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={autoTrim}
                onChange={(e) => setAutoTrim(e.target.checked)}
                style={{ accentColor: '#00E5EE', width: '16px', height: '16px' }}
              />
              <span style={{ color: '#CBD5E1' }}>Auto-trim oldest events when limit is reached</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showWarning}
                onChange={(e) => setShowWarning(e.target.checked)}
                style={{ accentColor: '#00E5EE', width: '16px', height: '16px' }}
              />
              <span style={{ color: '#CBD5E1' }}>Show ⚠️ warning when buffer is ≥80% full</span>
            </label>
          </div>

          {/* Clear Buffer */}
          <button
            onClick={handleClearBuffer}
            style={{ backgroundColor: '#334155', color: '#F8FAFC', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
          >
            🗑 Clear Memory Buffer Now
          </button>
        </div>
      )}
    </div>
  );
};
