// src/components/portal/features/records/RecordsPage.tsx
import React, { useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from "@/components/portal/features/records/sidebar/Sidebar"
import RecordContents, { RecordContentsRef } from "@/components/portal/features/records/RecordContents"
import RecordConfig from './sidebar/records-config/RecordConfig';

import Footer from "@/components/portal/layouts/Footer"
import { useSystemConfigStore } from '@/store/systemConfigStore';
import { SystemConfig_SystemConfigType } from '@/generated/common';
import { useRecordGroups } from '@/hooks/useRecordGroups';

const RecordsPage = React.memo(() => {
    const router = useRouter();
    const pathname = usePathname();
    const recordContentsRef = useRef<RecordContentsRef>(null);
    
    // 🔥 최상위에서 useRecordGroups 한 번만 호출
    const recordGroupsData = useRecordGroups();
    
    // 최초 접근 시 systemConfig 로드
    const { fetchSystemConfig, getSystemConfig } = useSystemConfigStore();
    
    // URL 경로에 따라 모드 결정
    const isConfigMode = pathname === '/records/config';
    
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
            router.push('/records');
        } else {
            router.push('/records/config');
        }
    };

    const handleConfigClose = () => {
        router.push('/records');
    };

    return (
        <main>
            <Sidebar 
                onConfigToggle={handleConfigToggle}
                recordGroupsData={recordGroupsData}
            />
            <section>
                {isConfigMode ? (
                    <RecordConfig 
                        onClose={handleConfigClose}
                        recordGroupsData={recordGroupsData}
                    />
                ) : (
                    <RecordContents 
                        ref={recordContentsRef}
                        recordGroupsData={recordGroupsData}
                    />
                )}
                <Footer/>
            </section>
        </main>
    );
});

RecordsPage.displayName = 'RecordsPage';

export default RecordsPage;

