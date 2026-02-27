import { NextRequest, NextResponse } from 'next/server';
import { apiFetchHandler } from '@workfolio/shared/utils/ApiFetchHandler';
import { getCookie } from '@workfolio/shared/utils/cookie';
import HttpMethod from '@workfolio/shared/enums/HttpMethod';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(request: NextRequest) {
  try {
    const accessToken = await getCookie('admin_access_token');
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized', isSuccess: false }, { status: 401 });
    }

    const body = await request.json();

    const response = await apiFetchHandler(
      `${API_BASE_URL}/api/admin/credits/adjust`,
      HttpMethod.POST,
      body,
      accessToken
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error adjusting credits:', error);
    return NextResponse.json({ error: 'Internal server error', isSuccess: false }, { status: 500 });
  }
}
