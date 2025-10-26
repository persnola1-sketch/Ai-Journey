# 🚀 Deployment Guide

## Pre-Deployment Checklist

### ✅ Required Before Shipping

- [ ] `.env` file created with valid OpenAI API key
- [ ] Both servers start without errors (backend + frontend)
- [ ] Production build completes successfully (`npm run build`)
- [ ] All features tested in both light and dark modes
- [ ] Tested on mobile, tablet, and desktop viewports
- [ ] No console errors in browser
- [ ] All linter checks pass (`npm run lint`)
- [ ] README.md is up-to-date
- [ ] Documentation is complete

### 🔍 Testing Checklist

#### Core Functionality
- [ ] Chat interface sends and receives messages
- [ ] AI responds with correct personality for each mode
- [ ] Goals can be created, edited, completed, and deleted
- [ ] Milestones can be added to timeline
- [ ] Plugins can be installed and uninstalled
- [ ] Theme toggle works (light ↔ dark)
- [ ] Help documentation is accessible

#### AI Modes (Multi-Agent Plugin)
- [ ] Chat mode provides empathetic responses
- [ ] Thinking mode shows structured analysis
- [ ] Plan mode creates actionable plans
- [ ] Prompt Helper generates optimized prompts
- [ ] Mode selector appears only when plugin installed

#### Prompt Library
- [ ] Prompts can be saved
- [ ] Favorites toggle works
- [ ] Search filters prompts correctly
- [ ] Export downloads JSON file
- [ ] Saved prompts persist after refresh

#### Responsive Design
- [ ] Mobile (< 640px): Navigation collapses, touch-friendly buttons
- [ ] Tablet (640-1023px): Two-column layouts work
- [ ] Desktop (1024px+): Full layout with all features visible
- [ ] No horizontal scrolling on any screen size
- [ ] Text is readable on all devices

#### Data Persistence
- [ ] Goals persist after page refresh
- [ ] Milestones saved to LocalStorage
- [ ] Chat history maintained
- [ ] Plugin installation state preserved
- [ ] Theme preference remembered

---

## 🏗️ Production Build

### Step 1: Test Build Locally

```bash
cd ai-journey-companion

# Run production build
npm run build

# Preview the production build
npm run preview
```

The preview server will start on `http://localhost:4173`

### Step 2: Verify Build Output

Check the `dist/` folder contains:
- `index.html`
- `assets/` folder with CSS and JS bundles
- Public assets (icons, images)

### Step 3: Test Production Build

1. Open preview URL (`http://localhost:4173`)
2. Test all core features
3. Check browser console for errors
4. Verify performance (should be fast!)

---

## 📦 Deployment Options

### Option 1: Vercel (Recommended for React Apps)

**Pros**: Free tier, automatic deployments, great for React

**Steps**:
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables: Add `OPENAI_API_KEY`
5. Deploy!

**Note**: You'll need to deploy the backend separately (see Backend Deployment below)

### Option 2: Netlify

**Pros**: Simple setup, good free tier

**Steps**:
1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. New site from Git
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variables in Netlify dashboard
6. Deploy!

### Option 3: GitHub Pages

**Pros**: Free, integrated with GitHub

**Steps**:
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. Run: `npm run deploy`

**Note**: Backend must be deployed elsewhere

### Option 4: Docker (Full Stack)

**Pros**: Bundle frontend + backend together

Create `Dockerfile`:
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3001 5173

CMD ["npm", "run", "server"]
```

---

## 🔧 Backend Deployment

The Express backend (`server.js`) needs to be deployed separately from the frontend.

### Option 1: Railway

**Pros**: Easy deployment, free tier available

**Steps**:
1. Go to [railway.app](https://railway.app)
2. Create new project
3. Deploy from GitHub
4. Add environment variable: `OPENAI_API_KEY`
5. Railway will auto-detect Node.js and run `npm start`

### Option 2: Render

**Pros**: Free tier, simple setup

**Steps**:
1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repo
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm run server`
   - Environment: Add `OPENAI_API_KEY`
5. Deploy!

### Option 3: Heroku

**Pros**: Well-established platform

**Steps**:
1. Install Heroku CLI
2. `heroku create your-app-name`
3. `heroku config:set OPENAI_API_KEY=your-key`
4. `git push heroku main`

### Option 4: DigitalOcean App Platform

**Pros**: Reliable, scalable

1. Create new app from GitHub
2. Detect Node.js
3. Add environment variables
4. Deploy!

---

## 🔐 Environment Variables

### Development (`.env` file)
```bash
OPENAI_API_KEY=sk-your-development-key
```

### Production
Set these in your hosting platform's dashboard:
- `OPENAI_API_KEY` - Your OpenAI API key
- `NODE_ENV=production` (optional)
- `PORT` (if required by host)

**Security**:
- ⚠️ NEVER commit `.env` file to Git
- ✅ Use platform environment variables for production
- ✅ Rotate API keys periodically
- ✅ Monitor API usage in OpenAI dashboard

---

## 🌐 CORS Configuration

For production, update `server.js`:

```javascript
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:5173',
  'https://your-production-domain.com',
  'https://your-vercel-app.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
```

---

## 📊 Post-Deployment Verification

### Immediate Checks
- [ ] Homepage loads without errors
- [ ] Chat interface connects to backend
- [ ] AI responds to messages
- [ ] Theme toggle works
- [ ] Navigation works on mobile
- [ ] All pages are accessible

### Performance Checks
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3s
- [ ] No console errors
- [ ] No 404 errors in Network tab

### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## 🐛 Common Deployment Issues

### Frontend builds but backend fails
**Problem**: Backend not deployed or CORS issues  
**Solution**: Deploy backend separately, update CORS origins

### Environment variables not working
**Problem**: `.env` not loaded in production  
**Solution**: Set variables in hosting platform dashboard

### 404 on page refresh
**Problem**: SPA routing not configured  
**Solution**: Add `_redirects` file (Netlify) or `vercel.json` (Vercel):

**Netlify** `public/_redirects`:
```
/*    /index.html   200
```

**Vercel** `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

### Build fails with memory error
**Problem**: Not enough memory during build  
**Solution**: Increase Node memory:
```json
"scripts": {
  "build": "node --max_old_space_size=4096 node_modules/vite/bin/vite.js build"
}
```

### API calls fail in production
**Problem**: Backend URL hardcoded to localhost  
**Solution**: Use environment variables for API URL

---

## 📈 Monitoring & Maintenance

### Recommended Monitoring
- **Uptime**: [UptimeRobot](https://uptimerobot.com) - Free uptime monitoring
- **Analytics**: [Plausible](https://plausible.io) - Privacy-friendly analytics
- **Errors**: Check browser console, server logs

### Regular Maintenance
- Monitor OpenAI API usage and costs
- Check for dependency updates: `npm outdated`
- Rotate API keys every 3-6 months
- Backup user data (if using database in future)
- Review and clear old logs

---

## 🎯 Performance Optimization

### Already Implemented
✅ Code splitting with Vite
✅ Optimized Tailwind CSS (PurgeCSS)
✅ Lazy loading with React.lazy (if needed)
✅ Minimal dependencies
✅ Efficient LocalStorage usage

### Future Optimizations
- Implement service worker for offline support
- Add image optimization (if using images)
- Enable gzip compression on server
- Use CDN for static assets
- Implement request caching

---

## 🚦 Go-Live Checklist

**Final Steps Before Launch**:

1. [ ] Run `npm run build` - Verify builds without errors
2. [ ] Run `npm run preview` - Test production build locally
3. [ ] Deploy backend to hosting platform
4. [ ] Deploy frontend to hosting platform
5. [ ] Set all environment variables
6. [ ] Update CORS origins for production domain
7. [ ] Test all features on production URL
8. [ ] Check mobile responsiveness on real devices
9. [ ] Run Lighthouse audit (score > 90)
10. [ ] Monitor for errors in first 24 hours

---

## 📞 Support & Resources

- **OpenAI Docs**: https://platform.openai.com/docs
- **Vite Docs**: https://vitejs.dev/guide/
- **React Docs**: https://react.dev
- **Tailwind Docs**: https://tailwindcss.com/docs

---

**Ready to Ship?** 🚀

Run through the checklist one more time, then deploy with confidence!

**Version**: 1.0.0  
**Last Updated**: 2025-10-24

