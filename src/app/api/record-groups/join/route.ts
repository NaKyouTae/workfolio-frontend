import { NextResponse } from 'next/server';
import HttpMethod from '@/enums/HttpMethod';
import { getCookie } from '@/utils/cookie';
import { apiFetchHandler } from '@/utils/ApiFetchHandler';
import { SuccessResponse } from '../../../../../generated/common';

export async function POST(req: Request) {
    try {
        const requestData = await req.json();        
        const accessToken = await getCookie('accessToken');
        
        // accessToken이 없으면 401 응답 반환
        if (accessToken == null) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        
        const res = await apiFetchHandler<SuccessResponse>('http://localhost:8080/api/record-groups/join', HttpMethod.POST, requestData, accessToken);
        
        // 응답이 정상적인 경우
        const data = await res.json();
        
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error in POST request:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
