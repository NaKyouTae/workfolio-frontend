import { NextRequest, NextResponse } from 'next/server';
import HttpMethod from '@workfolio/shared/enums/HttpMethod';
import { getCookie } from '@workfolio/shared/utils/cookie';
import { apiFetchHandler } from '@workfolio/shared/utils/ApiFetchHandler';
import { CheckListCheckedUpdateRequest, CheckListResponse } from '@workfolio/shared/generated/turn_over';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function PUT(request: NextRequest) {
  try {
    const body: CheckListCheckedUpdateRequest = await request.json();

    const accessToken = await getCookie('accessToken');

    // accessToken이 없으면 401 응답 반환
    if (!accessToken) {
        return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
    }

    const res = await apiFetchHandler<CheckListResponse>(
      `${API_BASE_URL}/api/check-lists/checked`,
      HttpMethod.PUT,
      body,
      accessToken,
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating check list checked status:', error);
    return NextResponse.json({ error: 'Failed to update check list checked status' }, { status: 500 });
  }
}
