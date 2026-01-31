# CampusHub – College Event & Club Management Platform

Frontend for a college event and club management system. Built with **React**, **Vite**, and a minimal matte black UI. Role-based flows for **Student** and **Club Coordinator** (coordinator dashboard is placeholder). Uses mock data; no backend required to run.

---

## Features

- **Student:** Feed, Events, Clubs, My Registrations, Discussions (chat-style), Profile (with edit)
- **Auth:** Login (Student / Coordinator), Signup (Student only), Forgot password
- **Events:** Upcoming events, event detail, registration, **Razorpay** payment link (https://razorpay.me/@golivignesh)
- **Clubs:** List, club detail, history, leadership, event gallery, join/leave
- **Past events:** Detail pages and gallery from club pages
- **UI:** Matte black theme, glassmorphism, responsive layout

---

## Quick start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Start dev server         |
| `npm run build`| Production build         |
| `npm run preview` | Preview production build |

---

## Project structure

```
src/
├── components/   # Reusable (Sidebar, TopNavbar, GlassCard)
├── layouts/      # DashboardLayout
├── pages/        # Login, Signup, Student pages, Coordinator placeholder
├── data/         # mockData.js
├── App.jsx
├── main.jsx
└── index.css
```

---

## Docs in this repo

- **DEMO_GUIDE.md** – How to demo the app (flows, routes, payment)
- **GIT_INSTRUCTIONS.md** – Step-by-step: commit and push to GitHub
- **FEATURES_SUGGESTIONS.md** – Ideas for future features

---

## Git – push to GitHub

1. Open **GIT_INSTRUCTIONS.md**.
2. Follow steps 1–10 (init, remote, add, commit, push).

Short version:

```bash
git init
git add .
git commit -m "Initial commit: CampusHub"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub username and repository name.
