// src/components/portal/features/records/RecordsPage.tsx
import React, { useRef, useState, useEffect, Suspense } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/features/records/sidebar/Sidebar";
import RecordContents, {
    RecordContentsRef,
} from "@/components/features/records/RecordContents";
import RecordDashboard from "@/components/features/records/dashboard/RecordDashboard";
import RecordConfigModal from "./sidebar/records-config/RecordConfigModal";

import Footer from "@/components/layouts/Footer";
import { useSystemConfigStore } from "@workfolio/shared/store/systemConfigStore";
import { SystemConfig_SystemConfigType } from "@workfolio/shared/generated/common";
import { useRecordGroups } from "@/hooks/useRecordGroups";

const RecordsPage = React.memo(() => {
    const pathname = usePathname();
    const recordContentsRef = useRef<RecordContentsRef>(null);
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [showDashboard, setShowDashboard] = useState(true);

    // 최상위에서 useRecordGroups 한 번만 호출
    const recordGroupsData = useRecordGroups();

    // 최초 접근 시 systemConfig 로드
    const { fetchSystemConfig, getSystemConfig } = useSystemConfigStore();

    // 페이지 접근 시에만 샘플 데이터 리프레시
    useEffect(() => {
        if (pathname === "/records") {
            recordGroupsData.refreshRecordGroups(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

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
        setIsConfigModalOpen(prev => !prev);
    };

    const handleConfigClose = () => {
        setIsConfigModalOpen(false);
    };

    const handleGoHome = () => {
        setShowDashboard(true);
    };

    const handleGoRecords = () => {
        setShowDashboard(false);
    };

    return (
        <main>
            <Sidebar
                onConfigToggle={handleConfigToggle}
                recordGroupsData={recordGroupsData}
                showDashboard={showDashboard}
                onGoHome={handleGoHome}
                onGoRecords={handleGoRecords}
            />
            <section>
                {showDashboard ? (
                    <RecordDashboard allRecordGroups={recordGroupsData.allRecordGroups} />
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
            <RecordConfigModal
                isOpen={isConfigModalOpen}
                onClose={handleConfigClose}
            />
        </main>
    );
});

RecordsPage.displayName = "RecordsPage";

export default RecordsPage;
