#!/bin/bash

# Deploy Lambda function for welcome emails
echo "Deploying Welcome Email Lambda Function..."

# Install dependencies
npm install

# Create deployment package
zip -r welcome-email-function.zip . -x "*.sh" "*.md"

# Create Lambda function
aws lambda create-function \
  --function-name welcome-email-sender \
  --runtime nodejs18.x \
  --role arn:aws:iam::428635020147:role/lambda-execution-role \
  --handler welcome-email-function.handler \
  --zip-file fileb://welcome-email-function.zip \
  --timeout 30 \
  --memory-size 256 \
  --region ap-south-1

echo "Lambda function deployed successfully!"
echo "Function Name: welcome-email-sender"
echo "Region: ap-south-1"
echo ""
echo "Note: Update YOUR_ACCOUNT_ID in the role ARN before running this script"