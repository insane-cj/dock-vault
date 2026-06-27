import { useState, useEffect, useCallback, useRef } from 'react';
import {
  loadStore, patchStore,
  extractFolderId, fetchDriveFiles,
  getCategory, getFileType,
} from '../utils';

export function useVault() {
  const [authState, setAuthState] = useState('loading'); // loading | locked | setup | app
  const [files, setFiles]         = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recents, setRecents]     = useState([]);
  const [folderId, setFolderId]   = useState('');
  const [syncing, setSyncing]     = useState(false);
  const [lastSync, setLastSync]   = useState(null);
  const [syncError, setSyncError] = useState('');
  const [toast, setToast]         = useState(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  const refreshTimer = useRef(null);
  const toastTimer   = useRef(null);

  // ── Init ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const session = sessionStorage.getItem('dv_session');
    const d = loadStore();
    if (!d.password) {
      patchStore({ password: 'dockvault' });
    }
    if (session === '1') {
      if (d.folderId) {
        bootApp(d);
      } else {
        setAuthState('setup');
      }
    } else {
      setAuthState('locked');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function bootApp(d) {
    setFolderId(d.folderId);
    setFavorites(d.favorites || []);
    setRecents(d.recents || []);
    setAuthState('app');
  }

  // ── Auto-refresh when app is active ──────────────────────────────────
  useEffect(() => {
    if (authState !== 'app' || !folderId) return;
    syncFiles(folderId);
    const d = loadStore();
    if (d.autoRefresh !== false) {
      refreshTimer.current = setInterval(() => syncFiles(folderId), 30000);
    }
    return () => clearInterval(refreshTimer.current);
  }, [authState, folderId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auth ──────────────────────────────────────────────────────────────
  function unlock(password) {
    const d = loadStore();
    if (password === (d.password || 'dockvault')) {
      sessionStorage.setItem('dv_session', '1');
      if (d.folderId) {
        bootApp(d);
      } else {
        setAuthState('setup');
      }
      return true;
    }
    return false;
  }

  function lock() {
    sessionStorage.removeItem('dv_session');
    clearInterval(refreshTimer.current);
    setFiles([]);
    setAuthState('locked');
  }

  // ── Setup ─────────────────────────────────────────────────────────────
  function connectFolder(link) {
    const id = extractFolderId(link);
    if (!id) return 'Could not find a folder ID in that link. Make sure you copied a Google Drive folder URL.';
    patchStore({ folderId: id });
    setFolderId(id);
    setAuthState('app');
    return null;
  }

  // ── Sync ──────────────────────────────────────────────────────────────
  const syncFiles = useCallback(async (id) => {
    const fid = id || folderId;
    if (!fid) return;
    setSyncing(true);
    setSyncError('');
    try {
      const fetched = await fetchDriveFiles(fid);
      setFiles(prev => {
        if (prev.length > 0 && fetched.length > prev.length) {
          const newCount = fetched.length - prev.length;
          showToast(`${newCount} new file${newCount > 1 ? 's' : ''} added!`, 'success');
        }
        return fetched;
      });
      setLastSync(new Date());
      setApiKeyMissing(false);
    } catch (err) {
      if (err.message === 'NO_API_KEY') {
        setApiKeyMissing(true);
      } else {
        setSyncError(err.message);
        showToast('Sync failed: ' + err.message, 'error');
      }
    } finally {
      setSyncing(false);
    }
  }, [folderId]); // eslint-disable-line react-hooks/exhaustive-deps

  function refresh() { syncFiles(folderId); }

  // ── Favorites ─────────────────────────────────────────────────────────
  function toggleFavorite(fileId) {
    setFavorites(prev => {
      const next = prev.includes(fileId) ? prev.filter(x => x !== fileId) : [fileId, ...prev];
      patchStore({ favorites: next });
      showToast(next.includes(fileId) ? 'Added to favorites' : 'Removed from favorites');
      return next;
    });
  }

  function isFavorite(fileId) { return favorites.includes(fileId); }

  // ── Recents ───────────────────────────────────────────────────────────
  function logRecent(fileId) {
    setRecents(prev => {
      const next = [fileId, ...prev.filter(x => x !== fileId)].slice(0, 30);
      patchStore({ recents: next });
      return next;
    });
  }

  function getRecentFiles() {
    return recents.map(id => files.find(f => f.id === id)).filter(Boolean);
  }

  function getFavoriteFiles() {
    return favorites.map(id => files.find(f => f.id === id)).filter(Boolean);
  }

  // ── Settings ──────────────────────────────────────────────────────────
  function updateFolderLink(link) {
    const id = extractFolderId(link);
    if (!id) return 'Invalid Drive link';
    patchStore({ folderId: id });
    setFolderId(id);
    clearInterval(refreshTimer.current);
    syncFiles(id);
    refreshTimer.current = setInterval(() => syncFiles(id), 30000);
    showToast('Drive folder updated');
    return null;
  }

  function updatePassword(newPw) {
    if (!newPw || newPw.length < 4) return 'Password must be at least 4 characters';
    patchStore({ password: newPw });
    showToast('Password updated');
    return null;
  }

  function setAutoRefresh(on) {
    patchStore({ autoRefresh: on });
    clearInterval(refreshTimer.current);
    if (on) refreshTimer.current = setInterval(() => syncFiles(folderId), 30000);
  }

  function getAutoRefresh() { return loadStore().autoRefresh !== false; }

  function clearLocalData() {
    patchStore({ favorites: [], recents: [] });
    setFavorites([]);
    setRecents([]);
    showToast('Local data cleared');
  }

  // ── Toast ─────────────────────────────────────────────────────────────
  function showToast(message, type = 'success') {
    clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }

  // ── Computed stats ────────────────────────────────────────────────────
  function getStats() {
    const cats = {};
    files.forEach(f => { const c = getCategory(f); cats[c] = (cats[c] || 0) + 1; });
    const totalSize = files.reduce((s, f) => s + parseInt(f.size || 0), 0);
    return {
      total: files.length,
      categories: Object.keys(cats).length,
      favorites: favorites.filter(id => files.find(f => f.id === id)).length,
      recents: recents.filter(id => files.find(f => f.id === id)).length,
      totalSize,
      byCategory: cats,
      byType: files.reduce((acc, f) => {
        const t = getFileType(f);
        acc[t] = (acc[t] || 0) + 1;
        return acc;
      }, {}),
    };
  }

  return {
    authState, files, favorites, recents, folderId,
    syncing, lastSync, syncError, toast, apiKeyMissing,
    unlock, lock, connectFolder,
    refresh, syncFiles,
    toggleFavorite, isFavorite,
    logRecent, getRecentFiles, getFavoriteFiles,
    updateFolderLink, updatePassword, setAutoRefresh, getAutoRefresh,
    clearLocalData, getStats, showToast,
  };
}
