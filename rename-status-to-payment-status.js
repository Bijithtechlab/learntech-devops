require('dotenv').config({ path: '.env.local' })
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, ScanCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb')

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-south-1'
})
const docClient = DynamoDBDocumentClient.from(client)

async function renameStatusToPaymentStatus() {
  try {
    // Scan all items in the table
    const scanCommand = new ScanCommand({
      TableName: 'course-registrations'
    })

    const result = await docClient.send(scanCommand)
    const items = result.Items || []

    console.log(`Found ${items.length} registrations to update`)

    // Rename status to PaymentStatus for each item
    for (const item of items) {
      if (item.status) {
        const updateCommand = new UpdateCommand({
          TableName: 'course-registrations',
          Key: { id: item.id },
          UpdateExpression: 'SET PaymentStatus = :status REMOVE #status',
          ExpressionAttributeNames: {
            '#status': 'status'
          },
          ExpressionAttributeValues: {
            ':status': item.status
          }
        })

        await docClient.send(updateCommand)
        console.log(`Renamed status to PaymentStatus for registration: ${item.id}`)
      }
    }

    console.log('Successfully renamed status attribute to PaymentStatus for all registrations')
  } catch (error) {
    console.error('Error renaming status attribute:', error)
  }
}

renameStatusToPaymentStatus()