import { NextRequest, NextResponse } from 'next/server';
import { getCookie } from '@/utils/cookie';
import { apiFetchHandler } from '@/utils/ApiFetchHandler';
import { EducationListResponse, EducationResponse } from '@/generated/education';
import HttpMethod from '@/enums/HttpMethod';

// GET /api/workers/educations - 교육 목록 조회
export async function GET() {
  try {
    const accessToken = await getCookie('accessToken');
      
      // accessToken이 없으면 401 응답 반환
      if (!accessToken) {
          return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
      }
    
    const res = await apiFetchHandler<EducationListResponse>(
      'http://localhost:8080/api/workers/educations', 
      HttpMethod.GET, 
      null, 
      accessToken,
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching educations:', error);
    return NextResponse.json({ error: 'Failed to fetch educations' }, { status: 500 });
  }
}

// POST /api/workers/educations - 교육 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: 실제 데이터베이스에 교육 생성
    const accessToken = await getCookie('accessToken');
      
      // accessToken이 없으면 401 응답 반환
      if (!accessToken) {
          return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
      }
    
    const res = await apiFetchHandler<EducationResponse>(
      'http://localhost:8080/api/workers/educations', 
      HttpMethod.POST, 
      body, 
      accessToken,
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating education:', error);
    return NextResponse.json({ error: 'Failed to create education' }, { status: 500 });
  }
}

// PUT /api/workers/educations - 교육 수정
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: 실제 데이터베이스에서 교육 수정
    const accessToken = await getCookie('accessToken');
      
      // accessToken이 없으면 401 응답 반환
      if (!accessToken) {
          return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
      }
    
      const res = await apiFetchHandler<EducationResponse>(
      'http://localhost:8080/api/workers/educations', 
      HttpMethod.PUT, 
      body, 
      accessToken,
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating education:', error);
    return NextResponse.json({ error: 'Failed to update education' }, { status: 500 });
  }
}
