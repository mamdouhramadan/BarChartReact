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
- **Motion**: Staggered **entrance animations** (hero, form fields, summary cards, charts) implemented with **MUI Emotion `keyframes`** and a small helper — **no** separate animation runtime library. Respects **`prefers-reduced-motion`**.

---

## Tech stack

| Layer | Technologies |
| --- | --- |
| **Language** | **TypeScript** (strict) |
| **UI** | React 19, Material UI 7 (`@mui/material`, `@mui/icons-material`), Emotion |
| **Animation** | **CSS keyframes** via `@mui/material/styles` — see `src/animation/entrance.ts` and `src/hooks/usePrefersReducedMotion.ts` |
| **Charts** | Chart.js 4, react-chartjs-2 v5 |
| **Dates** | Day.js, MUI X Date Pickers v8 (`@mui/x-date-pickers`) |
| **State** | Zustand 5 |
| **i18n** | i18next, react-i18next |
| **Tooling** | **Vite** 6, Vitest 3; TypeScript project references (`tsconfig.app.json` / `tsconfig.node.json`) |
| **Deploy** | **GitHub Actions** on `main` → GitHub Pages (artifact from **`dist/`**; no `gh-pages` branch) |

---

## Project structure (high level)

```
index.html                 # Vite entry (root)
src/
  main.tsx                 # createRoot + providers
  App.tsx                  # Dashboard sections + data flow
  types/gold.ts            # Observation, DateRange, SeriesId
  animation/entrance.ts
  hooks/usePrefersReducedMotion.ts
  api/freeGoldApi.ts
  components/                # AppNavbar, HeroPanel, DashboardLayout, GoldRangeForm, GoldCharts, GoldSummaryCards, Spinner
  i18n/                      # index.ts, constants.ts, i18next.d.ts
  locales/                   # en.json, ar.json
  providers/LanguageProvider.tsx
  store/useGoldStore.ts
  theme/createAppTheme.ts
  utils/
public/
  favicon.png, manifest.json
```

---

## Prerequisites

- **Node.js** **18.18+**, **20.x**, or **22+** (Vite 6; **20 LTS** recommended). Avoid **Node 21** if you can — it is not in Vite’s supported range and may show npm engine warnings.
- **npm** (comes with Node)

---

## Getting started

```bash
git clone https://github.com/mamdouhramadan/BarChartReact.git
cd BarChartReact
npm install
npm run dev
```

Opens the Vite dev server at [http://localhost:5173/BarChartReact/](http://localhost:5173/BarChartReact/) (matches the `base` in `vite.config.ts`). No `.env` file is required for data (see `.env.example` for notes).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` / `npm start` | Vite dev server with HMR |
| `npm run build` | `tsc -b` then production bundle → **`dist/`** |
| `npm run preview` | Serve `dist/` locally (check GitHub Pages base path) |
| `npm test` | Vitest |

**`vite.config.ts`** sets `base: '/BarChartReact/'` to match `homepage` in `package.json`, so assets resolve when hosted under `/BarChartReact/`.

---

## Deployment

### GitHub Actions (recommended)

On every push to **`main`**, [`.github/workflows/deploy-github-pages.yml`](.github/workflows/deploy-github-pages.yml) runs `npm ci`, `npm run build`, uploads the **`dist/`** folder with **`actions/upload-pages-artifact`**, and deploys with **`actions/deploy-pages`**. **No `gh-pages` branch** is used.

**One-time repository settings**

1. **Settings → General → Default branch** — set to **`main`** (required if the repo still used `master`).
2. **Settings → Pages → Build and deployment** — **Source:** **GitHub Actions** (not “Deploy from a branch”).
3. If an old **`master`** branch remains on GitHub, delete it after step 1: **Branches** → delete `master`, or locally:  
   `git push origin --delete master`

After the first successful workflow run, the live URL follows your `package.json` **`homepage`** (e.g. `https://<user>.github.io/BarChartReact/`).

### Manual static upload

Run `npm run build` and host the `dist/` folder on any static host (optional).

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
- [Vite](https://vitejs.dev/)  
- [Material UI](https://mui.com/) · [Chart.js](https://www.chartjs.org/) · [i18next](https://www.i18next.com/)
