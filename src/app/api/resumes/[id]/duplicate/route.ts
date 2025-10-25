import { NextRequest, NextResponse } from 'next/server';
import HttpMethod from '@/enums/HttpMethod';
import { getCookie } from '@/utils/cookie';
import { apiFetchHandler } from '@/utils/ApiFetchHandler';
import { ResumeResponse } from '@/generated/resume';

// POST /api/resumes/{id}/duplicate - 이력서 복제
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const accessToken = await getCookie('accessToken');
      
    // accessToken이 없으면 401 응답 반환
    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
    }
    
    const res = await apiFetchHandler<ResumeResponse>(
      `http://localhost:8080/api/resumes/${id}/duplicate`, 
      HttpMethod.POST, 
      null, 
      accessToken,
    );

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Error duplicating resume:', error);
    return NextResponse.json({ error: 'Failed to duplicate resume' }, { status: 500 });
  }
}

