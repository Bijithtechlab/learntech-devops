#!/bin/bash

# Fix CORS for API Gateway
# This script enables CORS for the registration API

API_ID="qgeusz2rj7"
REGION="ap-south-1"
RESOURCE_PATH="/register"

echo "Fixing CORS for API Gateway..."

# Get the API Gateway resource ID
RESOURCE_ID=$(aws apigateway get-resources --rest-api-id $API_ID --region $REGION --query "items[?path=='$RESOURCE_PATH'].id" --output text)

if [ -z "$RESOURCE_ID" ]; then
    echo "Error: Could not find resource with path $RESOURCE_PATH"
    exit 1
fi

echo "Found resource ID: $RESOURCE_ID"

# Create OPTIONS method if it doesn't exist
echo "Creating OPTIONS method..."
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $RESOURCE_ID \
    --http-method OPTIONS \
    --authorization-type NONE \
    --region $REGION \
    --no-api-key-required 2>/dev/null || echo "OPTIONS method already exists"

# Set up OPTIONS method integration
echo "Setting up OPTIONS integration..."
aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $RESOURCE_ID \
    --http-method OPTIONS \
    --type MOCK \
    --integration-http-method OPTIONS \
    --request-templates '{"application/json": "{\"statusCode\": 200}"}' \
    --region $REGION 2>/dev/null || echo "OPTIONS integration already exists"

# Set up OPTIONS method response
echo "Setting up OPTIONS method response..."
aws apigateway put-method-response \
    --rest-api-id $API_ID \
    --resource-id $RESOURCE_ID \
    --http-method OPTIONS \
    --status-code 200 \
    --response-parameters method.response.header.Access-Control-Allow-Headers=false,method.response.header.Access-Control-Allow-Methods=false,method.response.header.Access-Control-Allow-Origin=false \
    --region $REGION 2>/dev/null || echo "OPTIONS method response already exists"

# Set up OPTIONS integration response
echo "Setting up OPTIONS integration response..."
aws apigateway put-integration-response \
    --rest-api-id $API_ID \
    --resource-id $RESOURCE_ID \
    --http-method OPTIONS \
    --status-code 200 \
    --response-parameters '{"method.response.header.Access-Control-Allow-Headers": "'"'"'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"'"'", "method.response.header.Access-Control-Allow-Methods": "'"'"'GET,POST,OPTIONS'"'"'", "method.response.header.Access-Control-Allow-Origin": "'"'"'*'"'"'"}' \
    --region $REGION 2>/dev/null || echo "OPTIONS integration response already exists"

# Update GET method response to include CORS headers
echo "Updating GET method response..."
aws apigateway put-method-response \
    --rest-api-id $API_ID \
    --resource-id $RESOURCE_ID \
    --http-method GET \
    --status-code 200 \
    --response-parameters method.response.header.Access-Control-Allow-Origin=false \
    --region $REGION 2>/dev/null || echo "GET method response already configured"

# Update POST method response to include CORS headers
echo "Updating POST method response..."
aws apigateway put-method-response \
    --rest-api-id $API_ID \
    --resource-id $RESOURCE_ID \
    --http-method POST \
    --status-code 200 \
    --response-parameters method.response.header.Access-Control-Allow-Origin=false \
    --region $REGION 2>/dev/null || echo "POST method response already configured"

# Deploy the API
echo "Deploying API..."
aws apigateway create-deployment \
    --rest-api-id $API_ID \
    --stage-name prod \
    --region $REGION

echo "CORS configuration completed and API deployed!"
echo "Please wait a few minutes for the changes to take effect."