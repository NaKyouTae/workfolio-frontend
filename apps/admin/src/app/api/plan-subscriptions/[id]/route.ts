import { NextRequest, NextResponse } from 'next/server';
import { apiFetchHandler } from '@workfolio/shared/utils/ApiFetchHandler';
import { getCookie } from '@workfolio/shared/utils/cookie';
import HttpMethod from '@workfolio/shared/enums/HttpMethod';
import { PlanSubscription } from '@workfolio/shared/generated/common';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET /api/plan-subscriptions/{id} - 플랜 구독 옵션 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const accessToken = await getCookie('admin_access_token');

    const response = await apiFetchHandler<{ plan_subscription: PlanSubscription }>(
      `${API_BASE_URL}/api/plan-subscriptions/${id}`,
      HttpMethod.GET,
      null,
      accessToken
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching plan subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/plan-subscriptions/{id} - 플랜 구독 옵션 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const accessToken = await getCookie('admin_access_token');

    const response = await apiFetchHandler<{ is_success: boolean }>(
      `${API_BASE_URL}/api/plan-subscriptions/${id}`,
      HttpMethod.DELETE,
      null,
      accessToken
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting plan subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
