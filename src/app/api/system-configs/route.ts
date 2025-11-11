import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
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
        `${API_BASE_URL}/api/system-configs`, 
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