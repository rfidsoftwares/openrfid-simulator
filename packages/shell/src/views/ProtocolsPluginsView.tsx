/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import React from 'react';
import { PluginManager, RegisteredPlugin } from '@openrfid/plugin-api';

interface Props {
  pluginManager: PluginManager;
}

export const ProtocolsPluginsView: React.FC<Props> = ({ pluginManager }) => {
  const plugins: RegisteredPlugin[] = pluginManager.getAllPlugins();

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Protocol Servers &amp; Installed Plugins</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {plugins.map((p: RegisteredPlugin) => (
          <div key={p.metadata.name} style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '10px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#00E5EE' }}>{p.metadata.name}</h3>
              <span
                style={{
                  backgroundColor: p.state === 'STARTED' ? '#10B981' : '#64748B',
                  color: '#FFF',
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                }}
              >
                {p.state}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '8px' }}>v{p.metadata.version}</div>
            <p style={{ fontSize: '13px', color: '#CBD5E1', marginTop: '10px' }}>{p.metadata.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
