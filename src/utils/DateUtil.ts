import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';

// dayjs 플러그인 설정
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.locale('ko');

/**
 * dayjs 유틸리티 클래스
 * 모든 날짜 처리를 로컬 시간 기준으로 통일
 */
export class DateUtil {
  static defaultFormat: string = 'YYYY-MM-DD';
  /**
   * 타임스탬프를 로컬 시간 기준 날짜 문자열로 변환
   * @param timestamp - 밀리초 단위 타임스탬프
   * @param format - 출력 형식 (기본값: 'YYYY-MM-DD')
   * @returns 포맷된 날짜 문자열
   */
  static formatTimestamp(timestamp: number, format: string = this.defaultFormat): string {
    if (timestamp === 0) return '';

    const timestampString = timestamp.toString();
    const date = new Date(parseInt(timestampString));
    return dayjs(date).format(format);
  }

  /**
   * 날짜 문자열을 타임스탬프로 변환
   * @param dateString - 날짜 문자열 (YYYY-MM-DD 형식)
   * @returns 밀리초 단위 타임스탬프
   */
  static parseToTimestamp(dateString: string): number {
    if (!dateString) return 0;
    const date = new Date(dateString);
    return dayjs(date).valueOf();
  }


  /**
   * 날짜 범위를 문자열로 포맷팅
   * @param startTimestamp - 시작 타임스탬프
   * @param endTimestamp - 종료 타임스탬프 (0이면 "현재" 표시)
   * @param format - 날짜 형식 (기본값: 'YYYY-MM-DD')
   * @returns 포맷된 날짜 범위 문자열
   */
  static formatDateRange(
    startTimestamp: number, 
    endTimestamp: number = 0, 
    format: string = this.defaultFormat
  ): string {
    const startDate = this.formatTimestamp(startTimestamp, format);
    const endDate = endTimestamp === 0 ? '현재' : this.formatTimestamp(endTimestamp, format);
    return `${startDate} ~ ${endDate}`;
  }
}

// 편의를 위한 기본 export
export default DateUtil;
