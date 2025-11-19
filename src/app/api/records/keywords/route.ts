import HttpMethod from '@/enums/HttpMethod';
import { ListRecordResponse } from '@/generated/record';
import { apiFetchHandler } from '@/utils/ApiFetchHandler';
import { getCookie } from '@/utils/cookie';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(request: NextRequest) {
    try {
        const accessToken = await getCookie('accessToken');
        const refreshToken = await getCookie('refreshToken');
        
        if (accessToken == null && !refreshToken) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        
        const keyword = request.nextUrl.searchParams.get('keyword');
        const recordGroupIds = request.nextUrl.searchParams.getAll('recordGroupIds');
        
        // URL 구성
        let url = `${API_BASE_URL}/api/records/keywords?keyword=${encodeURIComponent(keyword || '')}`;
        if (recordGroupIds.length > 0) {
            recordGroupIds.forEach(id => {
                url += `&recordGroupIds=${encodeURIComponent(id)}`;
            });
        }
        
        const res = await apiFetchHandler<ListRecordResponse[]>(
            url, 
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