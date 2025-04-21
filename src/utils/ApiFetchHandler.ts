import {NextResponse} from "next/server"
import HttpMethod from "@/enums/HttpMethod"

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
        
        // ✅ 응답 타입 확인 후 JSON 파싱
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            return NextResponse.json(data, { status: response.status });
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
