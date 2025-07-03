# GitHub Authentication Setup

## 🔐 Authentication Options

### Option 1: Personal Access Token (Recommended)

1. **Generate Token:**
   - Go to GitHub → Settings → Developer settings → Personal access tokens
   - Click "Generate new token (classic)"
   - Select scopes: `repo`, `workflow`
   - Copy the generated token

2. **Push with Token:**
   ```bash
   git push https://YOUR_TOKEN@github.com/Bijithtechlab/learntech-devops.git main
   ```

### Option 2: GitHub CLI (Easiest)

1. **Install GitHub CLI:**
   ```bash
   brew install gh
   ```

2. **Authenticate:**
   ```bash
   gh auth login
   ```

3. **Push:**
   ```bash
   git push -u origin main
   ```

### Option 3: SSH Key

1. **Generate SSH Key:**
   ```bash
   ssh-keygen -t ed25519 -C "your-email@example.com"
   ```

2. **Add to GitHub:**
   - Copy public key: `cat ~/.ssh/id_ed25519.pub`
   - Add to GitHub → Settings → SSH Keys

3. **Change remote URL:**
   ```bash
   git remote set-url origin git@github.com:Bijithtechlab/learntech-devops.git
   git push -u origin main
   ```

## ✅ Quick Fix

Try this command with your GitHub username and password/token:
```bash
git push https://Bijithtechlab@github.com/Bijithtechlab/learntech-devops.git main
```