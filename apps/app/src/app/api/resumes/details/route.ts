import { NextResponse } from 'next/server';
import HttpMethod from '@workfolio/shared/enums/HttpMethod';
import { getCookie } from '@workfolio/shared/utils/cookie';
import { apiFetchHandler } from '@workfolio/shared/utils/ApiFetchHandler';
import { ResumeDetailListResponse } from '@workfolio/shared/generated/resume';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET /api/workers/companies - 회사 목록 조회
export async function GET() {
  try {
    const accessToken = await getCookie('accessToken');

    // accessToken이 없으면 401 응답 반환
    if (!accessToken) {
        return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
    }

    const res = await apiFetchHandler<ResumeDetailListResponse>(
      `${API_BASE_URL}/api/resumes/details`,
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
