import { NextResponse } from "next/server";
import { getCookie } from "@/utils/cookie";
import { apiFetchHandler } from "@/utils/ApiFetchHandler";
import HttpMethod from "@/enums/HttpMethod";
import { CreateRecordGroupResponse } from "@/generated/record_group";
import { SuccessResponse } from "@/generated/common";

export async function PUT(req: Request, { params }: { params: { recordGroupId: string } }) {
    try {
        const requestData = await req.json();
        const recordGroupId = params.recordGroupId;
        const accessToken = await getCookie('accessToken');
        
        if (accessToken == null) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        
        const res = await apiFetchHandler<CreateRecordGroupResponse>(`http://localhost:8080/api/record-groups/${recordGroupId}`, HttpMethod.PUT, requestData, accessToken);
        const data = await res.json();
        
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error in PUT request:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function DELETE(req: Request, { params }: { params: { recordGroupId: string } }) {
    try {
        const recordGroupId = params.recordGroupId;
        const accessToken = await getCookie('accessToken');
        
        if (accessToken == null) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        
        const res = await apiFetchHandler<SuccessResponse>(`http://localhost:8080/api/record-groups/${recordGroupId}`, HttpMethod.DELETE, null, accessToken);
        const data = await res.json();
        
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error in DELETE request:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}