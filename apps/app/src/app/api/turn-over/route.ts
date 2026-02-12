import { NextRequest, NextResponse } from 'next/server';
import HttpMethod from '@workfolio/shared/enums/HttpMethod';
import { getCookie } from '@workfolio/shared/utils/cookie';
import { apiFetchHandler } from '@workfolio/shared/utils/ApiFetchHandler';
import { TurnOverListResponse, TurnOverUpsertRequest } from '@workfolio/shared/generated/turn_over';
import { SuccessResponse } from '@workfolio/shared/generated/common';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET() {
  try {
    const accessToken = await getCookie('accessToken');

    // accessToken이 없으면 401 응답 반환
    if (!accessToken) {
        return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
    }

    const res = await apiFetchHandler<TurnOverListResponse>(
      `${API_BASE_URL}/api/turn-overs`,
      HttpMethod.GET,
      null,
      accessToken,
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching turn overs:', error);
    return NextResponse.json({ error: 'Failed to fetch turn overs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: TurnOverUpsertRequest = await request.json();

    const accessToken = await getCookie('accessToken');

      // accessToken이 없으면 401 응답 반환
      if (!accessToken) {
          return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
      }

    const res = await apiFetchHandler<SuccessResponse>(
      `${API_BASE_URL}/api/turn-overs`,
      HttpMethod.POST,
      body,
      accessToken,
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating turn over:', error);
    return NextResponse.json({ error: 'Failed to create turn over' }, { status: 500 });
  }
}
