import React, { useState, useEffect, useRef } from 'react';
import { Education } from '@/generated/common';
import { DateUtil } from '../../../utils/DateUtil';
import { EducationCreateRequest, EducationUpdateRequest } from '@/generated/education';
import HttpMethod from '@/enums/HttpMethod';

interface EducationManagementProps {
  initialData?: Education[];
  onDataChange?: (data: Education[]) => void;
}

const EducationManagement: React.FC<EducationManagementProps> = ({ 
  initialData = [], 
  onDataChange
}) => {
  const [educations, setEducations] = useState<Education[]>([]);
  const [newEducation, setNewEducation] = useState<EducationCreateRequest>({
    name: '',
    agency: '',
    startedAt: 0,
    endedAt: 0
  });

  // Input 표시 상태
  const [showEducationInput, setShowEducationInput] = useState(false);
  
  // 초기 로드 여부를 추적하는 ref
  const isInitialLoad = useRef(true);

  // 초기 데이터 로드
  useEffect(() => {
    if (isInitialLoad.current && initialData && initialData.length > 0) {
      const educationsForm: Education[] = initialData.map((education: Education) => ({
        id: education.id,
        name: education.name,
        agency: education.agency,
        startedAt: education.startedAt,
        endedAt: education.endedAt,
        createdAt: education.createdAt,
        updatedAt: education.updatedAt
      }));
      setEducations(educationsForm);
      isInitialLoad.current = false;
    }
  }, [initialData]);

  // 데이터 변경 시 부모에게 알림 (초기 로드 제외)
  useEffect(() => {
    if (!isInitialLoad.current && educations.length >= 0 && onDataChange) {
      onDataChange(educations as Education[]);
    }
  }, [educations, onDataChange]);


  // 데이터 변경 핸들러
  const handleDataChange = (newEducations: Education[]) => {
    setEducations(newEducations);
    if (onDataChange) {
      onDataChange(newEducations as Education[]);
    }
  };

  // 교육 이력 추가
  const addEducation = async () => {
    if (newEducation.name && newEducation.agency && newEducation.startedAt) {
      try {
        const response = await fetch('/api/workers/educations', {
          method: HttpMethod.POST,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEducation),
        });

        if (response.ok) {
          const result = await response.json();
            if (result) {
            handleDataChange([...educations, result.education]);
            setNewEducation({
              name: '',
              agency: '',
              startedAt: 0,
              endedAt: 0
            });
          } else {
            console.error('Failed to add education');
          }
        } else {
          console.error('Failed to add education');
        }
      } catch (error) {
        console.error('Error adding education:', error);
      }
    }
  };

  // 교육 이력 수정
  const updateEducation = async (index: number, updatedEducation: EducationUpdateRequest) => {
    try {
      const response = await fetch('/api/workers/educations', {
        method: HttpMethod.PUT,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEducation),
      });

      if (response.ok) {
        const result = await response.json();
        if (result) {
          const updatedData = [...educations];
          updatedData[index] = result.education;
          handleDataChange(updatedData);
        } else {
          console.error('Failed to update education');
        }
      } else {
        console.error('Failed to update education');
      }
    } catch (error) {
      console.error('Error updating education:', error);
    }
  };

  // 교육 이력 삭제
  const removeEducation = async (index: number) => {
    try {
      const response = await fetch(`/api/workers/educations/${index}`, {
        method: HttpMethod.DELETE,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        handleDataChange(educations.filter((_, i) => i !== index));
      } else {
        console.error('Failed to delete education');
      }
    } catch (error) {
      console.error('Error deleting education:', error);
    }
  };

  // 공통 추가 버튼 렌더링 함수
  const renderAddButton = (title: string, backgroundColor: string = "#007bff", onClick: () => void) => (
    <div style={{ display: 'inline-block' }}>
      <button
        onClick={onClick}
        style={{
          backgroundColor: backgroundColor,
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          width: '50px',
          height: '30px',
          padding: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          whiteSpace: 'nowrap'
        }}
        title={title}
      >
        {title}
      </button>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0px' }}>
        {renderAddButton('추가', '#007bff', () => setShowEducationInput(!showEducationInput))}
      </div>
      
      {/* 교육 추가 입력 폼 */}
      {showEducationInput && (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #dee2e6'
        }}>
          <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', color: '#495057' }}>교육 추가</h4>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="교육명"
              value={newEducation.name}
              onChange={(e) => setNewEducation({ ...newEducation, name: e.target.value })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', flex: 1, minWidth: '150px' }}
            />
            <input
              type="text"
              placeholder="교육기관"
              value={newEducation.agency}
              onChange={(e) => setNewEducation({ ...newEducation, agency: e.target.value })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', flex: 1, minWidth: '150px' }}
            />
            <input
              type="date"
              placeholder="시작일"
              value={newEducation.startedAt ? DateUtil.formatTimestamp(newEducation.startedAt) : ''}
              onChange={(e) => setNewEducation({ ...newEducation, startedAt: DateUtil.parseToTimestamp(e.target.value) })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', flex: 1, minWidth: '150px' }}
            />
            <input
              type="date"
              placeholder="종료일"
              value={newEducation.endedAt ? DateUtil.formatTimestamp(newEducation.endedAt) : ''}
              onChange={(e) => setNewEducation({ ...newEducation, endedAt: DateUtil.parseToTimestamp(e.target.value) })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', flex: 1, minWidth: '150px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={addEducation}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#28a745', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer'
              }}
            >
              추가
            </button>
            <button 
              onClick={() => setShowEducationInput(false)}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#6c757d', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer'
              }}
            >
              취소
            </button>
          </div>
        </div>
      )}
      

      {/* 교육 이력 목록 */}
      <div>
        {educations?.map((education, index) => (
          <div 
            key={index} 
            style={{ 
              display: 'flex', 
              gap: '10px', 
              justifyContent: 'space-between', 
              padding: '10px', 
              border: '1px solid #ddd', 
              marginBottom: '10px', 
              borderRadius: '4px',
              backgroundColor: '#f9f9f9'
            }}
          >
            <div style={{ flex: 1 }}>
              <div><strong>{education.name}</strong></div>
              <div>교육기관: {education.agency}</div>
              <div>시작일: {education.startedAt ? DateUtil.formatTimestamp(education.startedAt) : ''}</div>
              <div>종료일: {education.endedAt ? DateUtil.formatTimestamp(education.endedAt) : ''}</div>
              <div>{DateUtil.formatTimestamp(education.startedAt)} ~ {DateUtil.formatTimestamp(education.endedAt || 0)}</div>
            </div>
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              <button 
                onClick={() => updateEducation(index, education)}
                style={{ 
                  width: '60px', 
                  height: '30px', 
                  backgroundColor: '#28a745', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                수정
              </button>
              {renderAddButton('삭제', '#dc3545', () => removeEducation(index))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationManagement;
