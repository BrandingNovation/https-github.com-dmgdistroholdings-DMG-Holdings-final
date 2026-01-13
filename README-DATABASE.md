# Database Backend - Quick Start

## What's Included

✅ **PostgreSQL Database** - Persistent storage for all site data and images  
✅ **Express.js API** - REST API for saving/loading data  
✅ **Authentication** - Secure admin login with password hashing  
✅ **Auto-sync** - Frontend automatically saves to database  
✅ **Offline Support** - Falls back to IndexedDB if API unavailable  

## Quick Deploy in Coolify

### 1. Deploy Database (2 minutes)
- Coolify → New Resource → Database → PostgreSQL
- Name: `dmg-holdings-db`
- Set password
- Deploy

### 2. Deploy API (3 minutes)
- Coolify → New Resource → Application
- Root Directory: `server`
- Environment Variables:
  ```
  DB_HOST=dmg-holdings-db
  DB_PASSWORD=<your-password>
  FRONTEND_URL=https://dmg.brandingnovations.com
  ```
- Deploy

### 3. Update Frontend (1 minute)
- Add env var: `VITE_API_URL=https://your-api-url.com`
- Redeploy

**Done!** Images now save permanently to database.

## Local Development

```bash
cd server
npm run setup    # Creates .env file
npm install
npm run dev      # Start API server
```

In another terminal:
```bash
npm run verify   # Check database connection
```

## File Structure

```
server/
├── index.js              # Main API server
├── db.js                 # Database initialization
├── routes/
│   ├── auth.js          # Login/password endpoints
│   └── siteData.js      # Save/load site data
├── package.json
├── Dockerfile           # For containerization
├── nixpacks.toml        # For Coolify deployment
└── setup.sh             # Setup script

services/
├── apiService.ts        # Frontend API client
└── dbService.ts         # Updated to use API
```

## API Endpoints

- `GET /health` - Health check
- `POST /api/auth/login` - Admin login
- `POST /api/auth/update-password` - Change password
- `GET /api/site-data` - Load site data
- `POST /api/site-data` - Save site data

## Default Credentials

- Username: `admin`
- Password: `admin`

**⚠️ Change immediately after first login!**

## Troubleshooting

See `COOLIFY-SETUP.md` for detailed troubleshooting guide.
