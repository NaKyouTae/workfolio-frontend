import { NextResponse } from 'next/server';
import { ReleaseNoticeListResponse } from '@workfolio/shared/generated/release';
import { apiFetchHandler } from '@workfolio/shared/utils/ApiFetchHandler';
import HttpMethod from '@workfolio/shared/enums/HttpMethod';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET /api/release/notices - 공지사항 조회 (인증 불필요)
export async function GET() {
  try {
    const response = await apiFetchHandler<ReleaseNoticeListResponse>(
      `${API_BASE_URL}/api/release/notices`,
      HttpMethod.GET,
      null,
      undefined // 인증 불필요
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching release notices:', error);
    return NextResponse.json(
      { error: 'Internal server error', notices: [] },
      { status: 500 }
    );
  }
}
