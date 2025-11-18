import { RecordGroup_RecordGroupType, recordGroup_RecordGroupTypeToJSON, Worker_Gender, Resume_Gender } from '@/generated/common';
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

    console.log("================================================")
    console.log('lowerValue', lowerValue);
    console.log('defaultValue', defaultValue);
    console.log('==============================================');
    
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

/**
 * Worker_Gender를 한글로 변환
 * @param gender - Worker_Gender enum 값
 * @returns 한글 성별 문자열
 * 
 * @example
 * getWorkerGenderLabel(Worker_Gender.MALE) // '남성'
 * getWorkerGenderLabel(Worker_Gender.FEMALE) // '여성'
 * getWorkerGenderLabel(0) // '남성'
 * getWorkerGenderLabel(1) // '여성'
 */
export const getWorkerGenderLabel = (gender: Worker_Gender | number | undefined): string => {
  if (gender === undefined || gender === null) {
    return '';
  }

  switch (gender) {
    case Worker_Gender.MALE:
    case 0:
      return '남성';
    case Worker_Gender.FEMALE:
    case 1:
      return '여성';
    default:
      return '';
  }
};

/**
 * Resume_Gender를 한글로 변환
 * @param gender - Resume_Gender enum 값
 * @returns 한글 성별 문자열
 * 
 * @example
 * getResumeGenderLabel(Resume_Gender.MALE) // '남성'
 * getResumeGenderLabel(Resume_Gender.FEMALE) // '여성'
 * getResumeGenderLabel(1) // '남성'
 * getResumeGenderLabel(2) // '여성'
 */
export const getResumeGenderLabel = (gender: Resume_Gender | number | undefined): string => {
  if (gender === undefined || gender === null) {
    return '';
  }

  switch (gender) {
    case Resume_Gender.MALE:
    case 1:
      return '남성';
    case Resume_Gender.FEMALE:
    case 2:
      return '여성';
    case Resume_Gender.UNKNOWN:
    case 0:
      return '';
    default:
      return '';
  }
};

/**
 * Gender를 한글로 변환 (Worker_Gender 또는 Resume_Gender 자동 감지)
 * @param gender - Gender enum 값 (Worker_Gender 또는 Resume_Gender)
 * @param type - 'worker' 또는 'resume' (선택적, 지정하지 않으면 자동 감지)
 * @returns 한글 성별 문자열
 * 
 * @example
 * getGenderLabel(Worker_Gender.MALE, 'worker') // '남성'
 * getGenderLabel(Resume_Gender.FEMALE, 'resume') // '여성'
 * getGenderLabel(0, 'worker') // '남성'
 * getGenderLabel(1, 'resume') // '남성'
 * getGenderLabel(2, 'resume') // '여성'
 */
export const getGenderLabel = (
  gender: Worker_Gender | Resume_Gender | number | undefined,
  type?: 'worker' | 'resume'
): string => {
  if (gender === undefined || gender === null) {
    return '';
  }

  if (type === 'worker') {
    return getWorkerGenderLabel(gender as Worker_Gender);
  }

  if (type === 'resume') {
    return getResumeGenderLabel(gender as Resume_Gender);
  }

  // 자동 감지: Resume_Gender는 UNKNOWN(0), MALE(1), FEMALE(2)이므로
  // 2인 경우 Resume_Gender로 판단
  if (gender === 2) {
    return getResumeGenderLabel(gender as Resume_Gender);
  }

  // 0 또는 1인 경우 Worker_Gender로 판단 (더 일반적)
  return getWorkerGenderLabel(gender as Worker_Gender);
};

/**
 * 전화번호를 한국 형식으로 포맷팅 (010-1234-5678)
 * @param value - 포맷팅할 전화번호 문자열
 * @returns 포맷팅된 전화번호 문자열
 * 
 * @example
 * formatPhoneNumber('01012345678') // '010-1234-5678'
 * formatPhoneNumber('010-1234-5678') // '010-1234-5678'
 * formatPhoneNumber('0101234') // '010-1234'
 * formatPhoneNumber('010') // '010'
 */
export const formatPhoneNumber = (value: string): string => {
  // 숫자만 추출
  const numbers = value.replace(/[^\d]/g, '');
  
  // 길이에 따라 하이픈 추가
  if (numbers.length <= 3) {
    return numbers;
  } else if (numbers.length <= 7) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  } else if (numbers.length <= 11) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
  } else {
    // 11자리 초과 시 11자리까지만
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  }
};

