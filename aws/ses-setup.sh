#!/bin/bash

# Setup Amazon SES for sending emails
echo "Setting up Amazon SES..."

# Verify sender email address (replace with your actual email)
SENDER_EMAIL="info@learntechlab.com"

# Verify the sender email address
aws ses verify-email-identity \
  --email-address $SENDER_EMAIL \
  --region ap-south-1

echo "Email verification request sent to: $SENDER_EMAIL"
echo "Please check your email and click the verification link."
echo ""
echo "Note: In production, you'll need to move out of SES sandbox mode"
echo "by requesting production access through AWS Support."