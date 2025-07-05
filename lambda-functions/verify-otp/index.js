const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: 'ap-south-1' });
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  try {
    const { email, otp } = JSON.parse(event.body);
    
    if (!email || !otp) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          message: 'Email and OTP are required'
        })
      };
    }

    // Get OTP from DynamoDB
    const getCommand = new GetCommand({
      TableName: 'email-otps',
      Key: { email }
    });

    const result = await docClient.send(getCommand);
    
    if (!result.Item) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          message: 'OTP not found or expired'
        })
      };
    }

    // Check if OTP is expired
    if (new Date() > new Date(result.Item.expiresAt)) {
      // Delete expired OTP
      await docClient.send(new DeleteCommand({
        TableName: 'email-otps',
        Key: { email }
      }));

      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          message: 'OTP has expired'
        })
      };
    }

    // Verify OTP
    if (result.Item.otp !== otp) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          message: 'Invalid OTP'
        })
      };
    }

    // Delete used OTP
    await docClient.send(new DeleteCommand({
      TableName: 'email-otps',
      Key: { email }
    }));

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        message: 'OTP verified successfully'
      })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        message: 'Failed to verify OTP',
        error: error.message
      })
    };
  }
};