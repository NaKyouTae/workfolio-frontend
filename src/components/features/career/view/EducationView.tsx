import React from 'react';
import { Education, Education_EducationStatus } from '@/generated/common';
import { DateUtil } from '@/utils/DateUtil';
import { normalizeEnumValue } from '@/utils/commonUtils';
import EmptyState from '@/components/ui/EmptyState';

interface EducationViewProps {
  educations?: Education[];
}

/**
 * 학력 정보 읽기 전용 컴포넌트
 */
const EducationView: React.FC<EducationViewProps> = ({ 
  educations = []
}) => {
  // 학력 상태 한글 변환
  const getStatusLabel = (status?: Education_EducationStatus) => {
    const normalizedStatus = normalizeEnumValue(status, Education_EducationStatus);
    switch (normalizedStatus) {
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

  return (
    <div>
      <h3 style={{ 
        fontSize: '16px', 
        fontWeight: '700', 
        color: '#000',
        marginBottom: '20px'
      }}>
        학력
      </h3>
      
      {(!educations || educations.length === 0) ? (
        <EmptyState text="등록된 학력 정보가 없습니다." />
      ) : (
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {educations.filter(e => e.isVisible !== false).map((education) => (
          <div 
            key={education.id}
            style={{
              padding: '20px',
              border: '1px solid #e0e0e0',
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '20px'
            }}
          >
            {/* 좌측: Title, Major, Description */}
            <div style={{ flex: 1 }}>
              <h4 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#333',
                marginBottom: '6px'
              }}>
                {education.name || '학교명'}
              </h4>
              <div style={{ 
                fontSize: '14px',
                color: education.major ? '#666' : '#ddd',
                marginBottom: '4px'
              }}>
                {education.major || '전공'}
              </div>
              <div style={{ 
                fontSize: '13px',
                color: education.description ? '#999' : '#ddd',
                marginTop: '8px'
              }}>
                {education.description || '내용'}
              </div>
            </div>

            {/* 우측: Date Range | Status */}
            <div style={{ 
              textAlign: 'right',
              whiteSpace: 'nowrap',
              fontSize: '13px',
              color: '#999'
            }}>
              {DateUtil.formatTimestamp(education.startedAt || 0, "YYYY. MM.") || '시작일'} - {DateUtil.formatTimestamp(education.endedAt || 0, "YYYY. MM.") || '종료일'}
              {education.status && (
                <>
                  {' | '}
                  <span>{getStatusLabel(education.status)}</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default EducationView;
