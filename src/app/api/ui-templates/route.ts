import { getCookie } from "@/utils/cookie"
import { apiFetchHandler } from "@/utils/ApiFetchHandler"
import HttpMethod from "@/enums/HttpMethod"
import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET /api/ui-templates - Get all UI templates (authenticated)
export async function GET(request: NextRequest) {
    try {
        const accessToken = await getCookie('accessToken');
        const refreshToken = await getCookie('refreshToken');

        if (accessToken == null && !refreshToken) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');

        let url = `${API_BASE_URL}/api/ui-templates`;
        if (type) {
            url += `?type=${type}`;
        }

        const res = await apiFetchHandler(url, HttpMethod.GET, undefined, accessToken);
        const data = await res.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in GET /api/ui-templates:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
