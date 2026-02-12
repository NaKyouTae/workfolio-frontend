import { useState, useCallback } from "react";
import { Worker } from "@workfolio/shared/generated/common";
import { SuccessResponse } from "@workfolio/shared/generated/common";
import { WorkerUpdateRequest, WorkerListResponse } from "@workfolio/shared/generated/worker";

export const useAdminUsers = () => {
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 전체 사용자 목록 조회
    const fetchWorkers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/workers");
            if (!response.ok) {
                throw new Error("Failed to fetch workers");
            }
            const data: WorkerListResponse = await response.json();
            setWorkers(data.workers || []);
            return data.workers;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Unknown error";
            setError(errorMessage);
            console.error("Error fetching workers:", err);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    // 사용자 수정
    const updateWorker = useCallback(
        async (request: WorkerUpdateRequest): Promise<boolean> => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch("/api/workers", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(request),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to update worker");
                }

                const data: SuccessResponse = await response.json();
                if (data.isSuccess) {
                    await fetchWorkers(); // 목록 새로고침
                }
                return data.isSuccess || false;
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Unknown error";
                setError(errorMessage);
                console.error("Error updating worker:", err);
                return false;
            } finally {
                setLoading(false);
            }
        },
        [fetchWorkers]
    );

    return {
        workers,
        loading,
        error,
        fetchWorkers,
        updateWorker,
    };
};
