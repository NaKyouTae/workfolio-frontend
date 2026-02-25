import { NextRequest, NextResponse } from 'next/server';
import { apiFetchHandler } from '@workfolio/shared/utils/ApiFetchHandler';
import { getCookie } from '@workfolio/shared/utils/cookie';
import HttpMethod from '@workfolio/shared/enums/HttpMethod';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET /api/ui-templates - 전체 UI 템플릿 목록 조회 (어드민)
export async function GET() {
  try {
    const accessToken = await getCookie('admin_access_token');

    const response = await apiFetchHandler(
      `${API_BASE_URL}/api/admin/ui-templates`,
      HttpMethod.GET,
      null,
      accessToken
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching ui templates:', error);
    return NextResponse.json(
      { error: 'Internal server error', uiTemplates: [] },
      { status: 500 }
    );
  }
}

// POST /api/ui-templates - UI 템플릿 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const accessToken = await getCookie('admin_access_token');

    const response = await apiFetchHandler(
      `${API_BASE_URL}/api/admin/ui-templates`,
      HttpMethod.POST,
      body,
      accessToken
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating ui template:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
