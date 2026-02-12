import { NextRequest, NextResponse } from 'next/server';
import HttpMethod from '@workfolio/shared/enums/HttpMethod';
import { getCookie } from '@workfolio/shared/utils/cookie';
import { apiFetchHandler } from '@workfolio/shared/utils/ApiFetchHandler';
import { CareerListResponse, CareerResponse } from '@workfolio/shared/generated/career';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET /api/workers/companies - 회사 목록 조회
export async function GET() {
  try {
    const accessToken = await getCookie('accessToken');

    // accessToken이 없으면 401 응답 반환
    if (!accessToken) {
        return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
    }

    const res = await apiFetchHandler<CareerListResponse>(
      `${API_BASE_URL}/api/careers`,
      HttpMethod.GET,
      null,
      accessToken,
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching careers:', error);
    return NextResponse.json({ error: 'Failed to fetch careers' }, { status: 500 });
  }
}

// POST /api/workers/companies - 회사 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const accessToken = await getCookie('accessToken');

      // accessToken이 없으면 401 응답 반환
      if (!accessToken) {
          return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
      }

    const res = await apiFetchHandler<CareerResponse>(
      `${API_BASE_URL}/api/careers`,
      HttpMethod.POST,
      body,
      accessToken,
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating career:', error);
    return NextResponse.json({ error: 'Failed to create career' }, { status: 500 });
  }
}

// PUT /api/workers/companies - 회사 수정
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const accessToken = await getCookie('accessToken');

      // accessToken이 없으면 401 응답 반환
      if (!accessToken) {
          return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
      }

    const res = await apiFetchHandler<CareerResponse>(
      `${API_BASE_URL}/api/careers`,
      HttpMethod.PUT,
      body,
      accessToken,
    );
    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating career:', error);
    return NextResponse.json({ error: 'Failed to update career' }, { status: 500 });
  }
}
