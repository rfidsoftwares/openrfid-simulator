/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import React from 'react';

interface Props {
  rssi: number; // e.g. -30 dBm (strong) to -90 dBm (weak)
}

export const TagSignalMeter: React.FC<Props> = ({ rssi }) => {
  // Normalize RSSI to 0 - 100 percentage
  const percentage = Math.max(0, Math.min(100, ((rssi + 90) / 60) * 100));

  let color = '#EF4444'; // Weak (Red)
  if (percentage > 66) color = '#10B981'; // Strong (Green)
  else if (percentage > 33) color = '#F59E0B'; // Medium (Yellow)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '80px', height: '8px', backgroundColor: '#374151', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: color }} />
      </div>
      <span style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'monospace' }}>{rssi} dBm</span>
    </div>
  );
};
