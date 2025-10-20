import { NextRequest, NextResponse } from 'next/server';
import HttpMethod from '@/enums/HttpMethod';
import { getCookie } from '@/utils/cookie';
import { apiFetchHandler } from '@/utils/ApiFetchHandler';
import { ResumeCreateRequest, ResumeListResponse, ResumeResponse, ResumeUpdateRequest } from '@/generated/resume';

// GET /api/workers/companies - 회사 목록 조회
export async function GET() {
  try {
    const accessToken = await getCookie('accessToken');
      
    // accessToken이 없으면 401 응답 반환
    if (!accessToken) {
        return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
    }
    
    const res = await apiFetchHandler<ResumeListResponse>(
      'http://localhost:8080/api/resumes', 
      HttpMethod.GET, 
      null, 
      accessToken,
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json({ error: 'Failed to fetch resumes' }, { status: 500 });
  }
}

// POST /api/workers/companies - 회사 생성
export async function POST(request: NextRequest) {
  try {
    const body: ResumeCreateRequest = await request.json();
    
    const accessToken = await getCookie('accessToken');
      
      // accessToken이 없으면 401 응답 반환
      if (!accessToken) {
          return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
      }
    
    const res = await apiFetchHandler<ResumeResponse>(
      'http://localhost:8080/api/resumes', 
      HttpMethod.POST, 
      body, 
      accessToken,
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating resume:', error);
    return NextResponse.json({ error: 'Failed to create resume' }, { status: 500 });
  }
}

// PUT /api/workers/companies - 회사 수정
export async function PUT(request: NextRequest) {
  try {
    const body: ResumeUpdateRequest = await request.json();
    
    const accessToken = await getCookie('accessToken');
      
      // accessToken이 없으면 401 응답 반환
      if (!accessToken) {
          return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
      }
    
    const res = await apiFetchHandler<ResumeResponse>(
      'http://localhost:8080/api/resumes', 
      HttpMethod.PUT, 
      body, 
      accessToken,
    );
    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating resumes:', error);
    return NextResponse.json({ error: 'Failed to update resumes' }, { status: 500 });
  }
}
