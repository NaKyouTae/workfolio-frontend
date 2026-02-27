import { NextResponse } from "next/server";
import { apiFetchHandler } from "@workfolio/shared/utils/ApiFetchHandler";
import HttpMethod from "@workfolio/shared/enums/HttpMethod";
import { getCookie } from "@workfolio/shared/utils/cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface AdminDashboardStatsResponse {
    totalRecordGroups: number;
    totalRecords: number;
    totalTurnOvers: number;
    totalCareers: number;
    totalPaymentAmount: number;
    totalCreditUsedAmount: number;
    totalAttachments: number;
}

// GET /api/dashboard/stats - 어드민 대시보드 집계 조회
export async function GET() {
    try {
        const adminAccessToken = await getCookie("admin_access_token");

        if (!adminAccessToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const response = await apiFetchHandler<AdminDashboardStatsResponse>(
            `${API_BASE_URL}/api/admin/dashboard/stats`,
            HttpMethod.GET,
            null,
            adminAccessToken
        );

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return NextResponse.json(
            {
                totalRecordGroups: 0,
                totalRecords: 0,
                totalTurnOvers: 0,
                totalCareers: 0,
                totalPaymentAmount: 0,
                totalCreditUsedAmount: 0,
                totalAttachments: 0,
                error: "Internal server error",
            },
            { status: 500 }
        );
    }
}
