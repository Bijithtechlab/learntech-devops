import { NextRequest, NextResponse } from 'next/server'

const LAMBDA_API_URL = 'https://qgeusz2rj7.execute-api.ap-south-1.amazonaws.com/prod/admin-materials'

// POST - Create material
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const materialData = JSON.parse(formData.get('materialData') as string)
    
    let fileContent = ''
    let fileName = ''
    
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer()
      fileContent = Buffer.from(arrayBuffer).toString('base64')
      fileName = file.name
    }

    const response = await fetch(LAMBDA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        materialData,
        fileContent,
        fileName
      })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Lambda function failed')
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error calling admin-materials Lambda:', error)
    return NextResponse.json({ success: false, message: 'Failed to create material', error: error.message }, { status: 500 })
  }
}

// DELETE - Remove material
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const materialId = searchParams.get('id')
    const s3Key = searchParams.get('s3Key')

    if (!materialId) {
      return NextResponse.json({ success: false, message: 'Material ID required' }, { status: 400 })
    }

    let url = `${LAMBDA_API_URL}?id=${encodeURIComponent(materialId)}`
    if (s3Key) {
      url += `&s3Key=${encodeURIComponent(s3Key)}`
    }

    const response = await fetch(url, {
      method: 'DELETE'
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Lambda function failed')
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error calling admin-materials Lambda:', error)
    return NextResponse.json({ success: false, message: 'Failed to delete material', error: error.message }, { status: 500 })
  }
}