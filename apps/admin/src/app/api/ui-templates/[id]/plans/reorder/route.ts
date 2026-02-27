import { NextRequest, NextResponse } from 'next/server';
import { apiFetchHandler } from '@workfolio/shared/utils/ApiFetchHandler';
import { getCookie } from '@workfolio/shared/utils/cookie';
import HttpMethod from '@workfolio/shared/enums/HttpMethod';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// PUT /api/ui-templates/[id]/plans/reorder - 플랜 순서 변경
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await params;
    const { plans } = await request.json();
    const accessToken = await getCookie('admin_access_token');

    const results = await Promise.all(
      plans.map((plan: { id: string; durationDays: number; price: number; displayOrder: number }) =>
        apiFetchHandler(
          `${API_BASE_URL}/api/admin/ui-templates/plans/${plan.id}`,
          HttpMethod.PUT,
          {
            id: plan.id,
            durationDays: plan.durationDays,
            price: plan.price,
            displayOrder: plan.displayOrder,
          },
          accessToken
        )
      )
    );

    const allOk = results.every((r) => r.ok);
    return NextResponse.json({ isSuccess: allOk }, { status: allOk ? 200 : 500 });
  } catch (error) {
    console.error('Error reordering plans:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
