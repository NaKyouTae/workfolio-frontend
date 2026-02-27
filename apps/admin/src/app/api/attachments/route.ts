import { NextRequest, NextResponse } from 'next/server';
import { apiFetchHandler } from '@workfolio/shared/utils/ApiFetchHandler';
import { getCookie } from '@workfolio/shared/utils/cookie';
import HttpMethod from '@workfolio/shared/enums/HttpMethod';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(request: NextRequest) {
  try {
    const accessToken = await getCookie('admin_access_token');
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized', attachments: [], totalElements: 0, totalPages: 0, currentPage: 0 }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '20';

    const url = `${API_BASE_URL}/api/admin/attachments?page=${page}&size=${size}`;
    const response = await apiFetchHandler(url, HttpMethod.GET, null, accessToken, { Accept: 'application/json' });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching attachments:', error);
    return NextResponse.json({ error: 'Internal server error', attachments: [], totalElements: 0, totalPages: 0, currentPage: 0 }, { status: 500 });
  }
}
