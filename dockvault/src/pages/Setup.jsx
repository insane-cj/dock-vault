import React, { useState } from 'react';
import { Button } from '../components/Components';
import './Setup.css';

export default function SetupPage({ onConnect }) {
  const [link, setLink]   = useState('');
  const [error, setError] = useState('');

  function handleConnect(e) {
    e.preventDefault();
    const err = onConnect(link);
    if (err) setError(err);
  }

  return (
    <div className="setup-screen">
      <div className="setup-card">
        <div className="setup-logo">
          <div className="setup-logo-icon">
            <i className="ti ti-vault" aria-hidden="true" />
          </div>
          <span>DockVault</span>
        </div>

        <h1>Connect your Drive folder</h1>
        <p className="setup-sub">
          Paste your Google Drive folder link below. Your documents will appear automatically —
          no Google login needed.
        </p>

        <div className="setup-tip">
          <div className="tip-step">
            <span className="tip-num">1</span>
            <span>Open <strong>Google Drive</strong> and go to your documents folder</span>
          </div>
          <div className="tip-step">
            <span className="tip-num">2</span>
            <span>Right-click the folder → <strong>Share</strong> → change to <strong>"Anyone with the link"</strong> (Viewer)</span>
          </div>
          <div className="tip-step">
            <span className="tip-num">3</span>
            <span>Click <strong>Copy link</strong> and paste it below</span>
          </div>
        </div>

        <form onSubmit={handleConnect}>
          {error && (
            <div className="setup-error" role="alert">
              <i className="ti ti-alert-circle" aria-hidden="true" />
              {error}
            </div>
          )}
          <div className="setup-field">
            <label htmlFor="drive-link">Google Drive folder link</label>
            <input
              id="drive-link"
              type="url"
              value={link}
              onChange={e => { setLink(e.target.value); setError(''); }}
              placeholder="https://drive.google.com/drive/folders/..."
              autoFocus
            />
          </div>
          <Button type="submit" variant="primary" size="lg" style={{ width: '100%', justifyContent: 'center' }}>
            <i className="ti ti-plug-connected" aria-hidden="true" />
            Connect folder
          </Button>
        </form>
      </div>
    </div>
  );
}
