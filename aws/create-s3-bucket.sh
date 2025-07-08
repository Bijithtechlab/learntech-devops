#!/bin/bash

REGION="ap-south-1"
BUCKET_NAME="learntechlab-course-materials"

echo "Creating S3 bucket for course materials..."

# Create S3 bucket
aws s3 mb s3://$BUCKET_NAME --region $REGION

# Set bucket policy for secure access
cat > bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowLambdaAccess",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::428635020147:role/LearnTechLabLambdaRole"
            },
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF

# Apply bucket policy
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json

# Enable versioning
aws s3api put-bucket-versioning --bucket $BUCKET_NAME --versioning-configuration Status=Enabled

echo "S3 bucket created successfully: $BUCKET_NAME"
rm bucket-policy.json