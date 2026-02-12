import React from 'react';
import '@workfolio/shared/styles/records-config.css';
import { useSystemConfigStore } from '@workfolio/shared/store/systemConfigStore';
import { SystemConfig_SystemConfigType } from '@workfolio/shared/generated/common';
import { CalendarViewType } from '@workfolio/shared/models/CalendarTypes';
import { parseCalendarViewType, calendarViewTypeToString } from '@workfolio/shared/utils/commonUtils';

const RecordManagement = () => {
    const { getSystemConfig, updateSystemConfig } = useSystemConfigStore();
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

    return (
        <div className="cont-box">
            <div className="cont-tit">
                <div>
                    <h3>기록 관리</h3>
                </div>
            </div>
            <ul className="setting-list">
                <li>
                    <p>기록장 기본 화면</p>
                    <ul className="input-list">
                        <li>
                            <input 
                                id="weekly"
                                type="radio" 
                                name="recordGroupDefaultScreen"
                                value="weekly"
                                checked={recordGroupDefaultScreen === 'weekly'}
                                onChange={(e) => handleScreenChange(e.target.value as CalendarViewType)}
                            />
                            <label htmlFor="weekly"><p>주별 보기</p></label>
                        </li>
                        <li>
                            <input 
                                id="monthly"
                                type="radio" 
                                name="recordGroupDefaultScreen"
                                value="monthly"
                                checked={recordGroupDefaultScreen === 'monthly'}
                                onChange={(e) => handleScreenChange(e.target.value as CalendarViewType)}
                            />
                            <label htmlFor="monthly"><p>월별 보기</p></label>
                        </li>
                        <li>
                            <input 
                                type="radio" 
                                name="recordGroupDefaultScreen"
                                value="list"
                                id="list"
                                checked={recordGroupDefaultScreen === 'list'}
                                onChange={(e) => handleScreenChange(e.target.value as CalendarViewType)}
                            />
                            <label htmlFor="list"><p>목록 보기</p></label>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    );
};

export default RecordManagement;
