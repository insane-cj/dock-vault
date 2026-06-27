import React from 'react';
import { CATEGORY_META } from '../utils';
import './Sidebar.css';

const NAV = [
  { id: 'dashboard',  icon: 'ti-layout-dashboard', label: 'Dashboard' },
  { id: 'all',        icon: 'ti-files',             label: 'All files' },
  { id: 'recents',    icon: 'ti-clock',             label: 'Recent' },
  { id: 'favorites',  icon: 'ti-star',              label: 'Favorites' },
];

const CATS = ['Certificates', 'Notes', 'Resume', 'Semester', 'Images', 'Others'];

export default function Sidebar({ page, onNavigate, stats, syncing, lastSync }) {
  const syncLabel = syncing
    ? 'Syncing…'
    : lastSync
    ? 'Synced ' + lastSync.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    : 'Not synced yet';

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <i className="ti ti-vault" aria-hidden="true" />
          </div>
          <span>Dock Vault</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group">
          {NAV.map(n => (
            <button
              key={n.id}
              className={`nav-item ${page === n.id ? 'active' : ''}`}
              onClick={() => onNavigate(n.id)}
            >
              <i className={`ti ${n.icon}`} aria-hidden="true" />
              <span>{n.label}</span>
              {n.id === 'all' && stats && (
                <span className="nav-badge">{stats.total}</span>
              )}
              {n.id === 'favorites' && stats && stats.favorites > 0 && (
                <span className="nav-badge">{stats.favorites}</span>
              )}
              {n.id === 'recents' && stats && stats.recents > 0 && (
                <span className="nav-badge">{stats.recents}</span>
              )}
            </button>
          ))}
        </div>

        <div className="nav-section-label">Categories</div>
        <div className="nav-group">
          {CATS.map(cat => {
            const meta = CATEGORY_META[cat];
            const count = stats?.byCategory?.[cat] || 0;
            return (
              <button
                key={cat}
                className={`nav-item ${page === 'cat:' + cat ? 'active' : ''}`}
                onClick={() => onNavigate('cat:' + cat)}
              >
                <i className={`ti ${meta.icon}`} aria-hidden="true" />
                <span>{cat}</span>
                {count > 0 && <span className="nav-badge">{count}</span>}
              </button>
            );
          })}
        </div>

        <div className="nav-section-label">Account</div>
        <div className="nav-group">
          <button
            className={`nav-item ${page === 'settings' ? 'active' : ''}`}
            onClick={() => onNavigate('settings')}
          >
            <i className="ti ti-settings" aria-hidden="true" />
            <span>Settings</span>
          </button>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className={`sync-status ${syncing ? 'syncing' : ''}`}>
          <span className="sync-dot" />
          <span className="sync-label">{syncLabel}</span>
        </div>
      </div>
    </aside>
  );
}
