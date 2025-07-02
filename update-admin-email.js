require('dotenv').config({ path: '.env.local' })
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, ScanCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb')

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-south-1'
})
const docClient = DynamoDBDocumentClient.from(client)

async function updateAdminEmail() {
  try {
    // Find the admin user
    const scanCommand = new ScanCommand({
      TableName: 'users',
      FilterExpression: 'email = :oldEmail',
      ExpressionAttributeValues: {
        ':oldEmail': 'admin@learntech.com'
      }
    })

    const result = await docClient.send(scanCommand)
    const adminUser = result.Items?.[0]

    if (!adminUser) {
      console.log('Admin user not found')
      return
    }

    // Update the email
    const updateCommand = new UpdateCommand({
      TableName: 'users',
      Key: { id: adminUser.id },
      UpdateExpression: 'SET email = :newEmail',
      ExpressionAttributeValues: {
        ':newEmail': 'admin@learntechlab.com'
      }
    })

    await docClient.send(updateCommand)
    console.log('Admin email updated successfully:')
    console.log('New Email: admin@learntechlab.com')
    console.log('Password: admin123')
    console.log('Role: admin')
  } catch (error) {
    console.error('Error updating admin email:', error)
  }
}

updateAdminEmail()