#!/bin/bash

# Deploy Student Portal DynamoDB Tables
echo "Deploying Student Portal DynamoDB Tables..."

STACK_NAME="learntechlab-infrastructure"
REGION="ap-south-1"

# Check if stack exists
if aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION >/dev/null 2>&1; then
    echo "Stack exists. Updating..."
    aws cloudformation update-stack \
        --stack-name $STACK_NAME \
        --template-body file://cloudformation.yaml \
        --region $REGION \
        --capabilities CAPABILITY_IAM
    
    echo "Waiting for stack update to complete..."
    aws cloudformation wait stack-update-complete \
        --stack-name $STACK_NAME \
        --region $REGION
else
    echo "Stack does not exist. Creating..."
    aws cloudformation create-stack \
        --stack-name $STACK_NAME \
        --template-body file://cloudformation.yaml \
        --region $REGION \
        --capabilities CAPABILITY_IAM
    
    echo "Waiting for stack creation to complete..."
    aws cloudformation wait stack-create-complete \
        --stack-name $STACK_NAME \
        --region $REGION
fi

echo "Deployment completed!"

# List the created tables
echo "Created DynamoDB Tables:"
aws dynamodb list-tables --region $REGION --query 'TableNames[?contains(@, `course`) || contains(@, `student`) || contains(@, `quiz`)]' --output table