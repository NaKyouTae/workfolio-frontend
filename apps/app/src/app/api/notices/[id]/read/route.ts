import { NextRequest, NextResponse } from 'next/server';
import { apiFetchHandler } from '@workfolio/shared/utils/ApiFetchHandler';
import { getCookie } from '@workfolio/shared/utils/cookie';
import HttpMethod from '@workfolio/shared/enums/HttpMethod';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// POST /api/notices/[id]/read - 공지사항 읽음 처리
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const accessToken = await getCookie('accessToken');

    if (!accessToken) {
      return NextResponse.json({ isSuccess: false }, { status: 401 });
    }

    const response = await apiFetchHandler<{ isSuccess: boolean }>(
      `${API_BASE_URL}/api/notices/${id}/read`,
      HttpMethod.POST,
      null,
      accessToken
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error marking notice as read:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
