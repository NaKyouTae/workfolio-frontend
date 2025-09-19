import { NextRequest, NextResponse } from 'next/server';
import { getCookie } from '@/utils/cookie';
import { apiFetchHandler } from '@/utils/ApiFetchHandler';
import HttpMethod from '@/enums/HttpMethod';
import { SalaryResponse } from '@/generated/salary';

// POST /api/workers/degrees - 학위 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const accessToken = await getCookie('accessToken');
      
      // accessToken이 없으면 401 응답 반환
      if (!accessToken) {
          return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
      }
    
    const res = await apiFetchHandler<SalaryResponse>(
      'http://localhost:8080/api/workers/salaries', 
      HttpMethod.POST, 
      body, 
      accessToken,
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating salary:', error);
    return NextResponse.json({ error: 'Failed to create salary' }, { status: 500 });
  }
}

// PUT /api/workers/degrees - 학위 수정
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    const accessToken = await getCookie('accessToken');
      
        // accessToken이 없으면 401 응답 반환
      if (!accessToken) {
          return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
      }
    
    const res = await apiFetchHandler<SalaryResponse>(
      'http://localhost:8080/api/workers/salaries', 
      HttpMethod.PUT, 
      body, 
      accessToken,
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating salary:', error);
    return NextResponse.json({ error: 'Failed to update salary' }, { status: 500 });
  }
}
