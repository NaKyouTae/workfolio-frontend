import {getCookie} from "@/utils/cookie"
import {apiFetchHandler} from "@/utils/ApiFetchHandler"
import HttpMethod from "@/enums/HttpMethod"
import {NextResponse} from "next/server"
import { SuccessResponse } from "@/generated/common"
import { RecordCreateRequest, RecordUpdateRequest } from "@/generated/record"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(req: Request) {
    try {
        const requestData: RecordCreateRequest = await req.json();
        const accessToken = await getCookie('accessToken');
        
        // accessToken이 없으면 401 응답 반환
        if (accessToken == null) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        
        const res = await apiFetchHandler<SuccessResponse>(`${API_BASE_URL}/api/records`, HttpMethod.POST, requestData, accessToken);
        
        // 응답이 정상적인 경우
        const data = await res.json();
        
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in POST request:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function PUT(req: Request) {
    try {
        const requestData: RecordUpdateRequest = await req.json();
        const accessToken = await getCookie('accessToken');
        
        // accessToken이 없으면 401 응답 반환
        if (accessToken == null) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        
        const res = await apiFetchHandler<SuccessResponse>(`${API_BASE_URL}/api/records`, HttpMethod.PUT, requestData, accessToken);
        
        // 응답이 정상적인 경우
        const data = await res.json();
        
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in POST request:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}