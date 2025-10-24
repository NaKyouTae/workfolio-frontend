import React from 'react';
import { Career, Career_EmploymentType } from '@/generated/common';
import { DateUtil } from '@/utils/DateUtil';
import { normalizeEnumValue } from '@/utils/commonUtils';
import SalaryView from './SalaryView';
import dayjs from 'dayjs';

interface CareerViewProps {
  careers?: Career[];
}

/**
 * 경력 정보 읽기 전용 컴포넌트
 */
const CareerView: React.FC<CareerViewProps> = ({ 
  careers = []
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
    const endDate = isWorking ? '재직중' : DateUtil.formatTimestamp(endedAt || 0, 'YYYY. MM.');
    
    let result = `${startDate} - ${endDate}`;
    
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

  if (!careers || careers.length === 0) {
    return null;
  }

  const totalPeriod = calculateTotalCareerPeriod();

  return (
    <div>
      <h3 style={{ 
        fontSize: '16px', 
        fontWeight: '700', 
        color: '#000',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}> 
        <span>경력</span>
        <span style={{
          fontSize: '14px',
          fontWeight: '400',
          color: '#999'
        }}>
          {totalPeriod}
        </span>
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {careers.filter(c => c.isVisible !== false).map((career) => (
          <div 
            key={career.id}
            style={{
              padding: '20px',
              border: '1px solid #e0e0e0',
              marginBottom: '16px'
            }}
          >
            {/* 상단 헤더: 회사명/직책 | 날짜/재직상태/연봉 */}
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '12px',
              gap: '20px'
            }}>
              {/* 좌측: 회사명과 직책 */}
              <div style={{ 
                flex: 1,
                display: 'flex',
                alignItems: 'baseline',
                gap: '12px'
              }}>
                <h4 style={{ 
                  fontSize: '18px', 
                  fontWeight: '700', 
                  color: '#000',
                  margin: 0
                }}>
                  {career.name}
                </h4>
                {career.position && (
                  <div style={{ 
                    fontSize: '14px',
                    color: '#999'
                  }}>
                    {career.position}
                  </div>
                )}
              </div>

              {/* 우측: 날짜, 재직상태, 연봉 */}
              <div style={{ 
                textAlign: 'right',
                whiteSpace: 'nowrap',
                fontSize: '13px',
                color: '#999'
              }}>
                <div>
                  {formatCareerPeriod(career.startedAt, career.endedAt, career.isWorking)}
                  {career.isWorking && (
                    <>
                      {' | '}
                      {getEmploymentTypeLabel(career.employmentType)}
                    </>
                  )}
                  {career.salary && career.salary > 0 && (
                    <>
                      {' | '}
                      연봉 {(career.salary).toLocaleString('ko-KR')}만 원
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 중간: 부서 | 직책 | 직급 */}
            {(career.department || career.position || career.jobGrade) && (
              <div style={{ 
                fontSize: '14px',
                color: '#666',
                marginBottom: '12px'
              }}>
                {[career.department, career.position, career.jobGrade].filter(Boolean).join(' | ')}
              </div>
            )}

            {/* 직무 내용 */}
            {career.description && (
              <div style={{ 
                fontSize: '14px',
                color: '#333',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap',
                marginBottom: '16px'
              }}>
                {career.description}
              </div>
            )}

            {/* 급여 이력 */}
            <SalaryView salaries={career.salaries || []} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerView;
