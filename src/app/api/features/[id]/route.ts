import { NextRequest, NextResponse } from 'next/server';
import { FeatureGetResponse } from '@/generated/feature';
import { SuccessResponse } from '@/generated/common';
import { apiFetchHandler } from '@/utils/ApiFetchHandler';
import { getCookie } from '@/utils/cookie';
import HttpMethod from '@/enums/HttpMethod';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET /api/features/{id} - 기능 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const accessToken = await getCookie('admin_access_token');

    const response = await apiFetchHandler<FeatureGetResponse>(
      `${API_BASE_URL}/api/features/${id}`,
      HttpMethod.GET,
      null,
      accessToken
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching feature:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/features/{id} - 기능 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const accessToken = await getCookie('admin_access_token');

    const response = await apiFetchHandler<SuccessResponse>(
      `${API_BASE_URL}/api/features/${id}`,
      HttpMethod.DELETE,
      null,
      accessToken
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting feature:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

