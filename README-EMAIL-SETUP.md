# Welcome Email Setup Guide

## 🚀 Implementation Overview

When an admin changes a student's payment status to "Completed", the system automatically:
1. Generates secure student credentials
2. Creates user account in DynamoDB
3. Sends professional welcome email with portal access

## 📧 Setup Steps

### 1. Amazon SES Setup
```bash
cd aws
./ses-setup.sh
```
- Verify sender email: info@learntechlab.com
- Check email for verification link
- Click verification link to activate

### 2. Lambda Function Deployment
```bash
cd lambda
./deploy-lambda.sh
```
- Update YOUR_ACCOUNT_ID in script before running
- Creates welcome-email-sender function
- Handles email generation and sending

### 3. IAM Role Creation
Create Lambda execution role with permissions from `aws/iam-policy.json`:
- SES email sending permissions
- DynamoDB read/write access
- CloudWatch logging permissions

## 🔧 Email Features

### Professional Email Template
- **Company branding** with LearnTechLab colors
- **Student portal credentials** (email + auto-generated password)
- **Course overview** and next steps
- **Trainer introduction** (Vinod Kumar & Bijith)
- **Support contact** information

### Security Features
- **Auto-generated passwords** (12-character secure)
- **Unique credentials** per student
- **Immediate account creation** in users table

## 📊 Integration Flow

1. **Admin Action**: Changes payment status to "Completed"
2. **API Call**: Triggers `/api/send-welcome-email`
3. **Lambda Invoke**: Calls welcome-email-sender function
4. **Account Creation**: Stores credentials in users table
5. **Email Delivery**: Sends welcome email via SES
6. **Student Access**: Student can immediately login to portal

## 🎯 Production Considerations

### SES Sandbox Mode
- Initially limited to verified email addresses
- Request production access through AWS Support
- Allows sending to any email address

### Cost Estimation
- **SES**: $0.10 per 1,000 emails
- **Lambda**: $0.20 per 1M requests
- **DynamoDB**: Pay-per-request pricing
- **Total**: ~$1-5/month for typical usage

## ✅ Testing

1. Register a test student
2. Admin marks payment as "Completed"
3. Check email delivery
4. Verify student can login with provided credentials
5. Confirm portal access works

## 🔍 Monitoring

- **CloudWatch Logs**: Lambda function execution logs
- **SES Metrics**: Email delivery statistics
- **DynamoDB Metrics**: Account creation success rates

The system is now ready to automatically welcome students with professional onboarding emails!