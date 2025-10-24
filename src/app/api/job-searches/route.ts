import { NextRequest, NextResponse } from 'next/server';
import HttpMethod from '@/enums/HttpMethod';
import { getCookie } from '@/utils/cookie';
import { apiFetchHandler } from '@/utils/ApiFetchHandler';  
import { JobSearchListResponse, JobSearchUpdateRequest } from '@/generated/job_search';
import { JobSearchCreateRequest } from '@/generated/job_search';
import { JobSearchResponse } from '@/generated/job_search';

// GET /api/job-searches - 이직 목록 조회
export async function GET() {
  try {
    const accessToken = await getCookie('accessToken');
    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
    }
    
    const res = await apiFetchHandler<JobSearchListResponse>(
      'http://localhost:8080/api/job-searches',
      HttpMethod.GET,
      null,
      accessToken,
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching job searches:', error);
    return NextResponse.json({ error: 'Failed to fetch job searches' }, { status: 500 });
  }
}

// POST /api/job-searches - 이직 생성
export async function POST(request: NextRequest) {
  try {
    const body: JobSearchCreateRequest = await request.json();
    const accessToken = await getCookie('accessToken');
    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
    }
    
    const res = await apiFetchHandler<JobSearchResponse>(
      'http://localhost:8080/api/job-searches',
      HttpMethod.POST,
      body,
      accessToken,
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating job search:', error);
    return NextResponse.json({ error: 'Failed to create job search' }, { status: 500 });
  }
}

// PUT /api/workers/job-searches - 이직 수정
export async function PUT(request: NextRequest) {
  try {
    const body: JobSearchUpdateRequest = await request.json();

    const accessToken = await getCookie('accessToken');
      
    // accessToken이 없으면 401 응답 반환
    if (!accessToken) {
        return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
    }
  
    const res = await apiFetchHandler<JobSearchResponse>(
      `http://localhost:8080/api/job-searches`, 
      HttpMethod.PUT, 
      body, 
      accessToken,
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating job search:', error);
    return NextResponse.json({ error: 'Failed to update job search' }, { status: 500 });
  }
}
