# AWS Amplify Deployment Guide

## 🚀 Quick Deployment Steps

### 1. **Push Code to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. **Create Amplify App**
- Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
- Click "Create new app" → "Host web app"
- Select "GitHub" as source
- Authorize AWS Amplify to access your repository
- Select your repository and branch (main/master)

### 3. **Configure Build Settings**
- Amplify will auto-detect Next.js
- Build settings will use `amplify.yml` file
- Click "Next" → "Save and deploy"

### 4. **Add Environment Variables**
In Amplify Console → App Settings → Environment Variables:
```
AWS_REGION=ap-south-1
DYNAMODB_TABLE_NAME=course-registrations
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
```

### 5. **Custom Domain Setup**
1. **In Amplify Console:**
   - Go to "Domain management"
   - Click "Add domain"
   - Enter: `learntechlab.com`
   - Add subdomains: `www.learntechlab.com`

2. **DNS Configuration:**
   - Amplify will provide DNS records
   - Add these records to your domain registrar:
   
   ```
   Type: CNAME
   Name: www
   Value: [provided by Amplify]
   
   Type: ANAME/ALIAS
   Name: @
   Value: [provided by Amplify]
   ```

### 6. **SSL Certificate**
- Amplify automatically provisions SSL certificate
- HTTPS will be enabled for learntechlab.com

## 🔧 Post-Deployment Configuration

### Update Email URLs
After deployment, update email templates to use production URL:
- Change `http://localhost:3000/student` to `https://learntechlab.com/student`

### SES Domain Verification
For production emails from `info@learntechlab.com`:
1. Verify domain in SES
2. Add DNS records for domain verification
3. Configure DKIM and SPF records

## 📊 Monitoring
- **Amplify Console**: Build logs and deployment status
- **CloudWatch**: Application logs and metrics
- **SES Console**: Email delivery statistics

## 🎯 Expected Results
- **Live URL**: https://learntechlab.com
- **Auto-deployment**: Every git push triggers new deployment
- **SSL**: Automatic HTTPS with valid certificate
- **CDN**: Global content delivery via CloudFront

## 💰 Cost Estimation
- **Amplify Hosting**: ~$15-30/month
- **Data Transfer**: ~$5-10/month
- **Total**: ~$20-40/month for typical usage

Your application will be live at https://learntechlab.com within 10-15 minutes!