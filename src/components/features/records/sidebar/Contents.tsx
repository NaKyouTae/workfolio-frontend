// src/components/layouts/Contents.tsx
import React, { useRef, useState, useEffect, useCallback } from 'react';
import Sidebar from "@/components/features/records/sidebar/Sidebar"
import BodyRight, { BodyRightRef } from "@/components/features/records/sidebar/BodyRight"

import Footer from "@/components/layouts/Footer"
import { useSystemConfigStore } from '@/store/systemConfigStore';
import { SystemConfig_SystemConfigType } from '@/generated/common';
import { useRecordGroups } from '@/hooks/useRecordGroups';
import { useCompanies } from '@/hooks/useCompanies';
import RecordConfig from './records-config/RecordConfig';

const Contents = React.memo(() => {
    const bodyRightRef = useRef<BodyRightRef>(null);
    const [isConfigMode, setIsConfigMode] = useState(false);
    const [isConfigLoaded, setIsConfigLoaded] = useState(false);
    
    // 🔥 최상위에서 useRecordGroups 한 번만 호출
    const recordGroupsData = useRecordGroups();
    
    // 🔥 최상위에서 useCompanies 한 번만 호출
    const companiesData = useCompanies();
    
    // 최초 접근 시 systemConfig 로드
    const { fetchSystemConfig, getSystemConfig } = useSystemConfigStore();
    
    useEffect(() => {
        const loadConfig = async () => {
            // DEFAULT_RECORD_TYPE 미리 로드
            await fetchSystemConfig(SystemConfig_SystemConfigType.DEFAULT_RECORD_TYPE);
            setIsConfigLoaded(true);
        };
        
        // 이미 로드되어 있으면 바로 설정
        const existingConfig = getSystemConfig(SystemConfig_SystemConfigType.DEFAULT_RECORD_TYPE);
        if (existingConfig) {
            setIsConfigLoaded(true);
        } else {
            loadConfig();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // 마운트 시 한 번만 실행 - Zustand store 함수들은 안정적

    const handleConfigToggle = useCallback(() => {
        setIsConfigMode(prev => !prev);
    }, []);

    const handleConfigClose = useCallback(() => {
        setIsConfigMode(false);
    }, []);

    // systemConfig 로드 중에는 로딩 표시
    if (!isConfigLoaded) {
        return (
            <main>
                <Sidebar 
                    onConfigToggle={handleConfigToggle}
                    recordGroupsData={recordGroupsData}
                    companiesData={companiesData}
                />
                <section>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}></div>
                    <Footer/>
                </section>
            </main>
        );
    }

    return (
        <main>
            <Sidebar 
                onConfigToggle={handleConfigToggle}
                recordGroupsData={recordGroupsData}
                companiesData={companiesData}
            />
            <section>
                {isConfigMode ? (
                    <RecordConfig 
                        onClose={handleConfigClose}
                        recordGroupsData={recordGroupsData}
                    />
                ) : (
                    <BodyRight 
                        ref={bodyRightRef}
                        recordGroupsData={recordGroupsData}
                        companiesData={companiesData}
                    />
                )}
                <Footer/>
            </section>
        </main>
    );
});

Contents.displayName = 'Contents';

export default Contents;
