# Gold Fix Tracker

A Create React App dashboard for **gold fix price history** from the [St. Louis Fed FRED API](https://fred.stlouisfed.org/). It shows line, bar, pie, and donut charts (pie/donut reflect **day-over-day direction counts**—up, down, flat—not portfolio weights).

## FRED API key and local development

1. Request a free API key: [FRED API key](https://fred.stlouisfed.org/docs/api/api_key.html).
2. Copy `.env.example` to `.env.local` and set `FRED_API_KEY=your_key`.
3. Run `npm start`. The dev server uses [`src/setupProxy.js`](src/setupProxy.js) to proxy `/api/fred` to `https://api.stlouisfed.org/fred` and inject the key **server-side** so it is not exposed in the browser bundle.

## Production and static hosting (e.g. GitHub Pages)

The CRA dev proxy **does not run** for `npm run build` output on static hosts. The app cannot call FRED from the browser without a proxy or backend unless you expose a key in the client (not recommended).

Options:

- **Netlify / Vercel serverless function** (or similar) that forwards requests to FRED with the key stored in host secrets, then set `REACT_APP_FRED_PROXY_URL` to that function’s base URL when building.
- **Deploy a small backend** that proxies FRED.
- **GitHub Pages alone**: either accept that data fetch is unavailable without a separate proxy, or use a public third-party proxy you trust (documented in your own deployment).

---

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
