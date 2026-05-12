# 👽 Integrated Workspace — Personal Productivity Dashboard

![React](https://img.shields.io/badge/React_19-UI-61DAFB?style=for-the-badge&logo=react&logoColor=black) 
![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?style=for-the-badge&logo=vite&logoColor=white) 
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-Styling-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white) 
![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animations-EF0072?style=for-the-badge&logo=framer&logoColor=white) 
![dnd kit](https://img.shields.io/badge/dnd--kit-Drag_&_Drop-000000?style=for-the-badge) 
![Lucide](https://img.shields.io/badge/Lucide-Icons-F56040?style=for-the-badge) 
![LocalStorage](https://img.shields.io/badge/LocalStorage-Persistence-FFB300?style=for-the-badge) 
![Supabase](https://img.shields.io/badge/Supabase-Future_Sync-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

A modern, minimal productivity dashboard built with **React 19 + Vite + Tailwind CSS**. Everything runs in the browser — no backend needed, all data persists via `localStorage`.

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [https://integrated-workspace.netlify.app/](https://integrated-workspace.netlify.app/)

---

## 📦 Build for Production

```bash
npm run build
npm run preview
```

---

## ✨ Features

| Feature | Description |
|---|---|
| 🏠 Dashboard | Personalized greeting, live clock, motivational quote, drag-and-drop app grid |
| 🧩 App Launcher | 20+ pre-loaded apps, add your own, category tabs, favourites |
| 🔍 Command Search | `Ctrl+K` to open — type shortcuts like `yt`, `gh`, `lc`, `gpt` and hit Enter |
| ✅ Tasks & Notes | Priority tags (High / Mid / Low), progress bar, quick sticky notes — all auto-saved |
| ⏱ Pomodoro Timer | Focus / Short Break / Long Break modes, circular SVG progress ring, audio beep |
| 🔥 Streak Tracker | DSA, Study, Focus — daily check-off with streak counts |
| 📊 Stats Row | Tasks done, focus minutes, top streak, top category |
| 🎯 Focus Mode | Hides Social & Streaming apps to keep you on track |
| 🌙 Theme | Dark / Light mode toggle |
| 🎨 Accent Colors | 6 accent colour options |
| 💾 Persistence | Everything saved to `localStorage` — survives refreshes |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+K` | Open command search |
| `Escape` | Close modals / overlays |
| `yt <query>` + Enter | Search YouTube |
| `lc <query>` + Enter | Search LeetCode |
| `gh <query>` + Enter | Search GitHub |
| `gpt <query>` + Enter | Open ChatGPT |
| `mdn <query>` + Enter | Search MDN Docs |
| `npm <query>` + Enter | Search npm |
| `wiki <query>` + Enter | Search Wikipedia |

---

## 🗂 Project Structure

```
Integrated Workspace/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/               # Images and icons
│   ├── components/
│   │   ├── Dashboard.jsx         # Home view — greeting, clock, app grid
│   │   ├── Launcher.jsx          # Full app launcher with categories
│   │   ├── AppLauncher.jsx       # App grid subcomponent
│   │   ├── AppGrid.jsx           # Overlay app grid
│   │   ├── TasksNotes.jsx        # Combined tasks + notes view
│   │   ├── Tasks.jsx             # Task list logic
│   │   ├── Notes.jsx             # Notes subcomponent
│   │   ├── Focus.jsx             # Pomodoro timer + streak tracker
│   │   ├── PomodoroTimer.jsx     # Circular SVG timer
│   │   ├── TodoPanel.jsx         # Quick-access todo panel
│   │   ├── QuickNotes.jsx        # Sticky notes widget
│   │   ├── CmdSearch.jsx         # Command palette (Ctrl+K)
│   │   ├── TopBar.jsx            # Navigation header
│   │   ├── Sidebar.jsx           # Side navigation
│   │   ├── GreetingSection.jsx   # Live clock + greeting
│   │   ├── StatsRow.jsx          # 4 stat cards
│   │   ├── StreakCards.jsx       # Daily streak checkboxes
│   │   ├── AddAppModal.jsx       # Add custom app form
│   │   └── SettingsModal.jsx     # Theme + accent settings
│   ├── data/
│   │   └── defaults.js           # Default apps, todos, streaks, timer modes
│   ├── hooks/
│   │   └── useLocalStorage.js    # Persistent state hook
│   ├── utils/
│   │   └── time.js               # Greeting text, time & date formatting
│   ├── App.jsx                   # Root component, routing, global state
│   ├── App.css                   # Global styles + CSS variables
│   ├── index.css                 # Tailwind base + custom utilities
│   └── main.jsx                  # Entry point
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── eslint.config.js
```

---

## 🛠 Tech Stack

| Tech | Purpose |
|---|---|
| [React 19](https://react.dev) | UI framework |
| [Vite 8](https://vitejs.dev) | Dev server & bundler |
| [Tailwind CSS 3](https://tailwindcss.com) | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | Animations & transitions |
| [dnd-kit](https://dndkit.com) | Drag-and-drop app grid |
| [Lucide React](https://lucide.dev) | Icon library |
| [react-hot-toast](https://react-hot-toast.com) | Toast notifications |
| [Supabase JS](https://supabase.com/docs/reference/javascript) | (included, reserved for future cloud sync) |

---

## 📝 Notes

- All state is persisted to `localStorage` — no account or login required.
- Supabase is included as a dependency but not yet wired up; intended for optional cloud sync in a future update.
- The username prompt appears once on first load and is stored locally.

