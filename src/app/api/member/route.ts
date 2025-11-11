import { NextResponse } from 'next/server'
import { getCookie } from '@/utils/cookie'
import { apiFetchHandler } from '@/utils/ApiFetchHandler';
import HttpMethod from '@/enums/HttpMethod';
import { WorkerGetResponse } from '@/generated/worker';


export async function GET() {
    try {
        const accessToken = await getCookie('accessToken');
        
        // accessToken이 없으면 401 응답 반환
        if (accessToken == null) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        
        const res = await apiFetchHandler<WorkerGetResponse[]>(`${API_BASE_URL}/api/workers/me`, HttpMethod.GET, undefined, accessToken);
        
        const data = await res.json()
        
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error in GET request:', error);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
