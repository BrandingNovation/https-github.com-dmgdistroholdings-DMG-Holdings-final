# Server Access & Deployment Summary

## Server Information

**VPS Details:**
- **IP Address:** `65.21.109.247`
- **Hostname:** `ubuntu-8gb-hel1-1`
- **Operating System:** Ubuntu Linux
- **Platform:** Coolify (self-hosted deployment platform)
- **Location:** Hetzner (hel1 = Helsinki datacenter)

## How We Connected

### Direct Server Access
- **Method:** Direct access through Cursor/development environment
- **No SSH Required:** Commands executed directly on the server
- **Working Directory:** `/data/coolify/applications/f8cgk888s8wgko80ogc0os4g/`
- **Permissions:** Root access for deployment tasks

### For Manual SSH Access (Your Terminal)

**SSH Command:**
```bash
ssh root@65.21.109.247
```

**Or:**
```bash
ssh root@ubuntu-8gb-hel1-1
```

**Authentication:**
- SSH key authentication (if configured)
- Or password authentication

## Key Server Directories

### Applications
- `/data/coolify/applications/dmg-api-server/` - API server code & config
- `/data/coolify/applications/f8cgk888s8wgko80ogc0os4g/` - Frontend application
- `/data/coolify/applications/*/docker-compose.yaml` - Container configs

### Databases
- `/data/coolify/databases/kssckc00scgw0oc404g4w88w/` - PostgreSQL database
- Database container: `kssckc00scgw0oc404g4w88w`

### System
- `/data/coolify/` - Main Coolify data directory
- `/data/coolify/proxy/` - Reverse proxy (Traefik/Caddy)
- `/data/coolify/ssh/keys/` - SSH keys for deployments

## What We Deployed

### 1. API Server (`dmg-api-server`)
- **Location:** `/data/coolify/applications/dmg-api-server/`
- **Container:** `dmg-api-server`
- **Port:** `3001`
- **Status:** Running and healthy
- **Database:** Connected to PostgreSQL

### 2. Frontend Application
- **Location:** `/data/coolify/applications/f8cgk888s8wgko80ogc0os4g/`
- **Container:** `f8cgk888s8wgko80ogc0os4g-*` (dynamic ID)
- **Port:** `80`
- **Domain:** `dmg.brandingnovations.com`
- **Status:** Running

### 3. PostgreSQL Database
- **Container:** `kssckc00scgw0oc404g4w88w`
- **Port:** `5432`
- **User:** `myuser`
- **Database:** `postgres`
- **Status:** Running and healthy

## Deployment Process We Used

1. **Cloned Repository:**
   ```bash
   git clone https://github.com/BrandingNovation/... /tmp/api-deploy
   ```

2. **Created API Server Directory:**
   ```bash
   mkdir -p /data/coolify/applications/dmg-api-server
   ```

3. **Copied Server Files:**
   ```bash
   cp -r server/* /data/coolify/applications/dmg-api-server/
   ```

4. **Created Docker Compose Config:**
   - Created `/data/coolify/applications/dmg-api-server/docker-compose.yaml`
   - Configured Traefik/Caddy labels for routing

5. **Built & Deployed:**
   ```bash
   cd /data/coolify/applications/dmg-api-server
   docker build -t dmg-api-server:latest .
   docker compose up -d
   ```

6. **Updated Frontend:**
   - Added `VITE_API_URL` environment variable
   - Restarted frontend container

## Useful Commands for SSH Session

```bash
# Check all containers
docker ps

# View API logs
docker logs dmg-api-server --tail 50

# Check API health
docker exec dmg-api-server node -e "require('http').get('http://localhost:3001/health', (r) => {let d='';r.on('data',c=>d+=c);r.on('end',()=>console.log(d))})"

# View frontend logs
docker logs f8cgk888s8wgko80ogc0os4g-020950875381 --tail 50

# Check database connection
docker exec dmg-api-server node -e "const {Pool}=require('pg');const p=new Pool({host:process.env.DB_HOST,port:5432,database:'postgres',user:'myuser',password:'testpass123'});p.query('SELECT NOW()').then(r=>{console.log('Connected:',r.rows[0].now);p.end()})"

# Restart API server
cd /data/coolify/applications/dmg-api-server && docker compose restart

# View Coolify structure
ls -la /data/coolify/applications/
```

## Environment Variables

### API Server (dmg-api-server)
- `DB_HOST=kssckc00scgw0oc404g4w88w`
- `DB_PORT=5432`
- `DB_NAME=postgres`
- `DB_USER=myuser`
- `DB_PASSWORD=testpass123`
- `PORT=3001`
- `FRONTEND_URL=https://dmg.brandingnovations.com`

### Frontend
- `VITE_API_URL=https://api-dmg.brandingnovations.com`

## Important Notes

- **No SSH Required for Automated Tasks:** Direct server access through development environment
- **Docker-Based:** Everything runs in containers managed by Coolify
- **Coolify Manages:** Container lifecycle, networking, SSL certificates
- **Database:** Internal Docker network, not exposed publicly
- **API:** Accessible via Traefik/Caddy reverse proxy

## For Future Reference

- **Repository:** GitHub (BrandingNovation organization)
- **Branch:** `main`
- **Deployment:** Manual via Coolify or automated via Git push
- **Backup:** Database volumes in `/data/coolify/databases/*/volumes/`
