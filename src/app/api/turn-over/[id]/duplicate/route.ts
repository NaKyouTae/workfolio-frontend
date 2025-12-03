import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import HttpMethod from '@/enums/HttpMethod';
import { getCookie } from '@/utils/cookie';
import { apiFetchHandler } from '@/utils/ApiFetchHandler';
import { SuccessResponse } from '@/generated/common';

export async function POST(
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
    
    const res = await apiFetchHandler<SuccessResponse>(
      `${API_BASE_URL}/api/turn-overs/${id}/duplicate`, 
      HttpMethod.POST, 
      null, 
      accessToken,
    );

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Error duplicating turn over:', error);
    return NextResponse.json({ error: 'Failed to duplicate turn over' }, { status: 500 });
  }
}
