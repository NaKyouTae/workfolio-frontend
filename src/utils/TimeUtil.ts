import { DateTime } from "luxon";

/**
 * ISO 8601 형식의 날짜 문자열을 밀리초(long) 타임스탬프로 변환
 * @param dateString - 변환할 날짜 문자열 (ISO 8601)
 * @returns 밀리초 단위의 timestamp (long)
 */
export const toTimestamp = (dateString: string): number => {
    return DateTime.fromISO(dateString).toMillis();
};

/**
 * 밀리초(long) 타임스탬프를 ISO 8601 문자열로 변환
 * @param timestamp - 변환할 timestamp (밀리초)
 * @returns ISO 8601 형식의 문자열
 */
export const fromTimestamp = (timestamp: number): string => {
    return <string>DateTime.fromMillis(timestamp).toISO();
};

/**
 * 현재 시간을 timestamp(long) 형태로 반환
 * @returns 현재 시간의 밀리초 timestamp
 */
export const getCurrentTimestamp = (): number => {
    return DateTime.now().toMillis();
};

export const formatDate = (date: Date, format: string = 'YYYY-MM-DD'): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return format
        .replace('YYYY', String(year))
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
}
