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
  static formatTimestamp(timestamp: number, format: string = DateUtil.defaultFormat): string {
    if (timestamp === 0 || timestamp === undefined) return '';

    return dayjs(timestamp).format(format);
  }

  /**
   * 날짜 문자열을 타임스탬프로 변환
   * @param dateString - 날짜 문자열 (YYYY-MM-DD 형식)
   * @returns 밀리초 단위 타임스탬프
   */
  static parseToTimestamp(dateString: string): number {
    if (!dateString) return 0;
    return dayjs(dateString).valueOf();
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
    format: string = DateUtil.defaultFormat
  ): string {
    if (startTimestamp === 0 || startTimestamp === undefined) return '';

    const startDate = this.formatTimestamp(startTimestamp, format);
    const endDate = endTimestamp === 0 ? '현재' : this.formatTimestamp(endTimestamp, format);
    return `${startDate} ~ ${endDate}`;
  }

  /**
   * 오늘 날짜를 Date 객체로 반환 (로컬 시간)
   * @returns Date 객체
   */
  static today(): Date {
    return dayjs().toDate();
  }

  /**
   * 오늘 날짜를 문자열로 반환
   * @param format - 날짜 형식 (기본값: 'YYYY-MM-DD')
   * @returns 포맷된 오늘 날짜 문자열
   */
  static todayString(format: string = DateUtil.defaultFormat): string {
    return dayjs().format(format);
  }

  /**
   * 날짜 문자열을 Date 객체로 변환
   * @param dateString - 날짜 문자열
   * @returns Date 객체
   */
  static toDate(dateString: string): Date {
    return dayjs(dateString).toDate();
  }

  /**
   * Date 객체를 문자열로 변환
   * @param date - Date 객체
   * @param format - 날짜 형식 (기본값: 'YYYY-MM-DD')
   * @returns 포맷된 날짜 문자열
   */
  static format(date: Date, format: string = DateUtil.defaultFormat): string {
    return dayjs(date).format(format);
  }
}

// 편의를 위한 기본 export
export default DateUtil;
