# DMG Holdings API Server

Backend API for persistent storage of site data and images.

## Setup

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Set up PostgreSQL database:**
   - Deploy PostgreSQL via Coolify, or
   - Use a local PostgreSQL instance

3. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Update database connection details
   - Set `FRONTEND_URL` to your frontend domain

4. **Run the server:**
   ```bash
   npm run dev  # Development
   npm start    # Production
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with username/password
- `POST /api/auth/update-password` - Update admin password

### Site Data
- `GET /api/site-data` - Get current site data
- `POST /api/site-data` - Save site data (includes images as base64)
- `GET /api/site-data/version` - Get last update timestamp

## Deployment

### Option 1: Separate API Service in Coolify
1. Create a new application in Coolify
2. Point it to this `server` directory
3. Set environment variables in Coolify
4. Deploy

### Option 2: Monorepo (API + Frontend)
- Update build process to build both
- Use a reverse proxy to route `/api/*` to the API server

## Database Schema

- `site_data`: Stores the complete site configuration as JSONB
- `admin_users`: Stores admin authentication credentials
