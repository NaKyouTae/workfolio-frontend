import { NextRequest, NextResponse } from 'next/server';
import HttpMethod from '@/enums/HttpMethod';
import { getCookie } from '@/utils/cookie';
import { apiFetchHandler } from '@/utils/ApiFetchHandler';
import { 
  JobSearchCompanyResponse, 
  JobSearchCompanyUpsertRequest
} from '@/generated/job_search_company';

// PUT /api/workers/job-search-companies - 구직 회사 수정
export async function PUT(request: NextRequest, { params }: { params: Promise<{ jobSearchId: string, jobSearchCompanyId: string }> }) {
  try {
    const body: JobSearchCompanyUpsertRequest = await request.json();
    const resolvedParams = await params;
    const jobSearchId = resolvedParams.jobSearchId;
    const jobSearchCompanyId = resolvedParams.jobSearchCompanyId;

    const accessToken = await getCookie('accessToken');
      
    // accessToken이 없으면 401 응답 반환
    if (!accessToken) {
        return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
    }
  
    const res = await apiFetchHandler<JobSearchCompanyResponse>(
      `http://localhost:8080/api/workers/job-searches/${jobSearchId}/companies/${jobSearchCompanyId}`, 
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
