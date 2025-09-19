import { NextRequest, NextResponse } from 'next/server';

// POST /api/workers/salaries - 급여 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: 실제 데이터베이스에 급여 생성
    const newSalary = {
      id: Date.now(),
      ...body,
      createdAt: Date.now()
    };

    return NextResponse.json({ success: true, data: newSalary });
  } catch (error) {
    console.error('Error creating salary:', error);
    return NextResponse.json({ error: 'Failed to create salary' }, { status: 500 });
  }
}

// PUT /api/workers/salaries - 급여 수정
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: 실제 데이터베이스에서 급여 수정
    const updatedSalary = {
      ...body,
      updatedAt: Date.now()
    };

    return NextResponse.json({ success: true, data: updatedSalary });
  } catch (error) {
    console.error('Error updating salary:', error);
    return NextResponse.json({ error: 'Failed to update salary' }, { status: 500 });
  }
}
