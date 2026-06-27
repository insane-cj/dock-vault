import React, { useState } from 'react';
import { Button } from '../components/Components';
import './Auth.css';

export default function AuthPage({ onUnlock }) {
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [shake, setShake]       = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const ok = onUnlock(password);
    if (!ok) {
      setError('Incorrect password');
      setPassword('');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  return (
    <div className="auth-screen">
      <div className={`auth-card ${shake ? 'shake' : ''}`}>
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <i className="ti ti-vault" aria-hidden="true" />
          </div>
          <span className="auth-logo-name">DockVault</span>
        </div>

        <h1 className="auth-heading">Welcome back</h1>
        <p className="auth-sub">Enter your password to access your vault</p>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="auth-error" role="alert">
              <i className="ti ti-alert-circle" aria-hidden="true" />
              {error}
            </div>
          )}
          <div className="auth-field">
            <label htmlFor="pw">Password</label>
            <input
              id="pw"
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder="Enter your password"
              autoFocus
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" variant="primary" size="lg" style={{ width: '100%', justifyContent: 'center' }}>
            <i className="ti ti-lock-open" aria-hidden="true" />
            Unlock vault
          </Button>
        </form>
        <p className="auth-hint">Default password: <code>dockvault</code> — change it in Settings</p>
      </div>
    </div>
  );
}
