import { NextResponse } from 'next/server';
import HttpMethod from '@/enums/HttpMethod';
import { getCookie } from '@/utils/cookie';
import { apiFetchHandler } from '@/utils/ApiFetchHandler';
import { TurnOverDetailResponse } from '@/generated/turn_over';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const accessToken = await getCookie('accessToken');
      
    // accessToken이 없으면 401 응답 반환
    if (!accessToken) {
        return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
    }
    
    const res = await apiFetchHandler<TurnOverDetailResponse>(
      `${API_BASE_URL}/api/turn-overs/details/${id}`, 
      HttpMethod.GET, 
      undefined, 
      accessToken,
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching turn over details:', error);
    return NextResponse.json({ error: 'Failed to fetch turn over details' }, { status: 500 });
  }
}
