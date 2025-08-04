import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb'

const dynamoClient = new DynamoDBClient({ region: 'ap-south-1' })
const docClient = DynamoDBDocumentClient.from(dynamoClient)

export async function GET(request: NextRequest, { params }: { params: { quizId: string } }) {
  try {
    const command = new GetCommand({
      TableName: 'course-materials',
      Key: { id: params.quizId }
    })

    const result = await docClient.send(command)
    
    if (!result.Item || result.Item.type !== 'quiz') {
      return NextResponse.json({ success: false, message: 'Quiz not found' }, { status: 404 })
    }

    // Format the quiz data for frontend consumption
    const formattedQuiz = {
      id: result.Item.id,
      title: result.Item.title,
      description: result.Item.description,
      timeLimit: result.Item.timeLimit,
      passingScore: result.Item.passingScore,
      maxAttempts: result.Item.maxAttempts,
      randomizeQuestions: result.Item.randomizeQuestions,
      questions: result.Item.questions || [],
      totalPoints: result.Item.totalPoints
    }

    return NextResponse.json({ success: true, quiz: formattedQuiz })
  } catch (error) {
    console.error('Error fetching quiz:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch quiz' },
      { status: 500 }
    )
  }
}