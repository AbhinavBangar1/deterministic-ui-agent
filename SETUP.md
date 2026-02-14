# 🛠️ Setup Guide

Complete installation and configuration instructions for the AI UI Generator.

---

## 📋 Prerequisites

### Required Software

1. **Node.js 18+**
   ```bash
   node --version  # Should show v18.x.x or higher
   ```
   Install from: https://nodejs.org/

2. **npm** (comes with Node.js)
   ```bash
   npm --version
   ```

3. **Claude API Key**
   - Sign up: https://console.anthropic.com/
   - Create API key
   - Copy key (starts with `sk-ant-api03-`)

---

## 🚀 Installation

### Step 1: Clone Repository

```bash
git clone <your-repo-url>
cd ai-ui-generator-full-stack
```

### Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and add your API key
nano .env  # or use any text editor
```

**Your `.env` should look like:**
```bash
CLAUDE_API_KEY=sk-ant-api03-YOUR_ACTUAL_KEY_HERE
PORT=3001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Step 3: Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local if backend URL is different
nano .env.local
```

**Your `.env.local` should look like:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## ▶️ Running the Application

### Option 1: Run Both (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
✅ AI UI Generator Backend running on http://localhost:3001
📡 Health check: http://localhost:3001/health
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
▲ Next.js 14.0.4
- Local: http://localhost:3000
✓ Ready in 2.5s
```

### Option 2: Production Build

```bash
# Build backend
cd backend
npm run build
npm start

# Build frontend
cd frontend
npm run build
npm start
```

---

## ✅ Verification

### 1. Check Backend Health

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-..."
}
```

### 2. Open Frontend

Navigate to: http://localhost:3000

You should see:
- Three-panel layout
- Chat panel on the left
- Code editor in the middle
- Preview panel on the right

### 3. Test Generation

In the chat panel, type:
```
Create a simple login form
```

Expected behavior:
- AI processes request
- Code appears in editor
- Preview renders UI
- Explanation shows in chat

---

## 🐛 Troubleshooting

### "CLAUDE_API_KEY not set"

**Problem:** Missing or incorrect API key

**Solution:**
```bash
cd backend
cat .env  # Verify file exists and has key
```

Make sure:
- File is named `.env` (not `.env.example`)
- Key starts with `sk-ant-api03-`
- No extra spaces around `=`

---

### "Cannot find module"

**Problem:** Dependencies not installed

**Solution:**
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

### "Port 3000 already in use"

**Problem:** Another process using port 3000

**Solution:**
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9

# Or use different port
cd frontend
PORT=3001 npm run dev
```

---

### "CORS Error"

**Problem:** Frontend can't reach backend

**Solution:**

1. Verify backend is running: http://localhost:3001/health
2. Check `FRONTEND_URL` in backend `.env`
3. Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
4. Restart both servers

---

### "Monaco Editor not loading"

**Problem:** Missing dependencies

**Solution:**
```bash
cd frontend
npm install @monaco-editor/react
```

---

## 🌐 Deployment

### Deploy Backend (Render.com)

1. Create account on Render.com
2. New → Web Service
3. Connect GitHub repository
4. Configure:
   - **Name:** ai-ui-generator-backend
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment Variables:**
     - `CLAUDE_API_KEY` = your_key
     - `PORT` = 3001
     - `FRONTEND_URL` = https://your-frontend-url.vercel.app

5. Deploy
6. Note the URL (e.g., `https://ai-ui-generator-backend.onrender.com`)

---

### Deploy Frontend (Vercel)

```bash
cd frontend

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts:
# - Link to project
# - Set environment variable:
#   NEXT_PUBLIC_API_URL = https://your-backend-url.onrender.com

# Deploy to production
vercel --prod
```

---

## 📊 Verification Checklist

After setup, verify:

- [ ] Backend running on http://localhost:3001
- [ ] Frontend running on http://localhost:3000
- [ ] Health check returns OK
- [ ] Can generate UI from chat
- [ ] Code appears in editor
- [ ] Preview renders correctly
- [ ] Can modify UI
- [ ] Can rollback versions
- [ ] Explanations appear in chat

---

## 🔧 Development Tips

### Hot Reload

Both servers support hot reload:
- **Backend:** Changes to `.ts` files auto-restart
- **Frontend:** Changes to `.tsx` files auto-refresh

### Debugging

**Backend logs:**
```bash
cd backend
npm run dev  # Watch console output
```

**Frontend logs:**
- Open browser DevTools (F12)
- Check Console tab

**API testing:**
```bash
# Test generate endpoint
curl -X POST http://localhost:3001/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Create a button","flowType":"new"}'
```

### Environment Variables

**Backend (.env):**
- `CLAUDE_API_KEY` - Required
- `PORT` - Default 3001
- `FRONTEND_URL` - For CORS
- `NODE_ENV` - development/production

**Frontend (.env.local):**
- `NEXT_PUBLIC_API_URL` - Backend URL

---

## 📚 Next Steps

After successful setup:

1. ✅ Read [README.md](./README.md) for feature overview
2. ✅ Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
3. ✅ Try example prompts:
   - "Create a dashboard with cards"
   - "Build a settings page"
   - "Make a data table"
4. ✅ Experiment with modifications
5. ✅ Check [IMPROVEMENTS.md](./IMPROVEMENTS.md) for enhancement ideas

---

## 🆘 Getting Help

If you encounter issues:

1. Check this guide's troubleshooting section
2. Verify all prerequisites are met
3. Check console logs (backend + frontend)
4. Ensure API key is valid and has credits
5. Try clearing `node_modules` and reinstalling

---

**Setup complete! Start building amazing UIs! 🚀**
