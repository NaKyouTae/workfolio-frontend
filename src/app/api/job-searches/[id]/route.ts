import { NextRequest, NextResponse } from 'next/server';
import HttpMethod from '@/enums/HttpMethod';
import { getCookie } from '@/utils/cookie';
import { apiFetchHandler } from '@/utils/ApiFetchHandler';
import { JobSearchResponse, JobSearchUpdateRequest } from '@/generated/job_search';

// PUT /api/workers/job-searches - 구직 수정
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body: JobSearchUpdateRequest = await request.json();
    const id = params.id;

    const accessToken = await getCookie('accessToken');
      
    // accessToken이 없으면 401 응답 반환
    if (!accessToken) {
        return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
    }
  
    const res = await apiFetchHandler<JobSearchResponse>(
      `http://localhost:8080/api/job-searches/${id}`, 
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
