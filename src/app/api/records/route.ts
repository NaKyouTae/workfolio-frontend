import {getCookie} from "@/utils/cookie"
import {apiFetchHandler} from "@/utils/ApiFetchHandler"
import HttpMethod from "@/enums/HttpMethod"
import {Record} from "../../../../generated/common"
import {NextResponse} from "next/server"

export async function GET(request: Request) {
    try {
        const accessToken = await getCookie('accessToken');
        
        // accessToken이 없으면 401 응답 반환
        if (accessToken == null) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        
        // URL에서 쿼리 파라미터 추출
        const { searchParams } = new URL(request.url);
        const month = searchParams.get('month');
        const year = searchParams.get('year');
        const search = searchParams.get('search');
        
        // 기본값 설정
        const currentDate = new Date();
        const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
        const targetYear = year ? parseInt(year) : currentDate.getFullYear();
        
        // API URL 구성
        let apiUrl = `http://localhost:8080/api/records?month=${targetMonth}&year=${targetYear}`;
        if (search) {
            apiUrl += `&search=${encodeURIComponent(search)}`;
        }
        
        const res = await apiFetchHandler<Record[]>(apiUrl, HttpMethod.GET, null, accessToken);
        
        const data = await res.json()
        
        return NextResponse.json({
            records: data.records,
            month: targetMonth,
            year: targetYear,
            search: search || ''
        })
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
