import {getCookie} from "@/utils/cookie"
import {apiFetchHandler} from "@/utils/ApiFetchHandler"
import HttpMethod from "@/enums/HttpMethod"
import {Record} from "../../../../generated/common"
import {NextResponse} from "next/server"

export async function GET() {
    try {
        const accessToken = await getCookie('accessToken');
        
        // accessToken이 없으면 401 응답 반환
        if (accessToken == null) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        
        const res = await apiFetchHandler<Record[]>(`http://localhost:8080/api/records`, HttpMethod.GET, null, accessToken);
        
        const data = await res.json()
        
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error in GET request:', error);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function POST(req: Request) {
    const requestData = await req.json();
    const accessToken = await getCookie('accessToken');
    
    if(accessToken == null) return
    
    return await apiFetchHandler('http://localhost:8080/api/records', HttpMethod.POST, requestData, accessToken);
}
