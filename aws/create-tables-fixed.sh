#!/bin/bash

REGION="ap-south-1"

echo "Creating missing DynamoDB tables for Student Portal..."

# Create student-progress table
echo "Creating student-progress table..."
aws dynamodb create-table \
    --table-name student-progress \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
        AttributeName=email,AttributeType=S \
        AttributeName=materialId,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --global-secondary-indexes \
        'IndexName=email-material-index,KeySchema=[{AttributeName=email,KeyType=HASH},{AttributeName=materialId,KeyType=RANGE}],Projection={ProjectionType=ALL}' \
    --billing-mode PAY_PER_REQUEST \
    --region $REGION

# Create quiz-attempts table
echo "Creating quiz-attempts table..."
aws dynamodb create-table \
    --table-name quiz-attempts \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
        AttributeName=email,AttributeType=S \
        AttributeName=quizId,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --global-secondary-indexes \
        'IndexName=email-quiz-index,KeySchema=[{AttributeName=email,KeyType=HASH},{AttributeName=quizId,KeyType=RANGE}],Projection={ProjectionType=ALL}' \
    --billing-mode PAY_PER_REQUEST \
    --region $REGION

echo "Waiting for tables to be created..."
sleep 15

# List all tables
echo "Current DynamoDB tables:"
aws dynamodb list-tables --region $REGION --output table

echo "Student Portal tables created successfully!"