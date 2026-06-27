# DockVault 🗄️

Your personal document vault — browse, search, preview, and organize your Google Drive files from anywhere. Password-protected. No Google login required.

---

## Features

- 🔒 Password lock screen (default: `dockvault`)
- 📁 Connect any public Google Drive folder
- 🔍 Search, filter by type, sort files
- 📂 Auto-categories: Certificates, Notes, Resume, Semester, Projects, Images
- ⭐ Star favorites, track recently opened files
- 👁️ Preview PDFs, Docs, Sheets, Slides, and Images inline
- 🔄 Auto-refresh every 30 seconds — new files appear automatically
- 📱 Fully responsive (mobile, tablet, desktop)
- 🌙 Automatic dark mode

---

## Quick Start

### 1. Clone & install

```bash
git clone <your-repo>
cd dockvault
npm install
```

### 2. Get a Google Drive API Key (free)

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or use an existing one)
3. Go to **APIs & Services → Library** → search **Google Drive API** → Enable it
4. Go to **APIs & Services → Credentials → Create Credentials → API Key**
5. Click **Restrict Key**:
   - Under **API restrictions**: select **Google Drive API**
   - Under **Website restrictions**: add your Firebase domain (e.g. `your-app.web.app`)
6. Copy the key

### 3. Add the key to your project

```bash
cp .env.example .env
# Edit .env and replace the placeholder:
REACT_APP_DRIVE_API_KEY=AIzaSy...your_key_here
```

### 4. Make your Drive folder public

1. Open [Google Drive](https://drive.google.com)
2. Right-click your documents folder → **Share**
3. Change from "Restricted" to **"Anyone with the link"** (Viewer)
4. Click **Copy link** — you'll paste this into the app on first launch

### 5. Run locally

```bash
npm start
# Opens at http://localhost:3000
```

---

## Deploy to Firebase Hosting

### One-time setup

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (select Hosting, use 'build' as public directory, SPA: yes)
firebase init hosting
```

Edit `.firebaserc` and replace `your-firebase-project-id` with your actual Firebase project ID.

### Deploy

```bash
# Build the app
npm run build

# Deploy
firebase deploy --only hosting
```

Your app will be live at `https://your-project.web.app` 🚀

---

## Project Structure

```
dockvault/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ApiKeyBanner.jsx   # Setup guide banner
│   │   ├── Components.jsx     # Shared UI (Button, Toast, Toggle…)
│   │   ├── FileBrowser.jsx    # Search + filter + grid/list view
│   │   ├── FileCard.jsx       # File card & list item
│   │   ├── PreviewModal.jsx   # Inline file preview
│   │   └── Sidebar.jsx        # Navigation sidebar
│   ├── hooks/
│   │   └── useVault.js        # All app state & Drive API logic
│   ├── pages/
│   │   ├── Auth.jsx           # Password lock screen
│   │   ├── Dashboard.jsx      # Stats + recent files
│   │   ├── Setup.jsx          # First-time Drive folder setup
│   │   └── Settings.jsx       # Settings page
│   ├── styles/
│   │   └── global.css         # CSS variables & reset
│   ├── utils/
│   │   └── index.js           # Drive API, file utils, storage
│   ├── App.jsx                # Main shell
│   └── index.js               # Entry point
├── .env.example
├── firebase.json
└── package.json
```

---

## Changing the Default Password

The default password is `dockvault`. Change it after first login:
- Go to **Settings → Password → New password**

Or set it in code by editing `useVault.js` — the line:
```js
if (!d.password) { patchStore({ password: 'dockvault' }); }
```

---

## How File Fetching Works

The app calls the [Google Drive Files.list API](https://developers.google.com/drive/api/v3/reference/files/list) directly from the browser using your API key. This works for **public folders** (Anyone with the link). No backend required.

Auto-categorization is done client-side by matching filenames against patterns.

---

## License

MIT
