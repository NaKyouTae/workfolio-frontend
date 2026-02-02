import { getCookie } from "@/utils/cookie"
import { apiFetchHandler } from "@/utils/ApiFetchHandler"
import HttpMethod from "@/enums/HttpMethod"
import { NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET /api/credits - Get current credit balance
export async function GET() {
    try {
        const accessToken = await getCookie('accessToken');
        const refreshToken = await getCookie('refreshToken');

        if (accessToken == null && !refreshToken) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const res = await apiFetchHandler(`${API_BASE_URL}/api/credits`, HttpMethod.GET, undefined, accessToken);

        const data = await res.json();

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error in GET /api/credits:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
