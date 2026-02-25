import { NextRequest, NextResponse } from 'next/server';
import { getCookie } from '@workfolio/shared/utils/cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// POST /api/ui-templates/[id]/images - 이미지 업로드 (FormData)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const accessToken = await getCookie('admin_access_token');
    const formData = await request.formData();

    const response = await fetch(
      `${API_BASE_URL}/api/admin/ui-templates/${id}/images`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error uploading images:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
