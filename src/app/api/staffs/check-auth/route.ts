import { NextResponse } from 'next/server';
import { getCookie } from '@/utils/cookie';

// GET /api/staffs/check-auth - 어드민 토큰 확인
export async function GET() {
  try {
    const adminAccessToken = await getCookie('admin_access_token');
    const adminRefreshToken = await getCookie('admin_refresh_token');

    // 두 토큰이 모두 없으면 401 반환
    if (!adminAccessToken && !adminRefreshToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 토큰이 있으면 200 반환
    return NextResponse.json(
      { authenticated: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking admin auth:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

