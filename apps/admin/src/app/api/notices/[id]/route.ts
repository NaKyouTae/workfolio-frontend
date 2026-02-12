import { NextRequest, NextResponse } from 'next/server';
import { NoticeGetResponse } from '@workfolio/shared/generated/notice';
import { SuccessResponse } from '@workfolio/shared/generated/common';
import { apiFetchHandler } from '@workfolio/shared/utils/ApiFetchHandler';
import { getCookie } from '@workfolio/shared/utils/cookie';
import HttpMethod from '@workfolio/shared/enums/HttpMethod';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET /api/notices/[id] - 공지사항 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const accessToken = await getCookie('admin_access_token');

    const response = await apiFetchHandler<NoticeGetResponse>(
      `${API_BASE_URL}/api/notices/${id}`,
      HttpMethod.GET,
      null,
      accessToken
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching notice:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/notices/[id] - 공지사항 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const accessToken = await getCookie('admin_access_token');

    const response = await apiFetchHandler<SuccessResponse>(
      `${API_BASE_URL}/api/notices/${id}`,
      HttpMethod.DELETE,
      null,
      accessToken
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting notice:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
