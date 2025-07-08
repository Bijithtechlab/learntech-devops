#!/bin/bash

REGION="ap-south-1"

echo "Creating DynamoDB tables for dynamic course materials..."

# Create course-materials table
echo "Creating course-materials table..."
aws dynamodb create-table \
    --table-name course-materials \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
        AttributeName=courseId,AttributeType=S \
        AttributeName=sectionId,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --global-secondary-indexes \
        'IndexName=course-section-index,KeySchema=[{AttributeName=courseId,KeyType=HASH},{AttributeName=sectionId,KeyType=RANGE}],Projection={ProjectionType=ALL}' \
    --billing-mode PAY_PER_REQUEST \
    --region $REGION

# Create quiz-questions table
echo "Creating quiz-questions table..."
aws dynamodb create-table \
    --table-name quiz-questions \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
        AttributeName=quizId,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --global-secondary-indexes \
        'IndexName=quiz-index,KeySchema=[{AttributeName=quizId,KeyType=HASH}],Projection={ProjectionType=ALL}' \
    --billing-mode PAY_PER_REQUEST \
    --region $REGION

echo "Waiting for tables to be created..."
sleep 15

echo "Course materials tables created successfully!"
aws dynamodb list-tables --region $REGION --query 'TableNames[?contains(@, `course`) || contains(@, `quiz`)]' --output table