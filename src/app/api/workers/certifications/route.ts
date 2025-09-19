import { CertificationsListResponse, CertificationsResponse } from '@/generated/certifications';
import { apiFetchHandler } from '@/utils/ApiFetchHandler';
import { getCookie } from '@/utils/cookie';
import HttpMethod from '@/enums/HttpMethod';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/workers/certifications - 자격증 목록 조회
export async function GET() {
  try {
      const accessToken = await getCookie('accessToken');
      
      // accessToken이 없으면 401 응답 반환
      if (!accessToken) {
          return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
      }
      
      const res = await apiFetchHandler<CertificationsListResponse>(
          'http://localhost:8080/api/workers/certifications', 
          HttpMethod.GET, 
          null, 
          accessToken,
      );
      
      // 응답이 정상적인 경우
      const data = await res.json();
      
      return NextResponse.json(data);
  } catch (error) {
      console.error('Error in certifications list request:', error);
      return new Response(JSON.stringify({ error: 'Certifications list failed' }), { status: 401 });
  }
}

// POST /api/workers/certifications - 자격증 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const accessToken = await getCookie('accessToken');
      
      // accessToken이 없으면 401 응답 반환
      if (!accessToken) {
          return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
      }
    
    const res = await apiFetchHandler<CertificationsResponse>(
      'http://localhost:8080/api/workers/certifications', 
      HttpMethod.POST, 
      body, 
      accessToken,
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating certifications:', error);
    return NextResponse.json({ error: 'Failed to create certifications' }, { status: 500 });
  }
}

// PUT /api/workers/certifications - 자격증 수정
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    const accessToken = await getCookie('accessToken');
      
      // accessToken이 없으면 401 응답 반환
      if (!accessToken) {
          return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
      }
    
    const res = await apiFetchHandler<CertificationsResponse>(
      'http://localhost:8080/api/workers/certifications', 
      HttpMethod.PUT, 
      body, 
      accessToken,
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating certification:', error);
    return NextResponse.json({ error: 'Failed to update certification' }, { status: 500 });
  }
}
