import React from 'react';
import { FileCard } from '../components/FileCard';
import { EmptyState } from '../components/Components';
import { formatSize, buildFolderUrl, CATEGORY_META } from '../utils';
import './Dashboard.css';

function StatCard({ label, value, icon, color }) {
  return (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-icon"><i className={`ti ${icon}`} aria-hidden="true" /></div>
      <div>
        <p className="stat-value">{value}</p>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );
}

export default function Dashboard({ stats, recentFiles, isFavorite, onToggleFav, onOpenFile, folderId, syncing }) {
  if (syncing && recentFiles.length === 0) {
    return (
      <div className="dashboard">
        <div className="dash-loading">
          <i className="ti ti-loader-2 spin" aria-hidden="true" />
          <p>Loading your files…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Stats Row */}
      <div className="stats-grid">
        <StatCard label="Total files"  value={stats.total}       icon="ti-files"       color="blue" />
        <StatCard label="Starred"      value={stats.favorites}   icon="ti-star"        color="amber" />
        <StatCard label="Recently opened" value={stats.recents}  icon="ti-clock"       color="purple" />
        <StatCard label="Storage used" value={formatSize(stats.totalSize) || '—'} icon="ti-database" color="teal" />
      </div>

      {/* Categories breakdown */}
      {Object.keys(stats.byCategory || {}).length > 0 && (
        <div className="dash-section">
          <h2 className="dash-section-title">By category</h2>
          <div className="cat-grid">
            {Object.entries(stats.byCategory).map(([cat, count]) => {
              const meta = CATEGORY_META[cat];
              return (
                <div key={cat} className={`cat-card cat-card-${meta?.color || 'gray'}`}>
                  <i className={`ti ${meta?.icon || 'ti-folder'}`} aria-hidden="true" />
                  <div>
                    <p className="cat-count">{count}</p>
                    <p className="cat-name">{cat}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent files */}
      <div className="dash-section">
        <h2 className="dash-section-title">Recently opened</h2>
        {recentFiles.length === 0 ? (
          <EmptyState icon="ti-clock-off" title="No recent files" subtitle="Open a file to see it here" />
        ) : (
          <div className="recent-grid">
            {recentFiles.slice(0, 6).map(f => (
              <FileCard
                key={f.id}
                file={f}
                isFavorite={isFavorite(f.id)}
                onToggleFav={onToggleFav}
                onClick={onOpenFile}
              />
            ))}
          </div>
        )}
      </div>

      {/* Open Drive folder link */}
      {folderId && (
        <div className="dash-drive-link">
          <i className="ti ti-brand-google-drive" aria-hidden="true" />
          <span>Your Drive folder:</span>
          <a href={buildFolderUrl(folderId)} target="_blank" rel="noopener noreferrer">
            Open in Google Drive <i className="ti ti-external-link" aria-hidden="true" />
          </a>
        </div>
      )}
    </div>
  );
}
