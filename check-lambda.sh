#!/bin/bash

echo "Checking Lambda function status..."

# Check if function exists
aws lambda get-function --function-name welcome-email-sender --region ap-south-1

echo ""
echo "Checking Lambda function logs..."

# Get recent logs
aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/welcome-email-sender" --region ap-south-1