import {NextResponse} from "next/server"
import HttpMethod from "@/enums/HttpMethod"
import {cookies} from "next/headers"
import {redirect} from "next/navigation"

export async function apiFetchHandler<T>(
    url: string,
    method: HttpMethod = HttpMethod.GET,
    body?: any,
    accessToken?: string
): Promise<NextResponse<T> | NextResponse<{ message: string }>> {
    try {
        const headers: HeadersInit = {
            'Content-Type': "application/json",
        };
        
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        } else {
            console.log('Unauthorized - Not found Access Token', accessToken)
            return NextResponse.json({ message: 'Unauthorized - Not found Access Token' }, { status: 401 });
        }
        
        const response = await fetch(url, {
            method,
            credentials: 'include',
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });
        
        const status = response.status
        const contentType = response.headers.get('content-type');
        
        console.log(status, contentType)
        
        
        if (status === 401) {
            // 🔑 토큰 삭제
            const cookieStore = await cookies();
            cookieStore.delete('accessToken'); // 실제 쿠키 이름으로 수정
            cookieStore.delete('refreshToken'); // 있다면 같이
            
            // 🔁 로그인 페이지로 리다이렉트
            redirect("http://localhost:3000/login")
        }
        
        
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            return NextResponse.json(data, { status });
        } else {
            const errorText = await response.text();
            console.error('Unexpected Response:', errorText);
            return NextResponse.json({ message: 'Invalid response format' }, { status: 500 });
        }
        
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
