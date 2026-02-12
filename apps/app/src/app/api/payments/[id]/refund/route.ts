import { getCookie } from "@workfolio/shared/utils/cookie"
import { apiFetchHandler } from "@workfolio/shared/utils/ApiFetchHandler"
import HttpMethod from "@workfolio/shared/enums/HttpMethod"
import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// POST /api/payments/[id]/refund - Request refund
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const accessToken = await getCookie('accessToken');
        const refreshToken = await getCookie('refreshToken');

        if (accessToken == null && !refreshToken) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        const res = await apiFetchHandler(
            `${API_BASE_URL}/api/payments/${id}/refund`,
            HttpMethod.POST,
            body,
            accessToken
        );

        const data = await res.json();

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error in POST /api/payments/[id]/refund:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
