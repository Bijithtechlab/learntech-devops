#!/bin/bash

echo "🚀 AWS Amplify Deployment Guide"
echo "================================"
echo ""

echo "📋 Prerequisites:"
echo "1. GitHub repository with your code"
echo "2. AWS CLI configured"
echo "3. Domain: learntechlab.com"
echo ""

echo "🔧 Step 1: Create Amplify App"
echo "aws amplify create-app --name learntechlab --region ap-south-1"
echo ""

echo "🔗 Step 2: Connect GitHub Repository"
echo "- Go to AWS Amplify Console"
echo "- Click 'Connect app'"
echo "- Select GitHub"
echo "- Choose your repository"
echo "- Select main/master branch"
echo ""

echo "⚙️ Step 3: Environment Variables (Add in Amplify Console)"
echo "AWS_REGION=ap-south-1"
echo "DYNAMODB_TABLE_NAME=course-registrations"
echo "AWS_ACCESS_KEY_ID=your-access-key"
echo "AWS_SECRET_ACCESS_KEY=your-secret-key"
echo ""

echo "🌐 Step 4: Custom Domain Setup"
echo "- Go to Domain Management in Amplify"
echo "- Add domain: learntechlab.com"
echo "- Configure DNS records"
echo ""

echo "📝 DNS Records to add to your domain registrar:"
echo "Type: CNAME"
echo "Name: www"
echo "Value: [Amplify will provide this]"
echo ""
echo "Type: ANAME/ALIAS (or A record)"
echo "Name: @"
echo "Value: [Amplify will provide this]"
echo ""

echo "✅ Deployment will be automatic on every git push!"