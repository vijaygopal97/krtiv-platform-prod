# Frontend deployment

## Reverse proxy (Nginx, etc.)

To avoid 500 errors on static files and chunk load errors:

- **Route `/kraik` to the Next.js app** (frontend). All paths under `/kraik` (including `/kraik/_next/static/*`) must be served by the frontend process.
- **Route `/kraik/api` to the Kraik backend** (Node/Express) if you proxy API separately.

If `/kraik/_next/static/*` is sent to the backend instead of Next.js, the server will return 404/500 and the app will fail to load.

## After rebuilding

1. Run: `npm run build` (this cleans `.next` and rebuilds).
2. Restart the frontend: `pm2 restart kraik-frontend` (or your process manager).
3. Hard refresh the browser: **Ctrl+Shift+R** (Windows/Linux) or **Cmd+Shift+R** (Mac).

The app sends `Cache-Control: no-store` for HTML so the browser does not cache the document; static assets are cached with immutable. If you still see chunk errors, clear the browser cache for the site or use an incognito window.
