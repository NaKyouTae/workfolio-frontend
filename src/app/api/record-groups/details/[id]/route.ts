import { NextResponse } from "next/server";
import { getCookie } from "@/utils/cookie";
import { apiFetchHandler } from "@/utils/ApiFetchHandler";
import HttpMethod from "@/enums/HttpMethod";
import { RecordGroupDetailResponse } from "@/generated/record_group";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const accessToken = await getCookie('accessToken');
        
        // accessToken이 없으면 401 응답 반환
        if (accessToken == null) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        
        const res = await apiFetchHandler<RecordGroupDetailResponse[]>(`${API_BASE_URL}/api/record-groups/details/${id}`, HttpMethod.GET, undefined, accessToken);
        
        const data = await res.json()
        
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error in GET request:', error);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}