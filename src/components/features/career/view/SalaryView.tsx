import React from 'react';
import { Salary } from '@/generated/common';
import { DateUtil } from '@/utils/DateUtil';

interface SalaryViewProps {
  salaries: Salary[];
  showHidden?: boolean;
}

/**
 * 급여 이력 읽기 전용 컴포넌트
 */
const SalaryView: React.FC<SalaryViewProps> = ({ salaries, showHidden = false }) => {
  if (!salaries || salaries.length === 0) {
    return null;
  }

  const visibleSalaries = salaries.filter(s => showHidden ? true : s.isVisible !== false); 

  if (visibleSalaries.length === 0) {
    return null;
  }

  return (
    <div style={{ 
      backgroundColor: '#f5f5f5',
      borderRadius: '4px',
      padding: '16px'
    }}>
      {visibleSalaries
        .sort((a, b) => (b.negotiationDate || 0) - (a.negotiationDate || 0))
        .map((salary, index) => (
          <div 
            key={salary.id}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              marginBottom: index < visibleSalaries.length - 1 ? '12px' : '0',
              gap: '20px'
            }}
          >
            {/* 좌측: 날짜와 메모 */}
            <div>
              {
                salary.negotiationDate && (
                  <div style={{ 
                    fontSize: '14px',
                    color: '#333',
                    marginBottom: '4px',
                    width: '150px',
                  }}>
                    {DateUtil.formatTimestamp(salary.negotiationDate || 0, 'YYYY. MM. DD.')}
                  </div>
                )
              }
              
            </div>

            {/* 우측: 금액 */}
            <div style={{ 
              fontSize: '14px',
              color: '#999',
              whiteSpace: 'nowrap'
            }}>
              {salary.memo && (
                <div style={{ 
                  fontSize: '13px',
                  color: '#666'
                }}>
                  {salary.memo}
                </div>
              )}
              {
                salary.amount && salary.amount > 0 && (
                  <span style={{ color: (salary.amount && salary.amount > 0) ? '#999' : '#ddd' }}>
                    {(salary.amount && salary.amount > 0) 
                      ? `연봉 ${salary.amount.toLocaleString('ko-KR')}만 원` 
                      : '연봉'}
                  </span>
                )
              }
            </div>
          </div>
        ))}
    </div>
  );
};

export default SalaryView;
