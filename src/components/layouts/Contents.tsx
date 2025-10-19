// src/components/layouts/Contents.tsx
import React, { useRef, useState, useEffect } from 'react';
import Sidebar from "@/components/layouts/Sidebar"
import BodyRight, { BodyRightRef } from "@/components/layouts/BodyRight"
import RecordConfig from "@/components/features/sidebar/records-config/RecordConfig"
import Footer from "@/components/layouts/Footer"
import { useSystemConfigStore } from '@/store/systemConfigStore';
import { SystemConfig_SystemConfigType } from '@/generated/common';

const Contents = () => {
    const bodyRightRef = useRef<BodyRightRef>(null);
    const [isConfigMode, setIsConfigMode] = useState(false);
    const [isConfigLoaded, setIsConfigLoaded] = useState(false);
    
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
    }, [fetchSystemConfig, getSystemConfig]);

    const handleConfigToggle = () => {
        setIsConfigMode(!isConfigMode);
    };

    const handleConfigClose = () => {
        setIsConfigMode(false);
    };

    // systemConfig 로드 중에는 로딩 표시
    if (!isConfigLoaded) {
        return (
            <main>
                <Sidebar onConfigToggle={handleConfigToggle} />
                <section>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}></div>
                    <Footer/>
                </section>
            </main>
        );
    }

    return (
        <main>
            <Sidebar onConfigToggle={handleConfigToggle} />
            <section>
                {isConfigMode ? (
                    <RecordConfig onClose={handleConfigClose} />
                ) : (
                    <BodyRight ref={bodyRightRef} />
                )}
                <Footer/>
            </section>
        </main>
    );
};

export default Contents;
