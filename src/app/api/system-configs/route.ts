import { NextRequest, NextResponse } from "next/server";
import { getCookie } from "@/utils/cookie";
import { apiFetchHandler } from "@/utils/ApiFetchHandler";
import HttpMethod from "@/enums/HttpMethod";
import { SuccessResponse } from "@/generated/common";
import { SystemConfigUpdateRequest } from "@/generated/system_config";

export async function PUT(request: NextRequest) {
    try {
      const body: SystemConfigUpdateRequest = await request.json();
  
      const accessToken = await getCookie('accessToken');
        
      // accessToken이 없으면 401 응답 반환
      if (!accessToken) {
          return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
      }
    
      const res = await apiFetchHandler<SuccessResponse>(
        `http://localhost:8080/api/system-configs`, 
        HttpMethod.PUT, 
        body, 
        accessToken,
      );
  
      const data = await res.json();
  
      return NextResponse.json(data);
    } catch (error) {
      console.error('Error updating system config:', error);
      return NextResponse.json({ error: 'Failed to update system config' }, { status: 500 });
    }
  }