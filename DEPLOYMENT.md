# Database Backend Deployment Guide

This guide explains how to deploy the new database-backed API for persistent image storage.

## Architecture

- **Frontend**: Static React app (served by Nginx/Caddy)
- **Backend API**: Node.js/Express server (separate service)
- **Database**: PostgreSQL (deployed via Coolify)

## Step 1: Deploy PostgreSQL Database

1. In Coolify Dashboard:
   - Click **"New Resource"** → **"Database"** → **"PostgreSQL"**
   - Name it: `dmg-holdings-db`
   - Set a strong password
   - Deploy it

2. Note the connection details:
   - Host: (internal service name, e.g., `dmg-holdings-db`)
   - Port: `5432`
   - Database: `postgres` (default)
   - User: `postgres` (default)
   - Password: (the one you set)

## Step 2: Deploy Backend API

### Option A: Separate Application in Coolify

1. **Create New Application:**
   - In Coolify: **"New Resource"** → **"Application"**
   - Connect to your GitHub repository
   - Set **"Root Directory"** to: `server`
   - Set **"Build Pack"** to: `Nixpacks` (auto-detects Node.js)

2. **Set Environment Variables:**
   ```
   DB_HOST=dmg-holdings-db
   DB_PORT=5432
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASSWORD=<your-db-password>
   DB_SSL=false
   PORT=3001
   FRONTEND_URL=https://dmg.brandingnovations.com
   ```

3. **Deploy:**
   - Click **"Deploy"**
   - Note the API URL (e.g., `https://api-dmg.brandingnovations.com`)

### Option B: Monorepo (API + Frontend together)

If you want to deploy both from the same repo:

1. Update `nixpacks.toml` to build both:
   ```toml
   [phases.setup]
   nixPkgs = ["nodejs-22"]

   [phases.install]
   cmds = [
     "cd server && npm install",
     "npm install"
   ]

   [phases.build]
   cmds = [
     "npm run build",
     "cd server && npm install --production"
   ]

   [start]
   cmd = "cd server && node index.js & npx vite preview --port 80 --host"
   ```

2. Set environment variables in Coolify for the API

## Step 3: Update Frontend

1. **Set API URL in Coolify Environment Variables:**
   ```
   VITE_API_URL=https://api-dmg.brandingnovations.com
   ```
   (Replace with your actual API URL)

2. **Redeploy Frontend:**
   - The frontend will automatically use the API when available
   - Falls back to IndexedDB if API is unavailable

## Step 4: Verify Deployment

1. **Check API Health:**
   - Visit: `https://api-dmg.brandingnovations.com/health`
   - Should return: `{"status":"ok","timestamp":"..."}`

2. **Test Login:**
   - Default credentials: `admin` / `admin`
   - Login should work via API

3. **Test Image Upload:**
   - Upload an image in the CMS
   - Check browser console for: `✓ Data saved to API database.`
   - Refresh page - image should persist

## Troubleshooting

### API Connection Failed
- Check database is running in Coolify
- Verify environment variables are correct
- Check API logs in Coolify dashboard

### Images Not Saving
- Check browser console for errors
- Verify `VITE_API_URL` is set correctly
- Check API logs for database errors

### Login Not Working
- Verify API is accessible
- Check database has admin user (auto-created on first run)
- Try default password: `admin`

## Database Schema

The API automatically creates these tables:
- `site_data`: Stores site configuration (JSONB)
- `admin_users`: Stores admin credentials (hashed passwords)

## Security Notes

- Change default `admin` password immediately after first login
- Use HTTPS in production (Coolify handles this)
- Database is only accessible from within Coolify network
- API uses CORS to restrict frontend origins
