import { NextRequest, NextResponse } from 'next/server';

// POST /api/staffs/logout - 관리자 로그아웃
export async function POST(request: NextRequest) {
  try {
    const res = NextResponse.json({ success: true });
    
    // 쿠키 삭제
    res.cookies.delete('admin_access_token');
    res.cookies.delete('admin_refresh_token');

    return res;
  } catch (error) {
    console.error('Error during staff logout:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

