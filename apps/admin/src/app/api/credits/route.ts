import { NextRequest, NextResponse } from 'next/server';
import { CreditHistoryListResponse } from '@workfolio/shared/types/credit';
import { apiFetchHandler } from '@workfolio/shared/utils/ApiFetchHandler';
import { getCookie } from '@workfolio/shared/utils/cookie';
import HttpMethod from '@workfolio/shared/enums/HttpMethod';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET /api/credits - 전체 크레딧 내역 조회 (어드민)
export async function GET(request: NextRequest) {
  try {
    const accessToken = await getCookie('admin_access_token');

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized', creditHistories: [], totalElements: 0, totalPages: 0, currentPage: 0 },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '20';
    const txType = searchParams.get('txType');
    const workerId = searchParams.get('workerId');

    let url = `${API_BASE_URL}/api/admin/credits?page=${page}&size=${size}`;
    if (txType) {
      url += `&txType=${txType}`;
    }
    if (workerId) {
      url += `&workerId=${workerId}`;
    }

    const response = await apiFetchHandler<CreditHistoryListResponse>(
      url,
      HttpMethod.GET,
      null,
      accessToken,
      { 'Accept': 'application/json' }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching credit histories:', error);
    return NextResponse.json(
      { error: 'Internal server error', creditHistories: [], totalElements: 0, totalPages: 0, currentPage: 0 },
      { status: 500 }
    );
  }
}
