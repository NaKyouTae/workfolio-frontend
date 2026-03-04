// src/components/portal/features/records/RecordsPage.tsx
import React, { useRef, useEffect, Suspense } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/features/records/sidebar/Sidebar";
import RecordContents, {
    RecordContentsRef,
} from "@/components/features/records/RecordContents";
import RecordConfig from "./sidebar/records-config/RecordConfig";

import Footer from "@/components/layouts/Footer";
import { useSystemConfigStore } from "@workfolio/shared/store/systemConfigStore";
import { SystemConfig_SystemConfigType } from "@workfolio/shared/generated/common";
import { useRecordGroups } from "@/hooks/useRecordGroups";

const RecordsPage = React.memo(() => {
    const router = useRouter();
    const pathname = usePathname();
    const recordContentsRef = useRef<RecordContentsRef>(null);

    // 🔥 최상위에서 useRecordGroups 한 번만 호출
    const recordGroupsData = useRecordGroups();

    // 최초 접근 시 systemConfig 로드
    const { fetchSystemConfig, getSystemConfig } = useSystemConfigStore();

    // URL 경로에 따라 모드 결정
    const isConfigMode = pathname === "/records/config";

    // 페이지 접근 시에만 샘플 데이터 리프레시
    useEffect(() => {
        // 기록 관리 페이지 접근 시에만 리프레시 (강제 리프레시)
        if (pathname === "/records" || pathname === "/records/config") {
            // forceRefresh=true로 호출하여 페이지 접근 시에만 샘플 데이터 생성
            recordGroupsData.refreshRecordGroups(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]); // pathname 변경 시에만 실행

    useEffect(() => {
        const loadConfig = async () => {
            // DEFAULT_RECORD_TYPE 미리 로드
            await fetchSystemConfig(SystemConfig_SystemConfigType.DEFAULT_RECORD_TYPE);
        };

        // 이미 로드되어 있으면 바로 설정
        const existingConfig = getSystemConfig(SystemConfig_SystemConfigType.DEFAULT_RECORD_TYPE);
        if (!existingConfig) {
            loadConfig();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // 마운트 시 한 번만 실행 - Zustand store 함수들은 안정적

    const handleConfigToggle = () => {
        if (isConfigMode) {
            router.push("/records");
        } else {
            router.push("/records/config");
        }
    };

    const handleConfigClose = () => {
        router.push("/records");
    };

    return (
        <main>
            <Sidebar onConfigToggle={handleConfigToggle} recordGroupsData={recordGroupsData} />
            <section>
                {isConfigMode ? (
                    <RecordConfig onClose={handleConfigClose} recordGroupsData={recordGroupsData} />
                ) : (
                    <Suspense fallback={<></>}>
                        <RecordContents
                            ref={recordContentsRef}
                            recordGroupsData={recordGroupsData}
                        />
                    </Suspense>
                )}
                <Footer />
            </section>
        </main>
    );
});

RecordsPage.displayName = "RecordsPage";

export default RecordsPage;
