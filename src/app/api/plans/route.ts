import { NextRequest, NextResponse } from 'next/server';
import { PlanListResponse, PlanCreateRequest } from '@/generated/plan';
import { SuccessResponse } from '@/generated/common';
import { apiFetchHandler } from '@/utils/ApiFetchHandler';
import { getCookie } from '@/utils/cookie';
import HttpMethod from '@/enums/HttpMethod';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET /api/plans - 전체 플랜 목록 조회
export async function GET() {
  try {
    // admin 토큰 우선, 없으면 일반 사용자 토큰 사용
    let accessToken = await getCookie('admin_access_token');
    if (!accessToken) {
      accessToken = await getCookie('accessToken');
    }
    
    const response = await apiFetchHandler<PlanListResponse>(
      `${API_BASE_URL}/api/plans`,
      HttpMethod.GET,
      null,
      accessToken || undefined
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/plans - 플랜 생성
export async function POST(request: NextRequest) {
  try {
    const body: PlanCreateRequest = await request.json();
    const accessToken = await getCookie('admin_access_token');

    const response = await apiFetchHandler<SuccessResponse>(
      `${API_BASE_URL}/api/plans`,
      HttpMethod.POST,
      body,
      accessToken
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating plan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/plans - 플랜 수정
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const accessToken = await getCookie('admin_access_token');

    const response = await apiFetchHandler<SuccessResponse>(
      `${API_BASE_URL}/api/plans`,
      HttpMethod.PUT,
      body,
      accessToken
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating plan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

