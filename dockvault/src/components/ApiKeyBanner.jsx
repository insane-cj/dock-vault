import React, { useState } from 'react';
import './ApiKeyBanner.css';

export default function ApiKeyBanner({ folderId }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="api-banner">
      <div className="api-banner-icon">
        <i className="ti ti-key" aria-hidden="true" />
      </div>
      <div className="api-banner-body">
        <strong>Google Drive API key needed</strong>
        <p>
          To fetch your files, add a free Google Drive API key to your project.
          Create one at{' '}
          <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer">
            console.cloud.google.com
          </a>{' '}
          → Enable <strong>Drive API</strong> → Credentials → <strong>Create API Key</strong>.
          Then add it to your <code>.env</code> file:
        </p>
        <div className="api-banner-code">
          REACT_APP_DRIVE_API_KEY=<em>your_key_here</em>
        </div>
        <p>
          Also make sure your Drive folder is set to <strong>"Anyone with the link → Viewer"</strong>.{' '}
          {folderId && (
            <a
              href={`https://drive.google.com/drive/folders/${folderId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open your folder →
            </a>
          )}
        </p>
      </div>
      <button className="api-banner-close" onClick={() => setDismissed(true)} aria-label="Dismiss">
        <i className="ti ti-x" aria-hidden="true" />
      </button>
    </div>
  );
}
