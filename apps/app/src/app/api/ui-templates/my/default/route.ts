import { getCookie } from "@workfolio/shared/utils/cookie"
import { apiFetchHandler } from "@workfolio/shared/utils/ApiFetchHandler"
import HttpMethod from "@workfolio/shared/enums/HttpMethod"
import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET /api/ui-templates/my/default - Get default UI templates
export async function GET(request: NextRequest) {
    try {
        const accessToken = await getCookie('accessToken');
        const refreshToken = await getCookie('refreshToken');

        if (accessToken == null && !refreshToken) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const url = `${API_BASE_URL}/api/ui-templates/my/default`;

        const res = await apiFetchHandler(url, HttpMethod.GET, undefined, accessToken);
        const data = await res.json();

        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error('Error in GET /api/ui-templates/my/default:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
