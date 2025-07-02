require('dotenv').config({ path: '.env.local' })
const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb')

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-south-1'
})

async function createTable() {
  const params = {
    TableName: 'course-registrations',
    BillingMode: 'PAY_PER_REQUEST',
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'S'
      },
      {
        AttributeName: 'email',
        AttributeType: 'S'
      }
    ],
    KeySchema: [
      {
        AttributeName: 'id',
        KeyType: 'HASH'
      }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'email-index',
        KeySchema: [
          {
            AttributeName: 'email',
            KeyType: 'HASH'
          }
        ],
        Projection: {
          ProjectionType: 'ALL'
        }
      }
    ]
  }

  try {
    const result = await client.send(new CreateTableCommand(params))
    console.log('Table created successfully:', result.TableDescription.TableName)
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log('Table already exists')
    } else {
      console.error('Error creating table:', error)
    }
  }
}

createTable()