# Deployment Guide - GitHub & Vercel

This guide covers deploying the Future Plumbing application to GitHub and then to Vercel.

## 📋 Prerequisites

1. **GitHub Account** - Create one at https://github.com
2. **Vercel Account** - Create one at https://vercel.com (connect with GitHub)
3. **Git installed** - Already initialized in project
4. **Node.js 18.x** - For local development

---

## Step 1: Prepare for GitHub

### 1.1 Configure Git User (if not already done)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 1.2 Check Git Status
```bash
cd c:\Users\Teest\OneDrive\Desktop\FUTURE-PLUMBLING
git status
```

### 1.3 Stage All Files
```bash
git add .
```

### 1.4 Create Initial Commit
```bash
git commit -m "Initial commit: Future Plumbing full-stack application with admin dashboard"
```

---

## Step 2: Push to GitHub

### 2.1 Create Repository on GitHub
1. Go to https://github.com/new
2. **Repository name**: `future-plumbing` (or your preferred name)
3. **Description**: "Full-stack e-commerce plumbing website with admin dashboard"
4. **Visibility**: Choose Public or Private
5. Click **Create repository**

### 2.2 Add Remote and Push
```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/future-plumbing.git

# Rename branch if needed (modern GitHub uses 'main')
git branch -M main

# Push to GitHub
git push -u origin main
```

### 2.3 Verify on GitHub
- Visit `https://github.com/YOUR_USERNAME/future-plumbing`
- You should see all your files and commit history

---

## Step 3: Deploy to Vercel

### 3.1 Sign Up / Log In to Vercel
1. Go to https://vercel.com
2. Click **Sign Up**
3. Choose **Sign up with GitHub**
4. Authorize Vercel to access your GitHub account

### 3.2 Import Project
1. After signing in, click **Add New** → **Project**
2. Click **Import Git Repository**
3. Find and select `future-plumbing` repository
4. Click **Import**

### 3.3 Configure Project
**Build & Development Settings:**
- **Build Command**: Leave blank (we're using vercel.json)
- **Output Directory**: Leave blank
- **Install Command**: `npm install && cd backend && npm install`
- **Root Directory**: ./

**Environment Variables:**
- Add any required environment variables (optional for now)

### 3.4 Deploy
1. Click **Deploy**
2. Wait for deployment to complete (usually 1-2 minutes)
3. You'll get a deployment URL like: `https://future-plumbing.vercel.app`

---

## Step 4: Test Your Deployment

### 4.1 Visit Your Live Site
- **Website**: `https://YOUR_PROJECT.vercel.app`
- **Admin Dashboard**: `https://YOUR_PROJECT.vercel.app/admin`
- **Login**: Username: `Adminoko1` | Password: `future1`

### 4.2 Test Key Features
- ✅ View products
- ✅ View services
- ✅ Test chat functionality
- ✅ Admin login
- ✅ Create/Edit/Delete services
- ✅ View customer messages

---

## Step 5: Continuous Deployment

Now that you've connected GitHub to Vercel:

### 5.1 How It Works
- Every time you push to `main` branch on GitHub, Vercel automatically deploys
- Push changes: `git push origin main`
- Vercel detects changes and redeploys automatically
- Check deployment status at https://vercel.com/dashboard

### 5.2 Make Updates Locally
```bash
# Make changes to your code
# Example: Edit a service name or add a new feature

git add .
git commit -m "Update: Add new service or feature"
git push origin main

# Wait 1-2 minutes for Vercel to deploy automatically
```

---

## Step 6: Custom Domain (Optional)

### 6.1 Add Custom Domain in Vercel
1. Go to https://vercel.com/dashboard
2. Select your `future-plumbing` project
3. Click **Settings** → **Domains**
4. Add your custom domain (e.g., `futureplumbing.com`)
5. Follow DNS configuration instructions

---

## Troubleshooting

### Build Fails
- Check Vercel build logs: Dashboard → Project → Deployments → Failed deployment
- Ensure `backend/server.js` is the correct entry point
- Check that all dependencies are listed in `backend/package.json`

### Static Files Not Loading
- Verify frontend files are in `frontend/` directory
- Check `vercel.json` routes configuration
- Clear Vercel cache: Re-deploy with force flag

### Database/File Issues
- Note: Uploaded files to `backend/uploads/` won't persist in Vercel
- Solutions: Use cloud storage (AWS S3, Cloudinary) or database (MongoDB)

### Admin Login Not Working
- Verify environment variables are set in Vercel dashboard if needed
- Check that login credentials match `server.js` configuration

---

## Files Needed for Deployment

✅ **Already Created:**
- `package.json` - Root package with dependencies
- `vercel.json` - Vercel routing and build configuration
- `.gitignore` - Excludes unnecessary files from Git
- `backend/package.json` - Backend dependencies
- `DEPLOYMENT.md` - This file

✅ **Project Files:**
- `backend/server.js` - Main API server
- `backend/admin/` - Admin dashboard files
- `backend/data/` - JSON data files
- `frontend/` - Frontend HTML/CSS/JS files

---

## Quick Reference Commands

```bash
# Clone your repository
git clone https://github.com/YOUR_USERNAME/future-plumbing.git

# Check git status
git status

# Stage changes
git add .

# Commit changes
git commit -m "Your message"

# Push to GitHub (auto-deploys to Vercel)
git push origin main

# View deployment logs
# Go to Vercel dashboard and click on a deployment
```

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **GitHub Docs**: https://docs.github.com
- **Express.js Docs**: https://expressjs.com

---

## Next Steps (Recommended)

1. **Database** - Consider moving from JSON files to MongoDB/PostgreSQL
2. **Cloud Storage** - Use S3 or Cloudinary for image uploads
3. **Security** - Add rate limiting, input validation, HTTPS-only
4. **Email** - Integrate Sendgrid or Mailgun for notifications
5. **Analytics** - Add Google Analytics or Vercel Analytics

---

**Last Updated**: December 13, 2025  
**Version**: 1.0.0
