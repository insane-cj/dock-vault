import React, { useState } from 'react';
import { Button, Toggle } from '../components/Components';
import { buildFolderUrl } from '../utils';
import './Settings.css';

function SettingsSection({ icon, title, children }) {
  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <i className={`ti ${icon}`} aria-hidden="true" />
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function SettingsRow({ label, sublabel, children }) {
  return (
    <div className="settings-row">
      <div className="settings-row-label">
        <span>{label}</span>
        {sublabel && <p>{sublabel}</p>}
      </div>
      <div className="settings-row-control">{children}</div>
    </div>
  );
}

export default function Settings({
  folderId,
  onUpdateFolder,
  onUpdatePassword,
  onSetAutoRefresh,
  getAutoRefresh,
  onClearData,
  onLock,
}) {
  const [folderLink, setFolderLink] = useState(folderId ? buildFolderUrl(folderId) : '');
  const [folderErr, setFolderErr]   = useState('');
  const [folderOk, setFolderOk]     = useState('');

  const [newPw, setNewPw]           = useState('');
  const [confirmPw, setConfirmPw]   = useState('');
  const [pwErr, setPwErr]           = useState('');
  const [pwOk, setPwOk]             = useState('');

  const [autoRefresh, setAutoRefresh] = useState(getAutoRefresh());

  function handleSaveFolder(e) {
    e.preventDefault();
    setFolderOk(''); setFolderErr('');
    const err = onUpdateFolder(folderLink);
    if (err) setFolderErr(err);
    else setFolderOk('Folder updated & syncing…');
  }

  function handleSavePassword(e) {
    e.preventDefault();
    setPwErr(''); setPwOk('');
    if (newPw !== confirmPw) { setPwErr('Passwords do not match'); return; }
    const err = onUpdatePassword(newPw);
    if (err) setPwErr(err);
    else { setPwOk('Password updated'); setNewPw(''); setConfirmPw(''); }
  }

  function handleAutoRefresh(val) {
    setAutoRefresh(val);
    onSetAutoRefresh(val);
  }

  return (
    <div className="settings-page">

      <SettingsSection icon="ti-brand-google-drive" title="Drive folder">
        <form onSubmit={handleSaveFolder}>
          <div className="settings-field">
            <label htmlFor="s-folder">Folder link</label>
            <input
              id="s-folder"
              type="url"
              value={folderLink}
              onChange={e => { setFolderLink(e.target.value); setFolderErr(''); setFolderOk(''); }}
              placeholder="https://drive.google.com/drive/folders/…"
            />
          </div>
          {folderErr && <p className="settings-msg error"><i className="ti ti-alert-circle" />{folderErr}</p>}
          {folderOk  && <p className="settings-msg ok"><i className="ti ti-circle-check" />{folderOk}</p>}
          <Button type="submit" variant="primary" size="sm">Save folder</Button>
        </form>
      </SettingsSection>

      <SettingsSection icon="ti-lock" title="Password">
        <form onSubmit={handleSavePassword}>
          <div className="settings-field">
            <label htmlFor="s-pw">New password</label>
            <input
              id="s-pw"
              type="password"
              value={newPw}
              onChange={e => { setNewPw(e.target.value); setPwErr(''); setPwOk(''); }}
              placeholder="Enter new password (min 4 chars)"
              autoComplete="new-password"
            />
          </div>
          <div className="settings-field">
            <label htmlFor="s-pw2">Confirm password</label>
            <input
              id="s-pw2"
              type="password"
              value={confirmPw}
              onChange={e => { setConfirmPw(e.target.value); setPwErr(''); setPwOk(''); }}
              placeholder="Re-enter new password"
              autoComplete="new-password"
            />
          </div>
          {pwErr && <p className="settings-msg error"><i className="ti ti-alert-circle" />{pwErr}</p>}
          {pwOk  && <p className="settings-msg ok"><i className="ti ti-circle-check" />{pwOk}</p>}
          <Button type="submit" variant="primary" size="sm">Update password</Button>
        </form>
      </SettingsSection>

      <SettingsSection icon="ti-refresh" title="Sync">
        <SettingsRow
          label="Auto-refresh"
          sublabel="Check for new files every 30 seconds"
        >
          <Toggle id="auto-refresh" checked={autoRefresh} onChange={handleAutoRefresh} />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection icon="ti-info-circle" title="About">
        <div className="settings-about">
          <p><strong>DockVault</strong> — your personal document vault powered by Google Drive.</p>
          <p>
            Documents are fetched from your public Google Drive folder using the{' '}
            <a href="https://developers.google.com/drive/api/v3/reference/files/list" target="_blank" rel="noopener noreferrer">
              Google Drive API v3
            </a>.
            No data is stored on any server — everything stays in your browser.
          </p>
          <div className="settings-api-note">
            <i className="ti ti-key" aria-hidden="true" />
            <div>
              <strong>Google Drive API key required</strong>
              <p>
                Add your API key to <code>.env</code> as{' '}
                <code>REACT_APP_DRIVE_API_KEY=your_key_here</code>.
                Get one free at{' '}
                <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer">
                  console.cloud.google.com
                </a>{' '}
                → Enable Drive API → Credentials → Create API Key.
              </p>
            </div>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection icon="ti-trash" title="Data">
        <p className="settings-sub">
          Clear favorites and recently opened files from this device. Your Drive folder and password are kept.
        </p>
        <div className="settings-danger-row">
          <Button variant="danger" size="sm" onClick={() => { if (window.confirm('Clear all local data (favorites, recents)?')) onClearData(); }}>
            <i className="ti ti-trash" /> Clear local data
          </Button>
          <Button variant="ghost" size="sm" onClick={onLock}>
            <i className="ti ti-logout" /> Lock vault now
          </Button>
        </div>
      </SettingsSection>

    </div>
  );
}
