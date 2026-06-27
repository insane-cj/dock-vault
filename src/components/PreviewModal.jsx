import React, { useEffect } from 'react';
import { buildPreviewUrl, buildOpenUrl, getFileType } from '../utils';
import { Button } from './Components';
import './PreviewModal.css';

const PREVIEWABLE = ['pdf', 'image', 'doc', 'sheet', 'slide'];

export default function PreviewModal({ file, onClose, onToggleFav, isFavorite }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!file) return null;

  const type       = getFileType(file);
  const canPreview = PREVIEWABLE.includes(type);
  const previewUrl = buildPreviewUrl(file.id, file.mimeType);
  const openUrl    = buildOpenUrl(file.id, file.mimeType);

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" role="dialog" aria-modal="true" aria-label={`Preview: ${file.name}`}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <p className="modal-filename">{file.name || 'Document'}</p>
          </div>
          <div className="modal-actions">
            <Button
              variant={isFavorite ? 'ghost' : 'ghost'}
              size="sm"
              onClick={() => onToggleFav(file.id)}
              style={{ color: isFavorite ? 'var(--amber-600)' : undefined }}
            >
              <i className={`ti ${isFavorite ? 'ti-star-filled' : 'ti-star'}`} aria-hidden="true" />
              {isFavorite ? 'Starred' : 'Star'}
            </Button>
            <a
              href={openUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
            >
              <i className="ti ti-external-link" aria-hidden="true" />
              Open in Drive
            </a>
            <button className="modal-close" onClick={onClose} aria-label="Close preview">
              <i className="ti ti-x" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="modal-body">
          {canPreview ? (
            <iframe
              className="preview-frame"
              src={previewUrl}
              title={`Preview of ${file.name}`}
              allow="autoplay"
              allowFullScreen
            />
          ) : (
            <div className="preview-fallback">
              <i className="ti ti-eye-off" aria-hidden="true" />
              <p>Preview not available for this file type</p>
              <a href={openUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-md">
                <i className="ti ti-external-link" aria-hidden="true" />
                Open in Google Drive
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
