import React from 'react';
import '@workfolio/shared/styles/records-config.css';
import { useSystemConfigStore } from '@workfolio/shared/store/systemConfigStore';
import { SystemConfig_SystemConfigType } from '@workfolio/shared/generated/common';
import { CalendarViewType, CALENDAR_VIEW_OPTIONS } from '@workfolio/shared/models/CalendarTypes';
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
        }
    };

    return (
        <div className="record-config-setting">
            <p className="record-config-label">기록장 기본 화면</p>
            <ul className="input-list">
                {CALENDAR_VIEW_OPTIONS.map((option) => (
                    <li key={option.value}>
                        <input
                            id={`rc-${option.value}`}
                            type="radio"
                            name="recordGroupDefaultScreen"
                            value={option.value}
                            checked={recordGroupDefaultScreen === option.value}
                            onChange={(e) => handleScreenChange(e.target.value as CalendarViewType)}
                        />
                        <label htmlFor={`rc-${option.value}`}><p>{option.label}</p></label>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecordManagement;
