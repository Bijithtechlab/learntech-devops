#!/bin/bash

# Create student-progress DynamoDB table
aws dynamodb create-table \
    --table-name student-progress \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --region ap-south-1

echo "student-progress table creation initiated..."