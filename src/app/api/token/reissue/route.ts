import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;
        const refreshToken = cookieStore.get('refreshToken')?.value;
        
        console.log('🔄 Token reissue requested');
        console.log('Has accessToken:', !!accessToken);
        console.log('Has refreshToken:', !!refreshToken);
        
        // refreshToken이 없으면 401 응답 반환
        if (!refreshToken) {
            console.error('❌ No refresh token found');
            return NextResponse.json({ error: 'Refresh token not found' }, { status: 401 });
        }
        
        // API Gateway URL 설정
        const apiGatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'https://api.workfolio.pro';
        const url = `${apiGatewayUrl}/api/token/reissue`;
        
        console.log('🔗 Calling:', url);
        
        // 토큰 재발급 API 호출
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': accessToken ? `Bearer ${accessToken}` : '',
                'RefreshToken': refreshToken,
                'Content-Type': 'application/json',
            },
        });
        
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Token reissue failed:', response.status, errorText);
            return NextResponse.json({ error: 'Token reissue failed' }, { status: response.status });
        }
        
        const data = await response.json();
        console.log('✅ Token reissue successful');
        console.log('New accessToken:', data.accessToken?.substring(0, 20) + '...');
        console.log('New refreshToken:', data.refreshToken?.substring(0, 20) + '...');
        
        // 새로운 토큰을 쿠키에 저장
        if (data.accessToken) {
            cookieStore.set('accessToken', data.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 7일
            });
        }
        
        if (data.refreshToken) {
            cookieStore.set('refreshToken', data.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24 * 30, // 30일
            });
        }
        
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in token reissue request:', error);
        return NextResponse.json({ error: 'Token reissue failed' }, { status: 500 });
    }
}
