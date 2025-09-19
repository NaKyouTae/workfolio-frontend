import React, { useState, useEffect, useRef } from 'react';
import { WorkerCareerUpdateRequest_WorkerDegrees } from '../../../generated/worker_career';
import { Degrees } from '@/generated/common';
import { DateUtil } from '../../../utils/DateUtil';

interface DegreesManagementProps {
  initialData?: Degrees[];
  onDataChange?: (data: Degrees[]) => void;
}

const DegreesManagement: React.FC<DegreesManagementProps> = ({ 
  initialData = [], 
  onDataChange
}) => {
  const [degrees, setDegrees] = useState<WorkerCareerUpdateRequest_WorkerDegrees[]>([]);
  const [newDegree, setNewDegree] = useState<WorkerCareerUpdateRequest_WorkerDegrees>({
    name: '',
    major: '',
    startedAt: 0,
    endedAt: 0
  });

  // Input 표시 상태
  const [showDegreeInput, setShowDegreeInput] = useState(false);
  
  // 초기 로드 여부를 추적하는 ref
  const isInitialLoad = useRef(true);

  // 초기 데이터 로드
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      const degreesForm: WorkerCareerUpdateRequest_WorkerDegrees[] = initialData.map((degree: Degrees) => ({
        name: degree.name,
        major: degree.major,
        startedAt: degree.startedAt,
        endedAt: degree.endedAt
      }));
      setDegrees(degreesForm);
      isInitialLoad.current = false;
    }
  }, [initialData]);

  // 데이터 변경 시 부모에게 알림 (초기 로드 제외)
  useEffect(() => {
    if (!isInitialLoad.current && degrees.length >= 0 && onDataChange) {
      onDataChange(degrees as Degrees[]);
    }
  }, [degrees, onDataChange]);

  // 데이터 변경 핸들러
  const handleDataChange = (newDegrees: WorkerCareerUpdateRequest_WorkerDegrees[]) => {
    setDegrees(newDegrees);
    if (onDataChange) {
      onDataChange(newDegrees as Degrees[]);
    }
  };



  // 학위 추가
  const addDegree = async () => {
    if (newDegree.name && newDegree.major && newDegree.startedAt) {
      try {
        const response = await fetch('/api/workers/degrees', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newDegree),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            handleDataChange([...degrees, result.data]);
            setNewDegree({
              name: '',
              major: '',
              startedAt: 0,
              endedAt: 0
            });
          } else {
            console.error('Failed to add degree');
          }
        } else {
          console.error('Failed to add degree');
        }
      } catch (error) {
        console.error('Error adding degree:', error);
      }
    }
  };

  // 학위 수정
  const updateDegree = async (index: number, updatedDegree: WorkerCareerUpdateRequest_WorkerDegrees) => {
    try {
      const response = await fetch('/api/workers/degrees', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDegree),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const updatedData = [...degrees];
          updatedData[index] = result.data;
          handleDataChange(updatedData);
        } else {
          console.error('Failed to update degree');
        }
      } else {
        console.error('Failed to update degree');
      }
    } catch (error) {
      console.error('Error updating degree:', error);
    }
  };

  // 학위 삭제
  const removeDegree = async (index: number) => {
    try {
      const response = await fetch(`/api/workers/degrees/${index}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        handleDataChange(degrees.filter((_, i) => i !== index));
      } else {
        console.error('Failed to delete degree');
      }
    } catch (error) {
      console.error('Error deleting degree:', error);
    }
  };

  // 공통 추가 버튼 렌더링 함수
  const renderAddButton = (title: string, backgroundColor: string = "#007bff", onClick: () => void) => (
    <div>
      <button 
        onClick={onClick} 
        style={{ 
          width: '70px', 
          height: '30px', 
          backgroundColor: backgroundColor, 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {title}
      </button>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', margin: 0 }}>학위</h3>
        <button 
          onClick={() => setShowDegreeInput(!showDegreeInput)}
          style={{ 
            width: '30px', 
            height: '30px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '50%', 
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="학위 추가"
        >
          +
        </button>
      </div>
      
      {/* 학위 추가 입력 폼 */}
      {showDegreeInput && (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #dee2e6'
        }}>
          <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', color: '#495057' }}>학위 추가</h4>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="학위명"
              value={newDegree.name}
              onChange={(e) => setNewDegree({ ...newDegree, name: e.target.value })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', flex: 1, minWidth: '150px' }}
            />
            <input
              type="text"
              placeholder="전공"
              value={newDegree.major}
              onChange={(e) => setNewDegree({ ...newDegree, major: e.target.value })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', flex: 1, minWidth: '150px' }}
            />
            <input
              type="date"
              placeholder="입학일"
              value={newDegree.startedAt ? DateUtil.formatTimestamp(newDegree.startedAt) : ''}
              onChange={(e) => setNewDegree({ ...newDegree, startedAt: DateUtil.parseToTimestamp(e.target.value) })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', flex: 1, minWidth: '150px' }}
            />
            <input
              type="date"
              placeholder="졸업일"
              value={newDegree.endedAt ? DateUtil.formatTimestamp(newDegree.endedAt) : ''}
              onChange={(e) => setNewDegree({ ...newDegree, endedAt: DateUtil.parseToTimestamp(e.target.value) })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', flex: 1, minWidth: '150px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={addDegree}
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
              onClick={() => setShowDegreeInput(false)}
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
      

      {/* 학위 목록 */}
      <div>
        {degrees?.map((degree, index) => (
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
              <div><strong>{degree.name}</strong></div>
              <div>전공: {degree.major}</div>
              <div>입학일: {degree.startedAt ? DateUtil.formatTimestamp(degree.startedAt) : ''}</div>
              <div>졸업일: {degree.endedAt ? DateUtil.formatTimestamp(degree.endedAt) : ''}</div>
              <div>{DateUtil.formatTimestamp(degree.startedAt)} ~ {DateUtil.formatTimestamp(degree.endedAt || 0)}</div>
            </div>
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              <button 
                onClick={() => updateDegree(index, degree)}
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
              {renderAddButton('삭제', '#dc3545', () => removeDegree(index))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DegreesManagement;
