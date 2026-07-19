/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import React from 'react';

interface Props {
  power: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
}

export const AntennaPowerSlider: React.FC<Props> = ({ power, onChange, min = 0.0, max = 33.0 }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#D1D5DB' }}>
        <span>Tx Power</span>
        <span style={{ fontWeight: 'bold', color: '#00E5EE' }}>{power.toFixed(1)} dBm</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={0.5}
        value={power}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ accentColor: '#00E5EE', cursor: 'pointer' }}
      />
    </div>
  );
};
