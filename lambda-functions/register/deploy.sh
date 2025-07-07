#!/bin/bash

# Create deployment package
zip -r register-lambda-updated.zip index.js package.json node_modules/

# Update Lambda function
aws lambda update-function-code \
  --function-name learntechlab-register \
  --zip-file fileb://register-lambda-updated.zip \
  --region ap-south-1

echo "Lambda function updated successfully!"