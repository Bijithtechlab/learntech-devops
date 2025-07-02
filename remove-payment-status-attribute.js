require('dotenv').config({ path: '.env.local' })
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, ScanCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb')

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-south-1'
})
const docClient = DynamoDBDocumentClient.from(client)

async function removePaymentStatusAttribute() {
  try {
    // Scan all items in the table
    const scanCommand = new ScanCommand({
      TableName: 'course-registrations'
    })

    const result = await docClient.send(scanCommand)
    const items = result.Items || []

    console.log(`Found ${items.length} registrations to update`)

    // Remove paymentStatus attribute from each item
    for (const item of items) {
      if (item.paymentStatus) {
        const updateCommand = new UpdateCommand({
          TableName: 'course-registrations',
          Key: { id: item.id },
          UpdateExpression: 'REMOVE paymentStatus'
        })

        await docClient.send(updateCommand)
        console.log(`Removed paymentStatus from registration: ${item.id}`)
      }
    }

    console.log('Successfully removed paymentStatus attribute from all registrations')
  } catch (error) {
    console.error('Error removing paymentStatus attribute:', error)
  }
}

removePaymentStatusAttribute()