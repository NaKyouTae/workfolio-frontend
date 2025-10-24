import React, { useEffect } from 'react';
import { ResumeUpdateRequest_EducationRequest } from '@/generated/resume';
import { Education_EducationStatus } from '@/generated/common';
import Input from '@/components/ui/Input';
import Dropdown from '@/components/ui/Dropdown';
import styles from '../CareerContentEdit.module.css';
import DatePicker from '@/components/ui/DatePicker';
import { DateTime } from 'luxon';
import { normalizeEnumValue } from '@/utils/commonUtils';

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
    major: '',
    name: '',
    description: '',
    status: undefined,
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

  const handleEducationChange = (index: number, field: keyof ResumeUpdateRequest_EducationRequest, value: string | number | boolean | undefined) => {
    const newEducations = [...educations];
    newEducations[index] = {
      ...newEducations[index],
      [field]: value
    };
    onUpdate(newEducations);
  };

  const toggleVisible = (index: number) => {
    handleEducationChange(index, 'isVisible', !educations[index].isVisible);
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
        <div key={education.id || index} className={styles.cardWrapper}>
          <div className={styles.card}>
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
                value={education.startedAt}
                onChange={(date) => handleEducationChange(index, 'startedAt', DateTime.fromISO(date).toMillis())}
                required={false}
              />
              <span className={styles.dateSeparator}>~</span>
              <DatePicker
                label="종료 일시"
                value={education.endedAt}
                onChange={(date) => handleEducationChange(index, 'endedAt', DateTime.fromISO(date).toMillis())}
                required={false}
              />
            </div>
            {/* 상태 */}
            <div className={styles.formField}>
              <Dropdown
                label="상태"
                selectedOption={normalizeEnumValue(education.status, Education_EducationStatus)}
                options={[
                  { value: Education_EducationStatus.GRADUATED, label: '졸업' },
                  { value: Education_EducationStatus.GRADUATING, label: '졸업예정' },
                  { value: Education_EducationStatus.ENROLLED, label: '재학중' },
                  { value: Education_EducationStatus.DROPPED_OUT, label: '중퇴' },
                  { value: Education_EducationStatus.COMPLETED, label: '수료' },
                  { value: Education_EducationStatus.ON_LEAVE, label: '휴학' },
                ]}
                setValue={(value) => handleEducationChange(index, 'status', normalizeEnumValue(value, Education_EducationStatus))}
              />
            </div>
          </div>
          <div className={styles.formField}>
            <Input
              type="text"
              label="내용"
              placeholder="내용"
              value={education.description || ''}
              onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
            />
          </div>
          </div>
          
          <div className={styles.cardActions}>
            <button
              onClick={() => toggleVisible(index)}
              className={`${styles.visibleButton} ${education.isVisible ? styles.visible : ''}`}
            >
              {education.isVisible ? '보임' : '안보임'}
            </button>
            <button
              onClick={() => handleDeleteEducation(index)}
              className={styles.cardDeleteButton}
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EducationEdit;
