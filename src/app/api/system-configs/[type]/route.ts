import { NextResponse } from "next/server";
import { getCookie } from "@/utils/cookie";
import { apiFetchHandler } from "@/utils/ApiFetchHandler";
import HttpMethod from "@/enums/HttpMethod";
import { SystemConfig_SystemConfigType } from "@/generated/common";
import { SystemConfigGetResponse } from "@/generated/system_config";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(req: Request, { params }: { params: Promise<{ type: SystemConfig_SystemConfigType }> }) {
    try {
        const { type } = await params;
        const accessToken = await getCookie('accessToken');
        const refreshToken = await getCookie('refreshToken');
        
        if (accessToken == null && !refreshToken) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        
        const res = await apiFetchHandler<SystemConfigGetResponse>(`${API_BASE_URL}/api/system-configs/${type}`, HttpMethod.GET, undefined, accessToken);
        
        const data = await res.json()
        
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error in GET request:', error);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}