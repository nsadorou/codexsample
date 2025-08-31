# Next.js ToDo (Simple)

A minimal ToDo app built with Next.js (App Router) and client-side persistence via `localStorage`.

## Features
- Add, update status, delete todos
- Filter: All / Active / In Progress / Completed
- Clear completed
- Persist in `localStorage`

## Run locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start dev server:
   ```bash
   npm run dev
   ```
3. Open http://localhost:3000

## Project structure
```
app/
  layout.js     # Root layout + global styles
  page.js       # ToDo UI (client component)
  globals.css   # Basic styling
next.config.mjs
package.json
```

## Notes
- No backend/database; data is stored in the browser. Clearing site data or switching browsers will reset items.
- To deploy, run `npm run build` then `npm start` on a suitable host.

