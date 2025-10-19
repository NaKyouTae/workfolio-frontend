import { RecordGroup_RecordGroupType, recordGroup_RecordGroupTypeToJSON } from '@/generated/common';
import { CalendarViewType } from '@/models/CalendarTypes';

/**
 * 대소문자 구분 없이 문자열을 CalendarViewType으로 변환
 * @param value - 변환할 문자열 (대소문자 무관)
 * @param defaultValue - 기본값 (변환 실패 시 반환)
 * @returns CalendarViewType
 * 
 * @example
 * parseCalendarViewType('WEEKLY') // 'weekly'
 * parseCalendarViewType('Monthly') // 'monthly'
 * parseCalendarViewType('invalid', 'monthly') // 'monthly'
 */
export const parseCalendarViewType = (
    value: string | undefined | null, 
    defaultValue: CalendarViewType = 'monthly'
): CalendarViewType => {
    if (!value) return defaultValue;
    
    const lowerValue = value.toLowerCase();
    
    if (lowerValue === 'weekly' || lowerValue === 'monthly' || lowerValue === 'list') {
        return lowerValue as CalendarViewType;
    }
    
    return defaultValue;
};

/**
 * CalendarViewType을 대문자 문자열로 변환
 * @param type - CalendarViewType
 * @returns 대문자 문자열
 * 
 * @example
 * calendarViewTypeToString('weekly') // 'WEEKLY'
 * calendarViewTypeToString('monthly') // 'MONTHLY'
 */
export const calendarViewTypeToString = (type: CalendarViewType): string => {
    return type.toUpperCase();
};

export const getRecordGroupTypeLabel = (type: RecordGroup_RecordGroupType): string => {
    switch (RecordGroup_RecordGroupType[type].toString()) {
        case RecordGroup_RecordGroupType.PUBLIC.toString():
            return '공개 기록장';
        case RecordGroup_RecordGroupType.PRIVATE.toString():
            return '개인 기록장';
        case RecordGroup_RecordGroupType.SHARED.toString():
            return '공유 기록장';
        case RecordGroup_RecordGroupType.UNKNOWN.toString():
            return '알 수 없음';
        case RecordGroup_RecordGroupType.UNRECOGNIZED.toString():
            return '인식 불가';
        default:
            return '알 수 없음';
    }
};

export const getRecordGroupTypeString = (type: RecordGroup_RecordGroupType): string => {
    return recordGroup_RecordGroupTypeToJSON(type);
};

export const getRecordGroupTypeStringByReverseMapping = (type: RecordGroup_RecordGroupType): string => {
    return RecordGroup_RecordGroupType[type];
};

