import { getCookie } from "@/utils/cookie"
import { apiFetchHandler } from "@/utils/ApiFetchHandler"
import HttpMethod from "@/enums/HttpMethod"
import { NextResponse } from "next/server"
import { Record } from "@/generated/common"

export async function GET(request: Request) {
    try {
        const accessToken = await getCookie('accessToken');
        
        // accessToken이 없으면 401 응답 반환
        if (accessToken == null) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        
        // URL에서 쿼리 파라미터 추출
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const recordGroupIds = searchParams.get('recordGroupIds');
        
        // 필수 파라미터 검증
        if (!startDate || !endDate) {
            return new Response(JSON.stringify({ 
                error: 'Missing required parameters: startDate and endDate are required' 
            }), { status: 400 });
        }
    

        // 백엔드 API URL 구성
        let backendUrl = `http://localhost:8080/api/records/weekly?startDate=${startDate}&endDate=${endDate}`;

        // recordGroupIds가 있으면 추가
        if (recordGroupIds) {
            const groupIds = recordGroupIds.split(',').filter(id => id.trim() !== '');
            if (groupIds.length > 0) {
                backendUrl += `&recordGroupIds=${groupIds.join(',')}`;
            }
        }
        
        const res = await apiFetchHandler<Record[]>(backendUrl, HttpMethod.GET, undefined, accessToken);
        
        const data = await res.json()
        
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error in GET request for weekly records:', error);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { 
            status: 500, 
            headers: { 'Content-Type': 'application/json' } 
        });
    }
}
