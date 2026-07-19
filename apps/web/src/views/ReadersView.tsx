/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import React, { useState } from 'react';
import { SimulatorManager } from '@openrfid/simulator';
import { VirtualReader } from '@openrfid/readers';
import { ReaderStatusBadge, AntennaPowerSlider } from '@openrfid/ui';

interface Props {
  simulator: SimulatorManager;
  refresh: () => void;
}

export const ReadersView: React.FC<Props> = ({ simulator, refresh }) => {
  const [, setTick] = useState(0);
  const readers = simulator.getAllReaders();
  const [readerName, setReaderName] = useState('');
  const [expandedReaderId, setExpandedReaderId] = useState<string | null>(null);

  const triggerUpdate = () => {
    setTick((t) => t + 1);
    refresh();
  };

  const handleAddReader = () => {
    const name = readerName.trim() || `Reader-${readers.length + 1}`;
    const reader = new VirtualReader({ name });
    simulator.addReader(reader);
    setReaderName('');
    triggerUpdate();
  };

  const handleToggleAntenna = (reader: VirtualReader, index: number) => {
    const antenna = reader.getAntenna(index);
    if (antenna) {
      antenna.enabled = !antenna.enabled;
      if (simulator.storage) {
        simulator.storage.saveAntenna({
          id: antenna.id,
          readerId: antenna.readerId,
          index: antenna.index,
          gain: antenna.gain,
          power: antenna.power,
          frequency: antenna.frequency,
          rssiOffset: antenna.rssiOffset,
          readZone: antenna.readZone,
          enabled: antenna.enabled,
        });
      }
      triggerUpdate();
    }
  };

  const handleAntennaPowerChange = (reader: VirtualReader, index: number, power: number) => {
    const antenna = reader.getAntenna(index);
    if (antenna) {
      antenna.power = power;
      if (simulator.storage) {
        simulator.storage.saveAntenna({
          id: antenna.id,
          readerId: antenna.readerId,
          index: antenna.index,
          gain: antenna.gain,
          power: antenna.power,
          frequency: antenna.frequency,
          rssiOffset: antenna.rssiOffset,
          readZone: antenna.readZone,
          enabled: antenna.enabled,
        });
      }
      triggerUpdate();
    }
  };

  const handleAntennaGainChange = (reader: VirtualReader, index: number, gain: number) => {
    const antenna = reader.getAntenna(index);
    if (antenna) {
      antenna.gain = gain;
      if (simulator.storage) {
        simulator.storage.saveAntenna({
          id: antenna.id,
          readerId: antenna.readerId,
          index: antenna.index,
          gain: antenna.gain,
          power: antenna.power,
          frequency: antenna.frequency,
          rssiOffset: antenna.rssiOffset,
          readZone: antenna.readZone,
          enabled: antenna.enabled,
        });
      }
      triggerUpdate();
    }
  };

  const handleAntennaRssiChange = (reader: VirtualReader, index: number, rssiOffset: number) => {
    const antenna = reader.getAntenna(index);
    if (antenna) {
      antenna.rssiOffset = rssiOffset;
      if (simulator.storage) {
        simulator.storage.saveAntenna({
          id: antenna.id,
          readerId: antenna.readerId,
          index: antenna.index,
          gain: antenna.gain,
          power: antenna.power,
          frequency: antenna.frequency,
          rssiOffset: antenna.rssiOffset,
          readZone: antenna.readZone,
          enabled: antenna.enabled,
        });
      }
      triggerUpdate();
    }
  };

  const handleAntennaZoneChange = (reader: VirtualReader, index: number, zone: string) => {
    const antenna = reader.getAntenna(index);
    if (antenna) {
      antenna.readZone = zone;
      if (simulator.storage) {
        simulator.storage.saveAntenna({
          id: antenna.id,
          readerId: antenna.readerId,
          index: antenna.index,
          gain: antenna.gain,
          power: antenna.power,
          frequency: antenna.frequency,
          rssiOffset: antenna.rssiOffset,
          readZone: antenna.readZone,
          enabled: antenna.enabled,
        });
      }
      triggerUpdate();
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Virtual Readers ({readers.length})</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="Reader Name..."
            value={readerName}
            onChange={(e) => setReaderName(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0F172A', color: '#FFF' }}
          />
          <button
            onClick={handleAddReader}
            style={{ backgroundColor: '#00E5EE', color: '#0F172A', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Add Reader
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        {readers.map((r) => {
          const isExpanded = expandedReaderId === r.id;
          return (
            <div key={r.id} style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontWeight: 'bold', fontSize: '18px', marginRight: '12px' }}>{r.name}</span>
                  <span style={{ fontSize: '12px', color: '#64748B', fontFamily: 'monospace' }}>ID: {r.id}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <ReaderStatusBadge status={r.status} />
                  <button
                    onClick={() => setExpandedReaderId(isExpanded ? null : r.id)}
                    style={{ backgroundColor: '#334155', color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                  >
                    {isExpanded ? 'Hide Ports' : 'Configure Ports'}
                  </button>
                </div>
              </div>

              <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div><strong>Vendor:</strong> {r.vendor} ({r.model})</div>
                <div><strong>Address:</strong> {r.ip}:{r.port}</div>
                <div><strong>Protocol:</strong> {r.protocol}</div>
                <div><strong>Antenna Ports:</strong> {r.antennas.size} ports</div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                {r.status === 'ONLINE' ? (
                  <button
                    onClick={() => { simulator.stopReader(r.id); triggerUpdate(); }}
                    style={{ backgroundColor: '#EF4444', color: '#FFF', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                  >
                    ⏹ Stop Simulation
                  </button>
                ) : (
                  <button
                    onClick={() => { simulator.startReader(r.id); triggerUpdate(); }}
                    style={{ backgroundColor: '#10B981', color: '#FFF', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                  >
                    ▶ Start Simulation
                  </button>
                )}
                <button
                  onClick={() => { simulator.removeReader(r.id); triggerUpdate(); }}
                  style={{ backgroundColor: '#334155', color: '#FFF', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                >
                  🗑 Delete Reader
                </button>
              </div>

              {/* Antenna Configuration Panel */}
              {isExpanded && (
                <div style={{ marginTop: '20px', borderTop: '1px solid #334155', paddingTop: '20px' }}>
                  <h4 style={{ margin: '0 0 16px', fontSize: '15px', color: '#00E5EE' }}>📡 Antenna Configuration</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    {Array.from(r.antennas.values()).map((ant) => (
                      <div key={ant.id} style={{ backgroundColor: '#0F172A', padding: '16px', borderRadius: '8px', border: ant.enabled ? '1px solid #00E5EE' : '1px solid #1E293B', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        
                        {/* Antenna Header with Toggle */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 'bold', fontSize: '14px', color: ant.enabled ? '#FFF' : '#64748B' }}>Port {ant.index}</span>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px' }}>
                            <input
                              type="checkbox"
                              checked={ant.enabled}
                              onChange={() => handleToggleAntenna(r, ant.index)}
                              style={{ accentColor: '#00E5EE' }}
                            />
                            <span style={{ color: ant.enabled ? '#00E5EE' : '#64748B' }}>{ant.enabled ? 'Enabled' : 'Disabled'}</span>
                          </label>
                        </div>

                        {/* Sliders when enabled */}
                        {ant.enabled ? (
                          <>
                            {/* Transmit Power Slider */}
                            <AntennaPowerSlider
                              power={ant.power}
                              onChange={(val) => handleAntennaPowerChange(r, ant.index, val)}
                              min={0.0}
                              max={33.0}
                            />

                            {/* Gain Slider */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#D1D5DB' }}>
                                <span>Antenna Gain</span>
                                <span style={{ fontWeight: 'bold', color: '#00E5EE' }}>{ant.gain.toFixed(1)} dBi</span>
                              </div>
                              <input
                                type="range"
                                min={0.0}
                                max={15.0}
                                step={0.5}
                                value={ant.gain}
                                onChange={(e) => handleAntennaGainChange(r, ant.index, parseFloat(e.target.value))}
                                style={{ accentColor: '#00E5EE', cursor: 'pointer' }}
                              />
                            </div>

                            {/* RSSI Offset Slider */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#D1D5DB' }}>
                                <span>RSSI Offset</span>
                                <span style={{ fontWeight: 'bold', color: '#00E5EE' }}>{ant.rssiOffset >= 0 ? '+' : ''}{ant.rssiOffset.toFixed(1)} dB</span>
                              </div>
                              <input
                                type="range"
                                min={-20.0}
                                max={20.0}
                                step={0.5}
                                value={ant.rssiOffset}
                                onChange={(e) => handleAntennaRssiChange(r, ant.index, parseFloat(e.target.value))}
                                style={{ accentColor: '#00E5EE', cursor: 'pointer' }}
                              />
                            </div>

                            {/* Read Zone Input */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ fontSize: '13px', color: '#D1D5DB' }}>Coverage Read Zone</span>
                              <input
                                type="text"
                                placeholder="Zone identifier..."
                                value={ant.readZone}
                                onChange={(e) => handleAntennaZoneChange(r, ant.index, e.target.value)}
                                style={{ padding: '6px 10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#1E293B', color: '#FFF' }}
                              />
                            </div>
                          </>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '140px', color: '#64748B', fontSize: '13px', border: '1px dashed #334155', borderRadius: '6px' }}>
                            Antenna port disabled
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
