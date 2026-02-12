import {getCookie} from "@workfolio/shared/utils/cookie"
import {apiFetchHandler} from "@workfolio/shared/utils/ApiFetchHandler"
import HttpMethod from "@workfolio/shared/enums/HttpMethod"
import {NextResponse} from "next/server"
import { SuccessResponse } from "@workfolio/shared/generated/common"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const accessToken = await getCookie('accessToken');
        const refreshToken = await getCookie('refreshToken');

        if (accessToken == null && !refreshToken) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const res = await apiFetchHandler<SuccessResponse>(`${API_BASE_URL}/api/records/${id}`, HttpMethod.DELETE, null, accessToken);
        const data = await res.json();

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error in DELETE request:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
