import React from 'react';
import './Components.css';

// ── Button ─────────────────────────────────────────────────────────────────
export function Button({ children, variant = 'default', size = 'md', onClick, disabled, className = '', ...props }) {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

// ── IconButton ─────────────────────────────────────────────────────────────
export function IconButton({ icon, onClick, title, active, className = '' }) {
  return (
    <button
      className={`icon-btn ${active ? 'active' : ''} ${className}`}
      onClick={onClick}
      title={title}
      aria-label={title}
    >
      <i className={`ti ${icon}`} aria-hidden="true" />
    </button>
  );
}

// ── Badge ──────────────────────────────────────────────────────────────────
export function Badge({ children, color = 'gray' }) {
  return <span className={`badge badge-${color}`}>{children}</span>;
}

// ── Toast ──────────────────────────────────────────────────────────────────
export function Toast({ toast }) {
  if (!toast) return null;
  const icon = toast.type === 'error' ? 'ti-alert-circle' : 'ti-circle-check';
  return (
    <div className={`toast toast-${toast.type}`} role="status" aria-live="polite">
      <i className={`ti ${icon}`} aria-hidden="true" />
      <span>{toast.message}</span>
    </div>
  );
}

// ── Spinner ────────────────────────────────────────────────────────────────
export function Spinner({ size = 16 }) {
  return (
    <i
      className="ti ti-loader-2"
      aria-label="Loading"
      style={{ fontSize: size, animation: 'spin 0.8s linear infinite', display: 'inline-block' }}
    />
  );
}

// ── Empty State ────────────────────────────────────────────────────────────
export function EmptyState({ icon = 'ti-files-off', title, subtitle }) {
  return (
    <div className="empty-state">
      <i className={`ti ${icon}`} aria-hidden="true" />
      <p className="empty-title">{title}</p>
      {subtitle && <p className="empty-sub">{subtitle}</p>}
    </div>
  );
}

// ── Section Header ─────────────────────────────────────────────────────────
export function SectionHeader({ title, count }) {
  return (
    <div className="section-header">
      <h2 className="section-title">{title}</h2>
      {count !== undefined && <span className="section-count">{count}</span>}
    </div>
  );
}

// ── Toggle ─────────────────────────────────────────────────────────────────
export function Toggle({ checked, onChange, id }) {
  return (
    <label className="toggle" htmlFor={id}>
      <input type="checkbox" id={id} checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="toggle-track" />
      <span className="toggle-thumb" />
    </label>
  );
}

// ── Card ───────────────────────────────────────────────────────────────────
export function Card({ children, className = '', onClick }) {
  return (
    <div className={`card ${onClick ? 'card-clickable' : ''} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}
