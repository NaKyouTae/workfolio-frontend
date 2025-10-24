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

/**
 * Enum 값을 정규화 (string → number 변환)
 * API에서 enum이 string으로 올 수 있으므로 number로 변환
 * @param value - enum 값 (string 또는 number)
 * @param enumObject - enum 객체 (예: Resume_Gender)
 * @param defaultValue - 기본값 (변환 실패 시 반환, 기본값: undefined)
 * @returns number | undefined
 * 
 * @example
 * normalizeEnumValue("1", Resume_Gender) // 1
 * normalizeEnumValue(1, Resume_Gender) // 1
 * normalizeEnumValue("MALE", Resume_Gender) // 1
 * normalizeEnumValue("invalid", Resume_Gender, 0) // 0
 * normalizeEnumValue(undefined, Resume_Gender) // undefined
 */
export const normalizeEnumValue = <T extends number>(
  value: string | number | undefined | null,
  enumObject: Record<string, number | string>,
  defaultValue?: T
): T | undefined => {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  
  // 이미 number면 그대로 반환
  if (typeof value === 'number') {
    return value as T;
  }
  
  // string인 경우
  if (typeof value === 'string') {
    // 먼저 enum key로 찾기 (예: "MALE" -> 1)
    if (value in enumObject && typeof enumObject[value] === 'number') {
      return enumObject[value] as T;
    }
    
    // 숫자 문자열이면 number로 변환 (예: "1" -> 1)
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      return numValue as T;
    }
  }
  
  // 변환 실패 시 기본값 반환
  return defaultValue;
};

/**
 * 두 Enum 값을 비교
 * string, number, enum key 등 다양한 형태의 값을 비교 가능
 * @param value1 - 첫 번째 비교 값
 * @param value2 - 두 번째 비교 값
 * @param enumObject - enum 객체 (예: Resume_Gender)
 * @returns boolean
 * 
 * @example
 * compareEnumValue("MALE", Resume_Gender.MALE, Resume_Gender) // true
 * compareEnumValue(1, Resume_Gender.MALE, Resume_Gender) // true
 * compareEnumValue("1", Resume_Gender.MALE, Resume_Gender) // true
 * compareEnumValue("MALE", "MALE", Resume_Gender) // true
 * compareEnumValue("FEMALE", Resume_Gender.MALE, Resume_Gender) // false
 */
export const compareEnumValue = <T extends number>(
  value1: string | number | undefined | null,
  value2: string | number | undefined | null,
  enumObject: Record<string, number | string>
): boolean => {
  // 둘 다 undefined/null이면 true
  if ((value1 === undefined || value1 === null) && (value2 === undefined || value2 === null)) {
    return true;
  }
  
  // 하나만 undefined/null이면 false
  if (value1 === undefined || value1 === null || value2 === undefined || value2 === null) {
    return false;
  }
  
  // 둘 다 정규화해서 비교
  const normalized1 = normalizeEnumValue<T>(value1, enumObject);
  const normalized2 = normalizeEnumValue<T>(value2, enumObject);
  
  return normalized1 === normalized2;
};

