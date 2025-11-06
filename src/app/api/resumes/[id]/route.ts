import { NextRequest, NextResponse } from 'next/server';
import HttpMethod from '@/enums/HttpMethod';
import { getCookie } from '@/utils/cookie';
import { apiFetchHandler } from '@/utils/ApiFetchHandler';
import { SuccessResponse } from '@/generated/common';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    const accessToken = await getCookie('accessToken');
      
      // accessToken이 없으면 401 응답 반환
      if (!accessToken) {
          return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
      }
    
    const res = await apiFetchHandler<SuccessResponse>(
      `http://localhost:8080/api/resumes/${id}`, 
      HttpMethod.PUT, 
      null, 
      accessToken,
    );
    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Error updating resume:', error);
    return NextResponse.json({ error: 'Failed to update resumes' }, { status: 500 });
  }
}

// DELETE /api/resumes/{id} - 이력서 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const accessToken = await getCookie('accessToken');
      
    // accessToken이 없으면 401 응답 반환
    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
    }
    
    const res = await apiFetchHandler(
      `http://localhost:8080/api/resumes/${id}`, 
      HttpMethod.DELETE, 
      null, 
      accessToken,
    );

    if (res.status === 204 || res.status === 200) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Error deleting resume:', error);
    return NextResponse.json({ error: 'Failed to delete resume' }, { status: 500 });
  }
}

