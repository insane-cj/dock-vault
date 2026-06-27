import React, { useState } from 'react';
import { useVault } from './hooks/useVault';
import AuthPage    from './pages/Auth';
import SetupPage   from './pages/Setup';
import Dashboard   from './pages/Dashboard';
import Settings    from './pages/Settings';
import Sidebar     from './components/Sidebar';
import FileBrowser from './components/FileBrowser';
import PreviewModal from './components/PreviewModal';
import ApiKeyBanner from './components/ApiKeyBanner';
import { Toast, IconButton, Spinner } from './components/Components';
import { getCategory } from './utils';
import './styles/global.css';
import './App.css';

export default function App() {
  const vault = useVault();
  const [page, setPage]           = useState('dashboard');
  const [previewFile, setPreview] = useState(null);
  const [sidebarOpen, setSidebar] = useState(false);

  // ── Loading splash ────────────────────────────────────────────────────
  if (vault.authState === 'loading') {
    return (
      <div className="loading-splash">
        <div className="splash-logo">
          <i className="ti ti-vault" aria-hidden="true" />
        </div>
      </div>
    );
  }

  // ── Auth screens ──────────────────────────────────────────────────────
  if (vault.authState === 'locked') {
    return <AuthPage onUnlock={vault.unlock} />;
  }
  if (vault.authState === 'setup') {
    return <SetupPage onConnect={vault.connectFolder} />;
  }

  // ── File open ─────────────────────────────────────────────────────────
  function openFile(file) {
    vault.logRecent(file.id);
    setPreview(file);
  }

  // ── Page content ─────────────────────────────────────────────────────
  function getPageContent() {
    if (page === 'dashboard') {
      return (
        <Dashboard
          stats={vault.getStats()}
          recentFiles={vault.getRecentFiles()}
          isFavorite={vault.isFavorite}
          onToggleFav={vault.toggleFavorite}
          onOpenFile={openFile}
          folderId={vault.folderId}
          syncing={vault.syncing}
        />
      );
    }

    if (page === 'all') {
      return (
        <FileBrowser
          files={vault.files}
          isFavorite={vault.isFavorite}
          onToggleFav={vault.toggleFavorite}
          onOpenFile={openFile}
          emptyTitle="No files found"
          emptySub="Make sure your Drive folder is public and your API key is set"
        />
      );
    }

    if (page === 'recents') {
      return (
        <FileBrowser
          files={vault.getRecentFiles()}
          isFavorite={vault.isFavorite}
          onToggleFav={vault.toggleFavorite}
          onOpenFile={openFile}
          showTypeFilter={false}
          emptyIcon="ti-clock-off"
          emptyTitle="No recent files"
          emptySub="Files you open will appear here"
        />
      );
    }

    if (page === 'favorites') {
      return (
        <FileBrowser
          files={vault.getFavoriteFiles()}
          isFavorite={vault.isFavorite}
          onToggleFav={vault.toggleFavorite}
          onOpenFile={openFile}
          showTypeFilter={false}
          emptyIcon="ti-star-off"
          emptyTitle="No favorites yet"
          emptySub="Star files to find them quickly here"
        />
      );
    }

    if (page.startsWith('cat:')) {
      const cat = page.slice(4);
      const catFiles = vault.files.filter(f => getCategory(f) === cat);
      return (
        <FileBrowser
          files={catFiles}
          isFavorite={vault.isFavorite}
          onToggleFav={vault.toggleFavorite}
          onOpenFile={openFile}
          emptyIcon="ti-folder-off"
          emptyTitle={`No ${cat} files`}
          emptySub="Files matching this category will appear here"
        />
      );
    }

    if (page === 'settings') {
      return (
        <Settings
          folderId={vault.folderId}
          onUpdateFolder={vault.updateFolderLink}
          onUpdatePassword={vault.updatePassword}
          onSetAutoRefresh={vault.setAutoRefresh}
          getAutoRefresh={vault.getAutoRefresh}
          onClearData={vault.clearLocalData}
          onLock={vault.lock}
        />
      );
    }

    return null;
  }

  const pageTitles = {
    dashboard: 'Dashboard',
    all:       'All files',
    recents:   'Recent',
    favorites: 'Favorites',
    settings:  'Settings',
  };

  const pageTitle = pageTitles[page] || (page.startsWith('cat:') ? page.slice(4) : page);
  const stats = vault.getStats();

  return (
    <div className="app-shell">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebar(false)} aria-hidden="true" />
      )}

      <Sidebar
        page={page}
        onNavigate={p => { setPage(p); setSidebar(false); }}
        stats={stats}
        syncing={vault.syncing}
        lastSync={vault.lastSync}
        className={sidebarOpen ? 'open' : ''}
      />

      <div className="app-main">
        {/* Topbar */}
        <header className="topbar">
          <button
            className="hamburger"
            onClick={() => setSidebar(v => !v)}
            aria-label="Toggle menu"
          >
            <i className="ti ti-menu-2" aria-hidden="true" />
          </button>

          <h1 className="topbar-title">{pageTitle}</h1>

          <div className="topbar-right">
            {vault.syncing && (
              <span className="topbar-syncing">
                <Spinner size={14} />
                <span>Syncing</span>
              </span>
            )}
            {vault.syncError && (
              <span className="topbar-error" title={vault.syncError}>
                <i className="ti ti-alert-triangle" aria-hidden="true" />
                Sync error
              </span>
            )}
            <IconButton
              icon={vault.syncing ? 'ti-loader-2' : 'ti-refresh'}
              onClick={vault.refresh}
              title="Refresh files"
              className={vault.syncing ? 'spinning' : ''}
            />
            <IconButton
              icon="ti-lock"
              onClick={vault.lock}
              title="Lock vault"
            />
          </div>
        </header>

        {/* Content */}
        <main className="app-content">
          {vault.apiKeyMissing && <ApiKeyBanner folderId={vault.folderId} />}
          {getPageContent()}
        </main>
      </div>

      {/* Preview modal */}
      {previewFile && (
        <PreviewModal
          file={previewFile}
          onClose={() => setPreview(null)}
          onToggleFav={vault.toggleFavorite}
          isFavorite={vault.isFavorite(previewFile.id)}
        />
      )}

      {/* Toast notifications */}
      <Toast toast={vault.toast} />
    </div>
  );
}
