const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const fs = require('fs');

/** Match CRA's homepage → pathname (e.g. /BarChartReact) so proxy aligns with redirectServedPath + PUBLIC_URL. */
function getHomePathname() {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
    const h = pkg.homepage;
    if (!h || h === '.' || h.startsWith('.')) return '';
    const pathname = new URL(h.endsWith('/') ? h : `${h}/`, 'https://cra.dev').pathname;
    return pathname.replace(/\/$/, '') || '';
  } catch {
    return '';
  }
}

function createFredProxy() {
  return createProxyMiddleware({
    target: 'https://api.stlouisfed.org',
    changeOrigin: true,
    // /api/fred/... or /BarChartReact/api/fred/... → /fred/...
    pathRewrite: (urlPath) => urlPath.replace(/^(\/[^/]+)?\/api\/fred/, '/fred'),
    onProxyReq(proxyReq) {
      const key = process.env.FRED_API_KEY;
      if (!key) {
        return;
      }
      const hasKey = /[?&]api_key=/.test(proxyReq.path);
      if (!hasKey) {
        const sep = proxyReq.path.includes('?') ? '&' : '?';
        proxyReq.path += `${sep}api_key=${encodeURIComponent(key)}`;
      }
    }
  });
}

module.exports = function setupProxy(app) {
  app.use('/api/fred', createFredProxy());
  const home = getHomePathname();
  if (home) {
    app.use(`${home}/api/fred`, createFredProxy());
  }
};
