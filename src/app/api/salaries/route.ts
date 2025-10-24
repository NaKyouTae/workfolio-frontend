import { NextRequest, NextResponse } from 'next/server';
import { getCookie } from '@/utils/cookie';
import { apiFetchHandler } from '@/utils/ApiFetchHandler';
import HttpMethod from '@/enums/HttpMethod';
import { SalaryListResponse, SalaryResponse } from '@/generated/salary';

// GET /api/salaries - 급여 목록 조회
export async function GET(request: NextRequest) {
  const companiesIds = request.nextUrl.searchParams.get('companiesIds');
  try {
    const accessToken = await getCookie('accessToken');
      
    // accessToken이 없으면 401 응답 반환
    if (!accessToken) {
        return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
    }
    
    const res = await apiFetchHandler<SalaryListResponse>(
      `http://localhost:8080/api/salaries?companiesIds=${companiesIds}`, 
      HttpMethod.GET, 
      null, 
      accessToken,
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching salaries:', error);
    return NextResponse.json({ error: 'Failed to fetch salaries' }, { status: 500 });
  }
}

// POST /api/salaries - 급여 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const accessToken = await getCookie('accessToken');
      
      // accessToken이 없으면 401 응답 반환
      if (!accessToken) {
          return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
      }
    
    const res = await apiFetchHandler<SalaryResponse>(
      'http://localhost:8080/api/salaries', 
      HttpMethod.POST, 
      body, 
      accessToken,
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating salary:', error);
    return NextResponse.json({ error: 'Failed to create salary' }, { status: 500 });
  }
}

// PUT /api/salaries - 급여 수정
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    const accessToken = await getCookie('accessToken');
      
        // accessToken이 없으면 401 응답 반환
      if (!accessToken) {
          return new Response(JSON.stringify({ error: 'Access token not found' }), { status: 401 });
      }
    
    const res = await apiFetchHandler<SalaryResponse>(
      'http://localhost:8080/api/salaries', 
      HttpMethod.PUT, 
      body, 
      accessToken,
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating salary:', error);
    return NextResponse.json({ error: 'Failed to update salary' }, { status: 500 });
  }
}
