import React from 'react';
import { TurnOverRetrospectiveDetail, TurnOverRetrospectiveDetail_EmploymentType } from '@/generated/common';
import DateUtil from '@/utils/DateUtil';
import styles from './TurnOverRetrospectiveView.module.css';
import MemoView from './common/MemoView';
import AttachmentView from './common/AttachmentView';

interface TurnOverRetrospectiveViewProps {
  turnOverRetrospective: TurnOverRetrospectiveDetail | null;
}

const TurnOverRetrospectiveView: React.FC<TurnOverRetrospectiveViewProps> = ({ turnOverRetrospective }) => {
  if (!turnOverRetrospective) {
    return (
      <div className={styles.emptyState}>
        <p>회고 정보가 없습니다.</p>
      </div>
    );
  }

  const getEmploymentTypeLabel = (type?: TurnOverRetrospectiveDetail_EmploymentType) => {
    switch (type) {
      case TurnOverRetrospectiveDetail_EmploymentType.FULL_TIME:
        return '정규직';
      case TurnOverRetrospectiveDetail_EmploymentType.CONTRACT:
        return '계약직';
      case TurnOverRetrospectiveDetail_EmploymentType.FREELANCER:
        return '프리랜서';
      case TurnOverRetrospectiveDetail_EmploymentType.INTERN:
        return '인턴';
      default:
        return '-';
    }
  };

  const formatSalary = (amount: number) => {
    if (amount >= 10000) {
      const billions = Math.floor(amount / 10000);
      const remainder = amount % 10000;
      if (remainder === 0) {
        return `${billions}억 원`;
      }
      return `${billions}억 ${remainder.toLocaleString()}만 원`;
    }
    return `${amount.toLocaleString()}만 원`;
  };

  const renderStars = (score: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={index < score ? styles.starFilled : styles.starEmpty}>
        ★
      </span>
    ));
  };

  return (
    <div className={styles.container}>
      {/* 최종 선택 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>최종 선택</h2>
        </div>
        <div className={styles.sectionContent}>
          <div className={styles.companyCard}>
            <div className={styles.companyHeader}>
              <h3 className={styles.companyName}>{turnOverRetrospective.name}</h3>
              <span className={styles.positionBadge}>{turnOverRetrospective.position}</span>
            </div>
            {turnOverRetrospective.reason && (
              <div className={styles.reasonContent}>
                <p>{turnOverRetrospective.reason}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 자우 협의 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>자우 협의</h2>
        </div>
        <div className={styles.sectionContent}>
          <div className={styles.negotiationCard}>
            {/* 직무 정보 */}
            <div className={styles.jobDetails}>
              <h4 className={styles.jobPosition}>{turnOverRetrospective.position}</h4>
              <div className={styles.jobMeta}>
                {turnOverRetrospective.department && (
                  <span className={styles.metaItem}>{turnOverRetrospective.department}</span>
                )}
                {turnOverRetrospective.rank && (
                  <>
                    <span className={styles.metaDivider}>|</span>
                    <span className={styles.metaItem}>{turnOverRetrospective.rank}</span>
                  </>
                )}
                {turnOverRetrospective.jobTitle && (
                  <>
                    <span className={styles.metaDivider}>|</span>
                    <span className={styles.metaItem}>{turnOverRetrospective.jobTitle}</span>
                  </>
                )}
              </div>
            </div>

            {/* 연봉 정보 */}
            {turnOverRetrospective.salary > 0 && (
              <div className={styles.salaryInfo}>
                <span className={styles.salaryLabel}>연봉</span>
                <span className={styles.salaryAmount}>
                  {formatSalary(turnOverRetrospective.salary)}
                </span>
              </div>
            )}

            {/* 추가 정보 */}
            <div className={styles.additionalDetails}>
              {turnOverRetrospective.workType && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>근무 형태</span>
                  <span className={styles.detailValue}>{turnOverRetrospective.workType}</span>
                </div>
              )}
              {turnOverRetrospective.employmentType && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>고용 형태</span>
                  <span className={styles.detailValue}>
                    {getEmploymentTypeLabel(turnOverRetrospective.employmentType)}
                  </span>
                </div>
              )}
              {turnOverRetrospective.joinedAt && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>입사 일자</span>
                  <span className={styles.detailValue}>
                    {DateUtil.formatTimestamp(turnOverRetrospective.joinedAt, 'YYYY. MM. DD.')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 만족도 평가 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>만족도 평가</h2>
        </div>
        <div className={styles.sectionContent}>
          <div className={styles.satisfactionCard}>
            {/* 점수 */}
            <div className={styles.scoreSection}>
              <span className={styles.scoreLabel}>점수</span>
              <div className={styles.stars}>
                {renderStars(turnOverRetrospective.score)}
              </div>
              <span className={styles.scoreValue}>{turnOverRetrospective.score}점</span>
            </div>

            {/* 한 줄 회고 */}
            {turnOverRetrospective.reviewSummary && (
              <div className={styles.reviewSection}>
                <span className={styles.reviewLabel}>한 줄 회고</span>
                <p className={styles.reviewText}>{turnOverRetrospective.reviewSummary}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 메모 */}
      <MemoView memos={turnOverRetrospective.memos || []} />

      {/* 첨부 */}
      <AttachmentView attachments={turnOverRetrospective.attachments || []} />
    </div>
  );
};

export default TurnOverRetrospectiveView;

