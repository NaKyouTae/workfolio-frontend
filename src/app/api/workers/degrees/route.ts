import { getCookie } from '@/utils/cookie';
import { NextRequest, NextResponse } from 'next/server';
import { apiFetchHandler } from '@/utils/ApiFetchHandler';
import { DegreesListResponse } from '@/generated/degrees';
import { SuccessResponse } from '@/generated/common';
import HttpMethod from '@/enums/HttpMethod';

// GET /api/workers/degrees - 학위 목록 조회
export async function GET() {
  try {
    const accessToken = await getCookie('accessToken');
      
      // accessToken이 없으면 401 응답 반환
      if (!accessToken) {
          return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
      }
    
    const res = await apiFetchHandler<DegreesListResponse>(
      'http://localhost:8080/api/workers/degrees', 
      HttpMethod.GET, 
      null, 
      accessToken,
    );

    return NextResponse.json({ success: true, data: res.json() });
  } catch (error) {
    console.error('Error fetching degrees:', error);
    return NextResponse.json({ error: 'Failed to fetch degrees' }, { status: 500 });
  }
}

// POST /api/workers/degrees - 학위 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const accessToken = await getCookie('accessToken');
      
      // accessToken이 없으면 401 응답 반환
      if (!accessToken) {
          return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
      }
    
    const res = await apiFetchHandler<SuccessResponse>(
      'http://localhost:8080/api/workers/degrees', 
      HttpMethod.POST, 
      body, 
      accessToken,
    );

    return NextResponse.json({ success: true, data: res.json() });
  } catch (error) {
    console.error('Error creating degree:', error);
    return NextResponse.json({ error: 'Failed to create degree' }, { status: 500 });
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
    
    const res = await apiFetchHandler<SuccessResponse>(
      'http://localhost:8080/api/workers/degrees', 
      HttpMethod.PUT, 
      body, 
      accessToken,
    );

    return NextResponse.json({ success: true, data: res.json() });
  } catch (error) {
    console.error('Error updating degree:', error);
    return NextResponse.json({ error: 'Failed to update degree' }, { status: 500 });
  }
}

