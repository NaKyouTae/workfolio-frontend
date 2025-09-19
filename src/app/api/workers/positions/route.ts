import { NextRequest, NextResponse } from 'next/server';

// POST /api/workers/positions - 직책 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: 실제 데이터베이스에 직책 생성
    const newPosition = {
      id: Date.now(),
      ...body,
      createdAt: Date.now()
    };

    return NextResponse.json({ success: true, data: newPosition });
  } catch (error) {
    console.error('Error creating position:', error);
    return NextResponse.json({ error: 'Failed to create position' }, { status: 500 });
  }
}

// PUT /api/workers/positions - 직책 수정
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: 실제 데이터베이스에서 직책 수정
    const updatedPosition = {
      ...body,
      updatedAt: Date.now()
    };

    return NextResponse.json({ success: true, data: updatedPosition });
  } catch (error) {
    console.error('Error updating position:', error);
    return NextResponse.json({ error: 'Failed to update position' }, { status: 500 });
  }
}
