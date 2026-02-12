import { getCookie } from "@workfolio/shared/utils/cookie"
import { apiFetchHandler } from "@workfolio/shared/utils/ApiFetchHandler"
import HttpMethod from "@workfolio/shared/enums/HttpMethod"
import { NextResponse } from "next/server"
import { RecordGroupResponse } from "@workfolio/shared/generated/record_group"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET() {
    try {
        const accessToken = await getCookie('accessToken');
        const refreshToken = await getCookie('refreshToken');

        if (accessToken == null && !refreshToken) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const res = await apiFetchHandler<RecordGroupResponse[]>(`${API_BASE_URL}/api/record-groups/editable`, HttpMethod.GET, undefined, accessToken);

        const data = await res.json()

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error in GET request:', error);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
