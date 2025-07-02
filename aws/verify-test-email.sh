#!/bin/bash

# Verify test email address for SES sandbox mode
TEST_EMAIL="bijichnr@gmail.com"

echo "Verifying test email address: $TEST_EMAIL"

aws ses verify-email-identity \
  --email-address $TEST_EMAIL \
  --region ap-south-1

echo "Verification email sent to: $TEST_EMAIL"
echo "Please check your email and click the verification link."
echo ""
echo "Current verified emails:"
aws ses list-verified-email-addresses --region ap-south-1