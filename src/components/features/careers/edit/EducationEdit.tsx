import React, { useEffect } from 'react';
import { ResumeUpdateRequest_EducationRequest } from '@/generated/resume';
import { Education_EducationStatus } from '@/generated/common';
import Input from '@/components/ui/Input';
import Dropdown from '@/components/ui/Dropdown';
import styles from '../CareerContentEdit.module.css';
import DatePicker from '@/components/ui/DatePicker';
import { DateTime } from 'luxon';
import { normalizeEnumValue } from '@/utils/commonUtils';
import DraggableList from '@/components/ui/DraggableList';
import DraggableItem from '@/components/ui/DraggableItem';
import CardActions from '@/components/ui/CardActions';
import EmptyState from '@/components/ui/EmptyState';

interface EducationEditProps {
  educations: ResumeUpdateRequest_EducationRequest[];
  onUpdate: (educations: ResumeUpdateRequest_EducationRequest[]) => void;
}

interface EducationItemProps {
  education: ResumeUpdateRequest_EducationRequest;
  index: number;
  handleEducationChange: (index: number, field: keyof ResumeUpdateRequest_EducationRequest, value: string | number | boolean | undefined) => void;
  toggleVisible: (index: number) => void;
  handleDeleteEducation: (index: number) => void;
}

const EducationItem: React.FC<EducationItemProps> = ({
  education,
  index,
  handleEducationChange,
  toggleVisible,
  handleDeleteEducation,
}) => {
  return (
    <DraggableItem 
      id={education.id || `education-${index}`}
      className={styles.cardWrapper}
    >
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
      
      <CardActions
        isVisible={education.isVisible ?? true}
        onToggleVisible={() => toggleVisible(index)}
        onDelete={() => handleDeleteEducation(index)}
      />
    </DraggableItem>
  );
};

/**
 * 학력 섹션 전체를 관리하는 컴포넌트
 * sectionHeader, 추가 버튼, 개별 학력 항목 포함
 */
const EducationEdit: React.FC<EducationEditProps> = ({ educations, onUpdate }) => {
  const createEmptyEducation = (priority: number = 0): ResumeUpdateRequest_EducationRequest => ({
    major: '',
    name: '',
    description: '',
    status: undefined,
    startedAt: undefined,
    endedAt: undefined,
    isVisible: true,
    priority,
  });

  // priority를 배열 인덱스와 동기화
  useEffect(() => {
    const needsUpdate = educations.some((education, idx) => education.priority !== idx);
    if (needsUpdate && educations.length > 0) {
      const updated = educations.map((education, idx) => ({
        ...education,
        priority: idx
      }));
      onUpdate(updated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [educations.length]);

  const handleAddEducation = () => {
    const newEducation = createEmptyEducation(educations.length);
    onUpdate([...educations, newEducation]);
  };

  const handleDeleteEducation = (index: number) => {
    const filtered = educations.filter((_, i) => i !== index);
    // priority를 인덱스로 재설정
    const updated = filtered.map((education, idx) => ({
      ...education,
      priority: idx
    }));
    onUpdate(updated);
  };

  const handleEducationChange = (index: number, field: keyof ResumeUpdateRequest_EducationRequest, value: string | number | boolean | undefined) => {
    const newEducations = [...educations];
    newEducations[index] = {
      ...newEducations[index],
      [field]: value
    };
    
    // priority를 인덱스로 설정
    const updatedEducations = newEducations.map((education, idx) => ({
      ...education,
      priority: idx
    }));
    
    onUpdate(updatedEducations);
  };

  const toggleVisible = (index: number) => {
    handleEducationChange(index, 'isVisible', !educations[index].isVisible);
  };

  const handleReorder = (reorderedEducations: ResumeUpdateRequest_EducationRequest[]) => {
    // priority를 새로운 인덱스로 재설정
    const updatedEducations = reorderedEducations.map((education, idx) => ({
      ...education,
      priority: idx
    }));
    onUpdate(updatedEducations);
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

      {educations.length === 0 ? (
        <EmptyState text="등록된 학력 정보가 없습니다." />
      ) : (
        <DraggableList
          items={educations}
          onReorder={handleReorder}
          getItemId={(edu, idx) => edu.id || `education-${idx}`}
          renderItem={(education, index) => (
            <EducationItem
              key={education.id || `education-${index}`}
              education={education}
              index={index}
              handleEducationChange={handleEducationChange}
              toggleVisible={toggleVisible}
              handleDeleteEducation={handleDeleteEducation}
            />
          )}
        />
      )}
    </div>
  );
};

export default EducationEdit;
