import { NextRequest, NextResponse } from 'next/server';
import HttpMethod from '@workfolio/shared/enums/HttpMethod';
import { getCookie } from '@workfolio/shared/utils/cookie';
import { apiFetchHandler } from '@workfolio/shared/utils/ApiFetchHandler';
import { SuccessResponse } from '@workfolio/shared/generated/common';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// PATCH /api/resumes/{id}/public - 이력서 공개/비공개 토글
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const accessToken = await getCookie('accessToken');
    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
    }

    const res = await apiFetchHandler<SuccessResponse>(
      `${API_BASE_URL}/api/resumes/${id}/public`,
      HttpMethod.PATCH,
      body,
      accessToken,
    );
    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Error toggling resume public status:', error);
    return NextResponse.json({ error: 'Failed to toggle resume public status' }, { status: 500 });
  }
}
