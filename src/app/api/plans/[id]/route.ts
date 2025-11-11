import { NextRequest, NextResponse } from 'next/server';
import { PlanGetResponse } from '@/generated/plan';
import { SuccessResponse } from '@/generated/common';
import { apiFetchHandler } from '@/utils/ApiFetchHandler';
import { getCookie } from '@/utils/cookie';
import HttpMethod from '@/enums/HttpMethod';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET /api/plans/{id} - 플랜 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const accessToken = await getCookie('admin_access_token');

    const response = await apiFetchHandler<PlanGetResponse>(
      `${API_BASE_URL}/api/plans/${id}`,
      HttpMethod.GET,
      null,
      accessToken
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching plan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/plans/{id} - 플랜 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const accessToken = await getCookie('admin_access_token');

    const response = await apiFetchHandler<SuccessResponse>(
      `${API_BASE_URL}/api/plans/${id}`,
      HttpMethod.DELETE,
      null,
      accessToken
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting plan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

