import {getCookie} from "@/utils/cookie"
import {apiFetchHandler} from "@/utils/ApiFetchHandler"
import HttpMethod from "@/enums/HttpMethod"
import {NextResponse} from "next/server"
import { SuccessResponse } from "@/generated/common"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const accessToken = await getCookie('accessToken');
        
        if (accessToken == null) {
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
