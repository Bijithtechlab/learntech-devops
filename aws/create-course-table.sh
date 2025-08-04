#!/bin/bash

# Create learntechCourse DynamoDB table
aws dynamodb create-table \
    --table-name learntechCourse \
    --attribute-definitions \
        AttributeName=courseId,AttributeType=S \
    --key-schema \
        AttributeName=courseId,KeyType=HASH \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --region ap-south-1

echo "learntechCourse table creation initiated..."