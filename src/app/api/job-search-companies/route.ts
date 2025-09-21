import { NextRequest, NextResponse } from 'next/server';
import HttpMethod from '@/enums/HttpMethod';
import { getCookie } from '@/utils/cookie';
import { apiFetchHandler } from '@/utils/ApiFetchHandler';
import { 
  JobSearchCompanyCreateRequest,
  JobSearchCompanyListResponse, 
  JobSearchCompanyResponse, 
  JobSearchCompanyUpdateRequest,
} from '@/generated/job_search_company';

// GET /api/workers/job-search-companies - 구직 회사 목록 조회
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobSearchId = searchParams.get('jobSearchId');
  
  try {
    const accessToken = await getCookie('accessToken');
      
    // accessToken이 없으면 401 응답 반환
    if (!accessToken) {
        return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
    }
    
    const res = await apiFetchHandler<JobSearchCompanyListResponse>(
      `http://localhost:8080/api/job-search-companies?jobSearchId=${jobSearchId}`, 
      HttpMethod.GET, 
      null, 
      accessToken,
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching job search companies:', error);
    return NextResponse.json({ error: 'Failed to fetch job search companies' }, { status: 500 });
  }
}

// POST /api/workers/job-search-companies - 구직 회사 생성
export async function POST(request: NextRequest) {
  try {
    const body: JobSearchCompanyCreateRequest = await request.json();

    const accessToken = await getCookie('accessToken');
      
    // accessToken이 없으면 401 응답 반환
    if (!accessToken) {
        return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
    }
  
    const res = await apiFetchHandler<JobSearchCompanyResponse>(
      `http://localhost:8080/api/job-search-companies`, 
      HttpMethod.POST, 
      body, 
      accessToken,
    );

    const data = await res.json();

    console.log('data', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating job search company:', error);
    return NextResponse.json({ error: 'Failed to create job search company' }, { status: 500 });
  }
}

// PUT /api/workers/job-search-companies - 구직 회사 수정
export async function PUT(request: NextRequest) {
  try {
    const body: JobSearchCompanyUpdateRequest = await request.json();

    const accessToken = await getCookie('accessToken');
      
    // accessToken이 없으면 401 응답 반환
    if (!accessToken) {
        return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
    }
  
    const res = await apiFetchHandler<JobSearchCompanyResponse>(
      `http://localhost:8080/api/job-search-companies`, 
      HttpMethod.PUT, 
      body, 
      accessToken,
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating job search company:', error);
    return NextResponse.json({ error: 'Failed to update job search company' }, { status: 500 });
  }
}
