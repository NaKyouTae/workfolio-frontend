import React from 'react';
import { Salary } from '@workfolio/shared/generated/common';
import { DateUtil } from '@workfolio/shared/utils/DateUtil';

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
    <ul>
        {visibleSalaries
        .sort((a, b) => (b.negotiationDate || 0) - (a.negotiationDate || 0))
        .map((salary) => (
            <li 
                key={salary.id}
            >
                {
                salary.negotiationDate && (
                    <p>{DateUtil.formatTimestamp(salary.negotiationDate || 0, 'YYYY. MM. DD.')}</p>
                )
                }
                <div>
                    {
                    salary.memo && (
                        <p>{salary.memo}</p>
                    )}
                    {
                    salary.amount && salary.amount > 0 && (
                        <span>
                        {`연봉 ${Number(salary.amount).toLocaleString('ko-KR')}만 원`}
                        </span>
                    )
                    }
                </div>
            </li>
        ))}
    </ul>
  );
};

export default SalaryView;
