import { NextRequest, NextResponse } from 'next/server';
import { StaffLoginRequest, StaffLoginResponse } from '@/generated/staff';
import { apiFetchHandler } from '@/utils/ApiFetchHandler';
import HttpMethod from '@/enums/HttpMethod';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// POST /api/staffs/login - 관리자 로그인
export async function POST(request: NextRequest) {
  try {
    const body: StaffLoginRequest = await request.json();

    const response = await apiFetchHandler<StaffLoginResponse>(
      `${API_BASE_URL}/api/staffs/login`,
      HttpMethod.POST,
      body
    );

    const data = await response.json();
    
    // 로그인 실패 시 에러 반환
    if (response.status !== 200) {
      return NextResponse.json(
        { error: data.error || data.message || 'Login failed' },
        { status: response.status }
      );
    }
    
    // 로그인 성공 시에만 토큰을 쿠키에 저장
    const res = NextResponse.json(data);
    
    // portal 토큰 제거 (admin 로그인 시)
    res.cookies.delete('accessToken');
    res.cookies.delete('refreshToken');
    
    // admin accessToken 쿠키 설정 (httpOnly, secure)
    res.cookies.set('admin_access_token', data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1일
      path: '/',
    });
    
    // admin refreshToken 쿠키 설정
    res.cookies.set('admin_refresh_token', data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: '/',
    });

    return res;
  } catch (error) {
    console.error('Error during staff login:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

