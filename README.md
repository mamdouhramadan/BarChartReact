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

---

## Tech stack

| Layer | Technologies |
| --- | --- |
| **UI** | React 17, Material UI 5 (`@mui/material`, `@mui/icons-material`), Emotion |
| **Charts** | Chart.js 3, react-chartjs-2 |
| **Dates** | Day.js, MUI X Date Pickers (`@mui/x-date-pickers`) |
| **State** | Zustand |
| **i18n** | i18next, react-i18next |
| **Tooling** | Create React App (`react-scripts` 5), `cross-env` (OpenSSL legacy for local Node) |
| **Deploy** | `gh-pages` (manual) or **GitHub Actions** → `gh-pages` branch (see below) |

---

## Project structure (high level)

```
src/
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
| `npm run deploy` | Build + push to `gh-pages` via `gh-pages` package (local deploy) |

`homepage` in `package.json` is set for GitHub Pages (`/BarChartReact/`), so asset paths resolve correctly when hosted under that path.

---

## Deployment

### Automatic (recommended)

On every push to **`main`**, the workflow [`.github/workflows/deploy-github-pages.yml`](.github/workflows/deploy-github-pages.yml) builds the app and publishes the `build` folder to the **`gh-pages`** branch.

**Repository settings**

1. **Settings → Pages → Build and deployment**
2. Source: **Deploy from a branch**
3. Branch: **`gh-pages`** / **/(root)**

The site URL uses the `homepage` field in `package.json` (user/org pages + repo name).

### Manual

```bash
npm run deploy
```

Requires `git` credentials and uses the `gh-pages` package to push `build/` to `gh-pages`.

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
