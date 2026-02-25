import { getCookie } from "@workfolio/shared/utils/cookie"
import { apiFetchHandler } from "@workfolio/shared/utils/ApiFetchHandler"
import HttpMethod from "@workfolio/shared/enums/HttpMethod"
import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// DELETE /api/ui-templates/my/[workerUITemplateId] - Delete (deactivate) owned template
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ workerUITemplateId: string }> }
) {
    try {
        const accessToken = await getCookie('accessToken');
        const refreshToken = await getCookie('refreshToken');

        if (accessToken == null && !refreshToken) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const { workerUITemplateId } = await params;
        const res = await apiFetchHandler(
            `${API_BASE_URL}/api/ui-templates/my/${workerUITemplateId}`,
            HttpMethod.DELETE,
            undefined,
            accessToken
        );

        const data = await res.json();

        if (!res.ok) {
            return new Response(JSON.stringify(data), { status: res.status, headers: { 'Content-Type': 'application/json' } });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in DELETE /api/ui-templates/my/[workerUITemplateId]:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
