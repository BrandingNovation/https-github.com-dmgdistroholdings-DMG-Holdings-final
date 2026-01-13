# Coolify Deployment Guide - Step by Step

This guide walks you through deploying the database backend in Coolify.

## Prerequisites
- Coolify dashboard access
- GitHub repository connected to Coolify

---

## Step 1: Deploy PostgreSQL Database

1. **In Coolify Dashboard:**
   - Click **"New Resource"** (top right)
   - Select **"Database"**
   - Choose **"PostgreSQL"**

2. **Configure Database:**
   - **Name**: `dmg-holdings-db`
   - **Database Name**: `postgres` (default)
   - **Username**: `postgres` (default)
   - **Password**: Set a strong password (save this!)
   - Click **"Deploy"**

3. **Wait for deployment** (takes 1-2 minutes)

4. **Note the connection details:**
   - Host: `dmg-holdings-db` (internal service name)
   - Port: `5432`
   - Database: `postgres`
   - User: `postgres`
   - Password: (the one you set)

---

## Step 2: Deploy Backend API Server

1. **Create New Application:**
   - Click **"New Resource"** → **"Application"**
   - **Source**: Select your GitHub repository
   - **Branch**: `main`

2. **Configure Build Settings:**
   - **Root Directory**: `server`
   - **Build Pack**: `Nixpacks` (auto-detected)
   - **Port**: `3001` (or leave empty, will use PORT env var)

3. **Set Environment Variables:**
   Click **"Environment Variables"** and add:
   ```
   DB_HOST=dmg-holdings-db
   DB_PORT=5432
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASSWORD=<your-database-password-from-step-1>
   DB_SSL=false
   PORT=3001
   FRONTEND_URL=https://dmg.brandingnovations.com
   ```

4. **Deploy:**
   - Click **"Deploy"**
   - Wait for build to complete (2-3 minutes)

5. **Get API URL:**
   - After deployment, note the URL (e.g., `https://api-dmg.brandingnovations.com`)
   - Or check the application's domain in Coolify

---

## Step 3: Update Frontend Application

1. **Go to your existing frontend application** in Coolify

2. **Add Environment Variable:**
   - Click **"Environment Variables"**
   - Add:
   ```
   VITE_API_URL=https://api-dmg.brandingnovations.com
   ```
   (Replace with your actual API URL from Step 2)

3. **Redeploy Frontend:**
   - Click **"Redeploy"**
   - Wait for deployment to complete

---

## Step 4: Verify Everything Works

1. **Check API Health:**
   - Visit: `https://your-api-url.com/health`
   - Should see: `{"status":"ok","timestamp":"..."}`

2. **Test Login:**
   - Go to your frontend site
   - Click admin/login
   - Use: `admin` / `admin` (default credentials)
   - Should log in successfully

3. **Test Image Upload:**
   - Log into CMS
   - Upload an image
   - Check browser console (F12) for: `✓ Data saved to API database.`
   - Refresh page - image should still be there

---

## Troubleshooting

### API won't connect to database
- **Check**: Database is running in Coolify
- **Check**: Environment variables are correct (especially `DB_HOST` and `DB_PASSWORD`)
- **Check**: API logs in Coolify dashboard for connection errors

### Images not saving
- **Check**: Browser console for API errors
- **Check**: `VITE_API_URL` is set correctly in frontend
- **Check**: API logs for database errors
- **Try**: Hard refresh browser (Ctrl+Shift+R)

### Login not working
- **Check**: API is accessible (visit `/health` endpoint)
- **Check**: Database has admin user (auto-created on first API start)
- **Try**: Default password `admin`
- **Check**: API logs for authentication errors

### Frontend can't reach API
- **Check**: `VITE_API_URL` environment variable is set
- **Check**: API URL is correct (no trailing slash)
- **Check**: CORS settings in API (should allow your frontend domain)
- **Check**: API is actually running (check health endpoint)

---

## Security Checklist

- [ ] Changed default admin password after first login
- [ ] Database password is strong and secure
- [ ] API is using HTTPS (Coolify handles this automatically)
- [ ] `FRONTEND_URL` in API matches your actual frontend domain
- [ ] Database is only accessible from within Coolify network (default)

---

## Default Credentials

**First Login:**
- Username: `admin`
- Password: `admin`

**⚠️ IMPORTANT:** Change this password immediately after first login!

---

## Need Help?

- Check API logs in Coolify dashboard
- Check database logs in Coolify dashboard
- Check browser console (F12) for frontend errors
- Verify all environment variables are set correctly
