import React, { useEffect } from 'react';
import { ResumeUpdateRequest_ActivityRequest } from '@/generated/resume';
import { Activity_ActivityType } from '@/generated/common';
import Input from '@/components/ui/Input';
import Dropdown from '@/components/ui/Dropdown';
import styles from '../CareerContentEdit.module.css';
import DatePicker from '@/components/ui/DatePicker';
import DateUtil from '@/utils/DateUtil';
import { DateTime } from 'luxon';
import { normalizeEnumValue } from '@/utils/commonUtils';

interface ActivityEditProps {
  activities: ResumeUpdateRequest_ActivityRequest[];
  onUpdate: (activities: ResumeUpdateRequest_ActivityRequest[]) => void;
}

/**
 * 활동 섹션 전체를 관리하는 컴포넌트
 * sectionHeader, 추가 버튼, 개별 활동 항목 포함
 */
const ActivityEdit: React.FC<ActivityEditProps> = ({ activities, onUpdate }) => {
  const createEmptyActivity = (): ResumeUpdateRequest_ActivityRequest => ({
    type: Activity_ActivityType.CERTIFICATION,
    name: '',
    organization: '',
    certificateNumber: '',
    startedAt: undefined,
    endedAt: undefined,
    description: '',
    isVisible: true,
  });

  // 빈 배열일 때 자동으로 항목 하나 추가
  useEffect(() => {
    if (activities.length === 0) {
      onUpdate([createEmptyActivity()]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddActivity = () => {
    onUpdate([...activities, createEmptyActivity()]);
  };

  const handleDeleteActivity = (index: number) => {
    onUpdate(activities.filter((_, i) => i !== index));
  };

  const handleActivityChange = (index: number, field: keyof ResumeUpdateRequest_ActivityRequest, value: string | number | boolean | undefined) => {
    const newActivities = [...activities];
    
    // startedAt, endedAt는 timestamp(number)로 변환
    if (field === 'startedAt' || field === 'endedAt') {
      newActivities[index] = {
        ...newActivities[index],
        [field]: typeof value === 'string' ? DateUtil.parseToTimestamp(value) : value
      };
    } 
    else {
      newActivities[index] = {
        ...newActivities[index],
        [field]: value
      };
    }
    
    onUpdate(newActivities);
  };

  const toggleVisible = (index: number) => {
    handleActivityChange(index, 'isVisible', !activities[index].isVisible);
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitleCounter}>
          활동 | {activities.length}개
        </h3>
        <div className={styles.addButtonContainer}>
          <button
            onClick={handleAddActivity}
            className={styles.addButton}
          >
            <span>+ 추가</span>
          </button>
        </div>
      </div>

      {activities.map((activity, index) => (
        <div key={activity.id || index} className={styles.cardWrapper}>
          <div className={styles.card}>
            <div className={styles.gridContainer2}>
            {/* 활동명 */}
            <div className={styles.formField}>
              <Input 
                type="text"
                label="활동명"
                placeholder="정보처리기사"
                value={activity.name || ''}
                onChange={(e) => handleActivityChange(index, 'name', e.target.value)}
              />
            </div>
            {/* 활동 유형 */}
            <div className={styles.formField}>
              <Dropdown
                label="구분"
                selectedOption={normalizeEnumValue(activity.type, Activity_ActivityType)}
                options={[
                  { value: Activity_ActivityType.EXTERNAL, label: '대외활동' },
                  { value: Activity_ActivityType.EDUCATION, label: '교육' },
                  { value: Activity_ActivityType.CERTIFICATION, label: '자격증' },
                  { value: Activity_ActivityType.AWARD, label: '수상' },
                  { value: Activity_ActivityType.ETC, label: '기타' },
                ]}
                setValue={(value) => handleActivityChange(index, 'type', normalizeEnumValue(value, Activity_ActivityType))}
              />
            </div>

          </div>
          <div className={styles.gridContainer2}>
            {/* 기관/단체명 */}
            <div className={styles.formField}>
              <Input 
                type="text"
                label="기관"
                placeholder="한국산업인력공단"
                value={activity.organization || ''}
                onChange={(e) => handleActivityChange(index, 'organization', e.target.value)}
              />
            </div>
            <div className={styles.formField}>
              <DatePicker
                label="기간"
                value={activity.startedAt}
                onChange={(date) => handleActivityChange(index, 'startedAt', DateTime.fromISO(date).toMillis())}
                required={false}
              />
            </div>
          </div>

          <div className={styles.gridContainer2}>
            {
              activity.type === Activity_ActivityType.CERTIFICATION && (
                <>
                  <div className={styles.formField}>
                    <Input 
                      type="text"
                      label="자격증 번호"
                      placeholder="00-00-000000"
                      value={activity.certificateNumber || ''}
                      onChange={(e) => handleActivityChange(index, 'certificateNumber', e.target.value)}
                    />
                  </div>
                </>
              )
            }
            {
              activity.type !== Activity_ActivityType.CERTIFICATION && (
                <>
                  <div className={styles.formField}>
                    <Input 
                      type="text"
                      label="내용"
                      placeholder="정보처리기사 자격증을 취득하였습니다."
                      value={activity.description || ''}
                      onChange={(e) => handleActivityChange(index, 'description', e.target.value)}
                    />
                  </div>
                </>
              )
            }
          </div>
          </div>
          
          <div className={styles.cardActions}>
            <button
              onClick={() => toggleVisible(index)}
              className={`${styles.visibleButton} ${activity.isVisible ? styles.visible : ''}`}
            >
              {activity.isVisible ? '보임' : '안보임'}
            </button>
            <button
              onClick={() => handleDeleteActivity(index)}
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

export default ActivityEdit;
