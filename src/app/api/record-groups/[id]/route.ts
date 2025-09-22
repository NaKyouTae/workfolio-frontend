import { NextResponse } from "next/server";
import { getCookie } from "@/utils/cookie";
import { apiFetchHandler } from "@/utils/ApiFetchHandler";
import HttpMethod from "@/enums/HttpMethod";
import { RecordGroupResponse } from "@/generated/record_group";
import { SuccessResponse } from "@/generated/common";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const requestData = await req.json();
        const id = params.id;
        const accessToken = await getCookie('accessToken');
        
        if (accessToken == null) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        
        const res = await apiFetchHandler<RecordGroupResponse>(`http://localhost:8080/api/record-groups/${id}`, HttpMethod.PUT, requestData, accessToken);
        const data = await res.json();
        
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error in PUT request:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const accessToken = await getCookie('accessToken');
        
        if (accessToken == null) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        console.log('id', id);
        
        const res = await apiFetchHandler<SuccessResponse>(`http://localhost:8080/api/record-groups/${id}`, HttpMethod.DELETE, null, accessToken);
        const data = await res.json();
        
        console.log('data', data);
        
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error in DELETE request:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}