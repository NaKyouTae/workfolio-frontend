import React from 'react';
import { JobApplication } from '@/generated/common';
import DateUtil from '@/utils/DateUtil';
import ApplicationStageView from './ApplicationStageView';
import styles from './JobApplicationView.module.css';

interface JobApplicationViewProps {
  jobApplication: JobApplication;
}

const JobApplicationView: React.FC<JobApplicationViewProps> = ({ jobApplication }) => {
  return (
    <div className={styles.applicationCard}>
      {/* 카드 헤더 */}
      <div className={styles.cardHeader}>
        <div className={styles.companyInfo}>
          <h3 className={styles.companyName}>{jobApplication.name}</h3>
          <div className={styles.positionInfo}>
            <span className={styles.position}>{jobApplication.position}</span>
            <button className={styles.detailButton}>상세보기 ↗</button>
          </div>
        </div>
      </div>

      {/* 직무 정보 */}
      <div className={styles.jobInfo}>
        <span className={styles.jobTitle}>{jobApplication.jobPostingTitle}</span>
        {jobApplication.jobPostingUrl && (
          <a 
            href={jobApplication.jobPostingUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.jobLink}
          >
            🔗
          </a>
        )}
      </div>

      {/* 지원 단계 타임라인 */}
      {jobApplication.applicationStages && jobApplication.applicationStages.length > 0 && (
        <ApplicationStageView 
          applicationStages={jobApplication.applicationStages}
          jobApplicationId={jobApplication.id}
        />
      )}

      {/* 추가 정보 */}
      <div className={styles.additionalInfo}>
        {(jobApplication.startedAt || jobApplication.endedAt) && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>모집 기간</span>
            <span className={styles.infoValue}>
              {jobApplication.startedAt && DateUtil.formatTimestamp(jobApplication.startedAt, 'YY.MM.DD')}
              {jobApplication.startedAt && jobApplication.endedAt && ' - '}
              {jobApplication.endedAt && DateUtil.formatTimestamp(jobApplication.endedAt, 'YY.MM.DD')}
            </span>
          </div>
        )}
        {jobApplication.applicationSource && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>지원 경로</span>
            <span className={styles.infoValue}>{jobApplication.applicationSource}</span>
          </div>
        )}
        {jobApplication.memo && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>메모</span>
            <span className={styles.infoValue}>{jobApplication.memo}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplicationView;

