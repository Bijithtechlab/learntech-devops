#!/bin/bash

echo "Creating IAM role for Lambda execution..."

# Create the IAM role
aws iam create-role \
  --role-name lambda-execution-role \
  --assume-role-policy-document file://lambda-trust-policy.json \
  --region ap-south-1

# Attach custom policy
aws iam put-role-policy \
  --role-name lambda-execution-role \
  --policy-name lambda-permissions \
  --policy-document file://iam-policy.json \
  --region ap-south-1

# Attach basic Lambda execution policy
aws iam attach-role-policy \
  --role-name lambda-execution-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole \
  --region ap-south-1

echo "IAM role created successfully!"
echo "Role Name: lambda-execution-role"
echo "Permissions: SES, DynamoDB, CloudWatch"