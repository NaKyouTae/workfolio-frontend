import { NextRequest, NextResponse } from 'next/server';
import { FeatureListResponse, FeatureCreateRequest } from '@/generated/feature';
import { SuccessResponse } from '@/generated/common';
import { apiFetchHandler } from '@/utils/ApiFetchHandler';
import { getCookie } from '@/utils/cookie';
import HttpMethod from '@/enums/HttpMethod';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET /api/features - 기능 목록 조회 (도메인 필터링 가능)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const domain = searchParams.get('domain');
    const accessToken = await getCookie('admin_access_token');

    const url = new URL(`${API_BASE_URL}/api/features`);
    if (domain) {
      url.searchParams.append('domain', domain);
    }

    const response = await apiFetchHandler<FeatureListResponse>(
      url.toString(),
      HttpMethod.GET,
      null,
      accessToken
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching features:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/features - 기능 생성
export async function POST(request: NextRequest) {
  try {
    const body: FeatureCreateRequest = await request.json();
    const accessToken = await getCookie('admin_access_token');

    const response = await apiFetchHandler<SuccessResponse>(
      `${API_BASE_URL}/api/features`,
      HttpMethod.POST,
      body,
      accessToken
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating feature:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/features - 기능 수정
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const accessToken = await getCookie('admin_access_token');

    const response = await apiFetchHandler<SuccessResponse>(
      `${API_BASE_URL}/api/features`,
      HttpMethod.PUT,
      body,
      accessToken
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating feature:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

