/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import React from 'react';
import { BRAND } from '@openrfid/core';

export const BrandHeader: React.FC = () => {
  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 24px',
        backgroundColor: '#111827',
        borderBottom: '1px solid #1F2937',
        color: '#FFFFFF',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="32" height="32">
          <path fill="none" stroke="#00E5EE" strokeWidth="38" strokeLinecap="round" d="M 80,80 L 380,80 A 80,80 0 0 1 440,200 L 320,290" />
          <path fill="none" stroke="#00E5EE" strokeWidth="38" strokeLinecap="round" d="M 150,160 L 150,420" />
          <path fill="none" stroke="#00E5EE" strokeWidth="38" strokeLinecap="round" d="M 150,160 L 350,160 A 40,40 0 0 1 350,240 L 150,240" />
          <path fill="none" stroke="#00E5EE" strokeWidth="38" strokeLinecap="round" d="M 230,260 L 460,460" />
          <circle fill="#00E5EE" cx="80" cy="80" r="34" />
          <circle fill="#111827" cx="80" cy="80" r="16" />
          <circle fill="#00E5EE" cx="150" cy="420" r="34" />
          <circle fill="#111827" cx="150" cy="420" r="16" />
        </svg>
        <div>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#FFFFFF' }}>{BRAND.name}</h1>
          <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{BRAND.tagline}</span>
        </div>
      </div>

      <div>
        <a
          href={BRAND.website}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#00E5EE',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: '600',
            border: '1px solid #00E5EE',
            padding: '4px 12px',
            borderRadius: '6px',
          }}
        >
          {BRAND.organization}
        </a>
      </div>
    </header>
  );
};
