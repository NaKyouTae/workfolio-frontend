import {getCookie} from "@workfolio/shared/utils/cookie"
import {apiFetchHandler} from "@workfolio/shared/utils/ApiFetchHandler"
import HttpMethod from "@workfolio/shared/enums/HttpMethod"
import {NextResponse} from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET() {
    try {
        const accessToken = await getCookie('accessToken');
        const refreshToken = await getCookie('refreshToken');

        // 토큰이 있으면 백엔드에 로그아웃 요청 (실패해도 상관없음)
        if (accessToken || refreshToken) {
            await apiFetchHandler(`${API_BASE_URL}/api/logout`, HttpMethod.GET, undefined, accessToken);
        }

        // 쿠키 삭제 (백엔드 호출 성공 여부와 관계없이)
        const res = NextResponse.json({ success: true });
        res.cookies.delete('accessToken');
        res.cookies.delete('refreshToken');
        res.cookies.delete('admin_access_token');
        res.cookies.delete('admin_refresh_token');

        return res;
    } catch (error) {
        console.error('Error in GET request:', error);
        // 에러가 발생해도 쿠키는 삭제
        const res = NextResponse.json({ success: true });
        res.cookies.delete('accessToken');
        res.cookies.delete('refreshToken');
        res.cookies.delete('admin_access_token');
        res.cookies.delete('admin_refresh_token');
        return res;
    }
}
