import React, { useState, useMemo } from 'react';
import { FileCard, FileListItem } from './FileCard';
import { IconButton, EmptyState } from './Components';
import { getFileType, getCategory } from '../utils';
import './FileBrowser.css';

const TYPE_FILTERS = [
  { value: 'all',   label: 'All types' },
  { value: 'pdf',   label: 'PDF' },
  { value: 'doc',   label: 'Docs' },
  { value: 'sheet', label: 'Sheets' },
  { value: 'slide', label: 'Slides' },
  { value: 'image', label: 'Images' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'az',     label: 'A → Z' },
  { value: 'za',     label: 'Z → A' },
  { value: 'size',   label: 'Largest first' },
];

export default function FileBrowser({
  files,
  isFavorite,
  onToggleFav,
  onOpenFile,
  showTypeFilter = true,
  emptyIcon,
  emptyTitle,
  emptySub,
}) {
  const [view, setView]         = useState('grid'); // 'grid' | 'list'
  const [typeFilter, setType]   = useState('all');
  const [sort, setSort]         = useState('newest');
  const [query, setQuery]       = useState('');

  const filtered = useMemo(() => {
    let f = [...files];
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      f = f.filter(x => (x.name || '').toLowerCase().includes(q));
    }
    if (typeFilter !== 'all') {
      f = f.filter(x => getFileType(x) === typeFilter);
    }
    if (sort === 'newest') f.sort((a, b) => new Date(b.modifiedTime || 0) - new Date(a.modifiedTime || 0));
    else if (sort === 'oldest') f.sort((a, b) => new Date(a.modifiedTime || 0) - new Date(b.modifiedTime || 0));
    else if (sort === 'az') f.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    else if (sort === 'za') f.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    else if (sort === 'size') f.sort((a, b) => parseInt(b.size || 0) - parseInt(a.size || 0));
    return f;
  }, [files, query, typeFilter, sort]);

  return (
    <div className="file-browser">
      <div className="browser-toolbar">
        <div className="search-box">
          <i className="ti ti-search" aria-hidden="true" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search files…"
            aria-label="Search files"
          />
          {query && (
            <button className="search-clear" onClick={() => setQuery('')} aria-label="Clear search">
              <i className="ti ti-x" />
            </button>
          )}
        </div>

        <div className="toolbar-right">
          <select
            className="sort-select"
            value={sort}
            onChange={e => setSort(e.target.value)}
            aria-label="Sort by"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <div className="view-toggle">
            <IconButton icon="ti-layout-grid" onClick={() => setView('grid')} active={view === 'grid'} title="Grid view" />
            <IconButton icon="ti-layout-list" onClick={() => setView('list')} active={view === 'list'} title="List view" />
          </div>
        </div>
      </div>

      {showTypeFilter && (
        <div className="type-filters" role="group" aria-label="Filter by type">
          {TYPE_FILTERS.map(f => (
            <button
              key={f.value}
              className={`type-chip ${typeFilter === f.value ? 'active' : ''}`}
              onClick={() => setType(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        query ? (
          <EmptyState icon="ti-search-off" title={`No results for "${query}"`} subtitle="Try different keywords" />
        ) : (
          <EmptyState icon={emptyIcon || 'ti-files-off'} title={emptyTitle || 'No files'} subtitle={emptySub} />
        )
      ) : view === 'grid' ? (
        <div className="file-grid">
          {filtered.map(f => (
            <FileCard
              key={f.id}
              file={f}
              isFavorite={isFavorite(f.id)}
              onToggleFav={onToggleFav}
              onClick={onOpenFile}
            />
          ))}
        </div>
      ) : (
        <div className="file-list">
          <div className="list-header">
            <span style={{ flex: 1 }}>Name</span>
            <span>Category</span>
            <span>Modified</span>
            <span>Size</span>
            <span />
          </div>
          {filtered.map(f => (
            <FileListItem
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
  );
}
