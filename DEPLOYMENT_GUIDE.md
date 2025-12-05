# 🚀 Snake Game - Complete Deployment Guide

From local testing to Azure Container Apps - step by step.

## 📋 Prerequisites

- ✅ Docker installed
- ✅ Azure CLI installed and logged in
- ✅ Azure Container Registry created
- ✅ Azure Container App Environment created
- ✅ Python 3 (for local testing)

## Phase 1: Local Testing (5 minutes)

### Step 1: Test in Browser

```bash
cd ~/Projects/browser-games/snake

# Make script executable
chmod +x test-local.sh

# Run local server
./test-local.sh
```

Open http://localhost:8080 in your browser and **play the game!**

**What to test:**
- ✅ Game loads without errors
- ✅ Arrow keys / WASD work
- ✅ Snake moves smoothly
- ✅ Food appears and can be eaten
- ✅ Score increases
- ✅ Game over works
- ✅ Restart works
- ✅ Pause works
- ✅ High score persists (refresh page to verify)

Press Ctrl+C to stop the server.

---

## Phase 2: Docker Testing (10 minutes)

### Step 2: Build and Test Container

```bash
# Make script executable
chmod +x test-docker.sh

# Build and run container
./test-docker.sh
```

This will:
1. Build Docker image
2. Start container on port 8080
3. Run health checks
4. Show container logs

Visit http://localhost:8080 and test again.

### Step 3: Verify Container

```bash
# Check container is running
docker ps

# Test health endpoint
curl http://localhost:8080/health

# Check nginx logs
docker logs snake-game-test

# Stop when done
docker stop snake-game-test
```

**Expected output:**
- Container status: `Up`
- Health check: `healthy`
- No errors in logs

---

## Phase 3: Azure Container Registry (15 minutes)

### Step 4: Push to ACR

```bash
# Set your ACR name
ACR_NAME="yourarcadecr"  # Change this!

# Login to ACR
az acr login --name $ACR_NAME

# Tag image for ACR
docker tag snake-game:latest ${ACR_NAME}.azurecr.io/snake-game:latest
docker tag snake-game:latest ${ACR_NAME}.azurecr.io/snake-game:v1.0.0

# Push to ACR
docker push ${ACR_NAME}.azurecr.io/snake-game:latest
docker push ${ACR_NAME}.azurecr.io/snake-game:v1.0.0

# Verify push
az acr repository list --name $ACR_NAME --output table
az acr repository show-tags --name $ACR_NAME --repository snake-game --output table
```

**Expected output:**
```
Repository    Tag
------------  -------
snake-game    latest
snake-game    v1.0.0
```

---

## Phase 4: Azure Container Apps Deployment (20 minutes)

### Step 5: Deploy to Container Apps

#### Option A: Azure CLI (Quick)

```bash
# Set variables
RG="arcade-rg"
CAE_NAME="cae-arcade-env"
APP_NAME="snake-game"
ACR_NAME="yourarcadecr"  # Change this!

# Deploy
az containerapp create \
  --name $APP_NAME \
  --resource-group $RG \
  --environment $CAE_NAME \
  --image ${ACR_NAME}.azurecr.io/snake-game:latest \
  --target-port 80 \
  --ingress external \
  --registry-server ${ACR_NAME}.azurecr.io \
  --cpu 0.25 \
  --memory 0.5Gi \
  --min-replicas 0 \
  --max-replicas 3 \
  --scale-rule-name http-rule \
  --scale-rule-type http \
  --scale-rule-http-concurrency 10
```

#### Option B: Update Existing App

```bash
az containerapp update \
  --name $APP_NAME \
  --resource-group $RG \
  --image ${ACR_NAME}.azurecr.io/snake-game:latest
```

### Step 6: Get App URL

```bash
# Get FQDN
az containerapp show \
  --name $APP_NAME \
  --resource-group $RG \
  --query properties.configuration.ingress.fqdn \
  --output tsv
```

**Copy the URL and open in browser!** 🎮

---

## Phase 5: Verification (5 minutes)

### Step 7: Test Production Deployment

Visit your Container App URL and verify:

- ✅ Game loads from Azure
- ✅ All features work
- ✅ No console errors (F12 to check)
- ✅ Health endpoint works: `https://your-app-url/health`

### Step 8: Monitor Deployment

```bash
# View logs
az containerapp logs show \
  --name $APP_NAME \
  --resource-group $RG \
  --follow

# Check replicas
az containerapp replica list \
  --name $APP_NAME \
  --resource-group $RG \
  --output table

# View metrics (if enabled)
az containerapp show \
  --name $APP_NAME \
  --resource-group $RG \
  --query properties.template
```

---

## 🎯 Quick Reference Commands

### Update Game After Changes

```bash
# 1. Rebuild image
docker build -t snake-game:latest .

# 2. Tag with new version
docker tag snake-game:latest ${ACR_NAME}.azurecr.io/snake-game:v1.0.1

# 3. Push to ACR
docker push ${ACR_NAME}.azurecr.io/snake-game:v1.0.1

# 4. Update Container App
az containerapp update \
  --name snake-game \
  --resource-group arcade-rg \
  --image ${ACR_NAME}.azurecr.io/snake-game:v1.0.1
```

### Scale Manually

```bash
# Scale up
az containerapp update \
  --name snake-game \
  --resource-group arcade-rg \
  --min-replicas 1 \
  --max-replicas 5

# Scale down to zero (pause)
az containerapp update \
  --name snake-game \
  --resource-group arcade-rg \
  --min-replicas 0 \
  --max-replicas 0
```

### Delete Container App

```bash
az containerapp delete \
  --name snake-game \
  --resource-group arcade-rg \
  --yes
```

---

## 🐛 Troubleshooting

### Container App not starting

```bash
# Check provisioning state
az containerapp show \
  --name snake-game \
  --resource-group arcade-rg \
  --query properties.provisioningState

# View recent logs
az containerapp logs show \
  --name snake-game \
  --resource-group arcade-rg \
  --tail 50
```

### Game loads but doesn't work

1. Check browser console (F12) for JavaScript errors
2. Verify all files were included in Docker build
3. Check nginx is serving files: `docker exec <container> ls /usr/share/nginx/html`

### ACR authentication fails

```bash
# Re-login to ACR
az acr login --name yourarcadecr

# Check ACR credentials
az acr credential show --name yourarcadecr
```

---

## 📊 Cost Estimate

**For Snake Game:**
- Container Apps execution: ~$0-2/month (scales to zero)
- ACR storage: ~$0.10/month (one image, < 50MB)
- Bandwidth: ~$0-1/month (depends on traffic)

**Total: ~$0-3/month** for one game with low traffic

---

## ✅ Success Checklist

- [ ] Game works locally (localhost)
- [ ] Game works in Docker container
- [ ] Image pushed to ACR successfully
- [ ] Container App deployed
- [ ] Game accessible via Azure URL
- [ ] All features working in production
- [ ] Health check endpoint responds
- [ ] No errors in logs

---

## 🎉 Next Steps

1. ✅ Snake game deployed!
2. ⬜ Add to GitHub repository
3. ⬜ Set up CI/CD pipeline
4. ⬜ Build second game (2048 or Pac-Man)
5. ⬜ Create landing page
6. ⬜ Configure custom domain
7. ⬜ Add Application Gateway routing

---

**You've just deployed your first self-built game to Azure! 🎮☁️**

Time to build the next one! 🚀
