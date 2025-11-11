import { NextRequest, NextResponse } from 'next/server';
import { PlanFeatureListResponse, PlanFeatureCreateRequest } from '@/generated/plan_feature';
import { SuccessResponse } from '@/generated/common';
import { apiFetchHandler } from '@/utils/ApiFetchHandler';
import { getCookie } from '@/utils/cookie';
import HttpMethod from '@/enums/HttpMethod';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET /api/plan-features - 플랜-기능 목록 조회 (필터링 가능)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const planId = searchParams.get('plan_id');
    const featureId = searchParams.get('feature_id');
    const accessToken = await getCookie('admin_access_token');

    const url = new URL(`${API_BASE_URL}/api/plan-features`);
    if (planId) {
      url.searchParams.append('plan_id', planId);
    }
    if (featureId) {
      url.searchParams.append('feature_id', featureId);
    }

    const response = await apiFetchHandler<PlanFeatureListResponse>(
      url.toString(),
      HttpMethod.GET,
      null,
      accessToken
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching plan-features:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/plan-features - 플랜-기능 생성 (플랜에 기능 연결)
export async function POST(request: NextRequest) {
  try {
    const body: PlanFeatureCreateRequest = await request.json();
    const accessToken = await getCookie('admin_access_token');

    const response = await apiFetchHandler<SuccessResponse>(
      `${API_BASE_URL}/api/plan-features`,
      HttpMethod.POST,
      body,
      accessToken
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating plan-feature:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/plan-features - 플랜-기능 수정
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const accessToken = await getCookie('admin_access_token');

    const response = await apiFetchHandler<SuccessResponse>(
      `${API_BASE_URL}/api/plan-features`,
      HttpMethod.PUT,
      body,
      accessToken
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating plan-feature:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

