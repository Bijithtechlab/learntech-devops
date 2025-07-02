#!/bin/bash

# Deploy DynamoDB table to Mumbai region
aws cloudformation deploy \
  --template-file cloudformation.yaml \
  --stack-name course-registration-stack \
  --region ap-south-1 \
  --capabilities CAPABILITY_IAM

echo "DynamoDB table deployed successfully in Mumbai region!"
echo "Table Name: course-registrations"
echo "Region: ap-south-1"