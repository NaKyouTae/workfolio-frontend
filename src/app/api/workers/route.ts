import { NextRequest, NextResponse } from "next/server";
import { apiFetchHandler } from "@/utils/ApiFetchHandler";
import HttpMethod from "@/enums/HttpMethod";
import { getCookie } from "@/utils/cookie";
import { WorkerListResponse, WorkerUpdateRequest } from "@/generated/worker";
import { SuccessResponse } from "@/generated/common";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET /api/workers - 사용자 목록 조회
export async function GET() {
    try {
        const adminAccessToken = await getCookie("admin_access_token");

        if (!adminAccessToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const response = await apiFetchHandler<WorkerListResponse>(
            `${API_BASE_URL}/api/workers`,
            HttpMethod.GET,
            null,
            adminAccessToken
        );

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching workers:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// PUT /api/workers - 사용자 수정
export async function PUT(request: NextRequest) {
    try {
        const adminAccessToken = await getCookie("admin_access_token");

        if (!adminAccessToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body: WorkerUpdateRequest = await request.json();

        const response = await apiFetchHandler<SuccessResponse>(
            `${API_BASE_URL}/api/workers`,
            HttpMethod.PUT,
            body,
            adminAccessToken
        );

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Error updating worker:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
