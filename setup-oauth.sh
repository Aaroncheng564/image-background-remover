#!/bin/bash
# OAuth Setup Script - Run this on your local machine

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo "Error: GitHub CLI (gh) is not installed"
    echo "Install from: https://cli.github.com/"
    exit 1
fi

# Check if gh is authenticated
gh auth status || { echo "Please run: gh auth login"; exit 1; }

echo "Setting up OAuth secrets..."

# Set Cloudflare API Token
echo "Enter your Cloudflare API Token (from https://dash.cloudflare.com/profile/api-tokens):"
read -s CF_TOKEN
echo ""

gh secret set CLOUDFLARE_API_TOKEN --body "$CF_TOKEN"

echo ""
echo "✓ All secrets configured!"
echo ""
echo "GitHub Actions will automatically deploy your site."
echo "Check progress at: https://github.com/Aaroncheng564/image-background-remover/actions"
