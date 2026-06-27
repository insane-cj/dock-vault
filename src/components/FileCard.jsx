import React from 'react';
import { getFileType, getCategory, FILE_TYPE_META, CATEGORY_META, formatSize, formatDateShort } from '../utils';
import './FileCard.css';

function FileIcon({ file, size = 40 }) {
  const type = getFileType(file);
  const meta = FILE_TYPE_META[type];
  return (
    <div className={`file-icon ${meta.bgClass}`} style={{ width: size, height: size }}>
      <i className={`ti ${meta.icon}`} aria-hidden="true" />
    </div>
  );
}

function CategoryBadge({ file }) {
  const cat = getCategory(file);
  const meta = CATEGORY_META[cat];
  return <span className={`cat-badge cat-${meta.color}`}>{cat}</span>;
}

function FavButton({ fileId, isFavorite, onToggle }) {
  return (
    <button
      className={`fav-btn ${isFavorite ? 'starred' : ''}`}
      onClick={e => { e.stopPropagation(); onToggle(fileId); }}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <i className={`ti ${isFavorite ? 'ti-star-filled' : 'ti-star'}`} aria-hidden="true" />
    </button>
  );
}

// ── Grid Card ────────────────────────────────────────────────────────────────
export function FileCard({ file, isFavorite, onToggleFav, onClick }) {
  return (
    <div className="file-card" onClick={() => onClick(file)} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick(file)}>
      <FavButton fileId={file.id} isFavorite={isFavorite} onToggle={onToggleFav} />
      <FileIcon file={file} size={40} />
      <p className="file-card-name" title={file.name}>{file.name || 'Untitled'}</p>
      <p className="file-card-meta">
        {formatSize(file.size)}{file.size && file.modifiedTime ? ' · ' : ''}{formatDateShort(file.modifiedTime)}
      </p>
      <CategoryBadge file={file} />
    </div>
  );
}

// ── List Item ────────────────────────────────────────────────────────────────
export function FileListItem({ file, isFavorite, onToggleFav, onClick }) {
  return (
    <div className="file-list-item" onClick={() => onClick(file)} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick(file)}>
      <FileIcon file={file} size={34} />
      <p className="file-list-name" title={file.name}>{file.name || 'Untitled'}</p>
      <CategoryBadge file={file} />
      <p className="file-list-date">{formatDateShort(file.modifiedTime)}</p>
      <p className="file-list-size">{formatSize(file.size)}</p>
      <FavButton fileId={file.id} isFavorite={isFavorite} onToggle={onToggleFav} />
    </div>
  );
}
