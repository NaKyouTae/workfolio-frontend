import HttpMethod from '@/enums/HttpMethod';
import { ListRecordResponse } from '@/generated/record';
import { apiFetchHandler } from '@/utils/ApiFetchHandler';
import { getCookie } from '@/utils/cookie';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(request: NextRequest) {
    try {
        const accessToken = await getCookie('accessToken');
        
        // accessToken이 없으면 401 응답 반환
        if (accessToken == null) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        
        const keyword = request.nextUrl.searchParams.get('keyword');
        
        const res = await apiFetchHandler<ListRecordResponse[]>(
            `${API_BASE_URL}/api/records/keywords?keyword=${keyword}`, 
            HttpMethod.GET, 
            undefined, 
            accessToken,
        );
        
        const data = await res.json()
        
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error in GET request:', error);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}