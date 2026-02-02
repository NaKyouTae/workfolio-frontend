import { NextRequest, NextResponse } from 'next/server';
import HttpMethod from '@/enums/HttpMethod';
import { ResumeDetail } from '@/generated/common';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface PublicResumeDetailResponse {
  resume?: ResumeDetail;
}

// GET /api/anonymous/resumes/[publicId] - 공개 이력서 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ publicId: string }> }
) {
  try {
    const { publicId } = await params;

    const res = await fetch(
      `${API_BASE_URL}/api/anonymous/resumes/${publicId}`,
      {
        method: HttpMethod.GET,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!res.ok) {
      if (res.status === 404 || res.status === 500) {
        return NextResponse.json(
          { error: '이력서를 찾을 수 없습니다.' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: '이력서를 불러오는데 실패했습니다.' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching public resume:', error);
    return NextResponse.json(
      { error: '이력서를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
