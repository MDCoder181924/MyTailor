Deploying the backend to Render

Prerequisites
- A Render account (https://render.com)
- A GitHub repository connected to Render
- A production MongoDB URI (e.g., Atlas)

Quick steps
1. Prepare repository
   - Ensure `backend/package.json` has a `start` script (`node server.js`).
   - Commit the `backend/.env.example` (do NOT commit real secrets).

2. Create a new Web Service on Render
   - On Render dashboard click "New" → "Web Service".
   - Connect your GitHub repo and select the branch (e.g., `main`).
   - For `Root Directory` set: `backend`.
   - Build Command: leave blank or `npm install` (Render runs `npm install` by default).
   - Start Command: `npm start` (Render will run `npm start` by default; ensure `start` exists).
   - Environment: choose `Node` or leave default; use `PORT` as provided by Render.

3. Add environment variables in Render (Service -> Environment -> Environment Variables)
   - `MONGO_URI` => your Atlas connection string
   - `JWT_SECRET` => production secret
   - `JWT_REFRESH_SECRET` => production refresh secret
   - `CORS_ORIGINS` => https://my-tailor-ch9n.vercel.app (or your frontend URL)
   - Any other vars from `.env.example`

4. Deploy
   - Trigger a manual deploy or enable automatic deploys on push.
   - Monitor build logs; service will start and show the assigned external URL.

5. Verify
   - Visit the Render service URL (https) and check health logs.
   - From your frontend, call the backend endpoints and check CORS and API responses.

Recommendations for production
- Use MongoDB Atlas with IP allowlist and strong username/password or SRV connection string.
- Use strong random values for `JWT_SECRET` and `JWT_REFRESH_SECRET`.
- Turn off `csurf` or configure appropriately for your production cookie domain if using CSRF protection.
- Use HTTPS-only cookies and set `secure: true` when behind TLS.
- Add logging/monitoring (Render has logs) and set appropriate resource plan if needed.

Optional: render.yaml
You can create a `render.yaml` to define the service as code. Example:

```yaml
services:
  - type: web
    name: mytailor-backend
    env: node
    repo: https://github.com/<your-org>/MyTailor
    branch: main
    buildCommand: npm install
    startCommand: npm start
    rootdir: backend
    envVars:
      - key: MONGO_URI
        value: "${{ MONGO_URI }}"
```

Security note
- Never commit real secrets to the repository. Use Render's environment variable UI or Secret Manager.
