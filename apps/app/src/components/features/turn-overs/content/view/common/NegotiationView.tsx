import React from 'react';
import { TurnOverRetrospectiveDetail_EmploymentType } from '@workfolio/shared/generated/common';
import DateUtil from '@workfolio/shared/utils/DateUtil';
import '@workfolio/shared/styles/component-view.css';

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
    <>
        <div className="cont-tit">
            <div>
                <h3>처우 협의</h3>
            </div>
        </div>
        
        <ul className="view-list type1">
            <li>
                <div className="info">
                    <div>
                        <div><h4>{position}</h4></div>
                        <ul>
                            {joinedAt && (
                                <li>입사 일자 {DateUtil.formatTimestamp(joinedAt, 'YYYY. MM. DD.')}</li>
                            )}
                            {employmentType && (
                                <li>{getEmploymentTypeLabel(employmentType)}</li>
                            )}
                            {workType && (
                                <li>{workType}</li>
                            )}
                        </ul>
                    </div>
                    <ul>
                        {department && <li>{department}</li>}
                        {rank && (
                            <li>{rank}</li>
                        )}
                        {jobTitle && (
                            <li>{jobTitle}</li>
                        )}
                    </ul>
                </div>
                <div className="desc">
                    {salary > 0 && (
                        <p>연봉 {formatSalary(salary)}</p>
                    )}
                </div>
            </li>
        </ul>
    </>
  );
};

export default NegotiationView;

