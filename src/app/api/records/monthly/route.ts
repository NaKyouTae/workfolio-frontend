import { getCookie } from "@/utils/cookie"
import { apiFetchHandler } from "@/utils/ApiFetchHandler"
import HttpMethod from "@/enums/HttpMethod"
import { NextResponse } from "next/server"
import { Record } from "@/generated/common"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * 월간 레코드 조회 API
 * Query Parameters:
 * - year: int (년도)
 * - month: int (월, 1-12)
 * - recordGroupIds: List<String> (레코드 그룹 ID 목록)
 */
export async function GET(request: Request) {
    try {
        const accessToken = await getCookie('accessToken');
        
        // accessToken이 없으면 401 응답 반환
        if (accessToken == null) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        
        // URL에서 쿼리 파라미터 추출
        const { searchParams } = new URL(request.url);
        const year = searchParams.get('year');
        const month = searchParams.get('month');
        const recordGroupIds = searchParams.get('recordGroupIds');
        
        // 필수 파라미터 검증
        if (!year || !month) {
            return new Response(JSON.stringify({ 
                error: 'Missing required parameters: year and month are required' 
            }), { status: 400 });
        }
        
        // 년도와 월이 유효한지 검증
        const yearNum = parseInt(year);
        const monthNum = parseInt(month);
        
        if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
            return new Response(JSON.stringify({ 
                error: 'Invalid parameters: year must be a valid number and month must be between 1-12' 
            }), { status: 400 });
        }
        
        // 백엔드 API URL 구성
        let backendUrl = `${API_BASE_URL}/api/records/monthly?year=${yearNum}&month=${monthNum}`;
        
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
        console.error('Error in GET request for monthly records:', error);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { 
            status: 500, 
            headers: { 'Content-Type': 'application/json' } 
        });
    }
}
