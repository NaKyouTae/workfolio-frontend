import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import HttpMethod from '@workfolio/shared/enums/HttpMethod';
import { getCookie } from '@workfolio/shared/utils/cookie';
import { apiFetchHandler } from '@workfolio/shared/utils/ApiFetchHandler';
import { ResumeResponse } from '@workfolio/shared/generated/resume';

// POST /api/resumes/{id}/duplicate - 이력서 복제
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const accessToken = await getCookie('accessToken');

    // accessToken이 없으면 401 응답 반환
    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
    }

    const res = await apiFetchHandler<ResumeResponse>(
      `${API_BASE_URL}/api/resumes/${id}/duplicate`,
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
