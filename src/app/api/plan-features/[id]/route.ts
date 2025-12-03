import { NextRequest, NextResponse } from 'next/server';
import { PlanFeatureGetResponse } from '@/generated/plan_feature';
import { SuccessResponse } from '@/generated/common';
import { apiFetchHandler } from '@/utils/ApiFetchHandler';
import { getCookie } from '@/utils/cookie';
import HttpMethod from '@/enums/HttpMethod';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET /api/plan-features/{id} - 플랜-기능 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const accessToken = await getCookie('admin_access_token');

    const response = await apiFetchHandler<PlanFeatureGetResponse>(
      `${API_BASE_URL}/api/plan-features/${id}`,
      HttpMethod.GET,
      null,
      accessToken
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching plan-feature:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/plan-features/{id} - 플랜-기능 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const accessToken = await getCookie('admin_access_token');

    const response = await apiFetchHandler<SuccessResponse>(
      `${API_BASE_URL}/api/plan-features/${id}`,
      HttpMethod.DELETE,
      null,
      accessToken
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting plan-feature:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

