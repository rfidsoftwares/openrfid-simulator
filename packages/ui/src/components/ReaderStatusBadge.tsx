/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import React from 'react';

export type StatusType = 'ONLINE' | 'OFFLINE' | 'CONNECTING' | 'ERROR';

interface Props {
  status: StatusType;
}

export const ReaderStatusBadge: React.FC<Props> = ({ status }) => {
  const styles: Record<StatusType, { bg: string; text: string; label: string }> = {
    ONLINE: { bg: '#10B981', text: '#FFFFFF', label: 'ONLINE' },
    OFFLINE: { bg: '#6B7280', text: '#FFFFFF', label: 'OFFLINE' },
    CONNECTING: { bg: '#F59E0B', text: '#FFFFFF', label: 'CONNECTING' },
    ERROR: { bg: '#EF4444', text: '#FFFFFF', label: 'ERROR' },
  };

  const current = styles[status] || styles.OFFLINE;

  return (
    <span
      style={{
        backgroundColor: current.bg,
        color: current.text,
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 'bold',
        display: 'inline-block',
      }}
    >
      {current.label}
    </span>
  );
};
