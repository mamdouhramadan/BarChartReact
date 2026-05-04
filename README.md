# Gold Fix Tracker

A responsive **gold price dashboard** built with React. It loads public historical data in the browser (no backend, no API keys), lets you pick a date range, and visualizes prices with **Chart.js** (line, bar, pie, donut). **English** and **Arabic** are supported, with **RTL** layout and **Almarai** typography for Arabic.

**Live site:** [https://mamdouhramadan.github.io/BarChartReact/](https://mamdouhramadan.github.io/BarChartReact/)  
*(Updates automatically when `main` is pushed — see [Deployment](#deployment).)*

---

## Overview

| | |
| --- | --- |
| **Purpose** | Explore USD gold prices over a custom calendar window; export the filtered series as CSV. |
| **Data** | [Free Gold API](https://freegoldapi.com/) — `GET https://freegoldapi.com/data/latest.json` (CORS-enabled, no authentication). One blended USD series; granularity varies by era (annual → monthly → daily). |
| **Hosting** | Static build only: works on **GitHub Pages**, Netlify, or any static file host. |

Pie and donut charts summarize **day-over-day direction** (up / down / flat counts), not portfolio weights.

---

## Features

- **Navbar** with logo (`favicon.png`), brand, and **language menu** (no select label).
- **Hero** + **live lens** card (series id, observation count, date window).
- **Range & series** form: date window, gold series (single public dataset), **Load** action.
- **Summary cards**: window move, open vs close, range high/low.
- **Charts**: Line, Bar, Pie, Donut with tabbed UI; CSV export of the active window.
- **Internationalization**: `i18next` / `react-i18next`; locale persisted in `localStorage` (`gold-tracker-locale`); fallback follows browser language.
- **Theming**: Material UI with dynamic **LTR/RTL** and **Almarai** for Arabic.
- **Motion**: Staggered **entrance animations** (hero, form fields, summary cards, charts) implemented with **MUI Emotion `keyframes`** and a small helper — **no** GSAP, Framer Motion, or react-awesome-reveal (keeps the bundle small and avoids Create React App + React 17 ESM issues with those libraries). Respects **`prefers-reduced-motion`**.

---

## Tech stack

| Layer | Technologies |
| --- | --- |
| **UI** | React 17, Material UI 5 (`@mui/material`, `@mui/icons-material`), Emotion |
| **Animation** | **CSS keyframes** via `@mui/material/styles` (`keyframes`) — see `src/animation/entrance.js` and `src/hooks/usePrefersReducedMotion.js` (not a separate npm animation package) |
| **Charts** | Chart.js 3, react-chartjs-2 |
| **Dates** | Day.js, MUI X Date Pickers (`@mui/x-date-pickers`) |
| **State** | Zustand |
| **i18n** | i18next, react-i18next |
| **Tooling** | Create React App (`react-scripts` 5), `cross-env` (OpenSSL legacy for local Node) |
| **Deploy** | **GitHub Actions** on `main` → GitHub Pages (artifact upload; no extra branch) |

---

## Project structure (high level)

```
src/
  animation/entrance.js    # Shared fade-up keyframes + staggered entrance `sx` helper
  hooks/usePrefersReducedMotion.js
  api/freeGoldApi.js       # Fetch + cache JSON; filter by date range
  components/              # AppNavbar, DatePicker (range form), GoldCharts, GoldSummaryCards, Spinner
  i18n/                    # i18n init, locale constants
  locales/                 # en.json, ar.json
  provider/LanguageProvider.js   # Theme + RTL + Dayjs locale + I18nextProvider
  store/useGoldStore.js    # Observations, range, loading, errors
  theme/createAppTheme.js    # MUI theme (direction + fonts)
  utils/                     # chartDataFromGold, goldKpis, exportGoldSeriesCsv
public/
  favicon.png, index.html, manifest.json
```

---

## Prerequisites

- **Node.js** 18+ (20 LTS recommended)
- **npm** (comes with Node)

---

## Getting started

```bash
git clone https://github.com/mamdouhramadan/BarChartReact.git
cd BarChartReact
npm install
npm start
```

Opens [http://localhost:3000](http://localhost:3000). No `.env` file is required for data (see `.env.example` for notes).

### Scripts

| Command | Description |
| --- | --- |
| `npm start` | Dev server with hot reload |
| `npm run build` | Production build → `build/` |
| `npm test` | CRA test runner |

`homepage` in `package.json` is set for GitHub Pages (`/BarChartReact/`), so asset paths resolve correctly when hosted under that path.

---

## Deployment

### GitHub Actions (recommended)

On every push to **`main`**, [`.github/workflows/deploy-github-pages.yml`](.github/workflows/deploy-github-pages.yml) runs `npm ci`, `npm run build`, uploads the `build/` folder with **`actions/upload-pages-artifact`**, and deploys with **`actions/deploy-pages`**. **No `gh-pages` branch** is used.

**One-time repository settings**

1. **Settings → General → Default branch** — set to **`main`** (required if the repo still used `master`).
2. **Settings → Pages → Build and deployment** — **Source:** **GitHub Actions** (not “Deploy from a branch”).
3. If an old **`master`** branch remains on GitHub, delete it after step 1: **Branches** → delete `master`, or locally:  
   `git push origin --delete master`

After the first successful workflow run, the live URL follows your `package.json` **`homepage`** (e.g. `https://<user>.github.io/BarChartReact/`).

### Manual static upload

Run `npm run build` and host the `build/` folder on any static host (optional).

---

## Data & limitations

- Data is **not** a dedicated LBMA “fix” feed; it is a **merged** USD series from public sources (see [freegoldapi.com](https://freegoldapi.com/)).
- Very long historical ranges may be **sparse** (e.g. annual points); recent ranges include **daily** updates where available.
- First load downloads ~**160KB** JSON; results are **cached in memory** for the session and filtered by your selected dates.

---

## License

This project is provided as-is for demonstration and personal use. Third-party data and libraries remain under their respective terms.

---

## Credits

- [Free Gold API](https://freegoldapi.com/) — public JSON dataset  
- [Create React App](https://create-react-app.dev/)  
- [Material UI](https://mui.com/) · [Chart.js](https://www.chartjs.org/) · [i18next](https://www.i18next.com/)
