# Deployment Guide for Billing System

## Overview
This project has two parts:
- **Frontend**: React app (can be deployed on Vercel)
- **Backend**: Node.js/Express API (needs separate deployment)

## Frontend Deployment on Vercel

### Option 1: Deploy from Vercel Dashboard (Current Method)

1. **On Vercel Dashboard:**
   - Keep the settings as shown
   - **Root Directory**: Leave as `./` (root)
   - **Framework Preset**: Other
   - The `vercel.json` file will handle the configuration

2. **Environment Variables to Add:**
   ```
   REACT_APP_API_URL = your_backend_api_url
   ```
   (You'll add this after deploying the backend)

3. **Click "Deploy"**

### Option 2: Deploy from Command Line

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

## Backend Deployment Options

### Option 1: Deploy on Render (Recommended for beginners)

1. Go to [render.com](https://render.com)
2. Create a New Web Service
3. Connect your GitHub repository
4. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add Environment Variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
6. Deploy and copy the URL

### Option 2: Deploy on Railway

1. Go to [railway.app](https://railway.app)
2. Create New Project → Deploy from GitHub
3. Select your repository
4. Add environment variables (same as above)
5. Railway will auto-detect Node.js and deploy

### Option 3: Deploy on Heroku

```bash
# Install Heroku CLI and login
heroku login

# Create app
heroku create your-billing-backend

# Add MongoDB (or use MongoDB Atlas)
# Set environment variables
heroku config:set MONGODB_URI=your_uri
heroku config:set JWT_SECRET=your_secret

# Deploy
cd backend
git subtree push --prefix backend heroku master
```

## After Backend Deployment

1. Copy your backend URL (e.g., `https://your-app.onrender.com`)
2. Go back to Vercel project settings
3. Add environment variable:
   ```
   REACT_APP_API_URL = https://your-app.onrender.com/api
   ```
4. Redeploy the frontend

## MongoDB Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Get connection string
5. Whitelist all IPs (0.0.0.0/0) for cloud deployment
6. Update `MONGODB_URI` in backend environment variables

## Important Notes

- The frontend will be deployed at: `https://your-project.vercel.app`
- The backend needs a separate URL
- Make sure CORS is configured in backend to allow your Vercel domain
- Keep your JWT_SECRET secure and never commit it to Git

## Testing Deployment

1. Visit your Vercel URL
2. Try to register/login
3. Check browser console for any API errors
4. If you see CORS errors, update backend CORS settings

## Troubleshooting

- **Blank page**: Check browser console for errors
- **API not working**: Verify REACT_APP_API_URL is set correctly
- **CORS errors**: Update backend CORS to allow your Vercel domain
- **Build fails**: Check build logs in Vercel dashboard
