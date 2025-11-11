import React from 'react';
import { Career, Career_EmploymentType } from '@/generated/common';
import { DateUtil } from '@/utils/DateUtil';
import { normalizeEnumValue } from '@/utils/commonUtils';
import SalaryView from './SalaryView';
import dayjs from 'dayjs';
import EmptyState from '@/components/portal/ui/EmptyState';

interface CareerViewProps {
  careers?: Career[];
  showHidden?: boolean;
}

/**
 * 경력 정보 읽기 전용 컴포넌트
 */
const CareerView: React.FC<CareerViewProps> = ({ 
  careers = [],
  showHidden = false
}) => {
  // 고용 형태 한글 변환
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

  // 근무 기간 표시 (날짜 + 기간 계산)
  const formatCareerPeriod = (startedAt?: number, endedAt?: number, isWorking?: boolean) => {
    const startDate = DateUtil.formatTimestamp(startedAt || 0, 'YYYY. MM.');
    const endDate = isWorking ? ' - 재직중' : ` - ${DateUtil.formatTimestamp(endedAt || 0, 'YYYY. MM.')}`;
    

    let result = `${startDate}${endedAt ? endDate : ''}`;
    
    if (startedAt) {
      const start = dayjs(DateUtil.normalizeTimestamp(startedAt));
      let end: dayjs.Dayjs;
      
      if (isWorking) {
        // 재직중이면 현재 날짜 기준으로 계산
        end = dayjs(Date.now());
      } else if (endedAt) {
        // 퇴사했으면 endedAt 기준으로 계산
        end = dayjs(DateUtil.normalizeTimestamp(endedAt));
      } else {
        return result; // endedAt도 없으면 기간 표시 안 함
      }
      
      // 전체 개월 수 차이를 구함
      const totalMonths = end.diff(start, 'month');
      
      // 년과 월로 분리
      const years = Math.floor(totalMonths / 12);
      const months = totalMonths % 12;
      
      result += ` (${years}년 ${months}개월)`;
    }
    
    return result;
  };

  // 총 경력 기간 계산 (모든 career의 기간 합산)
  const calculateTotalCareerPeriod = () => {
    if (careers.length === 0) {
      return '';
    }

    let totalMonths = 0;

    // 각 career의 근무 개월 수를 계산하여 합산
    careers.forEach((career) => {
      const startedAt = career.startedAt;
      
      if (!startedAt) {
        return; // startedAt이 없으면 스킵
      }

      let endTimestamp: number;

      if (career.isWorking) {
        // 재직중이면 현재 날짜 사용
        endTimestamp = Date.now();
      } else {
        // 퇴사했으면 endedAt 사용
        endTimestamp = DateUtil.normalizeTimestamp(career.endedAt || 0);
      }

      const start = dayjs(DateUtil.normalizeTimestamp(startedAt));
      const end = dayjs(endTimestamp);

      // 해당 career의 개월 수를 총합에 더함
      const careerMonths = end.diff(start, 'month');
      totalMonths += careerMonths;
    });

    // 총 개월 수를 년/월로 변환
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    return `${years}년 ${months}개월`;
  };

  const totalPeriod = calculateTotalCareerPeriod();

  return (
    <>
        <div className="cont-tit">
            <div>
                <h3>경력</h3>
                {careers && careers.length > 0 && (
                    <p>{totalPeriod}</p>
                )}
            </div>
        </div>
        
        {/* 필터링된 경력 목록 (한 번만 필터링) */}
        {(() => {
        const filteredCareers = careers.filter(c => showHidden ? true : c.isVisible !== false);
        
        return (!careers || filteredCareers.length === 0) ? (
            <EmptyState text="등록된 경력 정보가 없습니다." />
        ) : (
        
        <ul className="view-list type1">
            {filteredCareers.map((career) => (
            <li 
                key={career.id}
            >
                <div className="info">
                    <div>
                        <div>
                            {
                                career.name && (
                                <h4>{career.name}</h4>
                                )
                            }
                            {
                                career.position && (
                                <p>{career.position}</p>
                                )
                            }
                        </div>
                        <ul>
                            <li className="font-bl">{formatCareerPeriod(career.startedAt, career.endedAt, career.isWorking)}</li>
                            {
                            career.employmentType && (
                                <li>{getEmploymentTypeLabel(career.employmentType)}</li>
                            )
                            }
                            {
                            career.salary > 0 && (
                                <li>{(career.salary && career.salary > 0 && `연봉 ${career.salary.toLocaleString('ko-KR')}만 원`)}</li>
                            )
                            }
                        </ul>
                    </div>
                    <ul>
                        {
                        career.department && (
                            <li>{career.department}</li>
                        )
                        }
                        {
                        career.jobTitle && (
                            <li>{career.jobTitle}</li>
                        )
                        }
                    </ul>
                </div>
                <div className="desc">
                    {
                    career.description && (
                        <p>{career.description}</p>
                    )
                    }
                    <SalaryView salaries={career.salaries || []} showHidden={showHidden} />
                </div>
            </li>
            ))}
        </ul>
        );
        })()}
    </>
  );
};

export default CareerView;
