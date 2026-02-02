import { getCookie } from "@/utils/cookie"
import { apiFetchHandler } from "@/utils/ApiFetchHandler"
import HttpMethod from "@/enums/HttpMethod"
import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// POST /api/ui-templates/purchase - Purchase a UI template
export async function POST(request: NextRequest) {
    try {
        const accessToken = await getCookie('accessToken');
        const refreshToken = await getCookie('refreshToken');

        if (accessToken == null && !refreshToken) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const body = await request.json();

        const res = await apiFetchHandler(
            `${API_BASE_URL}/api/ui-templates/purchase`,
            HttpMethod.POST,
            body,
            accessToken
        );

        const data = await res.json();

        if (!res.ok) {
            return new Response(JSON.stringify(data), { status: res.status, headers: { 'Content-Type': 'application/json' } });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in POST /api/ui-templates/purchase:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
