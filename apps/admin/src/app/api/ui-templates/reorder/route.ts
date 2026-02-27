import { NextRequest, NextResponse } from 'next/server';
import { apiFetchHandler } from '@workfolio/shared/utils/ApiFetchHandler';
import { getCookie } from '@workfolio/shared/utils/cookie';
import HttpMethod from '@workfolio/shared/enums/HttpMethod';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// PUT /api/ui-templates/reorder - 템플릿 순서 변경
export async function PUT(request: NextRequest) {
  try {
    const { templates } = await request.json();
    const accessToken = await getCookie('admin_access_token');

    const results = await Promise.all(
      templates.map((t: { id: string; name: string; description?: string; type: string; label?: string; urlPath?: string; isActive: boolean; displayOrder: number }) =>
        apiFetchHandler(
          `${API_BASE_URL}/api/admin/ui-templates/${t.id}`,
          HttpMethod.PUT,
          {
            id: t.id,
            name: t.name,
            description: t.description || '',
            type: t.type,
            label: t.label || '',
            urlPath: t.urlPath || '',
            isActive: t.isActive,
            displayOrder: t.displayOrder,
          },
          accessToken
        )
      )
    );

    const allOk = results.every((r) => r.ok);
    return NextResponse.json({ isSuccess: allOk }, { status: allOk ? 200 : 500 });
  } catch (error) {
    console.error('Error reordering templates:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
