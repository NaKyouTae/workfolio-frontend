import {
  Career,
  Career_EmploymentType,
  Education_EducationStatus,
  Activity_ActivityType,
  LanguageSkill_Language,
  LanguageSkill_LanguageLevel,
  Resume_Gender,
} from '@workfolio/shared/generated/common';
import { DateUtil } from '@workfolio/shared/utils/DateUtil';
import { normalizeEnumValue } from '@workfolio/shared/utils/commonUtils';
import dayjs from 'dayjs';

// ── Profile ──

export const getGenderLabel = (gender?: Resume_Gender): string => {
  const normalized = normalizeEnumValue(gender, Resume_Gender);
  if (normalized === Resume_Gender.MALE) return '남';
  if (normalized === Resume_Gender.FEMALE) return '여';
  return '';
};

export const formatBirthDate = (timestamp?: number): string => {
  if (!timestamp) return '';

  const birthDate = DateUtil.toDate(DateUtil.normalizeTimestamp(timestamp));
  const now = new Date();
  let age = now.getFullYear() - birthDate.getFullYear();

  const currentMonth = now.getMonth();
  const currentDay = now.getDate();
  const birthMonth = birthDate.getMonth();
  const birthDay = birthDate.getDate();

  if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
    age = age - 1;
  }

  return DateUtil.format(birthDate, `YYYY년 (만 ${age}세)`);
};

export const formatPhoneNumber = (phone?: string): string => {
  if (!phone) return '';

  const numbers = phone.replace(/[^0-9]/g, '');

  if (numbers.length === 11) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
  } else if (numbers.length === 10) {
    if (numbers.startsWith('02')) {
      return `${numbers.slice(0, 2)}-${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
    }
  } else if (numbers.length === 9) {
    return `${numbers.slice(0, 2)}-${numbers.slice(2, 5)}-${numbers.slice(5)}`;
  }

  return phone;
};

export const formatPublicPeriod = (startDate?: number, endDate?: number): string | null => {
  if (!startDate && !endDate) return null;

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return null;
    const date = DateUtil.toDate(DateUtil.normalizeTimestamp(timestamp));
    return DateUtil.format(date, 'YYYY.MM.DD');
  };

  const start = formatDate(startDate);
  const end = formatDate(endDate);

  if (start && end) {
    return `${start} ~ ${end}`;
  } else if (start) {
    return `${start} ~`;
  } else if (end) {
    return `~ ${end}`;
  }
  return null;
};

// ── Career ──

export const getEmploymentTypeLabel = (type?: Career_EmploymentType): string => {
  const normalized = normalizeEnumValue(type, Career_EmploymentType);
  switch (normalized) {
    case Career_EmploymentType.FULL_TIME:
      return '정규직';
    case Career_EmploymentType.CONTRACT:
      return '계약직';
    case Career_EmploymentType.INTERN:
      return '인턴';
    case Career_EmploymentType.FREELANCER:
      return '프리랜서';
    default:
      return '';
  }
};

export const formatCareerPeriod = (
  startedAt?: number,
  endedAt?: number,
  isWorking?: boolean,
): string => {
  const startDate = DateUtil.formatTimestamp(startedAt || 0, 'YYYY. MM.');
  const endDate = isWorking
    ? ' - 재직중'
    : ` - ${DateUtil.formatTimestamp(endedAt || 0, 'YYYY. MM.')}`;

  let result = `${startDate}${endedAt || isWorking ? endDate : ''}`;

  if (startedAt) {
    const start = dayjs(DateUtil.normalizeTimestamp(startedAt));
    let end: dayjs.Dayjs;

    if (isWorking) {
      end = dayjs(Date.now());
    } else if (endedAt) {
      end = dayjs(DateUtil.normalizeTimestamp(endedAt));
    } else {
      return result;
    }

    const totalMonths = end.diff(start, 'month');
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    result += ` (${years}년 ${months}개월)`;
  }

  return result;
};

export const calculateTotalCareerPeriod = (careers: Career[]): string => {
  if (careers.length === 0) return '';

  let totalMonths = 0;

  careers.forEach((career) => {
    const startedAt = career.startedAt;
    if (!startedAt) return;

    let endTimestamp: number;
    if (career.isWorking) {
      endTimestamp = Date.now();
    } else {
      endTimestamp = DateUtil.normalizeTimestamp(career.endedAt || 0);
    }

    const start = dayjs(DateUtil.normalizeTimestamp(startedAt));
    const end = dayjs(endTimestamp);
    const careerMonths = end.diff(start, 'month');
    totalMonths += careerMonths;
  });

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return `${years}년 ${months}개월`;
};

// ── Education ──

export const getEducationStatusLabel = (status?: Education_EducationStatus): string => {
  const normalized = normalizeEnumValue(status, Education_EducationStatus);
  switch (normalized) {
    case Education_EducationStatus.GRADUATED:
      return '졸업';
    case Education_EducationStatus.GRADUATING:
      return '졸업예정';
    case Education_EducationStatus.ENROLLED:
      return '재학';
    case Education_EducationStatus.DROPPED_OUT:
      return '중퇴';
    case Education_EducationStatus.COMPLETED:
      return '수료';
    case Education_EducationStatus.ON_LEAVE:
      return '휴학';
    default:
      return '';
  }
};

// ── Activity ──

export const getActivityTypeLabel = (type?: Activity_ActivityType): string => {
  const normalized = normalizeEnumValue(type, Activity_ActivityType);
  switch (normalized) {
    case Activity_ActivityType.EXTERNAL:
      return '대외활동';
    case Activity_ActivityType.EDUCATION:
      return '교육';
    case Activity_ActivityType.CERTIFICATION:
      return '자격증';
    case Activity_ActivityType.AWARD:
      return '수상';
    case Activity_ActivityType.COMPETITION:
      return '공모전';
    case Activity_ActivityType.ETC:
      return '기타';
    default:
      return '';
  }
};

// ── Language ──

export const getLanguageLabel = (language?: LanguageSkill_Language): string => {
  const normalized = normalizeEnumValue(language, LanguageSkill_Language);
  switch (normalized) {
    case LanguageSkill_Language.KOREAN:
      return '한국어';
    case LanguageSkill_Language.ENGLISH:
      return '영어';
    case LanguageSkill_Language.JAPANESE:
      return '일본어';
    case LanguageSkill_Language.CHINESE:
      return '중국어';
    case LanguageSkill_Language.FRENCH:
      return '프랑스어';
    case LanguageSkill_Language.SPANISH:
      return '스페인어';
    case LanguageSkill_Language.GERMAN:
      return '독일어';
    case LanguageSkill_Language.RUSSIAN:
      return '러시아어';
    case LanguageSkill_Language.VIETNAMESE:
      return '베트남어';
    case LanguageSkill_Language.ITALIAN:
      return '이탈리아어';
    case LanguageSkill_Language.THAI:
      return '태국어';
    case LanguageSkill_Language.ARABIC:
      return '아랍어';
    case LanguageSkill_Language.PORTUGUESE:
      return '포르투갈어';
    case LanguageSkill_Language.INDONESIAN:
      return '인도네시아어';
    case LanguageSkill_Language.MONGOLIAN:
      return '몽골어';
    case LanguageSkill_Language.TURKISH:
      return '터키어';
    default:
      return '';
  }
};

export const getLanguageLevelLabel = (level?: LanguageSkill_LanguageLevel): string => {
  const normalized = normalizeEnumValue(level, LanguageSkill_LanguageLevel);
  switch (normalized) {
    case LanguageSkill_LanguageLevel.DAILY_CONVERSATION:
      return '일상회화';
    case LanguageSkill_LanguageLevel.BUSINESS_CONVERSATION:
      return '비즈니스 회화';
    case LanguageSkill_LanguageLevel.NATIVE_LEVEL:
      return '원어민 수준';
    default:
      return '';
  }
};

// ── Date utilities ──

export const formatTimestamp = (timestamp: number, format: string): string => {
  return DateUtil.formatTimestamp(timestamp, format);
};

export const formatSalary = (amount: number): string => {
  return `연봉 ${Number(amount).toLocaleString('ko-KR')}만 원`;
};
