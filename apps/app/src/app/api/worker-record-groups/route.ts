import { SuccessResponse } from "@workfolio/shared/generated/common";
import { apiFetchHandler } from "@workfolio/shared/utils/ApiFetchHandler";
import HttpMethod from "@workfolio/shared/enums/HttpMethod";
import { getCookie } from "@workfolio/shared/utils/cookie";
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const recordGroupId = searchParams.get('recordGroupId');
        const targetWorkerId = searchParams.get('targetWorkerId');
        const accessToken = await getCookie('accessToken');
        const refreshToken = await getCookie('refreshToken');

        if (accessToken == null && !refreshToken) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const res = await apiFetchHandler<SuccessResponse>(`${API_BASE_URL}/api/worker-record-groups?recordGroupId=${recordGroupId}&targetWorkerId=${targetWorkerId}`, HttpMethod.DELETE, null, accessToken);

        const data = await res.json();

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error in DELETE request:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
