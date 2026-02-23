# Deployment Guide

## Project Structure
```
Deployment/
├── .github/
│   └── workflows/
│       ├── frontend-ci.yml    # Frontend CI/CD
│       └── backend-ci.yml     # Backend CI/CD
├── Frontend/                   # Next.js app
└── Backend/                    # FastAPI app
```

---

## GitHub Actions Setup (Step-by-Step)

### Step 1: Push to GitHub
```bash
cd C:\Users\Manoj Kasula\Desktop\Deployment
git init
git add .
git commit -m "Initial commit with CI/CD"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Configure Secrets (GitHub Repository)

Go to: **GitHub Repo → Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Description | Where to Get |
|-------------|-------------|--------------|
| `DOCKERHUB_USERNAME` | Docker Hub username | https://hub.docker.com |
| `DOCKERHUB_TOKEN` | Docker Hub access token | Docker Hub → Account Settings → Security |
| `VERCEL_TOKEN` | Vercel API token (optional) | Vercel → Settings → Tokens |
| `VERCEL_ORG_ID` | Vercel Organization ID (optional) | Vercel Dashboard |
| `VERCEL_PROJECT_ID` | Vercel Project ID (optional) | Vercel Project Settings |

---

## Hosting Options

### Option A: Fully Managed (Recommended - No VM needed)

| Component | Service | Cost | Setup |
|-----------|---------|------|-------|
| **Frontend** | Vercel | Free | `vercel deploy` |
| **Backend** | Railway | Free tier | Connect GitHub repo |
| **Backend** | Render | Free tier | Connect GitHub repo |
| **Backend** | Fly.io | Free allowance | `fly deploy` |

#### Deploy Frontend to Vercel:
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `cd Frontend && vercel`
3. Enable GitHub Actions in workflow file (uncomment Vercel section)

#### Deploy Backend to Railway:
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select your repo → Set root directory to `Backend`
4. Add environment variables
5. Railway auto-deploys on push

---

### Option B: Docker + Cloud Registry

1. **Build & push Docker images** (GitHub Actions does this automatically)
2. **Deploy anywhere that runs Docker:**
   - AWS ECS/Fargate
   - Google Cloud Run
   - Azure Container Instances
   - DigitalOcean App Platform

---

### Option C: VM Deployment (Full Control)

**Providers:** AWS EC2, DigitalOcean Droplet, Linode, GCP Compute Engine

**Setup Steps:**

1. **Create a VM** (Ubuntu 22.04, 1GB RAM minimum)

2. **Install Docker on VM:**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   ```

3. **Setup SSH Key for GitHub Actions:**
   ```bash
   ssh-keygen -t ed25519 -f github_actions_key
   # Copy public key to VM: ~/.ssh/authorized_keys
   # Add private key to GitHub Secrets as VM_SSH_KEY
   ```

4. **Add VM Secrets to GitHub:**
   | Secret | Value |
   |--------|-------|
   | `VM_HOST` | Your VM IP or domain |
   | `VM_USERNAME` | SSH username (e.g., `ubuntu`) |
   | `VM_SSH_KEY` | Private SSH key (from step 3) |

5. **Uncomment VM deployment section** in `backend-ci.yml`

---

## CI/CD Pipeline Flow

```
┌─────────────┐
│  Git Push   │
└──────┬──────┘
       ▼
┌─────────────────┐
│ GitHub Actions  │
└────────┬────────┘
         ▼
    ┌────┴────┐
    ▼         ▼
┌───────┐ ┌─────────┐
│Front  │ │ Backend │
└───┬───┘ └────┬────┘
    ▼          ▼
┌───────┐  ┌──────────┐
│ Build │  │  Build   │
│ Lint  │  │  Docker  │
│ Test  │  │  Image   │
└───┬───┘  └────┬─────┘
    │           │
    └─────┬─────┘
          ▼
   ┌──────────────┐
   │   Deploy to  │
   │   Hosting    │
   └──────────────┘
```

---

## Quick Start (Recommended Path)

1. **Frontend → Vercel** (best for Next.js)
   - Free, automatic HTTPS, global CDN
   - Zero config deployment

2. **Backend → Railway**
   - Free tier: $5/month credit
   - Auto-deploys from GitHub
   - Built-in database options

3. **GitHub Actions** handles:
   - ✅ Linting
   - ✅ Building
   - ✅ Testing
   - ✅ Docker image creation
   - ✅ Automatic deployment on push to `main`

---

## Troubleshooting

### Workflow not running?
- Check `.github/workflows/` files are in repo root
- Verify branch names match (`main` vs `master`)
- Check Actions tab for disabled workflows

### Docker build fails?
- Ensure `requirements.txt` is in `Backend/` root
- Check Dockerfile paths match project structure

### Deployment fails?
- Verify all secrets are configured
- Check CORS origins in `backend/app/main.py`
- Review action logs for specific errors
