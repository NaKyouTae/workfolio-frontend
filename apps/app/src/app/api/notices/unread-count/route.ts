import { NextResponse } from 'next/server';
import { apiFetchHandler } from '@workfolio/shared/utils/ApiFetchHandler';
import { getCookie } from '@workfolio/shared/utils/cookie';
import HttpMethod from '@workfolio/shared/enums/HttpMethod';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET /api/notices/unread-count - 미읽은 공지사항 수 조회
export async function GET() {
  try {
    const accessToken = await getCookie('accessToken');

    if (!accessToken) {
      return NextResponse.json({ unreadCount: 0 });
    }

    const response = await apiFetchHandler<{ unreadCount: number }>(
      `${API_BASE_URL}/api/notices/unread-count`,
      HttpMethod.GET,
      null,
      accessToken
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return NextResponse.json({ unreadCount: 0 });
  }
}
