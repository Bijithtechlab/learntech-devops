# AWS Setup for Course Registration

## Architecture Overview
```
Next.js App → API Gateway → Lambda → DynamoDB (Mumbai)
```

## Setup Steps

### 1. Install Dependencies
```bash
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
```

### 2. Configure AWS Credentials
```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Default region: ap-south-1
# Default output format: json
```

### 3. Deploy DynamoDB Table
```bash
cd aws
./deploy.sh
```

### 4. Update Environment Variables
Update `.env.local` with your actual AWS credentials:
```
AWS_REGION=ap-south-1
DYNAMODB_TABLE_NAME=course-registrations
AWS_ACCESS_KEY_ID=your-actual-access-key
AWS_SECRET_ACCESS_KEY=your-actual-secret-key
```

### 5. Test Locally
```bash
npm run dev
```

## DynamoDB Table Schema
- **Primary Key**: `id` (String) - UUID
- **GSI**: `email-index` for duplicate email checks
- **Attributes**:
  - firstName, lastName, email, phone (required)
  - education (required)
  - experience, motivation, referredBy, collegeName (optional)
  - createdAt, status

## Cost Estimation
- **DynamoDB**: ~₹75-225/month for 1000 registrations
- **API Gateway**: ~₹30/month for 10,000 requests
- **Lambda**: Free tier covers most usage

## Performance
- **Latency**: 80-135ms for Indian users
- **Throughput**: 1000+ concurrent requests
- **Availability**: 99.99% SLA