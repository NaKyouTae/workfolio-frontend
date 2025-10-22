import React, { useEffect } from 'react';
import { ResumeUpdateRequest_EducationRequest } from '@/generated/resume';
import { Education_EducationStatus } from '@/generated/common';
import Input from '@/components/ui/Input';
import Dropdown from '@/components/ui/Dropdown';
import styles from '../CareerContentEdit.module.css';
import DatePicker from '@/components/ui/DatePicker';
import DateUtil from '@/utils/DateUtil';

interface EducationEditProps {
  educations: ResumeUpdateRequest_EducationRequest[];
  onUpdate: (educations: ResumeUpdateRequest_EducationRequest[]) => void;
}

/**
 * 학력 섹션 전체를 관리하는 컴포넌트
 * sectionHeader, 추가 버튼, 개별 학력 항목 포함
 */
const EducationEdit: React.FC<EducationEditProps> = ({ educations, onUpdate }) => {
  const createEmptyEducation = (): ResumeUpdateRequest_EducationRequest => ({
    id: `temp_${Date.now()}`,
    major: '',
    name: '',
    status: Education_EducationStatus.GRADUATED,
    startedAt: undefined,
    endedAt: undefined,
    isVisible: true,
  });

  // 빈 배열일 때 자동으로 항목 하나 추가
  useEffect(() => {
    if (educations.length === 0) {
      onUpdate([createEmptyEducation()]);
    }
  }, []);

  const handleAddEducation = () => {
    onUpdate([...educations, createEmptyEducation()]);
  };

  const handleDeleteEducation = (index: number) => {
    onUpdate(educations.filter((_, i) => i !== index));
  };

  const handleEducationChange = (index: number, field: keyof ResumeUpdateRequest_EducationRequest, value: string) => {
    const newEducations = [...educations];
    newEducations[index] = {
      ...newEducations[index],
      [field]: value
    };
    onUpdate(newEducations);
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitleCounter}>
          학력 | {educations.length}개
        </h3>
        <div className={styles.addButtonContainer}>
          <button
            onClick={handleAddEducation}
            className={styles.addButton}
          >
            <span>+ 추가</span>
          </button>
        </div>
      </div>

      {educations.map((education, index) => (
        <div key={education.id || index} className={styles.card}>
          {educations.length > 1 && (
            <button
              onClick={() => handleDeleteEducation(index)}
              className={styles.deleteButton}
            >
              ×
            </button>
          )}

          <div className={styles.gridContainer2}>
            {/* 학교 */}
            <div className={styles.formField}>
              <Input 
                type="text"
                label="학교"
                placeholder="서울대학교"
                value={education.name || ''}
                onChange={(e) => handleEducationChange(index, 'name', e.target.value)}
              />
            </div>

            {/* 전공 */}
            <div className={styles.formField}>
              <Input 
                type="text"
                label="전공"
                placeholder="컴퓨터공학"
                value={education.major || ''}
                onChange={(e) => handleEducationChange(index, 'major', e.target.value)}
              />
            </div>
          </div>
          <div className={styles.gridContainer2}>
            <div className={styles.formField}>
              <DatePicker
                label="시작 일시"
                value={education.startedAt ? DateUtil.formatTimestamp(education.startedAt) : undefined}
                onChange={(date) => handleEducationChange(index, 'startedAt', date)}
                required={false}
              />
              <span className={styles.dateSeparator}>~</span>
              <DatePicker
                label="종료 일시"
                value={education.endedAt ? DateUtil.formatTimestamp(education.endedAt) : undefined}
                onChange={(date) => handleEducationChange(index, 'endedAt', date)}
                required={false}
              />
            </div>
            {/* 상태 */}
            <div className={styles.formField}>
              <Dropdown
                label="상태"
                selectedOption={education.status?.toString() || String(Education_EducationStatus.GRADUATED)}
                options={[
                  { value: String(Education_EducationStatus.GRADUATED), label: '졸업' },
                  { value: String(Education_EducationStatus.GRADUATING), label: '졸업예정' },
                  { value: String(Education_EducationStatus.ENROLLED), label: '재학중' },
                  { value: String(Education_EducationStatus.DROPPED_OUT), label: '중퇴' },
                  { value: String(Education_EducationStatus.COMPLETED), label: '수료' },
                  { value: String(Education_EducationStatus.ON_LEAVE), label: '휴학' },
                ]}
                setValue={(value) => handleEducationChange(index, 'status', value)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EducationEdit;
