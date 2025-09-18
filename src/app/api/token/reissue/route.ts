import { NextResponse } from "next/server";
import { getCookie } from "@/utils/cookie";
import { apiFetchHandler } from "@/utils/ApiFetchHandler";
import HttpMethod from "@/enums/HttpMethod";
import { TokenResponse } from "@/generated/token";

export async function GET() {
    try {
        const refreshToken = await getCookie('refreshToken');
        
        // refreshToken이 없으면 401 응답 반환
        if (!refreshToken) {
            return new Response(JSON.stringify({ error: 'Refresh token not found' }), { status: 401 });
        }
        
        const res = await apiFetchHandler<TokenResponse>(
            'http://localhost:8080/api/token/reissue', 
            HttpMethod.GET, 
            null, 
            refreshToken,
            {
                'RefreshToken': refreshToken
            }
        );
        
        // 응답이 정상적인 경우
        const data = await res.json();
        
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in token reissue request:', error);
        return new Response(JSON.stringify({ error: 'Token reissue failed' }), { status: 401 });
    }
}
