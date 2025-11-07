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
import DraggableList from '@/components/ui/DraggableList';
import DraggableItem from '@/components/ui/DraggableItem';
import CardActions from '@/components/ui/CardActions';
import EmptyState from '@/components/ui/EmptyState';

interface ActivityEditProps {
  activities: ResumeUpdateRequest_ActivityRequest[];
  onUpdate: (activities: ResumeUpdateRequest_ActivityRequest[]) => void;
}

interface ActivityItemProps {
  activity: ResumeUpdateRequest_ActivityRequest;
  index: number;
  handleActivityChange: (index: number, field: keyof ResumeUpdateRequest_ActivityRequest, value: string | number | boolean | undefined) => void;
  toggleVisible: (index: number) => void;
  handleDeleteActivity: (index: number) => void;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  activity,
  index,
  handleActivityChange,
  toggleVisible,
  handleDeleteActivity,
}) => {
  return (
    <DraggableItem 
        id={activity.id || `activity-${index}`}
    >
        <div className="card">
            <ul className="edit-cont">
                <li>
                    <p>활동명</p>
                    <Input 
                        type="text"
                        label="활동명"
                        placeholder="예) 자격증명, 교육명 등"
                        value={activity.name || ''}
                        onChange={(e) => handleActivityChange(index, 'name', e.target.value)}
                    />
                </li>
                <li>
                    <p>구분</p>
                    <Dropdown
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
                </li>
                <li>
                    <p>기관</p>
                    <Input 
                        type="text"
                        label="기관"
                        placeholder="예) 한국산업인력공단 등"
                        value={activity.organization || ''}
                        onChange={(e) => handleActivityChange(index, 'organization', e.target.value)}
                    />
                </li>
                <li>
                    <p>기간</p>
                    <div>
                        <DatePicker
                            value={activity.startedAt}
                            onChange={(date) => handleActivityChange(index, 'startedAt', DateTime.fromISO(date).toMillis())}
                            required={false}
                        />
                        { activity.type !== Activity_ActivityType.CERTIFICATION && (
                        <>  
                            <span>-</span>
                            <DatePicker
                                value={activity.endedAt}
                                onChange={(date) => handleActivityChange(index, 'endedAt', DateTime.fromISO(date).toMillis())}
                                required={false}
                            />
                        </>
                        )}
                    </div>
                </li>
                {
                    activity.type === Activity_ActivityType.CERTIFICATION && (
                    <li>
                        <p>취득번호</p>
                        <Input 
                            type="text"
                            label="취득번호"
                            placeholder="취득번호를 입력해 주세요."
                            value={activity.certificateNumber || ''}
                            onChange={(e) => handleActivityChange(index, 'certificateNumber', e.target.value)}
                        />
                    </li>
                    )
                }
                {
                    activity.type !== Activity_ActivityType.CERTIFICATION && (
                    <li className="full">
                        <p>내용</p>
                        {/* <Input 
                            type="text"
                            label="내용"
                            placeholder="내용을 입력해 주세요."
                            value={activity.description || ''}
                            onChange={(e) => handleActivityChange(index, 'description', e.target.value)}
                        /> */}
                        <textarea placeholder="내용을 입력해 주세요."></textarea>
                    </li>
                    )
                }
            </ul>
            <CardActions
            isVisible={activity.isVisible ?? true}
            onToggleVisible={() => toggleVisible(index)}
            onDelete={() => handleDeleteActivity(index)}
            />
        </div>
    </DraggableItem>
  );
};

/**
 * 활동 섹션 전체를 관리하는 컴포넌트
 * sectionHeader, 추가 버튼, 개별 활동 항목 포함
 */
const ActivityEdit: React.FC<ActivityEditProps> = ({ activities, onUpdate }) => {
  const createEmptyActivity = (priority: number = 0): ResumeUpdateRequest_ActivityRequest => ({
    type: Activity_ActivityType.CERTIFICATION,
    name: '',
    organization: '',
    certificateNumber: '',
    startedAt: undefined,
    endedAt: undefined,
    description: '',
    isVisible: true,
    priority,
  });

  // priority를 배열 인덱스와 동기화
  useEffect(() => {
    const needsUpdate = activities.some((activity, idx) => activity.priority !== idx);
    if (needsUpdate && activities.length > 0) {
      const updated = activities.map((activity, idx) => ({
        ...activity,
        priority: idx
      }));
      onUpdate(updated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activities.length]);

  const handleAddActivity = () => {
    const newActivity = createEmptyActivity(activities.length);
    onUpdate([...activities, newActivity]);
  };

  const handleDeleteActivity = (index: number) => {
    const filtered = activities.filter((_, i) => i !== index);
    // priority를 인덱스로 재설정
    const updated = filtered.map((activity, idx) => ({
      ...activity,
      priority: idx
    }));
    onUpdate(updated);
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
    
    // priority를 인덱스로 설정
    const updatedActivities = newActivities.map((activity, idx) => ({
      ...activity,
      priority: idx
    }));
    
    onUpdate(updatedActivities);
  };

  const toggleVisible = (index: number) => {
    handleActivityChange(index, 'isVisible', !activities[index].isVisible);
  };

  const handleReorder = (reorderedActivities: ResumeUpdateRequest_ActivityRequest[]) => {
    const updatedActivities = reorderedActivities.map((activity, idx) => ({
      ...activity,
      priority: idx
    }));
    onUpdate(updatedActivities);
  };

  return (
    <>
        <div className="cont-tit">
            <div>
                <h3>활동</h3>
                {/* <p>{activities.length}개</p> */}
            </div>
            <button onClick={handleAddActivity}><i className="ic-add" />추가</button>
        </div>

        {activities.length === 0 ? (
        <EmptyState text="등록된 활동 정보가 없습니다." />
        ) : (
        <DraggableList
            items={activities}
            onReorder={handleReorder}
            getItemId={(act, idx) => act.id || `activity-${idx}`}
            renderItem={(activity, index) => (
            <ActivityItem
                key={activity.id || `activity-${index}`}
                activity={activity}
                index={index}
                handleActivityChange={handleActivityChange}
                toggleVisible={toggleVisible}
                handleDeleteActivity={handleDeleteActivity}
            />
            )}
        />
        )}
    </>
  );
};

export default ActivityEdit;
