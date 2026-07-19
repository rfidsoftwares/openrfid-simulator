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
  
  // State for Add Reader Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [readerName, setReaderName] = useState('');
  const [vendor, setVendor] = useState('RFID Softwares');
  const [readerType, setReaderType] = useState('4-Port Reader');
  const [readMode, setReadMode] = useState<'continuous' | 'periodic'>('continuous');
  const [readIntervalValue, setReadIntervalValue] = useState(1);
  const [readIntervalUnit, setReadIntervalUnit] = useState<'seconds' | 'minutes' | 'hours'>('seconds');
  const [readRate, setReadRate] = useState(0); // 0 = unlimited
  const [epcFilterPrefix, setEpcFilterPrefix] = useState('');
  const [epcFilterStart, setEpcFilterStart] = useState('');
  const [epcFilterEnd, setEpcFilterEnd] = useState('');

  const [expandedReaderId, setExpandedReaderId] = useState<string | null>(null);

  const triggerUpdate = () => {
    setTick((t) => t + 1);
    refresh();
  };

  const getAntennasCount = (type: string): number => {
    if (type === 'Desktop Reader') return 1;
    if (type === 'Integrated Reader') return 2;
    if (type === '4-Port Reader') return 4;
    if (type === '8-Port Reader') return 8;
    if (type === '16-Port Reader') return 16;
    return 4;
  };

  const handleAddReader = () => {
    const name = readerName.trim() || `${vendor} ${readerType}`;
    const antennasCount = getAntennasCount(readerType);
    const reader = new VirtualReader({
      name,
      vendor,
      model: readerType,
      antennasCount,
      readRate,
      readMode,
      readIntervalValue,
      readIntervalUnit,
      epcFilterStart,
      epcFilterEnd,
      epcFilterPrefix,
    });
    simulator.addReader(reader);
    
    // Reset form states
    setReaderName('');
    setEpcFilterPrefix('');
    setEpcFilterStart('');
    setEpcFilterEnd('');
    setReadRate(0);
    setReadMode('continuous');
    setReadIntervalValue(1);
    setReadIntervalUnit('seconds');
    setShowAddForm(false);
    
    triggerUpdate();
  };

  const handleReaderSettingsChange = (reader: VirtualReader, key: string, val: any) => {
    (reader as any)[key] = val;
    if (simulator.storage) {
      simulator.storage.saveReader(reader.toJSON());
    }
    // If online, stop and start reader to apply interval changes immediately
    if (reader.status === 'ONLINE') {
      simulator.stopReader(reader.id);
      simulator.startReader(reader.id);
    }
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
      {/* View Header with Add button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Virtual Readers ({readers.length})</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ backgroundColor: '#00E5EE', color: '#0F172A', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {showAddForm ? 'Close Form' : '➕ Add Reader'}
        </button>
      </div>

      {/* Add Reader Card Form */}
      {showAddForm && (
        <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '8px', border: '1px solid #00E5EE', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', color: '#00E5EE' }}>Configure New RFID Reader</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '13px', color: '#D1D5DB' }}>Reader Name</span>
              <input
                type="text"
                placeholder="e.g. Warehouse Gate A..."
                value={readerName}
                onChange={(e) => setReaderName(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0F172A', color: '#FFF' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '13px', color: '#D1D5DB' }}>Vendor</span>
              <select
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0F172A', color: '#FFF' }}
              >
                <option value="RFID Softwares">RFID Softwares</option>
                <option value="Impinj">Impinj</option>
                <option value="Zebra">Zebra</option>
                <option value="ID Tech">ID Tech</option>
                <option value="Identium">Identium</option>
                <option value="Realtime">Realtime</option>
                <option value="Generic">Generic</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '13px', color: '#D1D5DB' }}>Type & Ports</span>
              <select
                value={readerType}
                onChange={(e) => setReaderType(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0F172A', color: '#FFF' }}
              >
                <option value="Desktop Reader">Desktop Reader (1 Port)</option>
                <option value="Integrated Reader">Integrated Reader (2 Ports)</option>
                <option value="4-Port Reader">4-Port Reader (4 Ports)</option>
                <option value="8-Port Reader">8-Port Reader (8 Ports)</option>
                <option value="16-Port Reader">16-Port Reader (16 Ports)</option>
              </select>
            </div>
          </div>

          <div style={{ borderTop: '1px dashed #334155', paddingTop: '16px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#00E5EE' }}>⚙️ Default Simulation Settings</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '13px', color: '#D1D5DB' }}>Read Mode</span>
                <select
                  value={readMode}
                  onChange={(e) => setReadMode(e.target.value as any)}
                  style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0F172A', color: '#FFF' }}
                >
                  <option value="continuous">Continuous Read</option>
                  <option value="periodic">Periodic Read</option>
                </select>
              </div>

              {readMode === 'periodic' && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                    <span style={{ fontSize: '13px', color: '#D1D5DB' }}>Interval</span>
                    <input
                      type="number"
                      min={1}
                      value={readIntervalValue}
                      onChange={(e) => setReadIntervalValue(parseInt(e.target.value, 10))}
                      style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0F172A', color: '#FFF', width: '100%' }}
                    />
                  </div>
                  <select
                    value={readIntervalUnit}
                    onChange={(e) => setReadIntervalUnit(e.target.value as any)}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0F172A', color: '#FFF', height: '37px' }}
                  >
                    <option value="seconds">Seconds</option>
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '13px', color: '#D1D5DB' }}>Max Read Rate Limit</span>
                <select
                  value={readRate}
                  onChange={(e) => setReadRate(parseInt(e.target.value, 10))}
                  style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0F172A', color: '#FFF' }}
                >
                  <option value={0}>Unlimited</option>
                  <option value={1}>1 tag/sec</option>
                  <option value={10}>10 tags/sec</option>
                  <option value={100}>100 tags/sec</option>
                  <option value={1000}>1000 tags/sec</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '13px', color: '#D1D5DB' }}>EPC Filter Prefix</span>
                <input
                  type="text"
                  placeholder="e.g. E200"
                  value={epcFilterPrefix}
                  onChange={(e) => setEpcFilterPrefix(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0F172A', color: '#FFF' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '13px', color: '#D1D5DB' }}>EPC Range Start</span>
                <input
                  type="text"
                  placeholder="e.g. E20000000001"
                  value={epcFilterStart}
                  onChange={(e) => setEpcFilterStart(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0F172A', color: '#FFF' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '13px', color: '#D1D5DB' }}>EPC Range End</span>
                <input
                  type="text"
                  placeholder="e.g. E20000000010"
                  value={epcFilterEnd}
                  onChange={(e) => setEpcFilterEnd(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0F172A', color: '#FFF' }}
                />
              </div>

            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              onClick={handleAddReader}
              style={{ backgroundColor: '#00E5EE', color: '#0F172A', border: 'none', padding: '8px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Confirm and Add
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              style={{ backgroundColor: '#334155', color: '#FFF', border: 'none', padding: '8px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Readers List */}
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
                    {isExpanded ? 'Hide Config' : 'Configure Reader'}
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

              {/* Advanced Configurations Panel */}
              {isExpanded && (
                <div style={{ marginTop: '20px', borderTop: '1px solid #334155', paddingTop: '20px' }}>
                  
                  {/* Simulation Configuration */}
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ margin: '0 0 16px', fontSize: '15px', color: '#00E5EE' }}>⚙️ Simulation & Filtering Settings</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', backgroundColor: '#0F172A', padding: '16px', borderRadius: '8px', border: '1px solid #1E293B' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '13px', color: '#D1D5DB' }}>Read Mode</span>
                        <select
                          value={r.readMode}
                          onChange={(e) => handleReaderSettingsChange(r, 'readMode', e.target.value)}
                          style={{ padding: '6px', borderRadius: '6px', backgroundColor: '#1E293B', color: '#FFF', border: '1px solid #334155' }}
                        >
                          <option value="continuous">Continuous Read</option>
                          <option value="periodic">Periodic Read</option>
                        </select>
                      </div>

                      {r.readMode === 'periodic' && (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                            <span style={{ fontSize: '13px', color: '#D1D5DB' }}>Interval</span>
                            <input
                              type="number"
                              min={1}
                              value={r.readIntervalValue ?? 1}
                              onChange={(e) => handleReaderSettingsChange(r, 'readIntervalValue', parseInt(e.target.value, 10))}
                              style={{ padding: '6px', borderRadius: '6px', backgroundColor: '#1E293B', color: '#FFF', border: '1px solid #334155', width: '100%' }}
                            />
                          </div>
                          <select
                            value={r.readIntervalUnit}
                            onChange={(e) => handleReaderSettingsChange(r, 'readIntervalUnit', e.target.value)}
                            style={{ padding: '6px', borderRadius: '6px', backgroundColor: '#1E293B', color: '#FFF', border: '1px solid #334155', height: '33px' }}
                          >
                            <option value="seconds">Seconds</option>
                            <option value="minutes">Minutes</option>
                            <option value="hours">Hours</option>
                          </select>
                        </div>
                      )}

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '13px', color: '#D1D5DB' }}>Read Rate Limit</span>
                        <select
                          value={r.readRate ?? 0}
                          onChange={(e) => handleReaderSettingsChange(r, 'readRate', parseInt(e.target.value, 10))}
                          style={{ padding: '6px', borderRadius: '6px', backgroundColor: '#1E293B', color: '#FFF', border: '1px solid #334155' }}
                        >
                          <option value={0}>Unlimited</option>
                          <option value={1}>1 tag/sec</option>
                          <option value={10}>10 tags/sec</option>
                          <option value={100}>100 tags/sec</option>
                          <option value={1000}>1000 tags/sec</option>
                        </select>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '13px', color: '#D1D5DB' }}>EPC Filter Prefix</span>
                        <input
                          type="text"
                          placeholder="e.g. E200"
                          value={r.epcFilterPrefix ?? ''}
                          onChange={(e) => handleReaderSettingsChange(r, 'epcFilterPrefix', e.target.value)}
                          style={{ padding: '6px', borderRadius: '6px', backgroundColor: '#1E293B', color: '#FFF', border: '1px solid #334155' }}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '13px', color: '#D1D5DB' }}>EPC Range Start</span>
                        <input
                          type="text"
                          placeholder="e.g. E20000000001"
                          value={r.epcFilterStart ?? ''}
                          onChange={(e) => handleReaderSettingsChange(r, 'epcFilterStart', e.target.value)}
                          style={{ padding: '6px', borderRadius: '6px', backgroundColor: '#1E293B', color: '#FFF', border: '1px solid #334155' }}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '13px', color: '#D1D5DB' }}>EPC Range End</span>
                        <input
                          type="text"
                          placeholder="e.g. E20000000010"
                          value={r.epcFilterEnd ?? ''}
                          onChange={(e) => handleReaderSettingsChange(r, 'epcFilterEnd', e.target.value)}
                          style={{ padding: '6px', borderRadius: '6px', backgroundColor: '#1E293B', color: '#FFF', border: '1px solid #334155' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Antenna Configuration */}
                  <div>
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
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
