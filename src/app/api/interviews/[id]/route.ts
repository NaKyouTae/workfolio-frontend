import { SuccessResponse } from "@/generated/common";
import { apiFetchHandler } from "@/utils/ApiFetchHandler";
import HttpMethod from "@/enums/HttpMethod";
import { getCookie } from "@/utils/cookie";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const accessToken = await getCookie('accessToken');
        
        if (accessToken == null) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        
        const res = await apiFetchHandler<SuccessResponse>(`http://localhost:8080/api/interviews/${id}`, HttpMethod.DELETE, null, accessToken);
    
        const data = await res.json();
        
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error in DELETE request:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}