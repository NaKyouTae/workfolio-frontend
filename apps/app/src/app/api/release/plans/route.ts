import { NextResponse } from 'next/server';
import { ReleasePlanListResponse } from '@workfolio/shared/generated/release';
import { apiFetchHandler } from '@workfolio/shared/utils/ApiFetchHandler';
import HttpMethod from '@workfolio/shared/enums/HttpMethod';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET /api/release/plans - 플랜 조회 (인증 불필요)
export async function GET() {
  try {
    const response = await apiFetchHandler<ReleasePlanListResponse>(
      `${API_BASE_URL}/api/release/plans`,
      HttpMethod.GET,
      null,
      undefined // 인증 불필요
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching release plans:', error);
    return NextResponse.json(
      { error: 'Internal server error', plans: [] },
      { status: 500 }
    );
  }
}
