import {NextResponse} from "next/server"
import HttpMethod from "@/enums/HttpMethod"
import {cookies} from "next/headers"
import {redirect} from "next/navigation"

export async function apiFetchHandler<T>(
    url: string,
    method: HttpMethod = HttpMethod.GET,
    body?: any,
    accessToken?: string,
    additionalHeaders?: Record<string, string>
): Promise<NextResponse<T> | NextResponse<{ message: string }>> {
    try {
        const headers: HeadersInit = {
            'Content-Type': "application/json",
        };
        
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
        
        // 추가 헤더가 있으면 추가
        if (additionalHeaders) {
            Object.assign(headers, additionalHeaders);
        }

        console.log('url', url);
        console.log('method', method);
        console.log('headers', headers);
        console.log('body', body);
        
        const response = await fetch(url, {
            method,
            credentials: 'include',
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        const status = response.status;

        if (status === 401 && accessToken) {
            const cookieStore = await cookies();
            cookieStore.delete('admin_access_token');
            cookieStore.delete('admin_refresh_token');
            cookieStore.delete('accessToken');
            cookieStore.delete('refreshToken');
            redirect("http://localhost:3000/login");
        }
        
        // 응답 body를 텍스트로 먼저 읽기
        const responseText = await response.text();
        
        // JSON 파싱 시도
        try {
            const data = responseText ? JSON.parse(responseText) : {};
            return NextResponse.json(data, { status });
        } catch (parseError) {
            console.error('Failed to parse JSON response:', responseText);
            console.error('Parse error:', parseError);
            return NextResponse.json({ message: 'Invalid JSON response', raw: responseText }, { status: 500 });
        }
        
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
