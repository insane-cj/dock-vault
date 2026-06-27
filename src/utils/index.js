// ── Storage ──────────────────────────────────────────────────────────────
const STORAGE_KEY = 'dockvault_v2';

export function loadStore() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}

export function saveStore(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function patchStore(patch) {
  saveStore({ ...loadStore(), ...patch });
}

// ── Drive folder ID extraction ────────────────────────────────────────────
export function extractFolderId(input) {
  if (!input) return null;
  const s = input.trim();
  // full URL: /folders/ID
  let m = s.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (m) return m[1];
  // ?id=ID
  m = s.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (m) return m[1];
  // raw ID
  if (/^[a-zA-Z0-9_-]{25,}$/.test(s)) return s;
  return null;
}

export function buildFolderUrl(folderId) {
  return `https://drive.google.com/drive/folders/${folderId}`;
}

// ── File type detection ────────────────────────────────────────────────────
export function getFileType(file) {
  const m = file.mimeType || '';
  const n = (file.name || '').toLowerCase();
  if (m.includes('pdf') || n.endsWith('.pdf')) return 'pdf';
  if (m.includes('image')) return 'image';
  if (m.includes('document') || m.includes('word') || /\.(docx?|odt|rtf)$/.test(n)) return 'doc';
  if (m.includes('spreadsheet') || m.includes('excel') || /\.(xlsx?|ods|csv)$/.test(n)) return 'sheet';
  if (m.includes('presentation') || m.includes('powerpoint') || /\.(pptx?|odp)$/.test(n)) return 'slide';
  if (m.includes('text') || /\.(txt|md)$/.test(n)) return 'text';
  if (m.includes('video')) return 'video';
  if (m.includes('audio')) return 'audio';
  if (m.includes('zip') || m.includes('compressed') || /\.(zip|rar|7z|tar|gz)$/.test(n)) return 'archive';
  return 'other';
}

export const FILE_TYPE_META = {
  pdf:     { icon: 'ti-file-type-pdf',   bgClass: 'icon-pdf',    label: 'PDF' },
  image:   { icon: 'ti-photo',           bgClass: 'icon-image',  label: 'Image' },
  doc:     { icon: 'ti-file-type-doc',   bgClass: 'icon-doc',    label: 'Document' },
  sheet:   { icon: 'ti-table',           bgClass: 'icon-sheet',  label: 'Sheet' },
  slide:   { icon: 'ti-presentation',    bgClass: 'icon-slide',  label: 'Slide' },
  text:    { icon: 'ti-file-text',       bgClass: 'icon-text',   label: 'Text' },
  video:   { icon: 'ti-video',           bgClass: 'icon-video',  label: 'Video' },
  audio:   { icon: 'ti-music',           bgClass: 'icon-audio',  label: 'Audio' },
  archive: { icon: 'ti-file-zip',        bgClass: 'icon-archive',label: 'Archive' },
  other:   { icon: 'ti-file',            bgClass: 'icon-other',  label: 'File' },
};

// ── Category detection ────────────────────────────────────────────────────
export const CATEGORIES = ['All', 'Certificates', 'Notes', 'Resume', 'Semester', 'Projects', 'Images', 'Others'];

export function getCategory(file) {
  const n = (file.name || '').toLowerCase();
  if (/cert|certif|badge|award|achievem/.test(n)) return 'Certificates';
  if (/resum|resume|cv\b|curriculum/.test(n)) return 'Resume';
  if (/note|lec|lecture|chap|chapter|unit|topic|class/.test(n)) return 'Notes';
  if (/sem|syllab|assign|lab|exam|mid|end\s*sem|question|paper|mark/.test(n)) return 'Semester';
  if (/proj|hack|build|app\b|web|code|repo|system|develop/.test(n)) return 'Projects';
  if (getFileType(file) === 'image') return 'Images';
  return 'Others';
}

export const CATEGORY_META = {
  Certificates: { icon: 'ti-certificate', color: 'teal' },
  Notes:        { icon: 'ti-notebook',     color: 'purple' },
  Resume:       { icon: 'ti-id-badge-2',   color: 'amber' },
  Semester:     { icon: 'ti-school',       color: 'blue' },
  Projects:     { icon: 'ti-code',         color: 'coral' },
  Images:       { icon: 'ti-photo',        color: 'green' },
  Others:       { icon: 'ti-folder',       color: 'gray' },
};

// ── Drive preview / open URLs ─────────────────────────────────────────────
export function buildPreviewUrl(fileId, mimeType) {
  if (!mimeType) return `https://drive.google.com/file/d/${fileId}/preview`;
  if (mimeType.includes('document'))     return `https://docs.google.com/document/d/${fileId}/preview`;
  if (mimeType.includes('spreadsheet'))  return `https://docs.google.com/spreadsheets/d/${fileId}/preview`;
  if (mimeType.includes('presentation')) return `https://docs.google.com/presentation/d/${fileId}/preview`;
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

export function buildOpenUrl(fileId, mimeType) {
  if (!mimeType) return `https://drive.google.com/file/d/${fileId}/view`;
  if (mimeType.includes('document'))     return `https://docs.google.com/document/d/${fileId}/edit`;
  if (mimeType.includes('spreadsheet'))  return `https://docs.google.com/spreadsheets/d/${fileId}/edit`;
  if (mimeType.includes('presentation')) return `https://docs.google.com/presentation/d/${fileId}/edit`;
  return `https://drive.google.com/file/d/${fileId}/view`;
}

// ── Formatting ─────────────────────────────────────────────────────────────
export function formatSize(bytes) {
  if (!bytes) return '';
  const n = parseInt(bytes);
  if (n >= 1073741824) return (n / 1073741824).toFixed(1) + ' GB';
  if (n >= 1048576)    return (n / 1048576).toFixed(1) + ' MB';
  if (n >= 1024)       return Math.round(n / 1024) + ' KB';
  return n + ' B';
}

export function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateShort(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000)    return 'Just now';
  if (diff < 3600000)  return Math.floor(diff / 60000) + 'm ago';
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
  if (diff < 604800000)return Math.floor(diff / 86400000) + 'd ago';
  return formatDate(iso);
}

// ── Drive API (public folders via API key) ────────────────────────────────
// For public Drive folders, use the public API with your own API key.
// Get one free at: https://console.cloud.google.com → Enable Drive API → Credentials → API Key
// Then restrict it to: Drive API + your Firebase domain.
// Replace the empty string below with your key.
const DRIVE_API_KEY = process.env.REACT_APP_DRIVE_API_KEY || '';

export async function fetchDriveFiles(folderId) {
  if (!DRIVE_API_KEY) {
    // Fallback: return empty — user will see "setup API key" message
    throw new Error('NO_API_KEY');
  }
  const q = encodeURIComponent(`'${folderId}' in parents and trashed=false`);
  const fields = encodeURIComponent(
    'files(id,name,mimeType,size,createdTime,modifiedTime,webViewLink,thumbnailLink,iconLink)'
  );
  const url =
    `https://www.googleapis.com/drive/v3/files` +
    `?q=${q}&fields=${fields}&pageSize=200&orderBy=modifiedTime desc&key=${DRIVE_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Drive API error ${res.status}`);
  }
  const data = await res.json();
  return data.files || [];
}
