import { getCookie } from "@/utils/cookie"
import { apiFetchHandler } from "@/utils/ApiFetchHandler"
import HttpMethod from "@/enums/HttpMethod"
import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET /api/credits/history - Get credit history with pagination
export async function GET(request: NextRequest) {
    try {
        const accessToken = await getCookie('accessToken');
        const refreshToken = await getCookie('refreshToken');

        if (accessToken == null && !refreshToken) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page') || '0';
        const size = searchParams.get('size') || '10';
        const txType = searchParams.get('txType');

        let url = `${API_BASE_URL}/api/credits/history?page=${page}&size=${size}`;
        if (txType) {
            url += `&txType=${txType}`;
        }

        const res = await apiFetchHandler(url, HttpMethod.GET, undefined, accessToken);

        const data = await res.json();

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error in GET /api/credits/history:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
