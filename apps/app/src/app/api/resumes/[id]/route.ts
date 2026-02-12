import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import HttpMethod from '@workfolio/shared/enums/HttpMethod';
import { getCookie } from '@workfolio/shared/utils/cookie';
import { apiFetchHandler } from '@workfolio/shared/utils/ApiFetchHandler';
import { SuccessResponse } from '@workfolio/shared/generated/common';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const accessToken = await getCookie('accessToken');

      // accessToken이 없으면 401 응답 반환
      if (!accessToken) {
          return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
      }

    const res = await apiFetchHandler<SuccessResponse>(
      `${API_BASE_URL}/api/resumes/${id}`,
      HttpMethod.PUT,
      null,
      accessToken,
    );
    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Error updating resume:', error);
    return NextResponse.json({ error: 'Failed to update resumes' }, { status: 500 });
  }
}

// DELETE /api/resumes/{id} - 이력서 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const accessToken = await getCookie('accessToken');

    // accessToken이 없으면 401 응답 반환
    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
    }

    const res = await apiFetchHandler(
      `${API_BASE_URL}/api/resumes/${id}`,
      HttpMethod.DELETE,
      null,
      accessToken,
    );

    if (res.status === 204 || res.status === 200) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Error deleting resume:', error);
    return NextResponse.json({ error: 'Failed to delete resume' }, { status: 500 });
  }
}
