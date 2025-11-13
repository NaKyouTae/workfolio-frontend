import { NextRequest, NextResponse } from 'next/server';
import { apiFetchHandler } from '@/utils/ApiFetchHandler';
import { getCookie } from '@/utils/cookie';
import HttpMethod from '@/enums/HttpMethod';
import { PlanSubscription } from '@/generated/common';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET /api/plan-subscriptions - 플랜 구독 옵션 목록 조회
// Query Parameters: planId (optional) - 특정 플랜의 구독 옵션만 조회
export async function GET(request: NextRequest) {
  try {
    // admin 토큰 우선, 없으면 일반 사용자 토큰 사용
    let accessToken = await getCookie('admin_access_token');
    if (!accessToken) {
      accessToken = await getCookie('accessToken');
    }
    
    const { searchParams } = new URL(request.url);
    const planId = searchParams.get('planId');

    let url = `${API_BASE_URL}/api/plan-subscriptions`;
    if (planId) {
      url += `?planId=${planId}`;
    }

    const response = await apiFetchHandler<{ plan_subscriptions: PlanSubscription[] }>(
      url,
      HttpMethod.GET,
      null,
      accessToken || undefined
    );

    // apiFetchHandler는 이미 NextResponse를 반환하므로 직접 반환
    if (response.status === 200) {
      const data = await response.json();
      return NextResponse.json(data);
    }
    
    // 에러 응답인 경우
    return response;
  } catch (error) {
    console.error('Error fetching plan subscriptions:', error);
    return NextResponse.json(
      { error: 'Internal server error', plan_subscriptions: [] },
      { status: 500 }
    );
  }
}

// POST /api/plan-subscriptions - 플랜 구독 옵션 생성
// Request Body: { plan_id, duration_months, total_price, monthly_equivalent, savings_amount, discount_rate, priority }
export async function POST(request: NextRequest) {
  try {
    const accessToken = await getCookie('admin_access_token');
    const body = await request.json();

    const response = await apiFetchHandler<{ is_success: boolean }>(
      `${API_BASE_URL}/api/plan-subscriptions`,
      HttpMethod.POST,
      body,
      accessToken
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating plan subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/plan-subscriptions - 플랜 구독 옵션 수정
// Request Body: { id, plan_id, duration_months, total_price, monthly_equivalent, savings_amount, discount_rate, priority }
export async function PUT(request: NextRequest) {
  try {
    const accessToken = await getCookie('admin_access_token');
    const body = await request.json();

    const response = await apiFetchHandler<{ is_success: boolean }>(
      `${API_BASE_URL}/api/plan-subscriptions`,
      HttpMethod.PUT,
      body,
      accessToken
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating plan subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

