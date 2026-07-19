/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import React, { useState, useEffect } from 'react';
import { EventBus, ConfigManager, Logger, MemoryStorageDriver } from '@openrfid/core';
import { SimulatorManager } from '@openrfid/simulator';
import { PluginManager } from '@openrfid/plugin-api';
import { BrowserRestPlugin, BrowserWebSocketPlugin, BrowserMqttPlugin, BrowserHopelandDiscoveryPlugin } from './plugins-browser';
import { BrandHeader } from '@openrfid/ui';

import {
  DashboardView,
  ReadersView,
  TagsView,
  EventMonitorView,
  EventHistoryView,
  ProtocolsPluginsView,
} from '@openrfid/shell';

// Central Singleton Services
const eventBus = new EventBus();
const config = new ConfigManager({ server: { port: 3000, host: '0.0.0.0' } });
const logger = new Logger('DesktopApp');
const storage = new MemoryStorageDriver(config);   // A4.2 — pass config for dynamic limit
const simulator = new SimulatorManager(eventBus, storage);
const pluginManager = new PluginManager({ eventBus, config, logger, simulator, storage });

// Register Protocol Plugins
pluginManager.register(new BrowserRestPlugin());
pluginManager.register(new BrowserWebSocketPlugin());
pluginManager.register(new BrowserMqttPlugin());
pluginManager.register(new BrowserHopelandDiscoveryPlugin());

type TabId = 'dashboard' | 'readers' | 'tags' | 'events' | 'history' | 'plugins';

const TABS: { id: TabId; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'readers',   label: 'Readers' },
  { id: 'tags',      label: 'Tags' },
  { id: 'events',    label: 'Event Monitor' },
  { id: 'history',   label: '📊 Event History' },
  { id: 'plugins',   label: 'Protocols & Plugins' },
];

interface StartupBannerState {
  show: boolean;
  readerCount: number;
  tagCount: number;
}

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [, setTick] = useState(0);
  const [banner, setBanner] = useState<StartupBannerState>({ show: false, readerCount: 0, tagCount: 0 });
  const [bannerDismissTimer, setBannerDismissTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const forceRefresh = () => setTick((t) => t + 1);

  useEffect(() => {
    async function init() {
      await storage.connect();

      // A3.1 — Load persisted readers and tags
      await simulator.loadFromStorage();

      const { readerCount, tagCount } = simulator.getStorageSummary();

      // A3.3 — Show startup banner only if there is existing data
      if (readerCount > 0 || tagCount > 0) {
        setBanner({ show: true, readerCount, tagCount });

        // Auto-dismiss after 5s
        const timer = setTimeout(() => setBanner((b) => ({ ...b, show: false })), 5000);
        setBannerDismissTimer(timer);
      }

      await pluginManager.initializeAll();
      await pluginManager.startAll();
    }
    init();

    return () => {
      if (bannerDismissTimer) clearTimeout(bannerDismissTimer);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBannerClearReaders = async () => {
    if (bannerDismissTimer) clearTimeout(bannerDismissTimer);
    const readers = simulator.getAllReaders();
    const tags = simulator.getAllTags();
    readers.forEach((r) => simulator.removeReader(r.id));
    tags.forEach((t) => simulator.removeTag(t.epc));
    setBanner({ show: false, readerCount: 0, tagCount: 0 });
    forceRefresh();
  };

  const handleBannerClearAll = async () => {
    if (bannerDismissTimer) clearTimeout(bannerDismissTimer);
    await storage.clearAllData();
    const readers = simulator.getAllReaders();
    const tags = simulator.getAllTags();
    readers.forEach((r) => simulator.removeReader(r.id));
    tags.forEach((t) => simulator.removeTag(t.epc));
    setBanner({ show: false, readerCount: 0, tagCount: 0 });
    forceRefresh();
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0F172A', color: '#F8FAFC' }}>
      <BrandHeader />

      {/* A3.3 — Startup Data Restore Banner */}
      {banner.show && (
        <div style={{
          backgroundColor: '#0D2137',
          border: '1px solid #0EA5E9',
          borderLeft: '4px solid #0EA5E9',
          padding: '12px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
        }}>
          <div>
            <span style={{ fontWeight: 'bold', color: '#38BDF8' }}>🔄 Restored from storage: </span>
            <span style={{ color: '#CBD5E1' }}>
              {banner.readerCount} reader{banner.readerCount !== 1 ? 's' : ''} · {banner.tagCount.toLocaleString()} tag{banner.tagCount !== 1 ? 's' : ''}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => { if (bannerDismissTimer) clearTimeout(bannerDismissTimer); setBanner((b) => ({ ...b, show: false })); }}
              style={{ backgroundColor: '#10B981', color: '#FFF', border: 'none', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
            >
              Continue ✓
            </button>
            <button
              onClick={handleBannerClearReaders}
              style={{ backgroundColor: '#F59E0B', color: '#FFF', border: 'none', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
            >
              Clear Readers &amp; Tags
            </button>
            <button
              onClick={handleBannerClearAll}
              style={{ backgroundColor: '#EF4444', color: '#FFF', border: 'none', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
            >
              ☢️ Clear Everything
            </button>
          </div>
        </div>
      )}

      {/* Main Tab Navigation */}
      <nav style={{ backgroundColor: '#1E293B', borderBottom: '1px solid #334155', display: 'flex', gap: '4px', padding: '0 24px', overflowX: 'auto' }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 20px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #00E5EE' : '2px solid transparent',
              color: activeTab === tab.id ? '#00E5EE' : '#94A3B8',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              cursor: 'pointer',
              fontSize: '14px',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Main Content View */}
      <main style={{ flex: 1 }}>
        {activeTab === 'dashboard' && <DashboardView simulator={simulator} storage={storage} />}
        {activeTab === 'readers'   && <ReadersView simulator={simulator} refresh={forceRefresh} />}
        {activeTab === 'tags'      && <TagsView simulator={simulator} refresh={forceRefresh} />}
        {activeTab === 'events'    && <EventMonitorView eventBus={eventBus} storage={storage} onViewHistory={() => setActiveTab('history')} />}
        {activeTab === 'history'   && <EventHistoryView storage={storage} />}
        {activeTab === 'plugins'   && <ProtocolsPluginsView pluginManager={pluginManager} />}
      </main>
    </div>
  );
};
