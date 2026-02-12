import { apiFetchHandler } from "@workfolio/shared/utils/ApiFetchHandler"
import HttpMethod from "@workfolio/shared/enums/HttpMethod"
import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET /api/anonymous/ui-templates - Get all UI templates (public)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');

        let url = `${API_BASE_URL}/api/anonymous/ui-templates`;
        if (type) {
            url += `?type=${type}`;
        }

        const res = await apiFetchHandler(url, HttpMethod.GET);
        const data = await res.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in GET /api/anonymous/ui-templates:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
