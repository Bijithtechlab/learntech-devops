require('dotenv').config({ path: '.env.local' })
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb')
const { randomUUID } = require('crypto')

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-south-1'
})
const docClient = DynamoDBDocumentClient.from(client)

async function seedAdminUser() {
  const adminUser = {
    id: randomUUID(),
    email: 'admin@learntech.com',
    password: 'admin123', // In production, this should be hashed
    role: 'admin',
    name: 'Admin User',
    createdAt: new Date().toISOString()
  }

  try {
    const command = new PutCommand({
      TableName: 'users',
      Item: adminUser
    })

    await docClient.send(command)
    console.log('Admin user created successfully:')
    console.log('Email: admin@learntech.com')
    console.log('Password: admin123')
    console.log('Role: admin')
  } catch (error) {
    console.error('Error creating admin user:', error)
  }
}

seedAdminUser()