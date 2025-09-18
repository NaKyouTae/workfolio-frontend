import { getCookie } from "@/utils/cookie"
import { apiFetchHandler } from "@/utils/ApiFetchHandler"
import HttpMethod from "@/enums/HttpMethod"
import { NextResponse } from "next/server"
import { Record } from "@/generated/common"

/**
 * 주간 레코드 조회 API
 * Query Parameters:
 * - year: int (년도)
 * - month: int (월, 1-12)
 * - week: int (주차, 1-5)
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
        const week = searchParams.get('week');
        const recordGroupIds = searchParams.get('recordGroupIds');
        
        // 필수 파라미터 검증
        if (!year || !month || !week) {
            return new Response(JSON.stringify({ 
                error: 'Missing required parameters: year, month, and week are required' 
            }), { status: 400 });
        }
        
        // 년도, 월, 주차가 유효한지 검증
        const yearNum = parseInt(year);
        const monthNum = parseInt(month);
        const weekNum = parseInt(week);
        
        if (isNaN(yearNum) || isNaN(monthNum) || isNaN(weekNum) || 
            monthNum < 1 || monthNum > 12 || weekNum < 1 || weekNum > 5) {
            return new Response(JSON.stringify({ 
                error: 'Invalid parameters: year must be a valid number, month must be between 1-12, and week must be between 1-5' 
            }), { status: 400 });
        }
        
        // 백엔드 API URL 구성
        let backendUrl = `http://localhost:8080/api/records/weekly?year=${yearNum}&month=${monthNum}&week=${weekNum}`;
        
        // recordGroupIds가 있으면 추가
        if (recordGroupIds) {
            const groupIds = recordGroupIds.split(',').filter(id => id.trim() !== '');
            if (groupIds.length > 0) {
                backendUrl += `&recordGroupIds=${groupIds.join(',')}`;
            }
        }
        
        const res = await apiFetchHandler<Record[]>(backendUrl, HttpMethod.GET, undefined, accessToken);
        
        const data = await res.json()
        
        return NextResponse.json({
            records: data.records,
            type: 'weekly',
            year: yearNum,
            month: monthNum,
            week: weekNum,
            recordGroupIds: recordGroupIds ? recordGroupIds.split(',').filter(id => id.trim() !== '') : []
        })
    } catch (error) {
        console.error('Error in GET request for weekly records:', error);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { 
            status: 500, 
            headers: { 'Content-Type': 'application/json' } 
        });
    }
}
