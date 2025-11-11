import {getCookie} from "@/utils/cookie"
import {apiFetchHandler} from "@/utils/ApiFetchHandler"
import HttpMethod from "@/enums/HttpMethod"
import {NextResponse} from "next/server"
import {RecordGroupResponse} from "@/generated/record_group"

export async function POST(req: Request) {
    try {
        const requestData = await req.json();        
        const accessToken = await getCookie('accessToken');
        
        // accessToken이 없으면 401 응답 반환
        if (accessToken == null) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        console.log('requestData', requestData);
        
        const res = await apiFetchHandler<RecordGroupResponse>(`${API_BASE_URL}/api/record-groups`, HttpMethod.POST, requestData, accessToken);
        
        // 응답이 정상적인 경우
        const data = await res.json();

        console.log('data', data);
        
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error in POST request:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
