import { NextRequest, NextResponse } from 'next/server';
import { NoticeListResponse, NoticeCreateRequest } from '@/generated/notice';
import { SuccessResponse } from '@/generated/common';
import { apiFetchHandler } from '@/utils/ApiFetchHandler';
import { getCookie } from '@/utils/cookie';
import HttpMethod from '@/enums/HttpMethod';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET /api/notices - 전체 공지사항 목록 조회
export async function GET() {
  try {
    const accessToken = await getCookie('admin_access_token');
    
    const response = await apiFetchHandler<NoticeListResponse>(
      `${API_BASE_URL}/api/notices`,
      HttpMethod.GET,
      null,
      accessToken
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching notices:', error);
    return NextResponse.json(
      { error: 'Internal server error', notices: [] },
      { status: 500 }
    );
  }
}

// POST /api/notices - 공지사항 생성
export async function POST(request: NextRequest) {
  try {
    const body: NoticeCreateRequest = await request.json();
    const accessToken = await getCookie('admin_access_token');

    const response = await apiFetchHandler<SuccessResponse>(
      `${API_BASE_URL}/api/notices`,
      HttpMethod.POST,
      body,
      accessToken
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating notice:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/notices - 공지사항 수정
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const accessToken = await getCookie('admin_access_token');

    const response = await apiFetchHandler<SuccessResponse>(
      `${API_BASE_URL}/api/notices`,
      HttpMethod.PUT,
      body,
      accessToken
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating notice:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
