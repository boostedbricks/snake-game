# 🐍 Snake Game - Browser Edition

A classic Snake game built with HTML5 Canvas and vanilla JavaScript, containerized and ready for Azure deployment.

## 🎮 Features

- **Smooth gameplay** with HTML5 Canvas rendering
- **Multiple difficulty levels** (Easy, Normal, Hard, Insane)
- **Keyboard controls** (Arrow keys + WASD)
- **High score tracking** (stored in localStorage)
- **Responsive design** for mobile and desktop
- **Beautiful gradient UI** with animations
- **Wrap-around walls** (snake appears on opposite side)
- **Pause/Resume** functionality
- **Docker containerized** for easy deployment

## 🚀 Quick Start - Local Testing

### Prerequisites
- A web browser (Chrome, Firefox, Safari, Edge)
- Python 3 (for local server) OR any HTTP server

### Method 1: Python HTTP Server (Recommended)

```bash
cd snake
python3 -m http.server 8080
```

Open browser: http://localhost:8080

### Method 2: Direct File Open

Simply open `index.html` in your browser (some features may be limited)

## 🎯 How to Play

- **Start Game**: Press SPACE or click "Start Game"
- **Move**: Arrow Keys or WASD
- **Pause**: Press SPACE during game
- **Restart**: Press R or click "Restart"
- **Change Difficulty**: Click difficulty buttons before starting

### Game Rules

- Eat the red food to grow and score points
- Don't run into yourself
- Walls wrap around (you'll appear on the opposite side)
- Score increases by 10 for each food eaten
- High score is automatically saved

## 🐳 Docker Deployment

### Build the Docker Image

```bash
# From the snake directory
docker build -t snake-game:latest .
```

### Run Locally

```bash
docker run -d -p 8080:80 --name snake-game snake-game:latest
```

Visit: http://localhost:8080

### Stop Container

```bash
docker stop snake-game
docker rm snake-game
```

## ☁️ Azure Container Registry (ACR) Deployment

### Prerequisites
- Azure CLI installed and logged in
- ACR created (e.g., `yourarcadecr`)

### Push to ACR

```bash
# Login to ACR
az acr login --name yourarcadecr

# Tag image
docker tag snake-game:latest yourarcadecr.azurecr.io/snake-game:latest

# Push to ACR
docker push yourarcadecr.azurecr.io/snake-game:latest

# Verify
az acr repository list --name yourarcadecr --output table
az acr repository show-tags --name yourarcadecr --repository snake-game --output table
```

## 🔧 Azure Container Apps Deployment

### Option 1: Azure CLI

```bash
# Create Container App (if not exists)
az containerapp create \
  --name snake-game \
  --resource-group arcade-rg \
  --environment cae-arcade-env \
  --image yourarcadecr.azurecr.io/snake-game:latest \
  --target-port 80 \
  --ingress external \
  --registry-server yourarcadecr.azurecr.io \
  --cpu 0.25 \
  --memory 0.5Gi \
  --min-replicas 0 \
  --max-replicas 3

# Update existing Container App
az containerapp update \
  --name snake-game \
  --resource-group arcade-rg \
  --image yourarcadecr.azurecr.io/snake-game:latest
```

### Option 2: Terraform (Recommended)

See `terraform/` directory for IaC deployment

## 📁 Project Structure

```
snake/
├── index.html          # Main HTML structure
├── snake.js            # Game logic
├── styles.css          # Styling and animations
├── Dockerfile          # Container configuration
├── nginx.conf          # Nginx web server config
└── README.md           # This file
```

## 🎨 Customization

### Change Colors

Edit `styles.css`:
- Background gradient: `.body` background
- Snake color: `snake.js` draw function
- Food color: `snake.js` draw function

### Adjust Difficulty

Edit `snake.js`:
- Modify `gameSpeed` values in difficulty buttons
- Change snake starting length in `snake` array
- Adjust grid size with `gridSize` constant

### Game Mechanics

In `snake.js`:
- **Wrap-around walls**: Remove/modify in `moveSnake()` function
- **Collision detection**: Modify `checkCollision()` function
- **Score calculation**: Adjust in `updateGame()` function

## 🐛 Troubleshooting

### Game doesn't start
- Check browser console for errors (F12)
- Ensure JavaScript is enabled
- Try different browser

### Docker container won't start
```bash
# Check container logs
docker logs snake-game

# Verify nginx is running
docker exec snake-game ps aux
```

### Azure deployment fails
```bash
# Check Container App logs
az containerapp logs show --name snake-game --resource-group arcade-rg --follow

# Verify ACR access
az acr repository show --name yourarcadecr --repository snake-game
```

## 📊 Performance

- **Load time**: < 100ms (local)
- **Bundle size**: ~15KB total (HTML + CSS + JS)
- **Memory usage**: ~5MB in browser
- **Container size**: ~25MB (nginx:alpine base)

## 🔐 Security

- Nginx configured with security headers
- No external dependencies
- No data collection or analytics
- LocalStorage only for high score

## 📈 Next Steps

1. ✅ Build and test locally
2. ✅ Containerize with Docker
3. ✅ Push to ACR
4. ⬜ Deploy to Container Apps
5. ⬜ Add to CI/CD pipeline
6. ⬜ Configure custom domain
7. ⬜ Add to landing page

## 🤝 Contributing

Feel free to modify and improve! This is a learning project.

## 📝 License

Free to use and modify for learning purposes.

---

**Built with ❤️ for the aks-arcade project**

Next game: Pac-Man or 2048?
