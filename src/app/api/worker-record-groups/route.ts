import { SuccessResponse } from "@/generated/common";
import { apiFetchHandler } from "@/utils/ApiFetchHandler";
import HttpMethod from "@/enums/HttpMethod";
import { getCookie } from "@/utils/cookie";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const recordGroupId = searchParams.get('recordGroupId');
        const targetWorkerId = searchParams.get('targetWorkerId');
        const accessToken = await getCookie('accessToken');
        
        if (accessToken == null) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        
        const res = await apiFetchHandler<SuccessResponse>(`http://localhost:8080/api/worker-record-groups?recordGroupId=${recordGroupId}&targetWorkerId=${targetWorkerId}`, HttpMethod.DELETE, null, accessToken);
    
        const data = await res.json();
        
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error in DELETE request:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}