import { NextRequest, NextResponse } from 'next/server';
import HttpMethod from '@/enums/HttpMethod';
import { getCookie } from '@/utils/cookie';
import { apiFetchHandler } from '@/utils/ApiFetchHandler';
import { InterviewCreateRequest, InterviewListResponse, InterviewResponse, InterviewUpdateRequest } from '@/generated/interview';

// GET /api/workers/job-search-companies - 이직 회사 목록 조회
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobSearchCompanyId = searchParams.get('jobSearchCompanyId');
  try {
    const accessToken = await getCookie('accessToken');
      
    // accessToken이 없으면 401 응답 반환
    if (!accessToken) {
        return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
    }
    
    const res = await apiFetchHandler<InterviewListResponse>(
      `http://localhost:8080/api/interviews?jobSearchCompanyId=${jobSearchCompanyId}`, 
      HttpMethod.GET, 
      null, 
      accessToken,
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching interviews:', error);
    return NextResponse.json({ error: 'Failed to fetch interviews' }, { status: 500 });
  }
}

// POST /api/workers/job-search-companies - 이직 회사 생성
export async function POST(request: NextRequest) {
  try {
    const body: InterviewCreateRequest = await request.json();
    const accessToken = await getCookie('accessToken');
      
    // accessToken이 없으면 401 응답 반환
    if (!accessToken) {
        return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
    }

    console.log('body', body);
  
    const res = await apiFetchHandler<InterviewResponse>(
      `http://localhost:8080/api/interviews`, 
      HttpMethod.POST, 
      body, 
      accessToken,
    );

    const data = await res.json();

    console.log('data', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating interview:', error);
    return NextResponse.json({ error: 'Failed to create interview' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: InterviewUpdateRequest = await request.json();

    const accessToken = await getCookie('accessToken');
      
    // accessToken이 없으면 401 응답 반환
    if (!accessToken) {
        return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
    }
  
    const res = await apiFetchHandler<InterviewResponse>(
      `http://localhost:8080/api/interviews`, 
      HttpMethod.PUT, 
      body, 
      accessToken,
    );

    const data = await res.json();

    console.log('data', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating interview:', error);
    return NextResponse.json({ error: 'Failed to update interview' }, { status: 500 });
  }
}
