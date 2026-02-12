import { getCookie } from "@workfolio/shared/utils/cookie"
import { apiFetchHandler } from "@workfolio/shared/utils/ApiFetchHandler"
import HttpMethod from "@workfolio/shared/enums/HttpMethod"
import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET /api/payments - Get payment history with pagination
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

        const res = await apiFetchHandler(
            `${API_BASE_URL}/api/payments?page=${page}&size=${size}`,
            HttpMethod.GET,
            undefined,
            accessToken
        );

        const data = await res.json();

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error in GET /api/payments:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

// POST /api/payments - Create payment
export async function POST(request: NextRequest) {
    try {
        const accessToken = await getCookie('accessToken');
        const refreshToken = await getCookie('refreshToken');

        if (accessToken == null && !refreshToken) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const body = await request.json();

        const res = await apiFetchHandler(
            `${API_BASE_URL}/api/payments`,
            HttpMethod.POST,
            body,
            accessToken
        );

        const data = await res.json();

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error in POST /api/payments:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
