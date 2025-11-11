import { getCookie } from "@/utils/cookie"
import { apiFetchHandler } from "@/utils/ApiFetchHandler"
import HttpMethod from "@/enums/HttpMethod"
import { NextResponse } from "next/server"
import { WorkerGetResponse } from "@/generated/worker"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET() {
    try {
        const accessToken = await getCookie('accessToken');
        
        // accessToken이 없으면 401 응답 반환
        if (accessToken == null) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        
        const res = await apiFetchHandler<WorkerGetResponse>(`${API_BASE_URL}/api/workers/me`, HttpMethod.GET, undefined, accessToken);
        
        // 응답이 정상적인 경우
        const data = await res.json();
        
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error in GET request:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function DELETE() {
    try {
        const accessToken = await getCookie('accessToken');
        
        // accessToken이 없으면 401 응답 반환
        if (accessToken == null) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        
        const res = await apiFetchHandler(`${API_BASE_URL}/api/workers/me`, HttpMethod.DELETE, undefined, accessToken);
        
        // 응답이 정상적인 경우
        const data = await res.json();
        
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error in DELETE request:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
