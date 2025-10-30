# MarketPulse — Real-Time Stock & Crypto Dashboard

A frontend-only dashboard built with Vite + React, Tailwind CSS, Redux Toolkit + RTK Query, Axios, and Recharts.

## Live URL
Add after deploy: https://<your-vercel-project>.vercel.app

## Tech
- React 18, Vite
- Tailwind CSS
- Redux Toolkit (RTK) + RTK Query
- Axios
- Recharts
- Jest + React Testing Library

## Setup
1. Install deps:
```
npm install
```
2. Create `.env` from `.env.example` and set:
```
VITE_STOCK_API_KEY=<your-finnhub-or-alpha-vantage-key>
VITE_STOCK_API_PROVIDER=finnhub
VITE_DEFAULT_CURRENCY=USD
```
If `VITE_STOCK_API_KEY` is missing at runtime, the app shows a banner and automatically falls back to mocked data in `src/mocks/`.

3. Start dev server:
```
npm run dev
```

## Build
```
npm run build
npm run preview
```

## Tests
Run unit and component tests:
```
npm test
```
What is covered:
- Utils formatting and portfolio value calculation
- API normalization (mocked) when key is missing
- Component behavior for MarketList, SymbolCard (watchlist), Portfolio (add flow)
- Overview page loading, error, and rate-limit states

## Continuous Integration (CI)
GitHub Actions workflow runs on push/PR to main:
- npm ci
- npm test
- npm run build

## Deploy to Vercel
- Import the GitHub repo into Vercel
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Environment Variables (Project Settings → Environment Variables):
  - `VITE_STOCK_API_KEY` = your Finnhub or Alpha Vantage API key
  - `VITE_STOCK_API_PROVIDER` = `finnhub` (or `alphavantage` if you adapt)
  - `VITE_DEFAULT_CURRENCY` = `USD`
- Redeploy and copy the live URL into the README above.

## GitHub commands to push as `marketpulse`
```
git init
git add .
git commit -m "chore: initial MarketPulse MVP"
gh repo create <your-username>/marketpulse --public --source=. --remote=origin --push
git branch -M main
git push -u origin main
# If gh is not available:
# git remote add origin https://github.com/<your-username>/marketpulse.git
# git push -u origin main
```

## Security
- API keys are required at runtime via env vars and not committed.

## Notes
- Offline mode, rate-limit handling, and fallbacks are implemented in `src/services/api.js` and utilities.
- Portfolio and settings persist to localStorage.

## Get API Keys
- Finnhub: https://finnhub.io/ → sign up → get free API key → set as `VITE_STOCK_API_KEY`
- Alpha Vantage: https://www.alphavantage.co/ → sign up → get free API key → set as `VITE_STOCK_API_KEY` and switch provider if adapted

## Fallbacks and Offline
- Missing API key: app shows a banner and uses mock responses from `src/mocks/`
- Offline: shows an offline indicator and serves cached/local data where possible
- Rate limits (HTTP 429): app displays a notice and increases polling interval with exponential backoff
