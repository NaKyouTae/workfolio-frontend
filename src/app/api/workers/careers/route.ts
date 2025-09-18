import { getCookie } from "@/utils/cookie"
import { apiFetchHandler } from "@/utils/ApiFetchHandler"
import HttpMethod from "@/enums/HttpMethod"
import { NextResponse } from "next/server"
import { WorkerCareerListResponse } from "@/generated/worker_career";
import { SuccessResponse } from "@/generated/common";

export async function PUT(req: Request) {
    try {
        const accessToken = await getCookie('accessToken');
        
        // accessToken이 없으면 401 응답 반환
        if (accessToken == null) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        
        const careerData = await req.json();
        
        // 백엔드 서버로 커리어 데이터 전송
        const res = await apiFetchHandler<SuccessResponse>(
            'http://localhost:8080/api/workers/careers', 
            HttpMethod.PUT, 
            careerData, 
            accessToken
        );
        
        // 응답이 정상적인 경우
        const data = await res.json();
        
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error in POST request:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function GET() {
    try {
        const accessToken = await getCookie('accessToken');
        
        // accessToken이 없으면 401 응답 반환
        if (accessToken == null) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        
        // 백엔드 서버에서 커리어 데이터 조회
        const res = await apiFetchHandler<WorkerCareerListResponse>(
            'http://localhost:8080/api/workers/careers', 
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
