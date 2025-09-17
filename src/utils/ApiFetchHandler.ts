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
        
        const response = await fetch(url, {
            method,
            credentials: 'include',
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });
        
        const status = response.status
        const contentType = response.headers.get('content-type');

        if (status === 401 && accessToken) {
            const cookieStore = await cookies();
            cookieStore.delete('accessToken');
            cookieStore.delete('refreshToken');
            redirect("http://localhost:3000/login");
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
