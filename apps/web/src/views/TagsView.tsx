/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import React, { useState } from 'react';
import { SimulatorManager } from '@openrfid/simulator';
import { TagGenerator, TagSerializer } from '@openrfid/tags';

interface Props {
  simulator: SimulatorManager;
  refresh: () => void;
}

export const TagsView: React.FC<Props> = ({ simulator, refresh }) => {
  const tags = simulator.getAllTags();
  const [batchCount, setBatchCount] = useState(10);
  const [genType, setGenType] = useState<'sequential' | 'random' | 'sgtin96'>('sequential');

  const handleGenerate = () => {
    const batch = TagGenerator.generateBatch({ count: batchCount, type: genType });
    simulator.addTagBatch(batch);
    refresh();
  };

  const handleExportCSV = () => {
    const csv = TagSerializer.toCSV(tags);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tags_export.csv';
    a.click();
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Simulated RFID Tags ({tags.length})</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select
            value={genType}
            onChange={(e) => setGenType(e.target.value as any)}
            style={{ padding: '8px', borderRadius: '6px', backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155' }}
          >
            <option value="sequential">Sequential EPC</option>
            <option value="random">Random Hex</option>
            <option value="sgtin96">SGTIN-96 GS1</option>
          </select>
          <input
            type="number"
            value={batchCount}
            onChange={(e) => setBatchCount(parseInt(e.target.value, 10))}
            style={{ width: '60px', padding: '8px', borderRadius: '6px', backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155' }}
          />
          <button
            onClick={handleGenerate}
            style={{ backgroundColor: '#00E5EE', color: '#0F172A', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Generate Tags
          </button>
          <button
            onClick={handleExportCSV}
            style={{ backgroundColor: '#334155', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Export CSV
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: '#1E293B', borderRadius: '8px', border: '1px solid #334155', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#0F172A', borderBottom: '1px solid #334155', color: '#94A3B8' }}>
              <th style={{ padding: '12px 16px' }}>EPC Header</th>
              <th style={{ padding: '12px 16px' }}>TID</th>
              <th style={{ padding: '12px 16px' }}>Protocol</th>
              <th style={{ padding: '12px 16px' }}>Read Count</th>
              <th style={{ padding: '12px 16px' }}>Current RSSI</th>
              <th style={{ padding: '12px 16px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {tags.slice(0, 100).map((t) => (
              <tr key={t.id} style={{ borderBottom: '1px solid #334155' }}>
                <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 'bold', color: '#00E5EE' }}>{t.epc}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#94A3B8' }}>{t.tid}</td>
                <td style={{ padding: '12px 16px' }}>{t.protocol}</td>
                <td style={{ padding: '12px 16px' }}>{t.readCount}</td>
                <td style={{ padding: '12px 16px', color: '#10B981' }}>{t.currentRssi} dBm</td>
                <td style={{ padding: '12px 16px' }}>
                  <button
                    onClick={() => { simulator.removeTag(t.epc); refresh(); }}
                    style={{ backgroundColor: '#EF4444', color: '#FFF', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
