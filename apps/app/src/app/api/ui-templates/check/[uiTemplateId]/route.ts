import { getCookie } from "@workfolio/shared/utils/cookie"
import { apiFetchHandler } from "@workfolio/shared/utils/ApiFetchHandler"
import HttpMethod from "@workfolio/shared/enums/HttpMethod"
import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET /api/ui-templates/check/[uiTemplateId] - Check UI template ownership
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ uiTemplateId: string }> }
) {
    try {
        const accessToken = await getCookie('accessToken');
        const refreshToken = await getCookie('refreshToken');

        if (accessToken == null && !refreshToken) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const { uiTemplateId } = await params;
        const res = await apiFetchHandler(
            `${API_BASE_URL}/api/ui-templates/check/${uiTemplateId}`,
            HttpMethod.GET,
            undefined,
            accessToken
        );

        const data = await res.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in GET /api/ui-templates/check/[uiTemplateId]:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
