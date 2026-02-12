import { useState, useEffect, useCallback } from "react";
import { ReleaseNoticeListResponse } from "@workfolio/shared/generated/release";

export interface Notice {
    id: string;
    title: string;
    content: string;
    author: string;
    createdAt: number;
    views: number;
    isImportant: boolean;
}

export const useNotices = () => {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNotices = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch("/api/release/notices", {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch notices: ${response.status}`);
            }

            const data: ReleaseNoticeListResponse = await response.json();

            // ReleaseNoticeListResponse 구조: { notices: Notice[] }
            const noticesData = data.notices || [];

            setNotices(
                noticesData.map((notice) => ({
                    id: notice.id,
                    title: notice.title,
                    content: notice.content,
                    author: "관리자",
                    createdAt: notice.createdAt,
                    views: 0,
                    isImportant: notice.isPinned || false,
                }))
            );
        } catch (err) {
            console.error("Error fetching notices:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch notices");
            setNotices([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotices();
    }, [fetchNotices]);

    return {
        notices,
        isLoading,
        error,
        refreshNotices: fetchNotices,
        isSampleData: false, // 인증 불필요하므로 항상 false
    };
};
