# OAuth Setup Instructions

## ✅ Already Done
1. Code pushed to GitHub with NextAuth.js
2. GitHub Actions workflow created

## ⚠️ Manual Step Required: Add Cloudflare API Token

Since I couldn't access your Cloudflare account, you need to do this manually:

### Step 1: Create Cloudflare API Token
1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Click "Create Custom Token"
3. Configure:
   - **Name**: `image-background-remover-deploy`
   - **Permissions**: 
     - Account: None
     - Zone: None  
     - **Cloudflare Pages**: Edit
4. Create and copy the token

### Step 2: Add Secrets to GitHub
Run these commands in your terminal:
```bash
# Replace YOUR_TOKEN with the Cloudflare token you just created
gh secret set CLOUDFLARE_API_TOKEN --body "YOUR_TOKEN"
```

### Step 3: Trigger Deployment
The GitHub Actions workflow will automatically run when secrets are set.

## Alternative: Manual Cloudflare Deployment
If you prefer, you can manually configure in Cloudflare Dashboard:
1. Go to your Pages project settings
2. Add environment variables:
   - `GOOGLE_CLIENT_ID`: `1024747233980-560unb1goh7tiilpj24laq5tg54lv3c3.apps.googleusercontent.com`
   - `GOOGLE_CLIENT_SECRET`: `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`
   - `NEXTAUTH_SECRET`: `2EZcifCvzK+6cY5hP+pdZ23MH2axuK7BJOlkQIzIfSM=`
   - `NEXTAUTH_URL`: `https://imagebackgroundremover.art`
3. Redeploy
