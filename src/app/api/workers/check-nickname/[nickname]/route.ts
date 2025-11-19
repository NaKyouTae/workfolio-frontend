import { getCookie } from "@/utils/cookie"
import { apiFetchHandler } from "@/utils/ApiFetchHandler"
import HttpMethod from "@/enums/HttpMethod"
import { NextResponse } from "next/server"
import { WorkerCheckNickNameResponse } from "@/generated/worker"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(
    req: Request,
    { params }: { params: { nickname: string } }
) {
    try {
        const accessToken = await getCookie('accessToken');
        const refreshToken = await getCookie('refreshToken');
        
        if (accessToken == null && !refreshToken) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        
        const { nickname } = params;
        
        const res = await apiFetchHandler<WorkerCheckNickNameResponse>(
            `${API_BASE_URL}/api/workers/check-nickname/${encodeURIComponent(nickname)}`, 
            HttpMethod.GET, 
            undefined, 
            accessToken
        );
        
        // 응답이 정상적인 경우
        const data = await res.json();
        
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error in GET request:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

