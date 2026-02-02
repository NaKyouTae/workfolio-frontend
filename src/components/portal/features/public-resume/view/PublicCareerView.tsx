import React from 'react';
import { Career, Career_EmploymentType, Salary } from '@/generated/common';
import { DateUtil } from '@/utils/DateUtil';
import { normalizeEnumValue } from '@/utils/commonUtils';
import dayjs from 'dayjs';
import styles from './PublicView.module.css';

interface PublicCareerViewProps {
  careers: Career[];
}

const PublicCareerView: React.FC<PublicCareerViewProps> = ({ careers }) => {
  const visibleCareers = careers.filter((c) => c.isVisible === true);
  const getEmploymentTypeLabel = (type?: Career_EmploymentType) => {
    const normalizedType = normalizeEnumValue(type, Career_EmploymentType);
    switch (normalizedType) {
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

  const formatCareerPeriod = (startedAt?: number, endedAt?: number, isWorking?: boolean) => {
    const startDate = DateUtil.formatTimestamp(startedAt || 0, 'YYYY. MM.');
    const endDate = isWorking ? ' - 재직중' : ` - ${DateUtil.formatTimestamp(endedAt || 0, 'YYYY. MM.')}`;

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

  const calculateTotalCareerPeriod = () => {
    if (visibleCareers.length === 0) return '';

    let totalMonths = 0;

    visibleCareers.forEach((career) => {
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

  const totalPeriod = calculateTotalCareerPeriod();

  return (
    <div className={styles.viewContainer}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>경력</h2>
        {totalPeriod && <span className={styles.sectionBadge}>{totalPeriod}</span>}
      </div>

      <ul className={styles.itemList}>
        {visibleCareers.map((career) => {
          const visibleSalaries = (career.salaries || []).filter((s: Salary) => s.isVisible === true);
          return (
          <li key={career.id} className={styles.item}>
            <div className={styles.itemHeader}>
              <div className={styles.itemTitleGroup}>
                {career.name && <h3 className={styles.itemTitle}>{career.name}</h3>}
                {career.position && <span className={styles.itemSubtitle}>{career.position}</span>}
              </div>
              <div className={styles.itemMeta}>
                <span className={styles.itemPeriod}>
                  {formatCareerPeriod(career.startedAt, career.endedAt, career.isWorking)}
                </span>
                {career.employmentType && (
                  <span className={styles.itemTag}>{getEmploymentTypeLabel(career.employmentType)}</span>
                )}
              </div>
            </div>

            <div className={styles.itemDetails}>
              {career.department && (
                <span className={styles.itemDetail}>{career.department}</span>
              )}
              {career.jobTitle && (
                <span className={styles.itemDetail}>{career.jobTitle}</span>
              )}
            </div>

            {/* 연봉 (경력 단일 연봉) */}
            {career.salary != null && career.salary > 0 && (
              <p className={styles.itemDescription}>
                연봉 {Number(career.salary).toLocaleString('ko-KR')}만 원
              </p>
            )}

            {/* 연봉 이력 (salaries) */}
            {visibleSalaries.length > 0 && (
              <ul className={styles.subList}>
                {visibleSalaries
                  .sort((a, b) => (b.negotiationDate || 0) - (a.negotiationDate || 0))
                  .map((salary) => (
                    <li key={salary.id} className={styles.subItem}>
                      <span className={styles.subItemName}>
                        {salary.amount != null && salary.amount > 0 && (
                          <>연봉 {Number(salary.amount).toLocaleString('ko-KR')}만 원</>
                        )}
                        {salary.memo && ` ${salary.memo}`}
                      </span>
                      {salary.negotiationDate && (
                        <span className={styles.subItemDate}>
                          {DateUtil.formatTimestamp(salary.negotiationDate, 'YYYY. MM. DD.')}
                        </span>
                      )}
                    </li>
                  ))}
              </ul>
            )}

            {career.description && (
              <p className={styles.itemDescription}>{career.description}</p>
            )}
          </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PublicCareerView;
