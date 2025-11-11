import React from 'react';
import { TurnOverRetrospectiveDetail_EmploymentType } from '@/generated/common';
import DateUtil from '@/utils/DateUtil';
import '@/styles/component-view.css';

interface NegotiationViewProps {
  position: string;
  department?: string;
  rank?: string;
  jobTitle?: string;
  salary: number;
  workType?: string;
  employmentType?: TurnOverRetrospectiveDetail_EmploymentType;
  joinedAt?: number;
}

const NegotiationView: React.FC<NegotiationViewProps> = ({
  position,
  department,
  rank,
  jobTitle,
  salary,
  workType,
  employmentType,
  joinedAt,
}) => {
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

  return (
    <div className="view-container">
      <h3 className="view-title">자우 협의</h3>
      
      <div className="view-list-container">
        <div className="view-item">
          <div className="view-item-content">
            {/* 직무 정보 */}
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a', marginBottom: '8px' }}>
                {position}
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
                {department && <span>{department}</span>}
                {rank && (
                  <>
                    <span>|</span>
                    <span>{rank}</span>
                  </>
                )}
                {jobTitle && (
                  <>
                    <span>|</span>
                    <span>{jobTitle}</span>
                  </>
                )}
              </div>
            </div>

            {/* 연봉 정보 */}
            {salary > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                background: '#f0f9ff',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <span style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a1a' }}>연봉</span>
                <span style={{ fontSize: '20px', fontWeight: 700, color: '#007bff' }}>
                  {formatSalary(salary)}
                </span>
              </div>
            )}

            {/* 추가 정보 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {workType && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#6b7280' }}>근무 형태</span>
                  <span style={{ fontSize: '14px', color: '#1a1a1a' }}>{workType}</span>
                </div>
              )}
              {employmentType && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#6b7280' }}>고용 형태</span>
                  <span style={{ fontSize: '14px', color: '#1a1a1a' }}>
                    {getEmploymentTypeLabel(employmentType)}
                  </span>
                </div>
              )}
              {joinedAt && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#6b7280' }}>입사 일자</span>
                  <span style={{ fontSize: '14px', color: '#1a1a1a' }}>
                    {DateUtil.formatTimestamp(joinedAt, 'YYYY. MM. DD.')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NegotiationView;

