import React from 'react';
import { Education, Education_EducationStatus } from '@/generated/common';
import { DateUtil } from '@/utils/DateUtil';
import { normalizeEnumValue } from '@/utils/commonUtils';
import EmptyState from '@/components/portal/ui/EmptyState';

interface EducationViewProps {
  educations?: Education[];
  showHidden?: boolean;
}

/**
 * 학력 정보 읽기 전용 컴포넌트
 */
const EducationView: React.FC<EducationViewProps> = ({ 
  educations = [],
  showHidden = false
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

  // 필터링된 학력 목록 (한 번만 필터링)
  const filteredEducations = educations.filter(e => showHidden ? true : e.isVisible !== false);

  return (
    <>
        <div className="cont-tit">
            <div>
                <h3>학력</h3>
            </div>
        </div>
        
        {(!educations || filteredEducations.length === 0) ? (
        <EmptyState text="등록된 학력 정보가 없습니다." />
        ) : (
        
        <ul className="view-list type1">
        {filteredEducations.map((education) => (
            <li 
                key={education.id}
            >
                <div className="info">
                    <div>
                        <div>
                            {
                            education.name && (
                                <h4>{education.name}</h4>
                            )
                            }
                        </div>
                        <ul>
                            <li className="font-bl">
                                {
                                education.startedAt && education.endedAt && (
                                    <>{`${DateUtil.formatTimestamp(education.startedAt || 0, "YYYY. MM.")}`}</>
                                )
                                }
                                {
                                education.startedAt && education.endedAt && (
                                    <>{`- ${DateUtil.formatTimestamp(education.endedAt || 0, "YYYY. MM.")}`}</>
                                )
                                }
                            </li>
                            {
                            education.status && (
                                <li>{getStatusLabel(education.status)}</li>
                            )}
                        </ul>
                    </div>
                    <ul>
                        {
                        education.major && (
                            <li>{education.major}</li>
                        )
                        }
                    </ul>
                </div>
                <div className="desc">
                    {
                    education.description && (
                        <p>{education.description}</p>
                    )
                    }
                </div>
            </li>
        ))}
        </ul>
        )}
    </>
  );
};

export default EducationView;
