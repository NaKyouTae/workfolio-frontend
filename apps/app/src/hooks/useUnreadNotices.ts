import { useState, useEffect, useCallback } from "react";
import { useUserStore } from "@workfolio/shared/store/userStore";

export const useUnreadNotices = () => {
    const [unreadCount, setUnreadCount] = useState(0);
    const { user } = useUserStore();

    const fetchUnreadCount = useCallback(async () => {
        if (!user) {
            setUnreadCount(0);
            return;
        }

        try {
            const response = await fetch("/api/notices/unread-count", {
                method: "GET",
            });

            if (!response.ok) {
                setUnreadCount(0);
                return;
            }

            const data = await response.json();
            setUnreadCount(data.unreadCount ?? 0);
        } catch {
            setUnreadCount(0);
        }
    }, [user]);

    const markAsRead = useCallback(async (noticeId: string) => {
        if (!user) return;

        try {
            await fetch(`/api/notices/${noticeId}/read`, {
                method: "POST",
            });
            // 읽음 처리 후 카운트 갱신
            setUnreadCount((prev) => Math.max(prev - 1, 0));
        } catch {
            // 실패해도 무시
        }
    }, [user]);

    useEffect(() => {
        fetchUnreadCount();
    }, [fetchUnreadCount]);

    return {
        unreadCount,
        hasUnread: unreadCount > 0,
        markAsRead,
        refreshUnreadCount: fetchUnreadCount,
    };
};
