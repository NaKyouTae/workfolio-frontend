import React from 'react';
import '@/styles/records-config.css';
import { useSystemConfigStore } from '@/store/systemConfigStore';
import { SystemConfig_SystemConfigType } from '@/generated/common';
import { CalendarViewType } from '@/models/CalendarTypes';
import { parseCalendarViewType, calendarViewTypeToString } from '@/utils/commonUtils';

const RecordManagement = () => {
    const { getSystemConfig, updateSystemConfig, isLoading } = useSystemConfigStore();
    const systemConfig = getSystemConfig(SystemConfig_SystemConfigType.DEFAULT_RECORD_TYPE);

    // systemConfig.value를 CalendarViewType으로 변환 (대소문자 구분 없음)
    const recordGroupDefaultScreen: CalendarViewType = parseCalendarViewType(systemConfig?.value, 'monthly');

    const handleScreenChange = async (value: CalendarViewType) => {
        // CalendarViewType을 대문자로 변환하여 API 호출
        const upperValue = calendarViewTypeToString(value);
        const success = await updateSystemConfig(SystemConfig_SystemConfigType.DEFAULT_RECORD_TYPE, upperValue);
        
        if (!success) {
            console.error('Failed to update system config');
            // 필요시 사용자에게 에러 메시지 표시 가능
        }
    };

    if (isLoading) {
        return <div>로딩 중...</div>;
    }

    return (
        <div>
            <div className="config-section">
                <h3>기록 관리</h3>
                <div className="config-row">
                    <label>기록장 기본 화면</label>
                    <div className="radio-group">
                        <label className="radio-option">
                            <input 
                                type="radio" 
                                name="recordGroupDefaultScreen"
                                value="weekly"
                                checked={recordGroupDefaultScreen === 'weekly'}
                                onChange={(e) => handleScreenChange(e.target.value as CalendarViewType)}
                            />
                            <span>주별 보기</span>
                        </label>
                        <label className="radio-option">
                            <input 
                                type="radio" 
                                name="recordGroupDefaultScreen"
                                value="monthly"
                                checked={recordGroupDefaultScreen === 'monthly'}
                                onChange={(e) => handleScreenChange(e.target.value as CalendarViewType)}
                            />
                            <span>월별 보기</span>
                        </label>
                        <label className="radio-option">
                            <input 
                                type="radio" 
                                name="recordGroupDefaultScreen"
                                value="list"
                                checked={recordGroupDefaultScreen === 'list'}
                                onChange={(e) => handleScreenChange(e.target.value as CalendarViewType)}
                            />
                            <span>목록 보기</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecordManagement;
